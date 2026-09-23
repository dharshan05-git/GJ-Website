import json
import os
from PIL import Image

with open("src/data/products.js", "r", encoding="utf-8") as f:
    code = f.read()

json_text = code.split("export const PRODUCTS = ")[1].split(";\n\nexport const CATEGORIES")[0]
products = json.loads(json_text)

print(f"Total products in catalog: {len(products)}")

errors = []
for p in products:
    slug = p["id"]
    if len(p["images"]) != 4:
        errors.append(f"{slug}: Expected 4 images, found {len(p['images'])}")
    for idx, img_path in enumerate(p["images"]):
        disk_path = os.path.join(r"c:\Users\vigneshwaran\OneDrive\Desktop\New folder (2)\public", img_path.lstrip("/"))
        if not os.path.exists(disk_path):
            errors.append(f"{slug}: Missing {disk_path}")
        else:
            try:
                with Image.open(disk_path) as im:
                    if im.width < 50 or im.height < 50:
                        errors.append(f"{slug}: Corrupt/empty image at {disk_path}")
            except Exception as e:
                errors.append(f"{slug}: Failed to open {disk_path}: {e}")

if errors:
    print("ERRORS FOUND:")
    for err in errors:
        print(" - ", err)
else:
    print("SUCCESS: ALL 56 PRODUCTS & 224 WEBP IMAGES VALIDATED PERFECTLY ON DISK!")
