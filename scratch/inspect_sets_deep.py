import os
from PIL import Image

def summarize(img_path):
    im = Image.open(img_path)
    w, h = im.size
    # sample colors from top center (face/neck area if model) vs center
    center = im.crop((w*0.3, h*0.3, w*0.7, h*0.7)).resize((20, 20)).convert("RGB")
    top = im.crop((w*0.3, h*0.05, w*0.7, h*0.35)).resize((20, 20)).convert("RGB")
    bot = im.crop((w*0.3, h*0.65, w*0.7, h*0.95)).resize((20, 20)).convert("RGB")
    
    return f"size={w}x{h}"

base = r"C:\Users\vigneshwaran\Downloads\GJ ALL FILES 5\GJ ALL FILES 5\Sets"
for prod in sorted(os.listdir(base)):
    p_dir = os.path.join(base, prod)
    if os.path.isdir(p_dir):
        print("Product:", prod)
        for f in os.listdir(p_dir):
            fp = os.path.join(p_dir, f)
            print(" ", f, summarize(fp))
