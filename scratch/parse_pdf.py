import re
import json

with open("scratch/pdf_text_dump.txt", "r", encoding="utf-8") as f:
    text = f.read()

pages = text.split("---PAGE---")

catalog_items = []

for p_idx, page in enumerate(pages):
    lines = [l.strip() for l in page.split("\n") if l.strip()]
    if not lines or "GJ Jewelry Catalog" in page:
        continue
    
    # Check category header if any
    current_cat = None
    i = 0
    while i < len(lines):
        line = lines[i]
        
        # Category headers
        if line in ["Jewelry Sets", "Earrings", "Studs", "Pendants", "Women's Rings", "Men's Rings", "Women's Bracelets", "Men's Bracelets"]:
            current_cat = line
            i += 1
            continue
        
        # Check if this line is followed by Rs. / Rs
        if i + 1 < len(lines) and re.match(r'^Rs\.?\s*[\d,]+', lines[i+1]):
            name = line
            price_str = lines[i+1]
            price_val = int(re.sub(r'[^\d]', '', price_str))
            
            # Next line(s) description
            desc_lines = []
            j = i + 2
            while j < len(lines):
                if re.match(r'^Rs\.?\s*[\d,]+', lines[j]) or (j + 1 < len(lines) and re.match(r'^Rs\.?\s*[\d,]+', lines[j+1])) or lines[j] in ["Jewelry Sets", "Earrings", "Studs", "Pendants", "Women's Rings", "Men's Rings", "Women's Bracelets", "Men's Bracelets"]:
                    break
                desc_lines.append(lines[j])
                j += 1
            
            desc = " ".join(desc_lines)
            # Clean non-ascii /  characters
            desc = desc.replace("", "-").replace("  ", " ").strip()
            
            catalog_items.append({
                "page": p_idx + 1,
                "category_header": current_cat,
                "name": name,
                "price": price_val,
                "description": desc
            })
            i = j
        else:
            i += 1

print(f"Extracted {len(catalog_items)} items from PDF:")
for idx, it in enumerate(catalog_items):
    print(f"{idx+1}. [{it['category_header']}] {it['name']} -> Rs. {it['price']} | Desc: {it['description'][:60]}...")

with open("scratch/pdf_catalog_parsed.json", "w", encoding="utf-8") as f:
    json.dump(catalog_items, f, indent=2)
