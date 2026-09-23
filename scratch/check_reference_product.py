import os
from PIL import Image

dir_path = r"C:\Users\vigneshwaran\Downloads\GJ ALL FILES 5\GJ ALL FILES 5\women's ring\Pink Butterfly Ring"
for f in os.listdir(dir_path):
    fp = os.path.join(dir_path, f)
    with Image.open(fp) as im:
        print(f"{f}: size={im.size}, mode={im.mode}, bytes={os.path.getsize(fp)}")
