# backend/db/mongo.py
from motor.motor_asyncio import AsyncIOMotorClient
from core.config import settings  # absolute import

client = AsyncIOMotorClient(settings.MONGO_URI)
db = client.get_default_database()  # uses <dbname> from URI
users_collection = db["users"]
posts_collection = db["posts"]
comments_collection = db["comments"]
