import { Product } from '../models/Product.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const SORTS = {
  featured: { isBestSeller: -1, rating: -1 },
  newest: { isNew: -1, createdAt: -1 },
  'price-asc': { price: 1 },
  'price-desc': { price: -1 },
  rating: { rating: -1, reviewsCount: -1 },
  name: { name: 1 },
};

// GET /api/products
export const listProducts = asyncHandler(async (req, res) => {
  const {
    category,
    subCategory,
    gender,
    search,
    minPrice,
    maxPrice,
    badge,
    bestSeller,
    isNew,
    available,
    sort = 'featured',
    page = 1,
    limit = 60,
  } = req.query;

  // Archived products are hidden; disabled ones stay visible but unbuyable, so
  // the storefront can render them as "Unavailable" instead of dropping them.
  const filter = { isActive: true };
  if (available === 'true') filter.isAvailable = true;
  if (available === 'false') filter.isAvailable = false;

  if (category && category.toUpperCase() !== 'ALL') filter.category = category.toUpperCase();
  if (subCategory) filter.subCategory = subCategory.toUpperCase();
  if (gender && gender.toUpperCase() !== 'ALL') filter.gender = gender.toUpperCase();
  if (badge) filter.badge = new RegExp(`^${escapeRegex(badge)}$`, 'i');
  if (bestSeller === 'true') filter.isBestSeller = true;
  if (isNew === 'true') filter.isNew = true;

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  if (search) {
    const rx = new RegExp(escapeRegex(search), 'i');
    filter.$or = [{ name: rx }, { description: rx }, { subCategory: rx }, { category: rx }];
  }

  const perPage = Math.min(Math.max(Number(limit) || 60, 1), 100);
  const currentPage = Math.max(Number(page) || 1, 1);

  const [items, total] = await Promise.all([
    Product.find(filter)
      // Unavailable pieces sink to the bottom of every listing.
      .sort({ isAvailable: -1, ...(SORTS[sort] || SORTS.featured) })
      .skip((currentPage - 1) * perPage)
      .limit(perPage),
    Product.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: {
      products: items,
      pagination: {
        total,
        page: currentPage,
        limit: perPage,
        pages: Math.ceil(total / perPage) || 1,
      },
    },
  });
});

// GET /api/products/categories
export const listCategories = asyncHandler(async (_req, res) => {
  const rows = await Product.aggregate([
    { $match: { isActive: true } },
    { $group: { _id: '$category', count: { $sum: 1 }, minPrice: { $min: '$price' } } },
    { $sort: { _id: 1 } },
  ]);

  res.json({
    success: true,
    data: {
      categories: rows.map((row) => ({
        name: row._id,
        count: row.count,
        startingPrice: row.minPrice,
      })),
    },
  });
});

// GET /api/products/:id
export const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id, isActive: true });
  if (!product) throw ApiError.notFound('Product not found');

  const related = await Product.find({
    _id: { $ne: product._id },
    category: product.category,
    isActive: true,
    isAvailable: true,
  })
    .sort({ isBestSeller: -1, rating: -1 })
    .limit(4);

  res.json({ success: true, data: { product, related } });
});

// POST /api/products  (admin)
export const createProduct = asyncHandler(async (req, res) => {
  const id = (req.body.id || req.body._id || slugify(req.body.name || '')).trim();
  if (!id) throw ApiError.badRequest('A product id or name is required');

  if (await Product.findById(id)) throw ApiError.conflict('A product with this id already exists');

  const product = await Product.create({ ...req.body, _id: id });
  res.status(201).json({ success: true, message: 'Product created', data: { product } });
});

// PUT /api/products/:id  (admin)
export const updateProduct = asyncHandler(async (req, res) => {
  const payload = { ...req.body };
  delete payload._id;
  delete payload.id;

  const product = await Product.findByIdAndUpdate(req.params.id, payload, {
    new: true,
    runValidators: true,
  });
  if (!product) throw ApiError.notFound('Product not found');

  res.json({ success: true, message: 'Product updated', data: { product } });
});

/**
 * PATCH /api/products/:id/availability  (admin)
 * The enable/disable switch. Body: { isAvailable, note?, stock? }
 * Turning a product off makes the storefront show it as Unavailable at once and
 * blocks it from carts and orders — no code change, no redeploy.
 */
export const setAvailability = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw ApiError.notFound('Product not found');

  if (req.body.isAvailable !== undefined) product.isAvailable = Boolean(req.body.isAvailable);
  if (req.body.note !== undefined) product.availabilityNote = req.body.note;
  if (req.body.stock !== undefined) product.stock = Math.max(0, Number(req.body.stock) || 0);

  await product.save();

  res.json({
    success: true,
    message: product.isAvailable ? 'Product is live' : 'Product marked unavailable',
    data: { product },
  });
});

// GET /api/products/admin/all  (admin) — includes archived and disabled pieces
export const listAllProducts = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.includeArchived !== 'true') filter.isActive = true;
  if (req.query.available === 'true') filter.isAvailable = true;
  if (req.query.available === 'false') filter.isAvailable = false;
  if (req.query.lowStock === 'true') filter.stock = { $lte: Number(req.query.threshold) || 5 };

  const products = await Product.find(filter).sort({ updatedAt: -1 });

  res.json({ success: true, data: { products, total: products.length } });
});

// DELETE /api/products/:id  (admin) — soft delete so existing orders stay readable
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  );
  if (!product) throw ApiError.notFound('Product not found');

  res.json({ success: true, message: 'Product archived', data: { product } });
});

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
