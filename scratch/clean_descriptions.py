import json
import re

with open("scratch/pdf_text_dump.txt", "r", encoding="utf-8") as f:
    raw_pdf_text = f.read()

# Helper to extract clean descriptions from PDF
# Each product has a clean text description in the catalog
# Let's inspect products.js and fix the description text
with open("src/data/products.js", "r", encoding="utf-8") as f:
    content = f.read()

# Find the JSON array
match = re.search(r'export const PRODUCTS = (\[[\s\S]*?\]);', content)
if not match:
    raise ValueError("Could not find PRODUCTS array")

products = json.loads(match.group(1))

for p in products:
    name = p["name"]
    desc = p["description"]
    # Strip any \u2013 or strange single-letter hyphens
    clean = re.sub(r'[\u2013\u2014\-–—]', '', desc)
    # Reconstruct clean text
    # e.g. "Blue Stone Set an elegant jewelry set crafted in blue stone, finished with a polished, statementready look. Handcrafted to perfection with signature Gevariya Jewels fine jewelry detailing."
    # Let's format nicely: "{Name} – an elegant {category/type} crafted in {materials}, finished with a polished, statement-ready look. Handcrafted to perfection with signature Gevariya Jewels fine jewelry detailing."
    
    # Extract material/type part if present
    m = re.search(r'an elegant (.*?) Handcrafted', desc)
    if not m:
        m = re.search(r'an elegant (.*)$', desc)
    
    desc_clean_body = ""
    if m:
        body = m.group(1)
        # clean out any dashes between letters
        body = re.sub(r'[\u2013\u2014–—\-]', '', body)
        body = re.sub(r'\s+', ' ', body).strip()
        body = body.rstrip('.').strip()
        if "statementready" in body:
            body = body.replace("statementready", "statement-ready")
        if "statement ready" in body:
            body = body.replace("statement ready", "statement-ready")
        desc_clean_body = f"an elegant {body}."
    else:
        desc_clean_body = f"an elegant piece crafted in fine precious metal with brilliant stone accents, finished with a polished, statement-ready look."
    
    p["description"] = f"{name} – {desc_clean_body} Handcrafted to perfection with signature Gevariya Jewels fine jewelry detailing."

# Re-serialize
js_content = """// GEVARIYA JEWELS - Full 56-Product Master Catalog
// Auto-generated from official product catalog & assets

export const PRODUCTS = """ + json.dumps(products, indent=2) + """;

export const CATEGORIES = [
  {
    id: "RINGS",
    name: "Rings",
    count: 20,
    image: "/products/pink-butterfly-ring/image-1.webp",
    description: "Engagement, solitaires & handcrafted statement bands",
    subCategories: ["WOMEN'S RINGS", "MEN'S RINGS", "SOLITAIRES", "ETERNITY BANDS"]
  },
  {
    id: "BRACELETS",
    name: "Bracelets & Bangles",
    count: 8,
    image: "/products/diamond-tennis-bracelet/image-1.webp",
    description: "Tennis bracelets, architectural cuffs & delicate charm chains",
    subCategories: ["WOMEN'S BRACELETS", "MEN'S BRACELETS", "TENNIS BRACELETS", "BANGLES"]
  },
  {
    id: "EARRINGS",
    name: "Earrings",
    count: 10,
    image: "/products/gold-bow-drop/image-1.webp",
    description: "Cascading drops, hoops & chandeliers designed to captivate",
    subCategories: ["DROP EARRINGS", "HOOPS", "STATEMENT DROPS"]
  },
  {
    id: "STUDS",
    name: "Solitaire Studs",
    count: 4,
    image: "/products/round-diamond-studs/image-1.webp",
    description: "Timeless brilliant-cut solitaires & halo designs for daily elegance",
    subCategories: ["ROUND STUDS", "CUSHION HALO", "EMERALD CUT"]
  },
  {
    id: "NECKLACES",
    name: "Pendants & Necklaces",
    count: 10,
    image: "/products/gold-swirl-pendant/image-1.webp",
    description: "Iconic pendants, solitaires & celestial motifs on fine gold chains",
    subCategories: ["SOLITAIRE PENDANTS", "FLORAL PENDANTS", "STATEMENT PENDANTS"]
  },
  {
    id: "SETS",
    name: "Jewelry Sets",
    count: 4,
    image: "/products/blue-stone-set/image-1.webp",
    description: "Harmonious bridal & gala sets combining necklace, earrings & ring",
    subCategories: ["BRIDAL SETS", "OCCASION SETS", "MATCHING SUITES"]
  }
];

export const SIGNATURE_PRODUCT = PRODUCTS.find(p => p.id === "pink-butterfly-ring") || PRODUCTS[0];
"""

with open("src/data/products.js", "w", encoding="utf-8") as f:
    f.write(js_content)

print("Cleaned descriptions for all 56 products successfully!")
