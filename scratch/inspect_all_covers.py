import json

with open("src/data/products.js", "r", encoding="utf-8") as f:
    code = f.read()

products = json.loads(code.split("export const PRODUCTS = ")[1].split(";\n\nexport const CATEGORIES")[0])

by_cat = {}
for p in products:
    by_cat.setdefault(p["category"], []).append(p)

for cat, prods in by_cat.items():
    print(f"=== {cat} ({len(prods)} products) ===")
    for p in prods:
        print(f"  - {p['name']}: cover={p['image']}")
