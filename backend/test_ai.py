import os
import base64
import json
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv('.env')

client = OpenAI(
    api_key=os.getenv('GROQ_API_KEY'),
    base_url='https://api.groq.com/openai/v1'
)

with open('uploads/069090b1-932b-4cb7-8261-b894d337dda9.jpg', 'rb') as f:
    b64 = base64.b64encode(f.read()).decode('utf-8')

prompt = """You are an elite fashion analyst. Analyze the individual clothing items in this unisex's outfit for a casual.
Break down the look into distinct pieces (e.g., shirt, pants, shoes, accessories).

Return ONLY a valid JSON object with NO markdown or backticks. Keys MUST be:
{
  "clothing_type": "Overall aesthetic (e.g. Streetwear casual)",
  "color": "Primary overall colors",
  "style": "Style category",
  "fabric_guess": "Likely fabrics",
  "tags": ["tag1", "tag2", "tag3", "tag4"],
  "detected_items": [
    {
      "name": "Descriptive name (e.g. Black Baggy Jeans, Red Casual Thick Shirt)",
      "type": "Category (e.g. Topwear, Bottomwear, Footwear, Accessory)",
      "search_query": "3-6 word Google Shopping query (e.g. men black baggy jeans)",
      "price_estimate": "Estimated price range (e.g. $40 - $80 or ₹2000 - ₹4000)"
    }
  ]
}"""

try:
    response = client.chat.completions.create(
        model='meta-llama/llama-4-scout-17b-16e-instruct',
        messages=[
            {
                'role': 'user',
                'content': [
                    {'type': 'image_url', 'image_url': {'url': f'data:image/jpeg;base64,{b64}'}},
                    {'type': 'text', 'text': prompt}
                ]
            }
        ],
        temperature=0.4
    )
    text = response.choices[0].message.content.strip()
    print('RAW TEXT:')
    print(text)
    
    if text.startswith('```'):
        lines = text.split('\n')
        if lines[0].startswith('```'):
            lines = lines[1:]
        if lines and lines[-1].strip() == '```':
            lines = lines[:-1]
        text = '\n'.join(lines).strip()
    
    print('JSON:', json.loads(text))
except Exception as e:
    print('AI ERROR:', e)
