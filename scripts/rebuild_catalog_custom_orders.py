import os
import json
import re
from PIL import Image

base_dir = r"C:\Users\vigneshwaran\Downloads\GJ ALL FILES 5\GJ ALL FILES 5"
public_products_dir = r"c:\Users\vigneshwaran\OneDrive\Desktop\New folder (2)\public\products"
os.makedirs(public_products_dir, exist_ok=True)

# Updated Exact Image Mappings according to User's precise instructions:
# 1. RINGS: Unchanged (Women's & Men's)
# 2. WOMEN'S BRACELETS: Unchanged
# 3. PENDANTS: Cover image is the styled/satin floral background image (the 2nd reference uploaded by user in previous prompt), 2nd is Model wearing it, 3rd is plain studio solo, 4th is box.
# 4. EARRINGS: Cover image is the clean Plain Background studio shot, 2nd is Model wearing it, 3rd is Angle, 4th is Box. (Fixing Pink Flower Drop, Red Stone Stud, Topaz Ear Crawler).
# 5. STUDS: Exactly 4 products (Cushion Halo Studs, Emerald Cut Studs, Gold Leopard Studs, Round Diamond Studs). Cover image is plain solo shot.
# 6. MEN'S BRACELETS: Cover image is clean plain solo shot, 2nd is Model wrist, 3rd is Angle, 4th is Box.
# 7. SETS: For Gold Heart Set and Rose Flower Set, Cover image is MODEL shot!

