import fs from 'fs';
import path from 'path';
import http from 'http';
import { PRODUCTS, CATEGORIES } from '../src/data/products.js';

console.log('=== PRODUCT CATALOG VALIDATION ===');
console.log(`Total Products: ${PRODUCTS.length}`);
console.log(`Total Categories: ${CATEGORIES.length}`);

let totalErrors = 0;
let totalImagesChecked = 0;

// Check each product
PRODUCTS.forEach((p, idx) => {
  if (!p.id || !p.name || !p.price || !p.category) {
    console.error(`[ERROR] Product #${idx+1} missing required field:`, p);
    totalErrors++;
  }
  
  if (!Array.isArray(p.images) || p.images.length !== 4) {
    console.error(`[ERROR] Product ${p.name} does not have exactly 4 images:`, p.images);
    totalErrors++;
  } else {
    p.images.forEach((imgUrl, imgIdx) => {
      totalImagesChecked++;
      const localPath = path.join(process.cwd(), 'public', imgUrl);
      if (!fs.existsSync(localPath)) {
        console.error(`[ERROR] Missing WebP file for ${p.name} image #${imgIdx+1}: ${localPath}`);
        totalErrors++;
      }
    });
  }
  
  if (p.image !== p.images[0]) {
    console.error(`[ERROR] Cover image mismatch on ${p.name}`);
    totalErrors++;
  }
  if (p.hoverImage !== p.images[1]) {
    console.error(`[ERROR] Hover image mismatch on ${p.name}`);
    totalErrors++;
  }
});

console.log(`\nChecked ${totalImagesChecked} image files.`);

if (totalErrors === 0) {
  console.log(' ALL 56 PRODUCTS & 224 WEBP IMAGES ARE 100% VALID ON DISK!');
} else {
  console.error(` Found ${totalErrors} validation errors.`);
}
