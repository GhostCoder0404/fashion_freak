
from fastapi import FastAPI, Response, Request
from fastapi.responses import JSONResponse
import uvicorn
from routes import auth, posts, users, prediction, find_similar, outfit_analysis, wardrobe

app = FastAPI(title="FashionFreak Backend - Phase1")

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(posts.router)
app.include_router(users.router)
app.include_router(prediction.router)          # /api/predict-score  (web)
app.include_router(prediction.router_root)    # /predict             (mobile)
app.include_router(find_similar.router)
app.include_router(outfit_analysis.router)    # /api/outfit-detailed-analysis
app.include_router(wardrobe.router)

from fastapi.staticfiles import StaticFiles
import os
os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("app:app", host="0.0.0.0", port=port, reload=True)
