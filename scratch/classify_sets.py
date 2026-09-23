import os
import numpy as np
from PIL import Image

def analyze_img(path):
    with Image.open(path) as im:
        im_rgb = im.convert("RGB").resize((100, 100))
        arr = np.array(im_rgb)
        # Check skin tones / model vs product
        # Skin tones roughly: R > G > B, R > 120, G > 70, B > 50, R - G > 15
        r, g, b = arr[:,:,0], arr[:,:,1], arr[:,:,2]
        skin_mask = (r > 120) & (g > 70) & (b > 50) & (r > g) & (g > b) & ((r.astype(int) - g.astype(int)) > 15)
        skin_pct = np.mean(skin_mask)
        # Check box top-left burgundy color (#7B3F42 or similar)
        tl_corner = arr[:25, :25]
        box_tl = np.mean((tl_corner[:,:,0] > 90) & (tl_corner[:,:,0] < 160) & (tl_corner[:,:,1] < 90) & (tl_corner[:,:,2] < 90))
        return skin_pct, box_tl

base = r"C:\Users\vigneshwaran\Downloads\GJ ALL FILES 5\GJ ALL FILES 5\Sets"
for prod in os.listdir(base):
    p_dir = os.path.join(base, prod)
    if os.path.isdir(p_dir):
        print("=== Product:", prod)
        for f in os.listdir(p_dir):
            skin_pct, box_tl = analyze_img(os.path.join(p_dir, f))
            print(f"  {f:50s} skin={skin_pct*100:5.1f}%  box={box_tl*100:5.1f}%")
