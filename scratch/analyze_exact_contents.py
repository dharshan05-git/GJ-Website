import os
import numpy as np
from PIL import Image

base = r"C:\Users\vigneshwaran\Downloads\GJ ALL FILES 5\GJ ALL FILES 5"

# Let's inspect the images in pendant, studs, Men's braclet
# Let's check:
# 1. PENDANTS:
# - Gold Knot: WhatsApp 11.32.02 (plain), ChatGPT 11_18_13 (model), WhatsApp 10.00.17 (angle/box?), WhatsApp 10.12.43 (box?)
# - Gold Swirl: ChatGPT 10_33_55 (box!), ChatGPT 11_02_01 (model), WhatsApp 10.38.16 (plain?), ChatGPT 10_41_38 (angle?)
# - Gold Teardrop: ChatGPT 10_30_19 (box!), ChatGPT 11_09_15 (model), WhatsApp 11.21.09 (plain?), ChatGPT 11_53_46 (angle?)
# - Gold Wing: ChatGPT 10_11_42 (box!), ChatGPT 11_16_10 (model), WhatsApp 11.29.49 (plain on silk/flowers!)
# - Green Leaf: ChatGPT 10_29_36 (box!), ChatGPT 11_12_09 (model), WhatsApp 11.22.49 (plain on silk/flowers!)

def inspect_folder(cat, prod):
    p_dir = os.path.join(base, cat, prod)
    files = sorted(os.listdir(p_dir))
    print(f"\n==============================\n{cat} / {prod}\n==============================")
    for f in files:
        fp = os.path.join(p_dir, f)
        with Image.open(fp) as im:
            rgb = im.convert("RGB")
            arr = np.array(rgb.resize((100, 100)), dtype=np.float32)
            r, g, b = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2]
            
            # Box color check in top-left (where the GJ box is):
            box_tl = (r[10:40, 10:40] > 100) & (r[10:40, 10:40] < 220) & (g[10:40, 10:40] > 40) & (g[10:40, 10:40] < 140) & (b[10:40, 10:40] > 50) & (b[10:40, 10:40] < 150)
            box_ratio = float(np.mean(box_tl))
            
            # Skin check
            skin = (r > 95) & (g > 40) & (b > 20) & ((r - g) > 15) & (r > b) & ((np.maximum(r, np.maximum(g, b)) - np.minimum(r, np.minimum(g, b))) > 15)
            skin_ratio = float(np.mean(skin))
            
            print(f"  {f} -> size:{im.size}, box_tl:{round(box_ratio,2)}, skin:{round(skin_ratio,2)}")

for cat in ["pendant", "studs", "Men's braclet"]:
    cat_dir = os.path.join(base, cat)
    for p in sorted(os.listdir(cat_dir)):
        if os.path.isdir(os.path.join(cat_dir, p)):
            inspect_folder(cat, p)
