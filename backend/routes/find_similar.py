import os
import json
import urllib.parse
import io
import base64
from fastapi import APIRouter, HTTPException
from db.mongo import posts_collection
from bson.objectid import ObjectId
from PIL import Image
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(prefix="/api", tags=["FindSimilar"])
groq_key = os.getenv("GROQ_API_KEY")

def get_openai_client():
    if not groq_key:
        return None
    return OpenAI(
        api_key=groq_key,
        base_url="https://api.groq.com/openai/v1"
    )

def image_to_base64(image_bytes: bytes) -> str:
    img = Image.open(io.BytesIO(image_bytes))
    if img.mode in ("RGBA", "P"):
        img = img.convert("RGB")
    buffer = io.BytesIO()
    img.save(buffer, format="JPEG", quality=85)
    return base64.b64encode(buffer.getvalue()).decode("utf-8")

async def analyze_image_with_openai(image_bytes: bytes, occasion: str, gender: str) -> dict:
    client = get_openai_client()
    if not client:
        return None
    try:
        b64_image = image_to_base64(image_bytes)

        prompt = f"""You are an elite fashion analyst. Analyze the individual clothing items in this {gender}'s outfit for a {occasion}.
Break down the look into distinct pieces (e.g., shirt, pants, shoes, accessories).

Return ONLY a valid JSON object with NO markdown or backticks. Keys MUST be:
{{
  "clothing_type": "Overall aesthetic (e.g. Streetwear casual)",
  "color": "Primary overall colors",
  "style": "Style category",
  "fabric_guess": "Likely fabrics",
  "tags": ["tag1", "tag2", "tag3", "tag4"],
  "detected_items": [
    {{
      "name": "Descriptive name (e.g. Black Baggy Jeans, Red Casual Thick Shirt)",
      "type": "Category (e.g. Topwear, Bottomwear, Footwear, Accessory)",
      "search_query": "3-6 word Google Shopping query (e.g. men black baggy jeans)",
      "price_estimate": "Estimated price range ONLY in Indian Rupees (e.g. ₹1500 - ₹4000)"
    }}
  ]
}}"""

        response = client.chat.completions.create(
            model="meta-llama/llama-4-scout-17b-16e-instruct",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{b64_image}"
                            }
                        },
                        {
                            "type": "text",
                            "text": prompt
                        }
                    ]
                }
            ],
            max_tokens=800,
            temperature=0.4
        )

        text = response.choices[0].message.content.strip()

        if text.startswith("```"):
            lines = text.split("\n")
            if lines[0].startswith("```"):
                lines = lines[1:]
            if lines and lines[-1].strip() == "```":
                lines = lines[:-1]
            text = "\n".join(lines).strip()

        return json.loads(text)

    except Exception as e:
        print(f"AI FindSimilar Error: {e}")
        return None

@router.get("/find-similar/{post_id}")
async def find_similar_products(post_id: str):
    """
    Analyzes a post's outfit image and extracts discrete clothing items
    (e.g., Baggy Jeans, Red Shirt, etc.) with specific search links.
    """
    try:
        post = await posts_collection.find_one({"_id": ObjectId(post_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid post ID")

    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    occasion = post.get("occasion", "casual")
    gender = post.get("gender", "unisex")
    title = post.get("title", "")

    image_url = post.get("image_url", "")
    image_bytes = None

    if image_url:
        if image_url.startswith("http"):
            try:
                import httpx
                with httpx.Client() as client:
                    response = client.get(image_url)
                    response.raise_for_status()
                    image_bytes = response.content
            except Exception as e:
                print(f"Error fetching remote image: {e}")
        elif "uploads/" in image_url:
            filename = image_url.split("uploads/")[-1]
            filepath = os.path.join("uploads", filename)
            if os.path.exists(filepath):
                with open(filepath, "rb") as f:
                    image_bytes = f.read()

    ai_data = None
    if image_bytes:
        ai_data = await analyze_image_with_openai(image_bytes, occasion, gender)

    if ai_data and ai_data.get("detected_items"):
        clothing_type = ai_data.get("clothing_type", title)
        color = ai_data.get("color", "")
        style = ai_data.get("style", occasion)
        fabric = ai_data.get("fabric_guess", "")
        tags = ai_data.get("tags", [gender, occasion])
        detected_items = ai_data.get("detected_items", [])
    else:
        clothing_type = title or "outfit"
        color = ""
        style = occasion
        fabric = ""
        tags = [gender, occasion]
        detected_items = [
            {
                "name": title or "Outfit",
                "type": "Outfit",
                "search_query": f"{gender} {occasion} {title} outfit",
                "price_estimate": "Varies"
            }
        ]

    for item in detected_items:
        encoded_query = urllib.parse.quote_plus(item.get("search_query", item.get("name", "fashion clothing")))
        item["shop_links"] = {
            "google": f"https://www.google.com/search?tbm=shop&q={encoded_query}",
            "amazon": f"https://www.amazon.com/s?k={encoded_query}",
            "myntra": f"https://www.myntra.com/{encoded_query}",
            "pinterest": f"https://www.pinterest.com/search/pins/?q={encoded_query}+outfit"
        }

    return {
        "post_id": post_id,
        "image_url": image_url,
        "clothing_type": clothing_type,
        "color": color,
        "style": style,
        "fabric": fabric,
        "tags": tags,
        "detected_items": detected_items,
        "ai_powered": ai_data is not None
    }
