import os
import json
import numpy as np
from PIL import Image

base_dir = r"C:\Users\vigneshwaran\Downloads\GJ ALL FILES 5\GJ ALL FILES 5"

def analyze_img_details(fp):
    with Image.open(fp) as im:
        rgb = im.convert("RGB")
        w, h = rgb.size
        small = rgb.resize((100, 100))
        arr = np.array(small, dtype=np.float32)
        
        r, g, b = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2]
        
        # Skin detection
        skin = (r > 95) & (g > 40) & (b > 20) & ((r - g) > 15) & (r > b) & ((np.maximum(r, np.maximum(g, b)) - np.minimum(r, np.minimum(g, b))) > 15)
        skin_ratio = float(np.mean(skin))
        
        # Box detection (pink/burgundy box with dark/rose box edges or interior beige/velvet pad)
        # Box has distinct pink/burgundy hue or beige interior
        box_exterior = (r > 120) & (r < 220) & (g > 50) & (g < 130) & (b > 60) & (b < 140)
        beige_interior = (r > 180) & (g > 140) & (g < 190) & (b > 110) & (b < 160) & ((r - g) > 15)
        box_ratio = float(np.mean(box_exterior | beige_interior))
        
        # Background uniformity (corners and borders)
        corners = np.concatenate([
            arr[0:15, 0:15, :].reshape(-1, 3),
            arr[0:15, -15:, :].reshape(-1, 3),
            arr[-15:, 0:15, :].reshape(-1, 3),
            arr[-15:, -15:, :].reshape(-1, 3)
        ])
        corner_std = float(np.mean(np.std(corners, axis=0)))
        
        # Center crop vs corner difference (plain background studio shot has high contrast in center vs uniform borders)
        center = arr[25:75, 25:75, :].reshape(-1, 3)
        center_std = float(np.mean(np.std(center, axis=0)))
        
        return {
            "w": w, "h": h, "aspect": round(w/h, 2),
            "skin": round(skin_ratio, 3),
            "box": round(box_ratio, 3),
            "corner_std": round(corner_std, 1),
            "center_std": round(center_std, 1)
        }

# Let's inspect each category
results = {}
for cat in sorted(os.listdir(base_dir)):
    cat_dir = os.path.join(base_dir, cat)
    if not os.path.isdir(cat_dir):
        continue
    results[cat] = {}
    for p in sorted(os.listdir(cat_dir)):
        p_dir = os.path.join(cat_dir, p)
        if not os.path.isdir(p_dir):
            continue
        results[cat][p] = {}
        for f in sorted(os.listdir(p_dir)):
            fp = os.path.join(p_dir, f)
            if os.path.isfile(fp) and f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp')):
                stats = analyze_img_details(fp)
                results[cat][p][f] = stats

with open("scratch/img_detailed_stats.json", "w", encoding="utf-8") as f:
    json.dump(results, f, indent=2)

print("Saved img_detailed_stats.json")