CUSTOM_MAPPINGS = {
    # ==================== 1. SETS (4) ====================
    ("Sets", "Blue Stone Set"): [
        "1000052334-no-watermark.png", # 1. plain
        "watermark-removed-1000051808.png", # 2. model
        "watermark-removed-1000052269.png", # 3. angle
        "WhatsApp Image 2026-09-14 at 10.09.35 PM (1).jpeg" # 4. box
    ],
    ("Sets", "Gold Heart Set"): [
        "WhatsApp Image 2026-09-14 at 10.09.34 PM (2).jpeg", # 1. 4th image as cover (User requested)
        "watermark-removed-1000051950.png", # 2. model
        "watermark-removed-1000051949.png", # 3. plain set
        "watermark-removed-1000052271.png"  # 4. angle
    ],
    ("Sets", "Pink Pendant Set"): [
        "895f0204ec8f4023ba838d9cbfba07ee.png", # 1. plain set
        "watermark-removed-1000051930.png", # 2. model
        "watermark-removed-1000051931.png", # 3. angle
        "WhatsApp Image 2026-09-14 at 10.09.35 PM.jpeg" # 4. box
    ],
    ("Sets", "Rose Flower Set"): [
        "WhatsApp Image 2026-09-14 at 10.09.35 PM (2).jpeg", # 1. 4th image as cover (User requested)
        "WhatsApp Image 2026-09-14 at 10.09.34 PM.jpeg", # 2. model
        "watermark-removed-1000052270.png", # 3. plain set
        "WhatsApp Image 2026-09-14 at 10.09.34 PM (1).jpeg" # 4. angle
    ],

    # ==================== 2. EARRINGS (10) ====================
    # All earrings: Cover = Plain background studio shot, 2 = Model, 3 = Angle, 4 = Box
    ("EARRINGS", "Diamond Heart Stud"): [
        "ChatGPT Image Aug 7, 2026, 04_47_01 PM.png", # 1. plain studio
        "ChatGPT Image Aug 7, 2026, 04_49_14 PM.png", # 2. model ear
        "Gemini_Generated_Image_66afvw66afvw66af.jpeg", # 3. angle
        "Gemini_Generated_Image_66afvw66afvw66af.jpeg"  # 4. box/setting
    ],
    ("EARRINGS", "Gold Bow Drop"): [
        "ChatGPT Image Aug 5, 2026, 01_42_04 AM.png", # 1. plain studio
        "ChatGPT Image Aug 5, 2026, 01_55_13 AM.png", # 2. model ear
        "ChatGPT Image Aug 5, 2026, 02_03_20 AM.png", # 3. angle
        "ChatGPT Image Aug 5, 2026, 02_19_06 AM.png"  # 4. box
    ],
    ("EARRINGS", "Gold Heart Stud"): [
        "ChatGPT Image Aug 7, 2026, 05_11_47 PM.png", # 1. plain studio
        "wmremove-transformed (1).png",               # 2. model ear
        "ChatGPT Image Aug 7, 2026, 05_21_15 PM.png", # 3. angle
        "wmremove-transformed (2).png"                # 4. box
    ],
    ("EARRINGS", "Gold Wing Stud"): [
        "ChatGPT Image Aug 5, 2026, 02_50_55 AM.png", # 1. plain studio
        "1.png",                                      # 2. model ear
        "Gemini_Generated_Image_faymwfaymwfaymwf.jpeg",# 3. angle
        "wmremove-transformed.png"                    # 4. box
    ],
    ("EARRINGS", "Pink Bow Drop"): [
        "ChatGPT Image Aug 5, 2026, 12_11_49 AM.png", # 1. plain studio
        "ChatGPT Image Aug 5, 2026, 12_23_39 AM.png", # 2. model ear
        "ChatGPT Image Aug 5, 2026, 12_29_58 AM.png", # 3. angle
        "ChatGPT Image Aug 5, 2026, 12_38_59 AM.png"  # 4. box
    ],
    ("EARRINGS", "Pink Flower Drop"): [
        "ChatGPT Image Aug 5, 2026, 12_06_56 AM.png", # 1. PLAIN STUDIO SHOT AS COVER (Fixed)
        "ChatGPT Image Aug 4, 2026, 10_30_17 PM.png", # 2. model ear
        "ChatGPT Image Aug 4, 2026, 10_43_37 PM.png", # 3. angle
        "ChatGPT Image Aug 5, 2026, 12_03_34 AM.png"  # 4. box
    ],
    ("EARRINGS", "Red Stone Stud"): [
        "ChatGPT Image Aug 5, 2026, 01_34_48 AM.png", # 1. PLAIN STUDIO SHOT AS COVER (Fixed)
        "ChatGPT Image Aug 5, 2026, 01_09_23 AM.png", # 2. model ear
        "ChatGPT Image Aug 5, 2026, 01_17_07 AM.png", # 3. angle
        "ChatGPT Image Aug 5, 2026, 01_31_52 AM.png"  # 4. box
    ],
    ("EARRINGS", "Rose Gold Hoops"): [
        "ChatGPT Image Aug 6, 2026, 04_01_00 PM.png", # 1. plain studio
        "wmremove-transformed.png",                   # 2. model ear
        "wmremove-transformed (1).png",               # 3. angle
        "wmremove-transformed (1).png"                # 4. box
    ],
    ("EARRINGS", "Topaz Ear Crawler"): [
        "Gemini_Generated_Image_ffnwrqffnwrqffnw.png",# 1. PLAIN STUDIO SHOT AS COVER (Fixed)
        "ChatGPT Image Aug 7, 2026, 05_28_06 PM.png", # 2. model ear
        "ChatGPT Image Aug 7, 2026, 05_36_05 PM.png", # 3. angle
        "Gemini_Generated_Image_ns9hyqns9hyqns9h.png" # 4. box
    ],
    ("EARRINGS", "Topaz Pearl Drop"): [
        "ChatGPT Image Aug 6, 2026, 03_24_03 PM.png", # 1. plain studio
        "ChatGPT Image Aug 6, 2026, 03_38_38 PM.png", # 2. model ear
        "ChatGPT Image Aug 6, 2026, 03_54_34 PM.png", # 3. angle
        "wmremove-transformed.png"                    # 4. box
    ],

    # ==================== 3. STUDS (4) ====================
    ("studs", "Cushion Halo Studs"): [
        "c2cb8320-7d68-4bbd-8ed6-d5fac15410e1-clean.png", # 1. plain studio
        "e395ccf1-a70a-4b7b-a513-baba202ec7bf-clean.png", # 2. model ear
        "gemini-watermark-removed (3).png",               # 3. angle
        "gemini-watermark-removed (4).png"                # 4. box
    ],
    ("studs", "Emerald Cut Studs"): [
        "a7bb15cf-0023-47ae-ad88-19796d16f94c-clean.png", # 1. plain studio
        "gemini-watermark-removed (6).png",               # 2. model ear
        "gemini-watermark-removed (7).png",               # 3. angle
        "WhatsApp Image 2026-09-14 at 7.45.15 PM.jpeg"    # 4. box
    ],
    ("studs", "Gold Leopard Studs"): [
        "3af62380-220b-4ee8-9513-f788a8bd070c-clean.png", # 1. plain studio
        "4ebab4a2-7052-49b6-bcdf-63a3e411acb4-clean.png", # 2. model ear
        "746ee96b-7763-4e6a-91cf-c23e1eb061f5-clean.png", # 3. angle
        "gemini-watermark-removed (5).png"                # 4. box
    ],
    ("studs", "Round Diamond Studs"): [
        "84115cf1-3545-4ac0-90ac-ff23af36a860-clean.png", # 1. plain studio
        "ba9b331d-8f26-46f0-9688-5c7bcdc53ba4-clean.png", # 2. model ear
        "gemini-watermark-removed (2).png",               # 3. angle
        "gemini-watermark-removed (1).png"                # 4. box
    ],

    # ==================== 4. PENDANTS (10) ====================
    # User instruction: Cover image is the styled/satin floral background image, 2nd is Model wearing it, 3rd is plain studio solo, 4th is box.
    ("pendant", "Gold Knot Pendant"): [
        "WhatsApp Image 2026-09-12 at 10.00.17 PM.jpeg", # 1. styled satin cover
        "ChatGPT Image Sep 12, 2026, 11_18_13 PM.png",   # 2. model neck
        "WhatsApp Image 2026-09-11 at 11.32.02 PM.jpeg", # 3. plain studio
        "WhatsApp Image 2026-09-14 at 10.12.43 PM.jpeg"  # 4. box
    ],
    ("pendant", "Gold Swirl Pendant"): [
        "ChatGPT Image Sep 12, 2026, 10_33_55 PM.png",   # 1. styled satin cover
        "ChatGPT Image Sep 12, 2026, 11_02_01 PM.png",   # 2. model neck
        "WhatsApp Image 2026-09-11 at 10.38.16 PM.jpeg", # 3. plain studio
        "ChatGPT Image Sep 13, 2026, 10_41_38 AM.png"   # 4. box/angle
    ],
    ("pendant", "Gold Teardrop Pendant"): [
        "ChatGPT Image Sep 12, 2026, 10_30_19 PM.png",   # 1. styled satin cover
        "ChatGPT Image Sep 12, 2026, 11_09_15 PM.png",   # 2. model neck
        "WhatsApp Image 2026-09-11 at 11.21.09 PM.jpeg", # 3. plain studio
        "ChatGPT Image Sep 13, 2026, 11_53_46 AM.png"   # 4. box/angle
    ],
    ("pendant", "Gold Wing Pendant"): [
        "ChatGPT Image Sep 12, 2026, 10_11_42 PM.png",   # 1. styled feather on silk with flowers (Image user uploaded!)
        "ChatGPT Image Sep 12, 2026, 11_16_10 PM.png",   # 2. model neck
        "WhatsApp Image 2026-09-11 at 11.29.49 PM.jpeg", # 3. plain studio
        "WhatsApp Image 2026-09-11 at 11.29.49 PM.jpeg"  # 4. box
    ],
    ("pendant", "Green Leaf Pendant"): [
        "ChatGPT Image Sep 12, 2026, 10_29_36 PM.png",   # 1. styled satin cover
        "ChatGPT Image Sep 12, 2026, 11_12_09 PM.png",   # 2. model neck
        "WhatsApp Image 2026-09-11 at 11.22.49 PM.jpeg", # 3. plain studio
        "WhatsApp Image 2026-09-11 at 11.22.49 PM.jpeg"  # 4. box
    ],
    ("pendant", "Pink Butterfly Pendant"): [
        "WhatsApp Image 2026-09-12 at 9.56.48 PM.jpeg",  # 1. styled satin cover
        "ChatGPT Image Sep 12, 2026, 11_25_11 PM.png",   # 2. model neck
        "WhatsApp Image 2026-09-11 at 11.33.38 PM.jpeg", # 3. plain studio
        "WhatsApp Image 2026-09-14 at 4.00.48 PM.jpeg"   # 4. box
    ],
    ("pendant", "Pink Flower Pendant"): [
        "WhatsApp Image 2026-09-12 at 12.28.13 AM.jpeg", # 1. styled satin cover
        "ChatGPT Image Sep 12, 2026, 11_04_38 PM.png",   # 2. model neck
        "WhatsApp Image 2026-09-11 at 11.02.48 PM.jpeg", # 3. plain studio
        "ChatGPT Image Sep 13, 2026, 10_50_45 AM.png"   # 4. box
    ],
    ("pendant", "Pink Leaf Pendant"): [
        "WhatsApp Image 2026-09-12 at 9.55.46 PM.jpeg",  # 1. styled satin cover
        "ChatGPT Image Sep 12, 2026, 11_07_12 PM.png",   # 2. model neck
        "ChatGPT Image Sep 9, 2026, 08_24_15 AM.png",    # 3. plain studio
        "ChatGPT Image Sep 13, 2026, 11_50_16 AM.png"   # 4. box
    ],
    ("pendant", "White Flower Pendant"): [
        "WhatsApp Image 2026-09-12 at 9.58.15 PM.jpeg",  # 1. styled satin cover
        "ChatGPT Image Sep 12, 2026, 11_27_48 PM.png",   # 2. model neck
        "WhatsApp Image 2026-09-11 at 11.41.35 PM.jpeg", # 3. plain studio
        "WhatsApp Image 2026-09-14 at 3.50.55 PM.jpeg"   # 4. box
    ],
    ("pendant", "White Star Pendant"): [
        "WhatsApp Image 2026-09-14 at 3.26.23 PM.jpeg",  # 1. styled satin cover
        "WhatsApp Image 2026-09-14 at 02.32.23.jpeg",    # 2. model neck
        "WhatsApp Image 2026-09-14 at 02.31.51.jpeg",    # 3. plain studio
        "WhatsApp Image 2026-09-14 at 02.42.13.jpeg"     # 4. box
    ],

    # ==================== 5. WOMEN'S BRACELETS (4) ====================
    ("women's bracelet", "Blue Flower Bracelet"): ["r2.jpeg", "r1.jpeg", "r3.jpeg", "r4.jpeg"],
    ("women's bracelet", "Gold Rose Bracelet"): ["t1.jpeg", "t2.jpeg", "t3.jpeg", "t4.jpeg"],
    ("women's bracelet", "Opal Bead Bracelet"): ["o1.jpeg", "o2.jpeg", "o3.jpeg", "o4.jpeg"],
    ("women's bracelet", "Pink Crystal Bracelet"): ["u1.jpeg", "u2.jpeg", "u3.jpeg", "u4.jpeg"],

    # ==================== 6. MEN'S BRACELETS (4) ====================
    ("Men's braclet", "Diamond Tennis Bracelet"): [
        "watermark-removed-8adf7324-f745-4ae0-8f42-4d24b020bb00.jpg", # 1. 3rd uploaded image as Cover (User requested)
        "ChatGPT Image Aug 14, 2026, 12_49_01 AM.png",
        "gemini-watermark-removed.png",
        "WhatsApp Image 2026-09-14 at 8.15.46 PM.jpeg"
    ],
    ("Men's braclet", "Gold Clover Bracelet"): [
        "d4f84afe-c58e-4152-b747-2067c3f5c0e4-clean.png",
        "ChatGPT Image Sep 14, 2026, 01_55_01 AM.png",
        "ChatGPT Image Sep 14, 2026, 02_00_26 AM.png",
        "ChatGPT Image Sep 14, 2026, 02_14_51 AM.png"
    ],
    ("Men's braclet", "Gold Cuff Bangle"): [
        "watermark-removed-1f2c658a-3732-4135-9953-240e5d69c759.jpg", # 1. 2nd uploaded image as Cover (User requested)
        "watermark-removed-1d4cf21e-0fd1-44dc-a956-611e23fd8d75.jpg",
        "watermark-removed-6da0db17-4138-4958-9a72-9200d96eae7c.jpg",
        "watermark-removed-f6599f44-4162-4879-957e-11df46576288.jpg"
    ],
    ("Men's braclet", "Ruby Emerald Bracelet"): [
        "b1bfc991-81cf-42f7-bdb8-df240d831284-clean.png",              # 1. 2nd uploaded image as Cover (User requested)
        "1cf5f706-750c-42ad-81a8-fa6449dc96f3-clean.png",
        "WhatsApp Image 2026-09-14 at 9.58.01 PM.jpeg",
        "WhatsApp Image 2026-09-14 at 9.59.50 PM.jpeg"
    ],

    # ==================== 7. WOMEN'S RINGS (10 - UNCHANGED) ====================
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

    # ==================== 8. MEN'S RINGS (10 - UNCHANGED) ====================
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
    ]
}

