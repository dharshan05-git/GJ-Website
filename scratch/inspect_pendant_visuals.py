import os
from PIL import Image
import numpy as np

base = r"C:\Users\vigneshwaran\Downloads\GJ ALL FILES 5\GJ ALL FILES 5"

# Let's write a script to describe the exact visual content of each file in pendant
print("=== PENDANTS INSPECTION ===")
for p in sorted(os.listdir(os.path.join(base, "pendant"))):
    p_dir = os.path.join(base, "pendant", p)
    if not os.path.isdir(p_dir): continue
    print(f"\nProduct: {p}")
    for f in sorted(os.listdir(p_dir)):
        fp = os.path.join(p_dir, f)
        with Image.open(fp) as im:
            rgb = im.convert("RGB")
            arr = np.array(rgb.resize((100, 100)), dtype=np.float32)
            r, g, b = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2]
            
            # Box detection (pink/burgundy box)
            # The Gevariya box is dark mauve/pink box
            is_box = "WhatsApp Image 2026-09-12" in f or "WhatsApp Image 2026-09-14 at 10.12.43" in f or "WhatsApp Image 2026-09-14 at 4.00.48" in f or "WhatsApp Image 2026-09-14 at 3.50.55" in f or "WhatsApp Image 2026-09-14 at 3.26.23" in f
            
            # Skin (model)
            skin = (r > 95) & (g > 40) & (b > 20) & ((r - g) > 15) & (r > b) & ((np.maximum(r, np.maximum(g, b)) - np.minimum(r, np.minimum(g, b))) > 15)
            skin_ratio = float(np.mean(skin))
            
            # Silk/floral background (ChatGPT Image Sep 12, 10_... or WhatsApp Image 2026-09-11 at ...)
            print(f"  {f} -> size:{im.size}, skin:{round(skin_ratio,2)}")
