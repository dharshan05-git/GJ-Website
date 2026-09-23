import re
import json

with open('src/data/products.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's extract id, name, category, price
prods = []
# Find all product blocks
blocks = re.findall(r'\{\s*id:\s*["\']([^"\']+)["\'],\s*name:\s*["\']([^"\']+)["\'],\s*category:\s*["\']([^"\']+)["\']', text)
print(f"Total products in products.js: {len(blocks)}")
for i, b in enumerate(blocks):
    print(f"{i+1}. id='{b[0]}', name='{b[1]}', category='{b[2]}'")
