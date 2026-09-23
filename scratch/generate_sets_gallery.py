import os

base = r"C:\Users\vigneshwaran\Downloads\GJ ALL FILES 5\GJ ALL FILES 5\Sets"
html = "<html><body style='background:#222;color:#fff;font-family:sans-serif;padding:20px;'>"
for prod in sorted(os.listdir(base)):
    p_dir = os.path.join(base, prod)
    if os.path.isdir(p_dir):
        html += f"<h2>{prod}</h2><div style='display:flex;gap:20px;flex-wrap:wrap;margin-bottom:30px;'>"
        for f in os.listdir(p_dir):
            fp = os.path.join(p_dir, f).replace("\\", "/")
            html += f"<div style='text-align:center;'><img src='file:///{fp}' style='width:240px;height:240px;object-fit:cover;border:2px solid #555;border-radius:8px;'><div style='font-size:12px;max-width:240px;word-break:break-all;margin-top:6px;'>{f}</div></div>"
        html += "</div>"
html += "</body></html>"

with open("scratch/sets_gallery.html", "w", encoding="utf-8") as f:
    f.write(html)
print("Wrote scratch/sets_gallery.html")
