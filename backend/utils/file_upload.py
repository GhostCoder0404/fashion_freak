
import os
import shutil
from uuid import uuid4
from fastapi import UploadFile

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

def save_upload(file: UploadFile) -> str:
    """
    Saves an uploaded file to the uploads directory with a unique name.
    """
    extension = file.filename.split(".")[-1]
    unique_name = f"{uuid4()}.{extension}"
    file_path = os.path.join(UPLOAD_DIR, unique_name)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    # Return web-accessible path
    # Assuming backend runs on 8000
    return f"http://127.0.0.1:8000/uploads/{unique_name}"
