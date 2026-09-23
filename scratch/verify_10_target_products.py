import json, re

with open('src/data/products.js', 'r', encoding='utf-8') as f:
    text = f.read()

m = re.search(r'export const PRODUCTS = (\[.*?\]);\s*export const CATEGORIES', text, re.DOTALL)
if m:
    prods = json.loads(m.group(1))
    target_names = [
        "Gold Swirl Pendant",
        "Gold Teardrop Pendant",
        "Gold Wing Pendant",
        "Green Leaf Pendant",
        "Emerald Cut Studs",
        "Gold Leopard Studs",
        "Round Diamond Studs",
        "Diamond Tennis Bracelet",
        "Gold Clover Bracelet",
        "Ruby Emerald Bracelet"
    ]
    for name in target_names:
        found = next((p for p in prods if p['name'] == name), None)
        if found:
            print(f"Product: {found['name']:25s} -> Cover: {found['image']} | Hover: {found['hoverImage']}")
