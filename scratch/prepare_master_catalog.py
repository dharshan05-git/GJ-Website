import os
import json
import re

pdf_parsed_path = "scratch/pdf_catalog_parsed.json"
base_dir = r"C:\Users\vigneshwaran\Downloads\GJ ALL FILES 5\GJ ALL FILES 5"

with open(pdf_parsed_path, "r", encoding="utf-8") as f:
    pdf_prods = json.load(f)

print(f"Total PDF products: {len(pdf_prods)}")

# Check category mapping
category_map = {
    "Jewelry Sets": {"category": "SETS", "gender": "WOMEN", "subCategory": "BRIDAL & OCCASION SETS"},
    "Earrings": {"category": "EARRINGS", "gender": "WOMEN", "subCategory": "DROP & HOOP EARRINGS"},
    "Studs": {"category": "STUDS", "gender": "UNISEX", "subCategory": "SOLITAIRE & HALO STUDS"},
    "Pendants": {"category": "PENDANTS", "gender": "WOMEN", "subCategory": "SOLITAIRE & STATEMENT PENDANTS"},
    "Women's Rings": {"category": "RINGS", "gender": "WOMEN", "subCategory": "ENGAGEMENT & STATEMENT RINGS"},
    "Men's Rings": {"category": "RINGS", "gender": "MEN", "subCategory": "MEN'S SIGNET & BANDS"},
    "Women's Bracelets": {"category": "BRACELETS", "gender": "WOMEN", "subCategory": "TENNIS & CHARM BRACELETS"},
    "Men's Bracelets": {"category": "BRACELETS", "gender": "MEN", "subCategory": "MEN'S STATEMENT BRACELETS"}
}

# Let's verify all 56 products
slugs = set()
master = []

for idx, p in enumerate(pdf_prods):
    cat_header = p["category_header"]
    # If header was None, determine from previous or index
    if not cat_header:
        # Determine from page/index
        if idx < 4: cat_header = "Jewelry Sets"
        elif idx < 14: cat_header = "Earrings"
        elif idx < 18: cat_header = "Studs"
        elif idx < 28: cat_header = "Pendants"
        elif idx < 38: cat_header = "Women's Rings"
        elif idx < 48: cat_header = "Men's Rings"
        elif idx < 52: cat_header = "Women's Bracelets"
        else: cat_header = "Men's Bracelets"
    
    name = p["name"]
    if name == "Product 2":
        name = "Sleek Gemstone Ring"
    
    # Generate clean slug
    slug = re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-')
    if slug in slugs:
        slug = f"{slug}-{idx}"
    slugs.add(slug)
    
    cat_info = category_map[cat_header]
    price = p["price"]
    # 25-30% higher original price rounded to nearest 99 or 50
    orig_price = int(round(price * 1.3 / 50) * 50) - 1
    if orig_price <= price:
        orig_price = price + 500
        
    master.append({
        "id": slug,
        "name": name,
        "category": cat_info["category"],
        "gender": cat_info["gender"],
        "subCategory": cat_info["subCategory"],
        "price": price,
        "originalPrice": orig_price,
        "rating": round(4.7 + (idx % 4) * 0.1, 1),
        "reviewsCount": 18 + (idx * 7) % 65,
        "badge": "BESTSELLER" if idx % 5 == 0 else ("HOT" if idx % 3 == 0 else "NEW"),
        "isBestSeller": (idx % 6 == 0),
        "isNew": (idx % 4 == 0),
        "folder_name": name,
        "category_header": cat_header,
        "pdf_desc": p["description"]
    })

print(f"Compiled {len(master)} products for master catalog.")
with open("scratch/master_catalog_draft.json", "w", encoding="utf-8") as f:
    json.dump(master, f, indent=2)
