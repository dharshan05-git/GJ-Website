import json, re

with open('src/data/products.js', 'r', encoding='utf-8') as f:
    text = f.read()

m = re.search(r'export const PRODUCTS = (\[.*?\]);\s*export const CATEGORIES', text, re.DOTALL)
if m:
    prods = json.loads(m.group(1))
    print("=== MEN'S BRACELETS ===")
    for p in prods:
        if p['category'] == 'BRACELETS' and p['gender'] == 'MEN':
            print(f"  {p['name']}: cover={p['image']}")
            
    print("\n=== STUDS ===")
    for p in prods:
        if p['category'] == 'STUDS':
            print(f"  {p['name']}: cover={p['image']}")
            
    print("\n=== PENDANTS ===")
    for p in prods:
        if p['category'] == 'NECKLACES':
            print(f"  {p['name']}: cover={p['image']}")
