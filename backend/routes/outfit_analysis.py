
import os
import json
import io
import base64
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from PIL import Image
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(prefix="/api", tags=["OutfitAnalysis"])

groq_key = os.getenv("GROQ_API_KEY")


def get_client():
    if not groq_key:
        raise HTTPException(
            status_code=503,
            detail="Groq API key not configured. Please add GROQ_API_KEY to backend/.env"
        )
    return OpenAI(
        api_key=groq_key,
        base_url="https://api.groq.com/openai/v1"
    )


def image_to_base64(image_bytes: bytes) -> str:
    """Convert raw image bytes to base64 string for vision analysis."""
    img = Image.open(io.BytesIO(image_bytes))
    if img.mode in ("RGBA", "P"):
        img = img.convert("RGB")
    buffer = io.BytesIO()
    img.save(buffer, format="JPEG", quality=85)
    return base64.b64encode(buffer.getvalue()).decode("utf-8")


@router.post("/outfit-detailed-analysis")
async def outfit_detailed_analysis(
    file: UploadFile = File(...),
    gender: str = Form(...),
    occasion: str = Form(...)
):
    """
    Accepts an outfit image and returns a thorough AI-powered
    fashion analysis. Uses Groq (Llama 4 Vision) for image understanding.
    Returns: color palette, clothing type, style, fabric, fit,
             occasion suitability, rating (0-10, two decimal places),
             pros, cons, stylist tip, and a full description.
    """
    client = get_client()

    image_bytes = await file.read()
    try:
        b64_image = image_to_base64(image_bytes)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid image file.")

    prompt = f"""You are an elite fashion critic and stylist with 20+ years of experience on international runways.
Analyze this {gender}'s outfit uploaded for a "{occasion}" occasion.

Return ONLY a valid JSON object. No markdown, no backticks, no extra text outside the JSON.
Use exactly these keys:

{{
  "overall_rating": <float 0.00 to 10.00, two decimal places, e.g. 7.85>,
  "rating_label": <one of: "Disaster", "Needs Work", "Decent", "Good", "Great", "Stellar", "Iconic">,
  "clothing_type": <main piece(s), e.g. "Slim-fit chinos with a linen button-down shirt">,
  "primary_colors": [<2-4 dominant colors, e.g. "Navy Blue", "Off-White">],
  "color_harmony": <brief color assessment>,
  "style_category": <e.g. "Smart Casual", "Streetwear", "Boho Chic", "Old Money", "Formal">,
  "fabric_estimate": <e.g. "Cotton-linen blend, lightweight">,
  "fit_assessment": <e.g. "Tailored and well-fitted, flatters the silhouette">,
  "occasion_suitability": <integer 0-10 for how well it matches "{occasion}">,
  "occasion_verdict": <one sentence on suitability>,
  "pros": [<3 to 5 specific positive points>],
  "cons": [<2 to 4 areas for improvement>],
  "stylist_tip": <one actionable tip to elevate the look>,
  "full_description": <3-4 sentence paragraph — colors, cut, accessories if visible, overall vibe>
}}"""

    try:
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
            max_tokens=1500,
            temperature=0.7
        )

        text = response.choices[0].message.content.strip()

        # Strip markdown fencing if present
        if text.startswith("```"):
            lines = text.split("\n")
            if lines[0].startswith("```"):
                lines = lines[1:]
            if lines and lines[-1].strip() == "```":
                lines = lines[:-1]
            text = "\n".join(lines).strip()

        analysis = json.loads(text)
        return {"success": True, "analysis": analysis}

    except json.JSONDecodeError as e:
        raise HTTPException(
            status_code=500,
            detail=f"AI response parsing failed: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Analysis failed: {str(e)}"
        )