CATEGORY_MAP = {
    "Jewelry Sets": {
        "category": "SETS",
        "gender": "WOMEN",
        "subCategory": "BRIDAL & OCCASION SETS",
        "metals": ["18K Yellow Gold", "18K Rose Gold", "18K White Gold"],
        "sizes": ["Standard Set (Adjustable Chain & Ring Free Size)"],
        "details_template": [
            "Complete luxury ensemble matching necklace, earrings, and ring",
            "Handcrafted in 18K solid gold finish over 925 sterling silver",
            "AAA+ high-grade certified brilliant sparkle stones",
            "Includes bespoke Gevariya Jewels velvet gift box & authenticity certificate"
        ]
    },
    "Earrings": {
        "category": "EARRINGS",
        "gender": "WOMEN",
        "subCategory": "DROP & HOOP EARRINGS",
        "metals": ["18K Rose Gold", "18K Yellow Gold", "18K White Gold"],
        "sizes": ["One Size"],
        "details_template": [
            "Secure push-back and french clasp design",
            "Hypoallergenic and nickel-free finish",
            "Precision handset accents with maximum light refraction",
            "Delivered in signature Gevariya Jewels luxury packaging"
        ]
    },
    "Studs": {
        "category": "STUDS",
        "gender": "UNISEX",
        "subCategory": "SOLITAIRE & HALO STUDS",
        "metals": ["18K White Gold", "18K Yellow Gold", "18K Rose Gold"],
        "sizes": ["Standard Stud"],
        "details_template": [
            "Classic 4-prong and halo solitaire setting",
            "Comfort screw-back posts for 24/7 wear",
            "Ethically sourced precision-cut stones",
            "Includes certificate of authenticity and velvet travel pouch"
        ]
    },
    "Pendants": {
        "category": "NECKLACES",
        "gender": "WOMEN",
        "subCategory": "PENDANTS",
        "metals": ["18K Rose Gold", "18K Yellow Gold", "18K White Gold"],
        "sizes": ["16-18 Inch Adjustable"],
        "details_template": [
            "Includes 18-inch delicate cable chain with 2-inch extender",
            "Sturdy lobster claw clasp closure",
            "Tarnish-resistant anti-oxidant protective coating",
            "Packaged in Gevariya Jewels presentation gift box"
        ]
    },
    "Women's Rings": {
        "category": "RINGS",
        "gender": "WOMEN",
        "subCategory": "ENGAGEMENT & STATEMENT RINGS",
        "metals": ["18K Rose Gold", "18K Yellow Gold", "18K White Gold"],
        "sizes": ["US 5", "US 6", "US 7", "US 8", "US 9"],
        "details_template": [
            "Comfort-fit inner band engineered for daily luxury",
            "Flawless precision gemstone handset work",
            "Certified hallmark quality guarantee",
            "Delivered with Gevariya Jewels velvet presentation box"
        ]
    },
    "Men's Rings": {
        "category": "RINGS",
        "gender": "MEN",
        "subCategory": "MEN'S SIGNET & BANDS",
        "metals": ["18K Yellow Gold", "18K White Gold", "Solid Platinum Finish"],
        "sizes": ["US 8", "US 9", "US 10", "US 11", "US 12"],
        "details_template": [
            "Heavyweight solid band with comfort-fit profile",
            "Satin and mirror-polished dual finish",
            "Scratch-resistant durable construction",
            "Includes collector's luxury box and guarantee card"
        ]
    },
    "Women's Bracelets": {
        "category": "BRACELETS",
        "gender": "WOMEN",
        "subCategory": "TENNIS & CHARM BRACELETS",
        "metals": ["18K Rose Gold", "18K Yellow Gold", "18K White Gold"],
        "sizes": ["6.5 Inch", "7.0 Inch", "7.5 Inch"],
        "details_template": [
            "Double safety box clasp closure",
            "Fluid articulated links for effortless wrist movement",
            "High-luster polished precious metal finish",
            "Packaged in Gevariya Jewels luxury bracelet box"
        ]
    },
    "Men's Bracelets": {
        "category": "BRACELETS",
        "gender": "MEN",
        "subCategory": "MEN'S STATEMENT BRACELETS",
        "metals": ["18K Yellow Gold", "18K White Gold", "Ruthenium Black Finish"],
        "sizes": ["7.5 Inch", "8.0 Inch", "8.5 Inch"],
        "details_template": [
            "Robust interlocking architectural link architecture",
            "Reinforced dual safety clasp",
            "Masculine substantial weight and hand-feel",
            "Includes Gevariya Jewels luxury presentation case"
        ]
    }
}

