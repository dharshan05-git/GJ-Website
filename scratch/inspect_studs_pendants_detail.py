import os
from PIL import Image

base = r"C:\Users\vigneshwaran\Downloads\GJ ALL FILES 5\GJ ALL FILES 5"

for cat in ["studs", "pendant"]:
    p_cat = os.path.join(base, cat)
    print(f"\n==================== {cat.upper()} ====================")
    for prod in sorted(os.listdir(p_cat)):
        p_prod = os.path.join(p_cat, prod)
        if os.path.isdir(p_prod):
            print(f"\nProduct: {prod}")
            for f in sorted(os.listdir(p_prod)):
                fp = os.path.join(p_prod, f)
                with Image.open(fp) as im:
                    print(f"  {f} ({im.size}, {im.mode})")
