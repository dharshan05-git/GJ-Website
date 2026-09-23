import os
import json

base_dir = r"C:\Users\vigneshwaran\Downloads\GJ ALL FILES 5\GJ ALL FILES 5"
with open("scratch/img_detailed_stats.json", "r", encoding="utf-8") as f:
    stats = json.load(f)

# Classification logic per product
# Let's inspect the files for each category and print out proposed slots

def classify_product_images(cat, prod, files_dict):
    filenames = list(files_dict.keys())
    
    # Custom rules based on known naming patterns across directories:
    # 1. Women's rings:
    # - ring *1 -> Plain BG (Slot 0)
    # - WhatsApp (model) or ring *2 -> Model (Slot 1)
    # - ring *2 / ring *3 / ring *4 (macro angle) -> Normal BG (Slot 2)
    # - ring *4 / 05.jpeg / WhatsApp (box) -> Box (Slot 3)
    
    slots = {"plain": None, "model": None, "angle": None, "box": None}
    
    # Sort files
    sorted_f = sorted(filenames)
    
    # Check if files follow 1,2,3,4 pattern
    # Let's check specific categories:
    if cat == "women's bracelet":
        # r1=plain, r2=model, r3=angle, r4=box
        for f in sorted_f:
            if f.endswith("1.jpeg") or f.endswith("1.png"): slots["plain"] = f
            elif f.endswith("2.jpeg") or f.endswith("2.png"): slots["model"] = f
            elif f.endswith("3.jpeg") or f.endswith("3.png"): slots["angle"] = f
            elif f.endswith("4.jpeg") or f.endswith("4.png"): slots["box"] = f
        return slots

    if cat == "women's ring":
        # Check files
        for f in sorted_f:
            st = files_dict[f]
            # box detection:
            # WhatsApp 10.49.54 PM or ring *4 or 05.jpeg or WhatsApp 8.50.42 PM or WhatsApp 3.09.12 PM
            if "10.49.54" in f or "05.jpeg" in f or "8.50.42" in f or "3.09.12" in f or "ring b4" in f or "ring c4" in f or "ring e4" in f or "ring i4" in f or "ring f3" in f or "ring a4" in f:
                slots["box"] = f
            elif "ring h1" in f or "ring a1" in f or "ring b1" in f or "ring c1" in f or "ring d1" in f or "ring e1" in f or "ring f1" in f or "ring i1" in f or "ring j1" in f or "ring k1" in f:
                slots["plain"] = f
            elif "3.32.12" in f or "1.06.59" in f or "2.01.14" in f or "10.11.23" in f or "10.11.24" in f or "ring a2" in f or "ring b2" in f or "ring c2" in f or "ring e2" in f:
                slots["model"] = f
            else:
                slots["angle"] = f
        return slots

    return None

# Let's inspect all products across all categories
for cat in sorted(stats.keys()):
    print(f"\n==================== {cat} ====================")
    for prod in sorted(stats[cat].keys()):
        files = stats[cat][prod]
        print(f"Product: {prod}")
        for fn, st in files.items():
            print(f"  {fn} -> w:{st['w']}, h:{st['h']}, aspect:{st['aspect']}, skin:{st['skin']}, box:{st['box']}, corner_std:{st['corner_std']}")
