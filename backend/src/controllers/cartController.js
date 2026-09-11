import { Product } from '../models/Product.js';
import { Settings } from '../models/Settings.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { calculateTotals } from '../utils/pricing.js';

const cartResponse = async (user) => {
  const settings = await Settings.get();
  return {
    items: user.cart,
    count: user.cart.reduce((sum, item) => sum + item.quantity, 0),
    ...calculateTotals(user.cart, null, settings.commerce),
  };
};

// GET /api/cart
export const getCart = asyncHandler(async (req, res) => {
  res.json({ success: true, data: { cart: await cartResponse(req.user) } });
});

// POST /api/cart/items
export const addToCart = asyncHandler(async (req, res) => {
  const { productId, metal = '', size = '', quantity = 1 } = req.body;

  const product = await Product.findOne({ _id: productId, isActive: true });
  if (!product) throw ApiError.notFound('Product not found');
  if (!product.isAvailable) throw ApiError.badRequest(`"${product.name}" is currently unavailable`);
  if (product.stock < quantity) throw ApiError.badRequest('Not enough stock for this piece');

  const existing = req.user.cart.find(
    (item) => item.product === productId && item.metal === metal && item.size === size
  );

  if (existing) {
    existing.quantity += Number(quantity);
  } else {
    req.user.cart.push({
      product: product._id,
      name: product.name,
      image: product.image,
      price: product.price, // always the server price, never the client's
      metal,
      size,
      quantity: Number(quantity),
    });
  }

  await req.user.save();
  res.status(201).json({ success: true, message: 'Added to bag', data: { cart: await cartResponse(req.user) } });
});

// PUT /api/cart/items/:itemId
export const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const item = req.user.cart.id(req.params.itemId);
  if (!item) throw ApiError.notFound('Item not in bag');

  if (Number(quantity) <= 0) item.deleteOne();
  else item.quantity = Number(quantity);

  await req.user.save();
  res.json({ success: true, data: { cart: await cartResponse(req.user) } });
});

// DELETE /api/cart/items/:itemId
export const removeCartItem = asyncHandler(async (req, res) => {
  const item = req.user.cart.id(req.params.itemId);
  if (!item) throw ApiError.notFound('Item not in bag');

  item.deleteOne();
  await req.user.save();

  res.json({ success: true, message: 'Removed from bag', data: { cart: await cartResponse(req.user) } });
});

// DELETE /api/cart
export const clearCart = asyncHandler(async (req, res) => {
  req.user.cart = [];
  await req.user.save();
  res.json({ success: true, message: 'Bag cleared', data: { cart: await cartResponse(req.user) } });
});

/**
 * POST /api/cart/merge — folds a guest's local bag into the account bag on sign in.
 * Body: { items: [{ productId, metal, size, quantity }] }
 */
export const mergeCart = asyncHandler(async (req, res) => {
  const incoming = Array.isArray(req.body.items) ? req.body.items : [];

  for (const raw of incoming) {
    const product = await Product.findOne({ _id: raw.productId, isActive: true });
    if (!product) continue;

    const metal = raw.metal || '';
    const size = raw.size || '';
    const quantity = Math.max(1, Number(raw.quantity) || 1);

    const existing = req.user.cart.find(
      (item) => item.product === product._id && item.metal === metal && item.size === size
    );

    if (existing) existing.quantity += quantity;
    else {
      req.user.cart.push({
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        metal,
        size,
        quantity,
      });
    }
  }

  await req.user.save();
  res.json({ success: true, message: 'Bag synced', data: { cart: await cartResponse(req.user) } });
});
