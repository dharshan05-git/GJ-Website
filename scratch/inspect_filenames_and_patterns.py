import os
import json

base_dir = r"C:\Users\vigneshwaran\Downloads\GJ ALL FILES 5\GJ ALL FILES 5"

for cat in sorted(os.listdir(base_dir)):
    cat_dir = os.path.join(base_dir, cat)
    if not os.path.isdir(cat_dir):
        continue
    print(f"=== CATEGORY: {cat} ===")
    for prod in sorted(os.listdir(cat_dir)):
        prod_dir = os.path.join(cat_dir, prod)
        if not os.path.isdir(prod_dir):
            continue
        files = sorted(os.listdir(prod_dir))
        print(f"  {prod}:")
        for f in files:
            fp = os.path.join(prod_dir, f)
            size = os.path.getsize(fp)
            print(f"    - {f} ({size} bytes)")
