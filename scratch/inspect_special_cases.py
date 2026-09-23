import os
from PIL import Image

base_dir = r"C:\Users\vigneshwaran\Downloads\GJ ALL FILES 5\GJ ALL FILES 5"

special = [
    ("EARRINGS", "Diamond Heart Stud"),
    ("EARRINGS", "Rose Gold Hoops"),
    ("pendant", "Gold Wing Pendant"),
    ("pendant", "Green Leaf Pendant"),
    ("EARRINGS", "Red Stone Stud"),
    ("studs", "Emerald Cut Studs")
]

for cat, prod in special:
    p_dir = os.path.join(base_dir, cat, prod)
    print(f"==============================")
    print(f"Product: {cat} / {prod}")
    print(f"==============================")
    files = sorted(os.listdir(p_dir))
    for f in files:
        fp = os.path.join(p_dir, f)
        if os.path.isfile(fp):
            with Image.open(fp) as im:
                print(f"  - {f}: size={im.size}, mode={im.mode}, bytes={os.path.getsize(fp)}")
