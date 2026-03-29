from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime

class UserCreate(BaseModel):
    username: str = Field(..., min_length=3)
    email: EmailStr
    password: str = Field(..., min_length=6)

class UserOut(BaseModel):
    id: str
    username: str
    email: EmailStr
    avatar: Optional[str] = None
    bio: Optional[str] = None

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class PostCreate(BaseModel):
    title: Optional[str] = None
    caption: Optional[str] = None
    image_url: str  # path/URL to image stored (we'll accept base64 or real storage later)
    owner_id: str
    occasion: Optional[str] = None
    gender: Optional[str] = None

class PostOut(BaseModel):
    id: str
    title: Optional[str]
    caption: Optional[str]
    image_url: str
    owner_id: str
    owner_username: Optional[str]
    occasion: Optional[str]
    gender: Optional[str]
    community_rating: float = 0.0
    created_at: datetime

class CommentCreate(BaseModel):
    post_id: str
    user_id: str
    text: str

class RatingCreate(BaseModel):
    post_id: str
    user_id: str
    score: float  # 1.0 - 10.0
class Login(BaseModel):
    # allow login using username OR email; frontend should send either "username" or "email"
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    password: str = Field(..., min_length=1)
