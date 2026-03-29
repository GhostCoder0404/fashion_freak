
from fastapi import APIRouter, File, UploadFile, Form, HTTPException
from services.model_service import predict_outfit_score

router = APIRouter(prefix="/api", tags=["Prediction"])

@router.post("/predict-score")
async def predict_score(
    gender: str = Form(...),
    occasion: str = Form(...),
    file: UploadFile = File(...)
):
    try:
        print(f"Received prediction request: Gender={gender}, Occasion={occasion}, File={file.filename}")
        
        # Read file
        contents = await file.read()
        
        # Get prediction
        result = predict_outfit_score(contents, gender, occasion)
        
        if "error" in result:
             raise HTTPException(status_code=500, detail=result["error"])
             
        return result
        
    except Exception as e:
        print(f"Route Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
