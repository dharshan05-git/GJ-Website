import os
import numpy as np
from PIL import Image

base = r"C:\Users\vigneshwaran\Downloads\GJ ALL FILES 5\GJ ALL FILES 5\pendant"

for p in sorted(os.listdir(base)):
    p_dir = os.path.join(base, p)
    if not os.path.isdir(p_dir): continue
    print(f"=== PENDANT / {p} ===")
    for f in sorted(os.listdir(p_dir)):
        fp = os.path.join(p_dir, f)
        with Image.open(fp) as im:
            rgb = im.convert("RGB")
            arr = np.array(rgb.resize((100, 100)), dtype=np.float32)
            r, g, b = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2]
            skin = (r > 95) & (g > 40) & (b > 20) & ((r - g) > 15) & (r > b) & ((np.maximum(r, np.maximum(g, b)) - np.minimum(r, np.minimum(g, b))) > 15)
            skin_ratio = float(np.mean(skin))
            
            box = (r > 100) & (r < 230) & (g > 40) & (g < 140) & (b > 50) & (b < 150)
            box_ratio = float(np.mean(box))
            
            corners = np.concatenate([arr[0:10, 0:10, :], arr[0:10, -10:, :], arr[-10:, 0:10, :], arr[-10:, -10:, :]])
            c_std = float(np.mean(np.std(corners, axis=0)))
            
            print(f"  {f}: skin={round(skin_ratio,2)}, box={round(box_ratio,2)}, corner_std={round(c_std,1)}, size={im.size}")
