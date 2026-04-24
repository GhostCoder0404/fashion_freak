import os
import io
import json
import random
import base64
from PIL import Image
from dotenv import load_dotenv
from openai import OpenAI
from services.fallback_data import FALLBACK_RECOMMENDATIONS, FALLBACK_SUMMARIES

load_dotenv()

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

def get_llama_analysis(image_bytes, gender, occasion):
    """
    Analyzes the outfit using Llama 4 Scout Instruct logic via Groq.
    Returns: JSON dict with {score, summary, recommendation}
    """
    client = get_openai_client()
    if not client:
        return None

    try:
        b64_image = image_to_base64(image_bytes)
        
        prompt = f"""
        You are a strict, professional fashion critic. Analyze this outfit for a {gender} attending a {occasion}.
        
        Provide the output strictly in valid JSON format with no markdown formatting or backticks. The JSON must have these keys:
        {{
          "score": 8.58 (upto two decimal points),
          "summary": "A concise 30-40 word summary of the look.",
          "recommendation": "1 or 2 specific sentences on how to improve (bullet points)."
        }}
        
        "score" should be a float between 0.0 and 10.0. Be critical. 10 is perfection, 5 is average.
        Do not be overly friendly. be objective and professional.
        """
        
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
        print(f"Llama AI Error: {e}")
        return None

def predict_outfit_score(image_bytes, gender, occasion):
    ai_result = get_llama_analysis(image_bytes, gender, occasion)
    
    if ai_result:
        return {
            "score": ai_result.get("score", 0),
            "compliment": ai_result.get("summary", "Analysis complete."),
            "recommendation": ai_result.get("recommendation", ""),
            "is_mock": False
        }

    print("Using Mock Model (Llama failed or no key)")
    mock_score = round(random.uniform(4.0, 9.5), 1)
    
    if mock_score < 2: bucket = 1
    elif mock_score < 4: bucket = 3
    elif mock_score < 6: bucket = 5
    elif mock_score < 8: bucket = 7
    else: bucket = 9
    
    recs = FALLBACK_RECOMMENDATIONS.get(bucket, FALLBACK_RECOMMENDATIONS[5])
    sums = FALLBACK_SUMMARIES.get(bucket, FALLBACK_SUMMARIES[5])
    
    recommendation = random.choice(recs)
    compliment = random.choice(sums)

    return {
        "score": mock_score,
        "compliment": compliment,
        "recommendation": recommendation,
        "is_mock": True
    }
