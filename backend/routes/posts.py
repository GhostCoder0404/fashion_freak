# backend/routes/posts.py
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from db.mongo import posts_collection, users_collection, comments_collection
from models.schemas import PostCreate, PostOut, CommentCreate, RatingCreate
from auth.auth_bearer import get_current_user
from datetime import datetime
from bson.objectid import ObjectId

router = APIRouter(prefix="/posts", tags=["posts"])

# Helper to attach owner username
async def attach_owner(doc):
    user = await users_collection.find_one({"_id": ObjectId(doc["owner_id"])})
    doc["owner_username"] = user["username"] if user else "unknown"
    doc["id"] = str(doc["_id"])
    return doc

from utils.file_upload import save_upload
from fastapi import Form

@router.post("/create", response_model=PostOut)
async def create_post(
    title: str = Form(...),
    caption: str = Form(...),
    gender: str = Form(...),
    occasion: str = Form(...),
    items: str = Form("[]"), # JSON string for items? or just ignore for now
    file: UploadFile = File(...),
    user=Depends(get_current_user)
):
    image_url = save_upload(file)
    
    doc = {
        "title": title,
        "caption": caption,
        "image_url": image_url,
        "gender": gender,
        "occasion": occasion,
        "items": [], # Parsing items JSON if needed later
        "owner_id": user["_id"], # Already ObjectId from auth
        "community_rating": 0.0,
        "ratings": [],
        "created_at": datetime.utcnow()
    }

    res = await posts_collection.insert_one(doc)
    created = await posts_collection.find_one({"_id": res.inserted_id})
    created["id"] = str(created["_id"])
    created["owner_id"] = str(created["owner_id"])
    created["owner_username"] = user["username"]
    return created

@router.get("/feed")
async def feed(skip: int = 0, limit: int = 20):
    cursor = posts_collection.find().sort("created_at", -1).skip(skip).limit(limit)
    items = []
    async for p in cursor:
        p["id"] = str(p["_id"])
        p.pop("_id", None)
        p["owner_id"] = str(p["owner_id"])
        
        owner = await users_collection.find_one({"_id": ObjectId(p["owner_id"])})
        p["owner_username"] = owner["username"] if owner else "unknown"
        items.append(p)
    return items

@router.get("/{post_id}")
async def get_post(post_id: str):
    p = await posts_collection.find_one({"_id": ObjectId(post_id)})
    if not p:
        raise HTTPException(404, "Post not found")
    p["id"] = str(p["_id"])
    p.pop("_id", None)
    p["owner_id"] = str(p["owner_id"])
    
    owner = await users_collection.find_one({"_id": ObjectId(p["owner_id"])})
    p["owner_username"] = owner["username"] if owner else "unknown"
    cursor = comments_collection.find({"post_id": post_id}).sort("created_at", 1)
    comments = []
    async for c in cursor:
        c["id"] = str(c["_id"])
        c.pop("_id", None)
        commenter = await users_collection.find_one({"_id": ObjectId(c["user_id"])})
        c["user_username"] = commenter["username"] if commenter else "Unknown"
        c["user_avatar"] = commenter.get("avatar") if commenter else None
        comments.append(c)
    p["comments"] = comments
    return p

@router.post("/comment")
async def add_comment(payload: CommentCreate, user=Depends(get_current_user)):
    doc = payload.dict()
    doc["created_at"] = datetime.utcnow()
    res = await comments_collection.insert_one(doc)
    return {"ok": True, "id": str(res.inserted_id)}

@router.post("/rate")
async def add_rating(payload: RatingCreate, user=Depends(get_current_user)):
    post = await posts_collection.find_one({"_id": ObjectId(payload.post_id)})
    if not post:
        raise HTTPException(404, "Post not found")
    ratings = post.get("ratings", [])
    ratings = [r for r in ratings if r.get("user_id") != payload.user_id]
    ratings.append({"user_id": payload.user_id, "score": payload.score})
    post["ratings"] = ratings
    avg = sum(r["score"] for r in ratings)/len(ratings)
    await posts_collection.update_one({"_id": ObjectId(payload.post_id)}, {"$set": {"ratings": ratings, "community_rating": avg}})
    await posts_collection.update_one({"_id": ObjectId(payload.post_id)}, {"$set": {"ratings": ratings, "community_rating": avg}})
    return {"ok": True, "community_rating": avg}

# Added Delete Endpoint
@router.delete("/{post_id}")
async def delete_post(post_id: str, user=Depends(get_current_user)):
    post = await posts_collection.find_one({"_id": ObjectId(post_id)})
    if not post:
        raise HTTPException(404, "Post not found")
    
    # Check ownership
    if str(post["owner_id"]) != str(user["_id"]):
         raise HTTPException(403, "Not authorized to delete this post")
         
    await posts_collection.delete_one({"_id": ObjectId(post_id)})
    # Ideally also delete comments and the image file
    return {"ok": True}
