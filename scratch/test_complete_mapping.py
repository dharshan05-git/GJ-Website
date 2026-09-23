import os
import json
import re

base_dir = r"C:\Users\vigneshwaran\Downloads\GJ ALL FILES 5\GJ ALL FILES 5"

with open("scratch/img_detailed_stats.json", "r", encoding="utf-8") as f:
    stats = json.load(f)

with open("scratch/pdf_catalog_parsed.json", "r", encoding="utf-8") as f:
    pdf_prods = json.load(f)

# Let's define the precise 4-slot image picker for each product folder
# Slot 1: Plain background / clean solo product
# Slot 2: Model wearing it
# Slot 3: Normal background / angle / close-up
# Slot 4: Box shot

def pick_images(cat, prod_folder, files_dict):
    # files_dict is a dict of {filename: stats}
    files = list(files_dict.keys())
    
    # 1. WOMEN'S BRACELET (r1..r4, t1..t4, o1..o4, u1..u4)
    if cat == "women's bracelet":
        p1 = [f for f in files if f.endswith("1.jpeg") or f.endswith("1.png")][0]
        p2 = [f for f in files if f.endswith("2.jpeg") or f.endswith("2.png")][0]
        p3 = [f for f in files if f.endswith("3.jpeg") or f.endswith("3.png")][0]
        p4 = [f for f in files if f.endswith("4.jpeg") or f.endswith("4.png")][0]
        return [p1, p2, p3, p4]

    # 2. WOMEN'S RING
    if cat == "women's ring":
        if prod_folder == "Pink Butterfly Ring":
            return [
                "ring h1.jpeg", # 1. plain bg
                "WhatsApp Image 2026-09-15 at 3.32.12 PM.jpeg", # 2. model hand
                "ring h2.png", # 3. close-up angle
                "WhatsApp Image 2026-09-15 at 10.49.54 PM.jpeg" # 4. box
            ]
        elif prod_folder == "Heart Diamond Ring":
            return ["ring b1.jpeg", "ring b2.png", "ring b3.png", "ring b4.png"]
        elif prod_folder == "Oval Diamond Ring":
            return ["ring e1.png", "ring e2.png", "ring e3.png", "ring e4.png"]
        elif prod_folder == "Petite Butterfly Ring":
            return ["ring i1.jpeg", "WhatsApp Image 2026-09-14 at 10.11.23 PM.jpeg", "ring i2.png", "ring i4.png"]
        elif prod_folder == "Pink Bow Ring":
            return ["ring f1.jpeg", "WhatsApp Image 2026-09-15 at 2.01.14 PM.jpeg", "ring f2.png", "ring f3.png"]
        elif prod_folder == "Pink Floral Ring":
            return ["ring j1.png", "WhatsApp Image 2026-09-14 at 10.11.24 PM.jpeg", "ring j4.jpeg", "05.jpeg"]
        elif prod_folder == "Pink Heart Ring":
            return ["ring k1.png", "WhatsApp Image 2026-09-14 at 8.50.42 PM.jpeg", "ring k2.png", "ring k4.png"]
        elif prod_folder == "Pink Trillion Ring":
            return ["ring d1.jpeg", "WhatsApp Image 2026-09-15 at 1.06.59 PM.jpeg", "ring d2.png", "WhatsApp Image 2026-09-15 at 3.09.12 PM.jpeg"]
        elif prod_folder == "Textured Gold Band":
            return ["ring c1.png", "ring c2.png", "ring c3.png", "ring c4.png"]
        elif prod_folder == "Yellow Gemstone Ring":
            return ["ring a1.png", "ring a2.png", "ring a3.jpeg", "ring a4.jpeg"]

    # 3. SETS
    if cat == "Sets":
        # Check files for each set
        if prod_folder == "Blue Stone Set":
            return [
                "1000052334-no-watermark.png", # plain
                "watermark-removed-1000051808.png", # model
                "watermark-removed-1000052269.png", # angle
                "WhatsApp Image 2026-09-14 at 10.09.35 PM (1).jpeg" # box
            ]
        elif prod_folder == "Gold Heart Set":
            return [
                "watermark-removed-1000051949.png", # plain
                "watermark-removed-1000051950.png", # model
                "watermark-removed-1000052271.png", # angle
                "WhatsApp Image 2026-09-14 at 10.09.34 PM (2).jpeg" # box
            ]
        elif prod_folder == "Pink Pendant Set":
            return [
                "895f0204ec8f4023ba838d9cbfba07ee.png", # plain
                "watermark-removed-1000051930.png", # model
                "watermark-removed-1000051931.png", # angle
                "WhatsApp Image 2026-09-14 at 10.09.35 PM.jpeg" # box
            ]
        elif prod_folder == "Rose Flower Set":
            # Files: WhatsApp (1), WhatsApp, WhatsApp (2), watermark-removed-1000052270.png
            # Let's inspect which WhatsApp is box, model, plain, angle
            return [
                "watermark-removed-1000052270.png", # plain
                "WhatsApp Image 2026-09-14 at 10.09.34 PM.jpeg", # model
                "WhatsApp Image 2026-09-14 at 10.09.34 PM (1).jpeg", # angle
                "WhatsApp Image 2026-09-14 at 10.09.35 PM (2).jpeg" # box
            ]

    # For other categories, let's sort by heuristic and verify
    # Box images usually have high box ratio or WhatsApp in name or specific box filename
    box_candidates = [f for f in files if "box" in f.lower() or "10.09." in f or "4.39.38" in f or "8.15.46" in f or "10.12.43" in f or "4.00.48" in f or "3.50.55" in f or "3.26.23" in f or "7.45.15" in f or "5.26.58" in f or "1.35.33" in f or "4.44.32" in f or "wmremove-transformed (2)" in f or "gemini-watermark-removed (4)" in f or "gemini-watermark-removed (5)" in f or "gemini-watermark-removed (2)" in f or "gemini-watermark-removed (8)" in f or "watermark-removed-8adf7324" in f or "watermark-removed-f6599f44" in f or "b1bfc991" in f or "watermark-removed-78ca0581" in f or "watermark-removed-5305b354" in f or "04_14_06" in f or "12_55_03" in f or "d79ce92b" in f or "f30af426" in f or "8f9s608f9s608f9s" in f]
    
    # Model images usually have high skin ratio or portrait aspect or specific model files
    # Plain bg usually has low corner std and centered composition
    return files[:4]

print("Pick function defined.")
