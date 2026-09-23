import os
import json
import base64

base_dir = r"C:\Users\vigneshwaran\Downloads\GJ ALL FILES 5\GJ ALL FILES 5"
with open("scratch/image_analysis.json", "r", encoding="utf-8") as f:
    data = json.load(f)

html = """<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Product Image Classification Inspector</title>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #121212; color: #eee; margin: 0; padding: 20px; }
  h1, h2, h3 { color: #f4c2c2; }
  .product-row { background: #1e1e1e; border: 1px solid #333; border-radius: 8px; margin-bottom: 24px; padding: 16px; }
  .img-grid { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 10px; }
  .img-card { background: #2a2a2a; border-radius: 6px; padding: 8px; width: 220px; text-align: center; }
  .img-card img { width: 100%; height: 200px; object-fit: contain; background: #000; border-radius: 4px; }
  .img-name { font-size: 11px; margin-top: 6px; word-break: break-all; color: #aaa; }
  .badge { display: inline-block; padding: 2px 6px; font-size: 10px; border-radius: 3px; font-weight: bold; margin-top: 4px; }
  .badge-plain { background: #2563eb; color: white; }
  .badge-model { background: #16a34a; color: white; }
  .badge-angle { background: #d97706; color: white; }
  .badge-box { background: #db2777; color: white; }
  .stats { font-size: 10px; color: #777; margin-top: 4px; }
</style>
</head>
<body>
<h1>Product Image Catalog Inspector (56 Products)</h1>
"""

for cat, prods in data.items():
    html += f"<h2>Category: {cat}</h2>"
    for p_name, images in prods.items():
        p_dir = os.path.join(base_dir, cat, p_name)
        html += f"<div class='product-row'><h3>{cat} &mdash; {p_name} ({len(images)} images)</h3><div class='img-grid'>"
        
        for idx, img_info in enumerate(images):
            fn = img_info["filename"]
            fp = os.path.join(p_dir, fn)
            # file url
            file_url = f"file:///{fp.replace('\\', '/')}"
            
            html += f"""
            <div class='img-card'>
                <img src='{file_url}' alt='{fn}'>
                <div class='img-name'><b>#{idx+1}</b> {fn}</div>
                <div class='stats'>{img_info.get('width', 0)}x{img_info.get('height', 0)} (aspect {img_info.get('aspect', 1)})<br>
                Skin: {img_info.get('skin_ratio', 0)} | Box: {img_info.get('box_ratio', 0)}</div>
            </div>
            """
        html += "</div></div>"

html += "</body></html>"

with open("scratch/gallery.html", "w", encoding="utf-8") as f:
    f.write(html)

print("Saved scratch/gallery.html")
