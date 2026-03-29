import os
import zipfile

source_dir = "d:/fashion_dataset/images"
extract_dir = "d:/fashion_dataset/extracted"

if not os.path.exists(extract_dir):
    os.makedirs(extract_dir)

for filename in os.listdir(source_dir):
    if filename.endswith(".zip"):
        file_path = os.path.join(source_dir, filename)
        # Create a folder for each zip to keep it organized (e.g. d:/fashion_dataset/extracted/casual_men)
        folder_name = os.path.splitext(filename)[0]
        target_path = os.path.join(extract_dir, folder_name)
        
        print(f"Extracting {filename} to {target_path}...")
        with zipfile.ZipFile(file_path, 'r') as zip_ref:
            zip_ref.extractall(target_path)
            
print("Extraction complete.")
