import json

with open('scratch/folder_structure.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

counts = {}
for item in data:
    c = len(item['images'])
    counts[c] = counts.get(c, 0) + 1
    if c != 4:
        filenames = [img['filename'] for img in item['images']]
        print(f"{item['category_folder']} / {item['product_name']}: {c} images -> {filenames}")

print('\nImage count distribution:', counts)
print(f"Total products: {len(data)}")
