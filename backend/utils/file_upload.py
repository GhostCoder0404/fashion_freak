
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
        
    # Return a relative path so mobile clients build the URL using their own BASE_URL.
    # Storing an absolute localhost URL breaks image loading on physical devices.
    return f"uploads/{unique_name}"
