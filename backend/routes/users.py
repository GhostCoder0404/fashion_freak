# backend/routes/users.py
from fastapi import APIRouter, Depends, HTTPException
from auth.auth_bearer import get_current_user
from db.mongo import users_collection, posts_collection
from bson.objectid import ObjectId
from fastapi import UploadFile, File
from utils.file_upload import save_upload

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/me")
async def me(user=Depends(get_current_user)):
    user["id"] = str(user["_id"])
    user.pop("password", None)
    user.pop("_id", None)
    return user

@router.get("/profile/{username}")
async def profile(username: str):
    user = await users_collection.find_one({"username": username})
    if not user:
        raise HTTPException(404, "User not found")
    user["id"] = str(user["_id"])
    user.pop("_id", None)
    user.pop("password", None)
    
    followers = user.get("followers", [])
    following = user.get("following", [])
    user["followers_count"] = len(followers)
    user["following_count"] = len(following)
    user["followers"] = followers # To let frontend check is_following
    
    cursor = posts_collection.find({"owner_id": ObjectId(user["id"])}).sort("created_at", -1)
    posts = []
    async for p in cursor:
        p["id"] = str(p["_id"])
        p.pop("_id", None)
        p["owner_id"] = str(p["owner_id"])
        posts.append(p)
    return {"user": user, "posts": posts}

@router.post("/update_avatar")
@router.post("/avatar")  # mobile alias
async def update_avatar(file: UploadFile = File(...), user=Depends(get_current_user)):
    url = save_upload(file)
    await users_collection.update_one({"_id": user["_id"]}, {"$set": {"avatar": url}})
    return {"ok": True, "avatar": url}

@router.get("/liked_posts")
async def get_liked_posts(user=Depends(get_current_user)):
    user_id = str(user["_id"])
    # Find posts where ratings array contains an object with user_id == current_user_id
    cursor = posts_collection.find({"ratings.user_id": user_id}).sort("created_at", -1)
    posts = []
    async for p in cursor:
        p["id"] = str(p["_id"])
        p.pop("_id", None)
        p["owner_id"] = str(p["owner_id"])
        
        owner = await users_collection.find_one({"_id": ObjectId(p["owner_id"])})
        p["owner_username"] = owner["username"] if owner else "unknown"
        posts.append(p)
    return posts

@router.post("/update")
@router.put("/profile")   # mobile alias
async def update_profile(payload: dict, user=Depends(get_current_user)):
    # Safety: prevent updating sensitive fields like password or _id directly here if passed
    payload.pop("_id", None)
    payload.pop("password", None)
    
    await users_collection.update_one({"_id": user["_id"]}, {"$set": payload})
    return {"ok": True}

@router.get("/search")
async def search_users(q: str):
    # Simple regex search
    cursor = users_collection.find({"username": {"$regex": q, "$options": "i"}}).limit(10)
    results = []
    async for u in cursor:
        results.append({"username": u["username"], "avatar": u.get("avatar")})
    return results

@router.post("/follow/{username}")
async def follow_user(username: str, user=Depends(get_current_user)):
    if username == user["username"]:
        raise HTTPException(400, "Cannot follow yourself")
    target = await users_collection.find_one({"username": username})
    if not target:
        raise HTTPException(404, "User not found")
        
    await users_collection.update_one({"_id": user["_id"]}, {"$addToSet": {"following": str(target["_id"])}})
    await users_collection.update_one({"_id": target["_id"]}, {"$addToSet": {"followers": str(user["_id"])}})
    return {"ok": True}

@router.post("/unfollow/{username}")
async def unfollow_user(username: str, user=Depends(get_current_user)):
    target = await users_collection.find_one({"username": username})
    if not target:
        raise HTTPException(404, "User not found")
        
    await users_collection.update_one({"_id": user["_id"]}, {"$pull": {"following": str(target["_id"])}})
    await users_collection.update_one({"_id": target["_id"]}, {"$pull": {"followers": str(user["_id"])}})
    return {"ok": True}
