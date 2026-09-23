import os
import json
from PIL import Image

base = r"C:\Users\vigneshwaran\Downloads\GJ ALL FILES 5\GJ ALL FILES 5"

# Let's inspect every file in pendant, studs, Men's braclet, Sets, EARRINGS
# For each file, check if it has the Gevariya box
# The Gevariya box has the gold GJ logo and the pink square box.

html = """<!DOCTYPE html>
<html>
<head>
<meta charset='utf-8'>
<title>Inspect All Images</title>
<style>
body { font-family: sans-serif; background: #1a1a1a; color: #fff; padding: 20px; }
.card { background: #2a2a2a; border-radius: 8px; margin-bottom: 20px; padding: 15px; }
.row { display: flex; gap: 10px; flex-wrap: wrap; }
.img-box { width: 220px; background: #000; padding: 5px; border-radius: 4px; text-align: center; }
.img-box img { width: 100%; height: 200px; object-fit: contain; }
.fn { font-size: 11px; word-break: break-all; margin-top: 5px; color: #aaa; }
</style>
</head>
<body>
"""

categories = ["pendant", "studs", "Men's braclet", "Sets", "EARRINGS"]

for cat in categories:
    html += f"<h1>Category: {cat}</h1>"
    cat_dir = os.path.join(base, cat)
    for p in sorted(os.listdir(cat_dir)):
        p_dir = os.path.join(cat_dir, p)
        if not os.path.isdir(p_dir): continue
        html += f"<div class='card'><h2>{p}</h2><div class='row'>"
        for f in sorted(os.listdir(p_dir)):
            fp = os.path.join(p_dir, f)
            url = f"file:///{fp.replace('\\', '/')}"
            html += f"<div class='img-box'><img src='{url}'><div class='fn'>{f}</div></div>"
        html += "</div></div>"

html += "</body></html>"

with open("scratch/inspect_all_raw_images.html", "w", encoding="utf-8") as f:
    f.write(html)

print("Saved scratch/inspect_all_raw_images.html")
