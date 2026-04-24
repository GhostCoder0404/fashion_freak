
from fastapi import FastAPI, Response, Request
from fastapi.responses import JSONResponse
import uvicorn
from routes import auth, posts, users, prediction, find_similar, outfit_analysis

app = FastAPI(title="FashionFreak Backend - Phase1")

# MANUAL CORS & LOGGING MIDDLEWARE
@app.middleware("http")
async def cors_logging_middleware(request, call_next):
    # Log Request
    print(f"DEBUG IN: {request.method} {request.url}")

    # Handle Preflight manually
    if request.method == "OPTIONS":
        response = Response(status_code=204)
    else:
        try:
            response = await call_next(request)
        except Exception as e:
            import traceback
            trace = traceback.format_exc()
            print(f"DEBUG EXCEPTION: {trace}")
            response = JSONResponse(
                status_code=500,
                content={"detail": str(e), "trace": trace}
            )

    # Force CORS Headers
    origin = request.headers.get("Origin", "*")
    response.headers["Access-Control-Allow-Origin"] = origin
    response.headers["Access-Control-Allow-Credentials"] = "true"
    response.headers["Access-Control-Allow-Methods"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "*"
    
    print(f"DEBUG OUT: {response.status_code}")
    return response


app.include_router(auth.router)
app.include_router(posts.router)
app.include_router(users.router)
app.include_router(prediction.router)          # /api/predict-score  (web)
app.include_router(prediction.router_root)    # /predict             (mobile)
app.include_router(find_similar.router)
app.include_router(outfit_analysis.router)    # /api/outfit-detailed-analysis

from fastapi.staticfiles import StaticFiles
import os
os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
