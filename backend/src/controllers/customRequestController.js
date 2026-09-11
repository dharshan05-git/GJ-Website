import { CustomRequest } from '../models/CustomRequest.js';
import { sendCustomRequestAck } from '../services/emailService.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * POST /api/custom-requests
 * Accepts multipart/form-data so the reference photo from the Customise page
 * can be uploaded in the same request (field name: `image`).
 */
export const createCustomRequest = asyncHandler(async (req, res) => {
  const {
    productName,
    productType,
    plating,
    ringSize = '',
    bangleSize = '',
    notes = '',
    contactName = '',
    contactEmail = '',
    contactPhone = '',
  } = req.body;

  const request = await CustomRequest.create({
    user: req.user?._id || null,
    productName,
    productType,
    plating,
    ringSize,
    bangleSize,
    notes,
    referenceImage: req.file ? `/uploads/${req.file.filename}` : '',
    contactName: contactName || req.user?.name || '',
    contactEmail: contactEmail || req.user?.email || '',
    contactPhone: contactPhone || req.user?.phone || '',
  });

  res.status(201).json({
    success: true,
    message: 'Custom request received. Our master karigars will review your specs.',
    data: { request },
  });

  sendCustomRequestAck(request).catch(() => {});
});

// GET /api/custom-requests/my  (protected)
export const getMyCustomRequests = asyncHandler(async (req, res) => {
  const requests = await CustomRequest.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, data: { requests } });
});

// GET /api/custom-requests/:reference
export const getCustomRequest = asyncHandler(async (req, res) => {
  const request = await CustomRequest.findOne({ reference: req.params.reference.toUpperCase() });
  if (!request) throw ApiError.notFound('Custom request not found');

  res.json({ success: true, data: { request } });
});

// GET /api/custom-requests  (admin)
export const listCustomRequests = asyncHandler(async (req, res) => {
  const filter = req.query.status ? { status: req.query.status.toUpperCase() } : {};
  const requests = await CustomRequest.find(filter).sort({ createdAt: -1 }).limit(200);

  res.json({ success: true, data: { requests, total: requests.length } });
});

// PUT /api/custom-requests/:id  (admin)
export const updateCustomRequest = asyncHandler(async (req, res) => {
  const { status, quotedPrice, adminNote } = req.body;

  const request = await CustomRequest.findByIdAndUpdate(
    req.params.id,
    {
      ...(status ? { status: status.toUpperCase() } : {}),
      ...(quotedPrice !== undefined ? { quotedPrice: Number(quotedPrice) } : {}),
      ...(adminNote !== undefined ? { adminNote } : {}),
    },
    { new: true, runValidators: true }
  );
  if (!request) throw ApiError.notFound('Custom request not found');

  res.json({ success: true, message: 'Custom request updated', data: { request } });
});
