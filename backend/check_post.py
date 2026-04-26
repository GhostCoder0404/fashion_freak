import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from bson.objectid import ObjectId

async def main():
    client = AsyncIOMotorClient("mongodb+srv://rexparse225_db_user:ZrK9Ehbc1Df6uxxP@fashion.dxiczue.mongodb.net/fashionfreak?appName=Fashion")
    db = client["fashionfreak"]
    post = await db.posts.find_one({"_id": ObjectId("69edd56343eaeb8cb4848b10")})
    print(post.get("image_url"))

asyncio.run(main())
