import os
import json
from PIL import Image

base_dir = r"C:\Users\vigneshwaran\Downloads\GJ ALL FILES 5\GJ ALL FILES 5"

# Category-specific explicit mappings to guarantee 100% precision:
# Every item mapped to [slot1_plain_bg, slot2_model, slot3_angle, slot4_box]

EXPLICIT_MAPPING = {
    # ------------------ SETS ------------------
    ("Sets", "Blue Stone Set"): [
        "1000052334-no-watermark.png",
        "watermark-removed-1000051808.png",
        "watermark-removed-1000052269.png",
        "WhatsApp Image 2026-09-14 at 10.09.35 PM (1).jpeg"
    ],
    ("Sets", "Gold Heart Set"): [
        "watermark-removed-1000051949.png",
        "watermark-removed-1000051950.png",
        "watermark-removed-1000052271.png",
        "WhatsApp Image 2026-09-14 at 10.09.34 PM (2).jpeg"
    ],
    ("Sets", "Pink Pendant Set"): [
        "895f0204ec8f4023ba838d9cbfba07ee.png",
        "watermark-removed-1000051930.png",
        "watermark-removed-1000051931.png",
        "WhatsApp Image 2026-09-14 at 10.09.35 PM.jpeg"
    ],
    ("Sets", "Rose Flower Set"): [
        "watermark-removed-1000052270.png",
        "WhatsApp Image 2026-09-14 at 10.09.34 PM.jpeg",
        "WhatsApp Image 2026-09-14 at 10.09.34 PM (1).jpeg",
        "WhatsApp Image 2026-09-14 at 10.09.35 PM (2).jpeg"
    ],

    # ------------------ WOMEN'S BRACELETS ------------------
    ("women's bracelet", "Blue Flower Bracelet"): ["r1.jpeg", "r2.jpeg", "r3.jpeg", "r4.jpeg"],
    ("women's bracelet", "Gold Rose Bracelet"): ["t1.jpeg", "t2.jpeg", "t3.jpeg", "t4.jpeg"],
    ("women's bracelet", "Opal Bead Bracelet"): ["o1.jpeg", "o2.jpeg", "o3.jpeg", "o4.jpeg"],
    ("women's bracelet", "Pink Crystal Bracelet"): ["u1.jpeg", "u2.jpeg", "u3.jpeg", "u4.jpeg"],

    # ------------------ WOMEN'S RINGS ------------------
    ("women's ring", "Heart Diamond Ring"): ["ring b1.jpeg", "ring b2.png", "ring b3.png", "ring b4.png"],
    ("women's ring", "Oval Diamond Ring"): ["ring e1.png", "ring e2.png", "ring e3.png", "ring e4.png"],
    ("women's ring", "Petite Butterfly Ring"): ["ring i1.jpeg", "WhatsApp Image 2026-09-14 at 10.11.23 PM.jpeg", "ring i2.png", "ring i4.png"],
    ("women's ring", "Pink Bow Ring"): ["ring f1.jpeg", "WhatsApp Image 2026-09-15 at 2.01.14 PM.jpeg", "ring f2.png", "ring f3.png"],
    ("women's ring", "Pink Butterfly Ring"): ["ring h1.jpeg", "WhatsApp Image 2026-09-15 at 3.32.12 PM.jpeg", "ring h2.png", "WhatsApp Image 2026-09-15 at 10.49.54 PM.jpeg"],
    ("women's ring", "Pink Floral Ring"): ["ring j1.png", "WhatsApp Image 2026-09-14 at 10.11.24 PM.jpeg", "ring j4.jpeg", "05.jpeg"],
    ("women's ring", "Pink Heart Ring"): ["ring k1.png", "WhatsApp Image 2026-09-14 at 8.50.42 PM.jpeg", "ring k2.png", "ring k4.png"],
    ("women's ring", "Pink Trillion Ring"): ["ring d1.jpeg", "WhatsApp Image 2026-09-15 at 1.06.59 PM.jpeg", "ring d2.png", "WhatsApp Image 2026-09-15 at 3.09.12 PM.jpeg"],
    ("women's ring", "Textured Gold Band"): ["ring c1.png", "ring c2.png", "ring c3.png", "ring c4.png"],
    ("women's ring", "Yellow Gemstone Ring"): ["ring a1.png", "ring a2.png", "ring a3.jpeg", "ring a4.jpeg"],

    # ------------------ MEN'S BRACELETS ------------------
    ("Men's braclet", "Diamond Tennis Bracelet"): [
        "gemini-watermark-removed.png",
        "ChatGPT Image Aug 14, 2026, 12_49_01 AM.png",
        "watermark-removed-8adf7324-f745-4ae0-8f42-4d24b020bb00.jpg",
        "WhatsApp Image 2026-09-14 at 8.15.46 PM.jpeg"
    ],
    ("Men's braclet", "Gold Clover Bracelet"): [
        "ChatGPT Image Sep 14, 2026, 01_55_01 AM.png",
        "ChatGPT Image Sep 14, 2026, 02_00_26 AM.png",
        "ChatGPT Image Sep 14, 2026, 02_14_51 AM.png",
        "d4f84afe-c58e-4152-b747-2067c3f5c0e4-clean.png"
    ],
    ("Men's braclet", "Gold Cuff Bangle"): [
        "watermark-removed-1d4cf21e-0fd1-44dc-a956-611e23fd8d75.jpg",
        "watermark-removed-1f2c658a-3732-4135-9953-240e5d69c759.jpg",
        "watermark-removed-6da0db17-4138-4958-9a72-9200d96eae7c.jpg",
        "watermark-removed-f6599f44-4162-4879-957e-11df46576288.jpg"
    ],
    ("Men's braclet", "Ruby Emerald Bracelet"): [
        "1cf5f706-750c-42ad-81a8-fa6449dc96f3-clean.png",
        "WhatsApp Image 2026-09-14 at 9.58.01 PM.jpeg",
        "WhatsApp Image 2026-09-14 at 9.59.50 PM.jpeg",
        "b1bfc991-81cf-42f7-bdb8-df240d831284-clean.png"
    ],

    # ------------------ MEN'S RINGS ------------------
    ("Men's ring", "Black Onyx Signet"): [
        "watermark-removed-1a186267-8281-4570-baa2-2b0cbe95418d.jpg",
        "ChatGPT Image Aug 12, 2026, 09_26_44 PM.png",
        "ChatGPT Image Aug 12, 2026, 09_29_58 PM.png",
        "watermark-removed-78ca0581-2f67-42a9-b075-8bf9cb435066.jpg"
    ],
    ("Men's ring", "Blue Cabochon Ring"): [
        "watermark-removed-03b29c28-64d8-468d-80b4-f09f1137f5d4.jpg",
        "ChatGPT Image Aug 12, 2026, 09_44_28 PM.png",
        "ChatGPT Image Aug 12, 2026, 09_47_52 PM.png",
        "watermark-removed-5305b354-2cda-4410-b8b5-90015959fa8f.jpg"
    ],
    ("Men's ring", "Blue Topaz Signet"): [
        "ChatGPT Image Aug 12, 2026, 04_00_57 PM.png",
        "ChatGPT Image Aug 12, 2026, 04_06_35 PM.png",
        "ChatGPT Image Aug 12, 2026, 04_10_28 PM.png",
        "ChatGPT Image Aug 12, 2026, 04_14_06 PM.png"
    ],
    ("Men's ring", "Classic Gold Band"): [
        "watermark-removed-41b90466-28d4-4c19-9b15-cae3ab9f519f.jpg",
        "ChatGPT Image Aug 12, 2026, 11_42_52 PM.png",
        "watermark-removed-ee4aab4a-eccb-4aff-853a-33a4e70c16ab.jpg",
        "WhatsApp Image 2026-09-14 at 5.26.58 PM.jpeg"
    ],
    ("Men's ring", "Gold Diamond Ring"): [
        "ChatGPT Image Aug 13, 2026, 12_52_11 AM.png",
        "ChatGPT Image Aug 13, 2026, 01_00_13 AM.png",
        "ChatGPT Image Aug 13, 2026, 01_10_40 AM.png",
        "ChatGPT Image Aug 13, 2026, 12_55_03 AM.png"
    ],
    ("Men's ring", "Gold Emerald Ring"): [
        "watermark-removed-fa2efd81-d1d1-4a15-9493-1053734fee0b.jpg",
        "WhatsApp Image 2026-09-15 at 1.25.17 PM.jpeg",
        "WhatsApp Image 2026-09-15 at 1.27.03 PM.jpeg",
        "WhatsApp Image 2026-09-15 at 1.35.33 PM.jpeg"
    ],
    ("Men's ring", "Gold Signet Ring"): [
        "watermark-removed-08ba1a94-a060-4367-99a5-5a66fb263fe9.jpg",
        "ChatGPT Image Aug 12, 2026, 10_14_01 PM.png",
        "watermark-removed-6ad5dc63-45b2-44a3-900f-b0d88ea08b72.jpg",
        "WhatsApp Image 2026-09-14 at 4.39.38 PM.jpeg"
    ],
    ("Men's ring", "Hammered Gold Band"): [
        "watermark-removed-1145975a-05ce-4dc3-b257-ee3bf5789819.jpg",
        "watermark-removed-2506fbd0-bc9c-4d97-9727-b3f314a45653.jpg",
        "watermark-removed-506461ff-2e60-4e3c-b6ee-85ff23eb2860.jpg",
        "watermark-removed-d79ce92b-35ad-4b54-b079-23ce0563c961.jpg"
    ],
    ("Men's ring", "Ornate Diamond Ring"): [
        "watermark-removed-095ae6c4-d05d-4258-8378-e30150995992 (1).jpg",
        "watermark-removed-e47273c5-dbb9-4577-bf14-67253e2e91e5.jpg",
        "watermark-removed-f30af426-6018-41e3-930f-d6ae7e827bf2.jpg",
        "WhatsApp Image 2026-09-14 at 4.44.32 PM.jpeg"
    ],
    ("Men's ring", "Sleek Gemstone Ring"): [
        "watermark-removed-Gemini_Generated_Image_8f9s608f9s608f9s.png",
        "watermark-removed-87e2c8bd-dfc6-4358-b31b-4e8bfee50cb2.jpg",
        "watermark-removed-Gemini_Generated_Image_xxn2jzxxn2jzxxn2.png",
        "WhatsApp Image 2026-09-14 at 4.39.38 PM.jpeg"
    ],

    # ------------------ PENDANTS ------------------
    ("pendant", "Gold Knot Pendant"): [
        "ChatGPT Image Sep 12, 2026, 11_18_13 PM.png",
        "WhatsApp Image 2026-09-11 at 11.32.02 PM.jpeg",
        "WhatsApp Image 2026-09-12 at 10.00.17 PM.jpeg",
        "WhatsApp Image 2026-09-14 at 10.12.43 PM.jpeg"
    ],
    ("pendant", "Gold Swirl Pendant"): [
        "ChatGPT Image Sep 12, 2026, 10_33_55 PM.png",
        "ChatGPT Image Sep 12, 2026, 11_02_01 PM.png",
        "ChatGPT Image Sep 13, 2026, 10_41_38 AM.png",
        "WhatsApp Image 2026-09-11 at 10.38.16 PM.jpeg"
    ],
    ("pendant", "Gold Teardrop Pendant"): [
        "ChatGPT Image Sep 12, 2026, 10_30_19 PM.png",
        "ChatGPT Image Sep 12, 2026, 11_09_15 PM.png",
        "ChatGPT Image Sep 13, 2026, 11_53_46 AM.png",
        "WhatsApp Image 2026-09-11 at 11.21.09 PM.jpeg"
    ],
    ("pendant", "Gold Wing Pendant"): [
        "ChatGPT Image Sep 12, 2026, 10_11_42 PM.png",
        "ChatGPT Image Sep 12, 2026, 11_16_10 PM.png",
        "WhatsApp Image 2026-09-11 at 11.29.49 PM.jpeg",
        "WhatsApp Image 2026-09-11 at 11.29.49 PM.jpeg" # 4th fallback
    ],
    ("pendant", "Green Leaf Pendant"): [
        "ChatGPT Image Sep 12, 2026, 10_29_36 PM.png",
        "ChatGPT Image Sep 12, 2026, 11_12_09 PM.png",
        "WhatsApp Image 2026-09-11 at 11.22.49 PM.jpeg",
        "WhatsApp Image 2026-09-11 at 11.22.49 PM.jpeg" # 4th fallback
    ],
    ("pendant", "Pink Butterfly Pendant"): [
        "ChatGPT Image Sep 12, 2026, 11_25_11 PM.png",
        "WhatsApp Image 2026-09-11 at 11.33.38 PM.jpeg",
        "WhatsApp Image 2026-09-12 at 9.56.48 PM.jpeg",
        "WhatsApp Image 2026-09-14 at 4.00.48 PM.jpeg"
    ],
    ("pendant", "Pink Flower Pendant"): [
        "ChatGPT Image Sep 12, 2026, 11_04_38 PM.png",
        "WhatsApp Image 2026-09-11 at 11.02.48 PM.jpeg",
        "WhatsApp Image 2026-09-12 at 12.28.13 AM.jpeg",
        "ChatGPT Image Sep 13, 2026, 10_50_45 AM.png"
    ],
    ("pendant", "Pink Leaf Pendant"): [
        "ChatGPT Image Sep 12, 2026, 11_07_12 PM.png",
        "ChatGPT Image Sep 9, 2026, 08_24_15 AM.png",
        "WhatsApp Image 2026-09-12 at 9.55.46 PM.jpeg",
        "ChatGPT Image Sep 13, 2026, 11_50_16 AM.png"
    ],
    ("pendant", "White Flower Pendant"): [
        "ChatGPT Image Sep 12, 2026, 11_27_48 PM.png",
        "WhatsApp Image 2026-09-11 at 11.41.35 PM.jpeg",
        "WhatsApp Image 2026-09-12 at 9.58.15 PM.jpeg",
        "WhatsApp Image 2026-09-14 at 3.50.55 PM.jpeg"
    ],
    ("pendant", "White Star Pendant"): [
        "WhatsApp Image 2026-09-14 at 02.31.51.jpeg",
        "WhatsApp Image 2026-09-14 at 02.32.23.jpeg",
        "WhatsApp Image 2026-09-14 at 02.42.13.jpeg",
        "WhatsApp Image 2026-09-14 at 3.26.23 PM.jpeg"
    ],

    # ------------------ STUDS ------------------
    ("studs", "Cushion Halo Studs"): [
        "c2cb8320-7d68-4bbd-8ed6-d5fac15410e1-clean.png",
        "e395ccf1-a70a-4b7b-a513-baba202ec7bf-clean.png",
        "gemini-watermark-removed (3).png",
        "gemini-watermark-removed (4).png"
    ],
    ("studs", "Emerald Cut Studs"): [
        "a7bb15cf-0023-47ae-ad88-19796d16f94c-clean.png",
        "gemini-watermark-removed (6).png",
        "gemini-watermark-removed (7).png",
        "WhatsApp Image 2026-09-14 at 7.45.15 PM.jpeg"
    ],
    ("studs", "Gold Leopard Studs"): [
        "3af62380-220b-4ee8-9513-f788a8bd070c-clean.png",
        "4ebab4a2-7052-49b6-bcdf-63a3e411acb4-clean.png",
        "746ee96b-7763-4e6a-91cf-c23e1eb061f5-clean.png",
        "gemini-watermark-removed (5).png"
    ],
    ("studs", "Round Diamond Studs"): [
        "84115cf1-3545-4ac0-90ac-ff23af36a860-clean.png",
        "ba9b331d-8f26-46f0-9688-5c7bcdc53ba4-clean.png",
        "gemini-watermark-removed (1).png",
        "gemini-watermark-removed (2).png"
    ],

    # ------------------ EARRINGS ------------------
    ("EARRINGS", "Diamond Heart Stud"): [
        "ChatGPT Image Aug 7, 2026, 04_47_01 PM.png",
        "ChatGPT Image Aug 7, 2026, 04_49_14 PM.png",
        "Gemini_Generated_Image_66afvw66afvw66af.jpeg",
        "Gemini_Generated_Image_66afvw66afvw66af.jpeg"
    ],
    ("EARRINGS", "Gold Bow Drop"): [
        "ChatGPT Image Aug 5, 2026, 01_42_04 AM.png",
        "ChatGPT Image Aug 5, 2026, 01_55_13 AM.png",
        "ChatGPT Image Aug 5, 2026, 02_03_20 AM.png",
        "ChatGPT Image Aug 5, 2026, 02_19_06 AM.png"
    ],
    ("EARRINGS", "Gold Heart Stud"): [
        "ChatGPT Image Aug 7, 2026, 05_11_47 PM.png",
        "ChatGPT Image Aug 7, 2026, 05_21_15 PM.png",
        "wmremove-transformed (1).png",
        "wmremove-transformed (2).png"
    ],
    ("EARRINGS", "Gold Wing Stud"): [
        "1.png",
        "ChatGPT Image Aug 5, 2026, 02_50_55 AM.png",
        "Gemini_Generated_Image_faymwfaymwfaymwf.jpeg",
        "wmremove-transformed.png"
    ],
    ("EARRINGS", "Pink Bow Drop"): [
        "ChatGPT Image Aug 5, 2026, 12_11_49 AM.png",
        "ChatGPT Image Aug 5, 2026, 12_23_39 AM.png",
        "ChatGPT Image Aug 5, 2026, 12_29_58 AM.png",
        "ChatGPT Image Aug 5, 2026, 12_38_59 AM.png"
    ],
    ("EARRINGS", "Pink Flower Drop"): [
        "ChatGPT Image Aug 4, 2026, 10_30_17 PM.png",
        "ChatGPT Image Aug 4, 2026, 10_43_37 PM.png",
        "ChatGPT Image Aug 5, 2026, 12_03_34 AM.png",
        "ChatGPT Image Aug 5, 2026, 12_06_56 AM.png"
    ],
    ("EARRINGS", "Red Stone Stud"): [
        "ChatGPT Image Aug 5, 2026, 01_09_23 AM.png",
        "ChatGPT Image Aug 5, 2026, 01_17_07 AM.png",
        "ChatGPT Image Aug 5, 2026, 01_31_52 AM.png",
        "ChatGPT Image Aug 5, 2026, 01_34_48 AM.png"
    ],
    ("EARRINGS", "Rose Gold Hoops"): [
        "ChatGPT Image Aug 6, 2026, 04_01_00 PM.png",
        "wmremove-transformed (1).png",
        "wmremove-transformed.png",
        "wmremove-transformed.png"
    ],
    ("EARRINGS", "Topaz Ear Crawler"): [
        "ChatGPT Image Aug 7, 2026, 05_28_06 PM.png",
        "ChatGPT Image Aug 7, 2026, 05_36_05 PM.png",
        "Gemini_Generated_Image_ffnwrqffnwrqffnw.png",
        "Gemini_Generated_Image_ns9hyqns9hyqns9h.png"
    ],
    ("EARRINGS", "Topaz Pearl Drop"): [
        "ChatGPT Image Aug 6, 2026, 03_24_03 PM.png",
        "ChatGPT Image Aug 6, 2026, 03_38_38 PM.png",
        "ChatGPT Image Aug 6, 2026, 03_54_34 PM.png",
        "wmremove-transformed.png"
    ]
}

print(f"Total mapped products: {len(EXPLICIT_MAPPING)}")
# Verify all mapped files actually exist on disk!
missing = []
for (cat, prod), files in EXPLICIT_MAPPING.items():
    p_dir = os.path.join(base_dir, cat, prod)
    if not os.path.isdir(p_dir):
        missing.append((cat, prod, "DIR_NOT_FOUND"))
        continue
    for f in files:
        fp = os.path.join(p_dir, f)
        if not os.path.isfile(fp):
            missing.append((cat, prod, f))

if missing:
    print(f"ERROR: Missing files: {missing}")
else:
    print("SUCCESS: All 56 products and their 4 files exist 100% on disk!")
