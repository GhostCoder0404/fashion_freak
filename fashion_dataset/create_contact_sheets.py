import os
from PIL import Image, ImageDraw, ImageFont
import math

source_dir = "d:/fashion_dataset/extracted"
sheets_dir = "d:/fashion_dataset/sheets"

if not os.path.exists(sheets_dir):
    os.makedirs(sheets_dir)

# Configuration
THUMB_SIZE = (200, 300)
GRID_COLS = 5
GRID_ROWS = 4
IMAGES_PER_SHEET = GRID_COLS * GRID_ROWS
SHEET_WIDTH = THUMB_SIZE[0] * GRID_COLS
SHEET_HEIGHT = THUMB_SIZE[1] * GRID_ROWS

def create_sheets_for_folder(folder_path, category_name):
    images = []
    for f in os.listdir(folder_path):
        if f.lower().endswith(('.png', '.jpg', '.jpeg')):
            images.append(os.path.join(folder_path, f))
    
    # Sort to be deterministic
    images.sort()
    
    num_sheets = math.ceil(len(images) / IMAGES_PER_SHEET)
    print(f"Processing {category_name}: {len(images)} images -> {num_sheets} sheets")
    
    for i in range(num_sheets):
        sheet = Image.new('RGB', (SHEET_WIDTH, SHEET_HEIGHT), color=(255, 255, 255))
        draw = ImageDraw.Draw(sheet)
        
        batch = images[i * IMAGES_PER_SHEET : (i + 1) * IMAGES_PER_SHEET]
        
        for idx, img_path in enumerate(batch):
            try:
                img = Image.open(img_path)
                img.thumbnail(THUMB_SIZE)
                
                # Position in grid
                col = idx % GRID_COLS
                row = idx // GRID_COLS
                x = col * THUMB_SIZE[0]
                y = row * THUMB_SIZE[1]
                
                # Paste image centered in slot
                sheet.paste(img, (x, y))
                
                # Draw filename
                filename = os.path.basename(img_path)
                # Draw a background rectangle for text readability
                text_x = x + 5
                text_y = y + 5
                draw.rectangle([text_x, text_y, text_x + 150, text_y + 15], fill="black")
                draw.text((text_x, text_y), filename, fill="white")
                
            except Exception as e:
                print(f"Error processing {img_path}: {e}")
        
        sheet_filename = f"{category_name}_sheet_{i+1}.jpg"
        save_path = os.path.join(sheets_dir, sheet_filename)
        sheet.save(save_path)
        print(f"Saved {save_path}")

# Iterate through all extracted folders
for root, dirs, files in os.walk(source_dir):
    for dir_name in dirs:
        full_path = os.path.join(root, dir_name)
        # Use relative path as category name (e.g., casual_men)
        rel_path = os.path.relpath(full_path, source_dir)
        category_name = rel_path.replace(os.path.sep, "_")
        create_sheets_for_folder(full_path, category_name)

print("Contact sheet generation complete.")
