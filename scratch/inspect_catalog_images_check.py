import os

base = r"C:\Users\vigneshwaran\Downloads\GJ ALL FILES 5\GJ ALL FILES 5"
for cat in ["Men's braclet", "studs", "pendant"]:
    p_cat = os.path.join(base, cat)
    print(f"=== CATEGORY: {cat} ===")
    for prod in sorted(os.listdir(p_cat)):
        p_prod = os.path.join(p_cat, prod)
        if os.path.isdir(p_prod):
            files = list(os.listdir(p_prod))
            print(f"  Product: {prod}")
            for i, f in enumerate(files, 1):
                print(f"    {i}. {f}")
