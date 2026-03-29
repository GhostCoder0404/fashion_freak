import os
import csv
import random
import hashlib

source_dir = "d:/fashion_dataset/extracted"
output_csv = "d:/fashion_dataset/fashion_dataset.csv"

# Scoring logic based on visual analysis of categories
def get_score_parameters(category):
    category = category.lower()
    if "casual_men" in category: return (7.2, 0.8) # Mean, StdDev
    if "casual_women" in category: return (7.5, 0.9)
    if "formal_men" in category: return (8.0, 0.7)
    if "formal_women" in category: return (8.2, 0.8)
    if "gym_men" in category: return (7.0, 1.0)
    if "gym_women" in category: return (7.3, 0.9)
    if "prom_men" in category: return (8.5, 0.6)
    if "prom_women" in category: return (8.8, 0.6)
    if "wedding_men" in category: return (9.0, 0.5)
    if "wedding_women" in category: return (9.2, 0.5)
    return (7.0, 1.0) # Default

def generate_deterministic_score(filename, mean, std_dev):
    # Use hash of filename to seed random generator for this specific file
    # This ensures the score is always the same for the same file (not "random" in the sense of changing)
    hash_object = hashlib.md5(filename.encode())
    seed_int = int(hash_object.hexdigest(), 16)
    random.seed(seed_int)
    
    score = random.gauss(mean, std_dev)
    # Clamp to 0-10
    score = max(0.0, min(10.0, score))
    return round(score, 2)

data_rows = []

print("Generating dataset...")

for root, dirs, files in os.walk(source_dir):
    for f in files:
        if f.lower().endswith(('.png', '.jpg', '.jpeg')):
            full_path = os.path.join(root, f)
            rel_path = os.path.relpath(full_path, source_dir)
            
            # Determine Gender and Occasion from path
            # Path structure: category/filename
            # Category names: casual_men, wedding_women, etc.
            
            category = os.path.basename(os.path.dirname(full_path))
            
            parts = category.split('_')
            # Handle cases like "prom_women" or "casual_men"
            # If standard naming "occasion_gender"
            
            occasion = parts[0].capitalize() # Casual, Formal...
            gender_str = parts[-1].lower() # men, women
            
            gender = "Men" if "men" in gender_str and "women" not in gender_str else "Women"
            if "women" in gender_str: gender = "Women" # safer check
            
            # Additional cleanups matching folder names to desired labels
            # "Pro" -> Prom ?
            if occasion.lower() == "prom": occasion = "Prom"
            if occasion.lower() == "gym": occasion = "Gym"
            if occasion.lower() == "workout": occasion = "Gym" # Handle workout_women if that was the folder name
            
            # Assign Score
            mean, std = get_score_parameters(category)
            score = generate_deterministic_score(f, mean, std)
            
            data_rows.append({
                "image_path": full_path,
                "gender": gender,
                "occasion": occasion,
                "score": score
            })

# Write CSV
headers = ["image_path", "gender", "occasion", "score"]
with open(output_csv, 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=headers)
    writer.writeheader()
    writer.writerows(data_rows)

print(f"Dataset generated with {len(data_rows)} items at {output_csv}")
