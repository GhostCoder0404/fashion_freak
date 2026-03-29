# backend/routes/auth.py
from fastapi import APIRouter, HTTPException, status, Depends
from models.schemas import UserCreate, Token, UserOut, Login
from db.mongo import users_collection
from auth.auth_utils import hash_password, verify_password
from core.config import settings
from jose import jwt
from datetime import datetime, timedelta
from bson.objectid import ObjectId

router = APIRouter(prefix="/auth", tags=["auth"])

async def create_access_token(subject: str):
    expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = {"exp": expire, "sub": subject}
    return jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)

@router.post("/signup", response_model=UserOut)
async def signup(payload: UserCreate):
    existing = await users_collection.find_one({"$or":[{"email":payload.email},{"username":payload.username}]})
    if existing:
        raise HTTPException(status_code=400, detail="User or email already exists")
    hashed = hash_password(payload.password)
    doc = {
        "username": payload.username,
        "email": payload.email,
        "password": hashed,
        "avatar": None,
        "bio": "",
        "created_at": datetime.utcnow()
    }
    res = await users_collection.insert_one(doc)
    user = doc
    user["id"] = str(res.inserted_id)
    return UserOut(id=user["id"], username=user["username"], email=user["email"], avatar=user["avatar"], bio=user["bio"])

@router.post("/login", response_model=Token)
async def login(payload: Login):
    print(f"DEBUG: Login attempt for: {payload.username} or {payload.email}")
    # require either username or email to be provided
    if not payload.email and not payload.username:
        raise HTTPException(status_code=400, detail="Provide username or email")
    
    query = {"$or": []}
    if payload.email:
        query["$or"].append({"email": payload.email})
    if payload.username:
        query["$or"].append({"username": payload.username})
    
    user = await users_collection.find_one(query)
    
    if not user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Incorrect credentials")
    
    if not verify_password(payload.password, user["password"]):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Incorrect credentials")
    
    token = await create_access_token(str(user["_id"]))
    return {"access_token": token, "token_type": "bearer"}
