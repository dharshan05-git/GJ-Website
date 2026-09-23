from PIL import Image
import numpy as np

def inspect_img(path):
    im = Image.open(path).convert('RGB')
    arr = np.array(im)
    print(f"File: {path}")
    print(f"  Shape: {arr.shape}")
    print(f"  Mean color: {arr.mean(axis=(0,1))}")

inspect_img(r"C:\Users\vigneshwaran\Downloads\GJ ALL FILES 5\GJ ALL FILES 5\Sets\Blue Stone Set\1000052334-no-watermark.png")
inspect_img(r"C:\Users\vigneshwaran\Downloads\GJ ALL FILES 5\GJ ALL FILES 5\Sets\Blue Stone Set\watermark-removed-1000051808.png")
inspect_img(r"C:\Users\vigneshwaran\Downloads\GJ ALL FILES 5\GJ ALL FILES 5\Sets\Blue Stone Set\watermark-removed-1000052269.png")
inspect_img(r"C:\Users\vigneshwaran\Downloads\GJ ALL FILES 5\GJ ALL FILES 5\Sets\Pink Pendant Set\895f0204ec8f4023ba838d9cbfba07ee.png")
inspect_img(r"C:\Users\vigneshwaran\Downloads\GJ ALL FILES 5\GJ ALL FILES 5\Sets\Pink Pendant Set\watermark-removed-1000051930.png")
inspect_img(r"C:\Users\vigneshwaran\Downloads\GJ ALL FILES 5\GJ ALL FILES 5\Sets\Pink Pendant Set\watermark-removed-1000051931.png")
