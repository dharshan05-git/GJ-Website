import { Product } from '../models/Product.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// GET /api/wishlist
export const getWishlist = asyncHandler(async (req, res) => {
  const products = await Product.find({ _id: { $in: req.user.wishlist }, isActive: true });
  res.json({ success: true, data: { products, ids: req.user.wishlist } });
});

// POST /api/wishlist/:productId — toggles, mirroring the frontend heart button
export const toggleWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const product = await Product.findOne({ _id: productId, isActive: true });
  if (!product) throw ApiError.notFound('Product not found');

  const index = req.user.wishlist.indexOf(productId);
  const added = index === -1;

  if (added) req.user.wishlist.push(productId);
  else req.user.wishlist.splice(index, 1);

  await req.user.save();

  res.json({
    success: true,
    message: added ? `Added "${product.name}" to wishlist` : `Removed "${product.name}" from wishlist`,
    data: { added, ids: req.user.wishlist },
  });
});

// DELETE /api/wishlist/:productId
export const removeFromWishlist = asyncHandler(async (req, res) => {
  req.user.wishlist = req.user.wishlist.filter((id) => id !== req.params.productId);
  await req.user.save();
  res.json({ success: true, data: { ids: req.user.wishlist } });
});
