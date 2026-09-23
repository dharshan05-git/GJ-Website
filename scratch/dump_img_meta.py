import os
import json
from PIL import Image

base_dir = r"C:\Users\vigneshwaran\Downloads\GJ ALL FILES 5\GJ ALL FILES 5"

# Let's inspect each folder and list all images with size and aspect ratio
categorized = {}

for cat in sorted(os.listdir(base_dir)):
    cat_dir = os.path.join(base_dir, cat)
    if not os.path.isdir(cat_dir):
        continue
    categorized[cat] = {}
    for p in sorted(os.listdir(cat_dir)):
        p_dir = os.path.join(cat_dir, p)
        if not os.path.isdir(p_dir):
            continue
        files = sorted(os.listdir(p_dir))
        categorized[cat][p] = []
        for f in files:
            fp = os.path.join(p_dir, f)
            if not os.path.isfile(fp) or not f.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')):
                continue
            with Image.open(fp) as im:
                categorized[cat][p].append({
                    "filename": f,
                    "width": im.width,
                    "height": im.height,
                    "aspect": round(im.width / im.height, 2)
                })

with open("scratch/all_images_meta.json", "w", encoding="utf-8") as f:
    json.dump(categorized, f, indent=2)

print("Saved all_images_meta.json")