with open("scratch/pdf_catalog_parsed.json", "r", encoding="utf-8") as f:
    pdf_prods = json.load(f)

products_list = []
total_converted = 0

for idx, p in enumerate(pdf_prods):
    cat_header = p["category_header"]
    if not cat_header:
        if idx < 4: cat_header = "Jewelry Sets"
        elif idx < 14: cat_header = "Earrings"
        elif idx < 18: cat_header = "Studs"
        elif idx < 28: cat_header = "Pendants"
        elif idx < 38: cat_header = "Women's Rings"
        elif idx < 48: cat_header = "Men's Rings"
        elif idx < 52: cat_header = "Women's Bracelets"
        else: cat_header = "Men's Bracelets"
    
    prod_name = p["name"]
    if prod_name == "Product 2":
        prod_name = "Sleek Gemstone Ring"
    
    slug = re.sub(r'[^a-z0-9]+', '-', prod_name.lower()).strip('-')
    
    folder_cat = cat_header
    if cat_header == "Jewelry Sets": folder_cat = "Sets"
    elif cat_header == "Earrings": folder_cat = "EARRINGS"
    elif cat_header == "Studs": folder_cat = "studs"
    elif cat_header == "Pendants": folder_cat = "pendant"
    elif cat_header == "Women's Rings": folder_cat = "women's ring"
    elif cat_header == "Men's Rings": folder_cat = "Men's ring"
    elif cat_header == "Women's Bracelets": folder_cat = "women's bracelet"
    elif cat_header == "Men's Bracelets": folder_cat = "Men's braclet"
    
    folder_prod_name = p["name"]
    if folder_prod_name == "Product 2":
        folder_prod_name = "Sleek Gemstone Ring"
    
    source_files = CUSTOM_MAPPINGS.get((folder_cat, folder_prod_name))
    if not source_files:
        raise ValueError(f"Mapping not found for {(folder_cat, folder_prod_name)}")
    
    prod_dest_dir = os.path.join(public_products_dir, slug)
    os.makedirs(prod_dest_dir, exist_ok=True)
    
    webp_images = []
    for img_idx, sf in enumerate(source_files):
        src_path = os.path.join(base_dir, folder_cat, folder_prod_name, sf)
        dest_filename = f"image-{img_idx + 1}.webp"
        dest_path = os.path.join(prod_dest_dir, dest_filename)
        
        with Image.open(src_path) as im:
            rgb_im = im.convert("RGB")
            max_dim = max(rgb_im.size)
            if max_dim > 1600:
                scale = 1600 / max_dim
                new_size = (int(rgb_im.width * scale), int(rgb_im.height * scale))
                rgb_im = rgb_im.resize(new_size, Image.Resampling.LANCZOS)
            rgb_im.save(dest_path, "WEBP", quality=90)
            total_converted += 1
            
        webp_images.append(f"/products/{slug}/{dest_filename}")
    
    cat_meta = CATEGORY_MAP[cat_header]
    price = p["price"]
    orig_price = int(round((price * 1.32) / 50) * 50) - 1
    if orig_price <= price:
        orig_price = price + 600
    
    clean_desc = p["description"]
    clean_desc = re.sub(r'[\u2013\u2014\-–—]', '', clean_desc)
    clean_desc = re.sub(r'\s+', ' ', clean_desc).strip()
    
    # Extract material description nicely
    m = re.search(r'an elegant (.*)$', clean_desc, re.IGNORECASE)
    if m:
        body = m.group(1).rstrip('.').strip()
        body = body.replace("statementready", "statement-ready").replace("statement ready", "statement-ready")
        formatted_desc = f"{prod_name} – an elegant {body}. Handcrafted to perfection with signature Gevariya Jewels fine jewelry detailing."
    else:
        formatted_desc = f"{prod_name} – an elegant piece crafted in fine precious metal with brilliant stone accents, finished with a polished, statement-ready look. Handcrafted to perfection with signature Gevariya Jewels fine jewelry detailing."
    
    badge = ""
    is_best_seller = False
    is_new = False
    
    if idx % 5 == 0:
        badge = "BESTSELLER"
        is_best_seller = True
    elif idx % 4 == 0:
        badge = "NEW"
        is_new = True
    elif idx % 3 == 0:
        badge = "HOT"
    elif idx % 7 == 0:
        badge = "LUXURY"
    
    rating = round(4.7 + ((idx * 3) % 4) * 0.1, 1)
    if rating > 5.0: rating = 5.0
    reviews = 19 + ((idx * 11) % 65)
    
    product_obj = {
        "id": slug,
        "name": prod_name,
        "category": cat_meta["category"],
        "gender": cat_meta["gender"],
        "subCategory": cat_meta["subCategory"],
        "price": price,
        "originalPrice": orig_price,
        "rating": rating,
        "reviewsCount": reviews,
        "badge": badge,
        "isBestSeller": is_best_seller,
        "isNew": is_new,
        "images": webp_images,
        "image": webp_images[0],
        "hoverImage": webp_images[1],
        "description": formatted_desc,
        "metals": cat_meta["metals"],
        "sizes": cat_meta["sizes"],
        "details": cat_meta["details_template"]
    }
    
    products_list.append(product_obj)

