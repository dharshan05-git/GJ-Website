import os

base = r"C:\Users\vigneshwaran\Downloads\GJ ALL FILES 5\GJ ALL FILES 5"

products_to_check = [
    ("pendant", "Gold Swirl Pendant"),
    ("pendant", "Gold Teardrop Pendant"),
    ("pendant", "Gold Wing Pendant"),
    ("pendant", "Green Leaf Pendant"),
    ("studs", "Emerald Cut Studs"),
    ("studs", "Gold Leopard Studs"),
    ("studs", "Round Diamond Studs"),
    ("Men's braclet", "Diamond Tennis Bracelet"),
    ("Men's braclet", "Gold Clover Bracelet"),
    ("Men's braclet", "Ruby Emerald Bracelet")
]

for cat, prod in products_to_check:
    p_dir = os.path.join(base, cat, prod)
    files = list(os.listdir(p_dir))
    print(f"\n[{cat}] -> {prod}")
    for idx, f in enumerate(files, 1):
        print(f"  {idx}. {f}")
