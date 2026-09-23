import os
from PIL import Image

base = r"C:\Users\vigneshwaran\Downloads\GJ ALL FILES 5\GJ ALL FILES 5"

items = [
    ("Men's braclet", "Diamond Tennis Bracelet"),
    ("Men's braclet", "Gold Cuff Bangle"),
    ("Men's braclet", "Ruby Emerald Bracelet"),
    ("women's bracelet", "Blue Flower Bracelet")
]

for cat, name in items:
    p_dir = os.path.join(base, cat, name)
    print(f"=== {name} ===")
    for f in sorted(os.listdir(p_dir)):
        fp = os.path.join(p_dir, f)
        with Image.open(fp) as im:
            print(f"  {f:50s} size={im.size}")
