import os

base = r"C:\Users\vigneshwaran\Downloads\GJ ALL FILES 5\GJ ALL FILES 5\pendant"
for p in sorted(os.listdir(base)):
    p_dir = os.path.join(base, p)
    if os.path.isdir(p_dir):
        files = list(os.listdir(p_dir))
        print(f"Product: {p}")
        for idx, f in enumerate(files, 1):
            print(f"  {idx}. {f}")
