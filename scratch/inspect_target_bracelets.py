import json
import os

with open("src/data/products.js", "r", encoding="utf-8") as f:
    code = f.read()

products = json.loads(code.split("export const PRODUCTS = ")[1].split(";\n\nexport const CATEGORIES")[0])

targets = ["diamond-tennis-bracelet", "gold-cuff-bangle", "ruby-emerald-bracelet", "blue-flower-bracelet"]

for p in products:
    if p["id"] in targets:
        print(f"=== {p['name']} ({p['id']}) ===")
        for idx, img in enumerate(p["images"]):
            print(f"  Slot {idx+1}: {img}")
