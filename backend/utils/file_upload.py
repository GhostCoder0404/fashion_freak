import os
import shutil
from uuid import uuid4
from fastapi import UploadFile
from core.config import settings

# Initialize cloudinary if URL is present
if settings.CLOUDINARY_URL:
    import cloudinary
    import cloudinary.uploader
    import re
    # Extract config from cloudinary://<api_key>:<api_secret>@<cloud_name>
    match = re.match(r"cloudinary://([^:]+):([^@]+)@(.+)", settings.CLOUDINARY_URL)
    if match:
        cloudinary.config(
            api_key=match.group(1),
            api_secret=match.group(2),
            cloud_name=match.group(3),
            secure=True
        )

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

def save_upload(file: UploadFile) -> str:
    """
    Saves an uploaded file to Cloudinary (if configured) or the local uploads directory.
    """
    if settings.CLOUDINARY_URL:
        # Upload to Cloudinary
        file.file.seek(0)
        result = cloudinary.uploader.upload(file.file)
        return result.get("secure_url")
    else:
        # Local upload
        extension = file.filename.split(".")[-1]
        unique_name = f"{uuid4()}.{extension}"
        file_path = os.path.join(UPLOAD_DIR, unique_name)
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        return f"uploads/{unique_name}"

