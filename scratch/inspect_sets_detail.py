import os
from PIL import Image

base = r"C:\Users\vigneshwaran\Downloads\GJ ALL FILES 5\GJ ALL FILES 5\Sets"
for prod in os.listdir(base):
    p_dir = os.path.join(base, prod)
    if os.path.isdir(p_dir):
        print("Product:", prod)
        for f in os.listdir(p_dir):
            fp = os.path.join(p_dir, f)
            with Image.open(fp) as im:
                print(f"  - {f}: size={im.size}, mode={im.mode}")
