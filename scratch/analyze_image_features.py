import os
import json
import re
import numpy as np
from PIL import Image

base_dir = r"C:\Users\vigneshwaran\Downloads\GJ ALL FILES 5\GJ ALL FILES 5"

# Helper to analyze image colors and properties
def analyze_img(fp):
    try:
        with Image.open(fp) as im:
            rgb_im = im.convert("RGB")
            w, h = rgb_im.size
            # Resize for fast analysis
            small = rgb_im.resize((100, 100))
            arr = np.array(small, dtype=np.float32)
            
            # Mean RGB
            mean_r = float(np.mean(arr[:, :, 0]))
            mean_g = float(np.mean(arr[:, :, 1]))
            mean_b = float(np.mean(arr[:, :, 2]))
            
            # Skin tone detection heuristic (simple rule: R > G > B and R-G in [15, 70], etc.)
            r = arr[:, :, 0]
            g = arr[:, :, 1]
            b = arr[:, :, 2]
            skin_mask = (r > 95) & (g > 40) & (b > 20) & ((r - g) > 15) & (r > b) & ((np.maximum(r, np.maximum(g, b)) - np.minimum(r, np.minimum(g, b))) > 15)
            skin_ratio = float(np.mean(skin_mask))
            
            # Box color heuristic (mauve/pinkish dark red box ~ [160-220, 80-140, 90-150] or [120-180, 50-100, 60-110])
            box_mask = (r > 100) & (r < 230) & (g > 40) & (g < 140) & (b > 50) & (b < 150) & (r > g) & (r > b)
            box_ratio = float(np.mean(box_mask))
            
            # Uniform background heuristic: edge std dev
            edges = np.concatenate([arr[0, :, :], arr[-1, :, :], arr[:, 0, :], arr[:, -1, :]])
            edge_std = float(np.std(edges))
            
            return {
                "width": w,
                "height": h,
                "aspect": round(w / h, 2),
                "skin_ratio": round(skin_ratio, 3),
                "box_ratio": round(box_ratio, 3),
                "edge_std": round(edge_std, 1),
                "mean_rgb": [round(mean_r, 1), round(mean_g, 1), round(mean_b, 1)]
            }
    except Exception as e:
        return {"error": str(e)}

categories = sorted([d for d in os.listdir(base_dir) if os.path.isdir(os.path.join(base_dir, d))])
all_data = {}

for cat in categories:
    cat_dir = os.path.join(base_dir, cat)
    prods = sorted([d for d in os.listdir(cat_dir) if os.path.isdir(os.path.join(cat_dir, d))])
    all_data[cat] = {}
    for p in prods:
        p_dir = os.path.join(cat_dir, p)
        files = sorted([f for f in os.listdir(p_dir) if os.path.isfile(os.path.join(p_dir, f)) and f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp'))])
        all_data[cat][p] = []
        for f in files:
            fp = os.path.join(p_dir, f)
            stats = analyze_img(fp)
            stats["filename"] = f
            all_data[cat][p].append(stats)

with open("scratch/image_analysis.json", "w", encoding="utf-8") as f:
    json.dump(all_data, f, indent=2)

print("Saved image_analysis.json successfully.")
