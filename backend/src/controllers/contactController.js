import { Contact } from '../models/Contact.js';
import { sendContactAck } from '../services/emailService.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// POST /api/contact — "Book a Private Consultation"
export const createContact = asyncHandler(async (req, res) => {
  const { name, email, phone, preferredDate, message = '' } = req.body;

  const enquiry = await Contact.create({ name, email, phone, preferredDate, message });

  res.status(201).json({
    success: true,
    message: 'Consultation request received. Our concierge will reach you shortly.',
    data: { enquiry: { id: enquiry._id, name: enquiry.name, email: enquiry.email } },
  });

  sendContactAck(enquiry).catch(() => {});
});

// GET /api/contact  (admin)
export const listContacts = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 25 } = req.query;
  const filter = status ? { status: status.toUpperCase() } : {};

  const perPage = Math.min(Number(limit) || 25, 100);
  const currentPage = Math.max(Number(page) || 1, 1);

  const [enquiries, total] = await Promise.all([
    Contact.find(filter).sort({ createdAt: -1 }).skip((currentPage - 1) * perPage).limit(perPage),
    Contact.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: { enquiries, pagination: { total, page: currentPage, limit: perPage } },
  });
});

// PUT /api/contact/:id  (admin)
export const updateContact = asyncHandler(async (req, res) => {
  const { status, adminNote } = req.body;

  const enquiry = await Contact.findByIdAndUpdate(
    req.params.id,
    { ...(status ? { status: status.toUpperCase() } : {}), ...(adminNote !== undefined ? { adminNote } : {}) },
    { new: true, runValidators: true }
  );
  if (!enquiry) throw ApiError.notFound('Enquiry not found');

  res.json({ success: true, message: 'Enquiry updated', data: { enquiry } });
});
