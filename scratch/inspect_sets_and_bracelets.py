import os

base = r"C:\Users\vigneshwaran\Downloads\GJ ALL FILES 5\GJ ALL FILES 5"
for cat in ["Sets", "Men's braclet"]:
    cat_dir = os.path.join(base, cat)
    print("=== CATEGORY:", cat, "===")
    for prod in os.listdir(cat_dir):
        p_dir = os.path.join(cat_dir, prod)
        if os.path.isdir(p_dir):
            print("  Product:", prod)
            for f in os.listdir(p_dir):
                print("    -", f)
