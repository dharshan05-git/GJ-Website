import os

base = r"C:\Users\vigneshwaran\Downloads\GJ ALL FILES 5\GJ ALL FILES 5\pendant"
for p in sorted(os.listdir(base)):
    p_dir = os.path.join(base, p)
    if os.path.isdir(p_dir):
        print(f"\n=== PENDANT: {p} ===")
        for f in os.listdir(p_dir):
            print(f"  - {f}")
