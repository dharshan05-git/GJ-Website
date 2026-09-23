import os
import json
import re
import pypdf
from PIL import Image

pdf_path = r"C:\Users\vigneshwaran\Downloads\GJ ALL FILES 5\GJ ALL FILES 5\GJ ALL FILES 5 - Catalog.pdf"
base_dir = r"C:\Users\vigneshwaran\Downloads\GJ ALL FILES 5\GJ ALL FILES 5"

# 1. Parse PDF
reader = pypdf.PdfReader(pdf_path)
pdf_text = ""
for page in reader.pages:
    pdf_text += page.extract_text() + "\n---PAGE---\n"

print(f"Total PDF pages: {len(reader.pages)}")

# Extract items from PDF
# Patterns look like:
# Item Name
# Rs. 3,999 or Rs. 2249
# Description text...
lines = [l.strip() for l in pdf_text.split('\n') if l.strip()]

with open("scratch/pdf_text_dump.txt", "w", encoding="utf-8") as f:
    f.write(pdf_text)

# Let's inspect folders in base_dir
categories = [d for d in os.listdir(base_dir) if os.path.isdir(os.path.join(base_dir, d))]
print(f"Categories found: {categories}")

catalog_data = []

for cat in categories:
    cat_dir = os.path.join(base_dir, cat)
    subdirs = [d for d in os.listdir(cat_dir) if os.path.isdir(os.path.join(cat_dir, d))]
    for sub in subdirs:
        prod_dir = os.path.join(cat_dir, sub)
        files = [f for f in os.listdir(prod_dir) if os.path.isfile(os.path.join(prod_dir, f)) and f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp'))]
        
        file_infos = []
        for f in files:
            fp = os.path.join(prod_dir, f)
            try:
                with Image.open(fp) as im:
                    w, h = im.size
                    file_infos.append({
                        "filename": f,
                        "size": os.path.getsize(fp),
                        "width": w,
                        "height": h,
                        "aspect": round(w / h, 2)
                    })
            except Exception as e:
                file_infos.append({
                    "filename": f,
                    "size": os.path.getsize(fp),
                    "error": str(e)
                })
        
        catalog_data.append({
            "category_folder": cat,
            "product_name": sub,
            "images": file_infos
        })

print(f"Total product folders found: {len(catalog_data)}")
with open("scratch/folder_structure.json", "w", encoding="utf-8") as f:
    json.dump(catalog_data, f, indent=2)

print("Saved to scratch/folder_structure.json and scratch/pdf_text_dump.txt")
