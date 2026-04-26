# backend/routes/wardrobe.py
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from db.mongo import wardrobe_collection
from auth.auth_bearer import get_current_user
from bson.objectid import ObjectId
from datetime import datetime
from utils.file_upload import save_upload

router = APIRouter(prefix="/wardrobe", tags=["wardrobe"])

from typing import Optional

@router.post("/add")
async def add_item(
    category: str = Form(...),
    color: str = Form(""),
    brand: str = Form(""),
    file: Optional[UploadFile] = File(None),
    image_url: Optional[str] = Form(None),
    user=Depends(get_current_user)
):
    valid_categories = ["top", "bottom", "footwear", "accessory"]
    if category.lower() not in valid_categories:
        raise HTTPException(400, "Invalid category")
        
    if not file and not image_url:
        raise HTTPException(400, "Must provide either a file or an image_url")
        
    final_image_url = save_upload(file) if file else image_url
    
    doc = {
        "user_id": user["_id"],
        "category": category.lower(),
        "color": color,
        "brand": brand,
        "image_url": final_image_url,
        "created_at": datetime.utcnow()
    }
    
    res = await wardrobe_collection.insert_one(doc)
    created = await wardrobe_collection.find_one({"_id": res.inserted_id})
    created["id"] = str(created["_id"])
    created.pop("_id", None)
    created["user_id"] = str(created["user_id"])
    return created

@router.get("/")
async def get_wardrobe(user=Depends(get_current_user)):
    cursor = wardrobe_collection.find({"user_id": user["_id"]}).sort("created_at", -1)
    items = []
    async for item in cursor:
        item["id"] = str(item["_id"])
        item.pop("_id", None)
        item["user_id"] = str(item["user_id"])
        items.append(item)
    return items

@router.delete("/{item_id}")
async def delete_item(item_id: str, user=Depends(get_current_user)):
    item = await wardrobe_collection.find_one({"_id": ObjectId(item_id)})
    if not item:
        raise HTTPException(404, "Item not found")
        
    if str(item["user_id"]) != str(user["_id"]):
        raise HTTPException(403, "Not authorized to delete this item")
        
    await wardrobe_collection.delete_one({"_id": ObjectId(item_id)})
    return {"ok": True}