print(f"Re-converted {total_converted} WebP images across {len(products_list)} products.")

js_content = """// GEVARIYA JEWELS - Full 56-Product Master Catalog
// Auto-generated from official product catalog & assets

export const PRODUCTS = """ + json.dumps(products_list, indent=2) + """;

export const CATEGORIES = [
  {
    id: "RINGS",
    name: "Rings",
    count: 20,
    image: "/products/pink-butterfly-ring/image-1.webp",
    description: "Engagement, solitaires & handcrafted statement bands",
    subCategories: ["WOMEN'S RINGS", "MEN'S RINGS", "SOLITAIRES", "ETERNITY BANDS"]
  },
  {
    id: "BRACELETS",
    name: "Bracelets & Bangles",
    count: 8,
    image: "/products/diamond-tennis-bracelet/image-1.webp",
    description: "Tennis bracelets, architectural cuffs & delicate charm chains",
    subCategories: ["WOMEN'S BRACELETS", "MEN'S BRACELETS", "TENNIS BRACELETS", "BANGLES"]
  },
  {
    id: "EARRINGS",
    name: "Earrings",
    count: 10,
    image: "/products/gold-bow-drop/image-1.webp",
    description: "Cascading drops, hoops & chandeliers designed to captivate",
    subCategories: ["DROP EARRINGS", "HOOPS", "STATEMENT DROPS"]
  },
  {
    id: "STUDS",
    name: "Solitaire Studs",
    count: 4,
    image: "/products/round-diamond-studs/image-1.webp",
    description: "Timeless brilliant-cut solitaires & halo designs for daily elegance",
    subCategories: ["ROUND STUDS", "CUSHION HALO", "EMERALD CUT"]
  },
  {
    id: "NECKLACES",
    name: "Pendants & Necklaces",
    count: 10,
    image: "/products/gold-wing-pendant/image-1.webp",
    description: "Iconic pendants, solitaires & celestial motifs on fine gold chains",
    subCategories: ["SOLITAIRE PENDANTS", "FLORAL PENDANTS", "STATEMENT PENDANTS"]
  },
  {
    id: "SETS",
    name: "Jewelry Sets",
    count: 4,
    image: "/products/gold-heart-set/image-1.webp",
    description: "Harmonious bridal & gala sets combining necklace, earrings & ring",
    subCategories: ["BRIDAL SETS", "OCCASION SETS", "MATCHING SUITES"]
  }
];

export const SIGNATURE_PRODUCT = PRODUCTS.find(p => p.id === "pink-butterfly-ring") || PRODUCTS[0];
"""

with open(r"c:\Users\vigneshwaran\OneDrive\Desktop\New folder (2)\src\data\products.js", "w", encoding="utf-8") as f:
    f.write(js_content)

print("Updated src/data/products.js successfully!")
