
import os
import google.generativeai as genai
from PIL import Image
import io
import json
from dotenv import load_dotenv
from services.fallback_data import FALLBACK_RECOMMENDATIONS, FALLBACK_SUMMARIES
import random

load_dotenv()

# Configure Gemini
api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)
    print("Gemini API Key configured.")
else:
    print("WARNING: GEMINI_API_KEY not found. Using mock model.")

def get_gemini_analysis(image_bytes, gender, occasion):
    """
    Analyzes the outfit using Gemini Pro Vision.
    Returns: JSON dict with {score, summary, recommendation}
    """
    if not api_key:
        return None

    try:
        model = genai.GenerativeModel('gemini-1.5-pro')
        
        image = Image.open(io.BytesIO(image_bytes))
        
        prompt = f"""
        You are a strict, professional fashion critic. Analyze this outfit for a {gender} attending a {occasion}.
        
        Provide the output strictly in valid JSON format with no markdown formatting or backticks. The JSON must have these keys:
        - "score": A float between 0.0 and 10.0. Be critical. 10 is perfection, 5 is average.
        - "summary": A concise 30-40 word summary of the look.
        - "recommendation": 1 or 2 specific sentences on how to improve (e.g., color advice, accessory changes). If it's good, say it's good.
        
        Do not be overly friendly. be objective and professional.
        """
        
        response = model.generate_content([prompt, image])
        text = response.text.strip()
        
        # Clean potential markdown code blocks if the model ignores instruction
        if text.startswith("```json"):
            text = text[7:]
        if text.startswith("```"):
            text = text[3:]
        if text.endswith("```"):
            text = text[:-3]
            
        result = json.loads(text)
        return result
        
    except Exception as e:
        print(f"Gemini Error: {e}")
        return None

def predict_outfit_score(image_bytes, gender, occasion):
    # Try Gemini First
    gemini_result = get_gemini_analysis(image_bytes, gender, occasion)
    
    if gemini_result:
        return {
            "score": gemini_result.get("score", 0),
            "compliment": gemini_result.get("summary", "Analysis complete."), # Map summary to display
            "recommendation": gemini_result.get("recommendation", ""),
            "is_mock": False
        }

    # Fallback to Mock
    print("Using Mock Model (Gemini failed or no key)")
    mock_score = round(random.uniform(4.0, 9.5), 1)
    
    # Determine bucket for score
    # Buckets in FALLBACK_RECOMMENDATIONS are keys: 1 (0-2), 3 (2-4), 5 (4-6), 7 (6-8), 9 (8-10)
    if mock_score < 2: bucket = 1
    elif mock_score < 4: bucket = 3
    elif mock_score < 6: bucket = 5
    elif mock_score < 8: bucket = 7
    else: bucket = 9
    
    # Get random recommendation and summary
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

