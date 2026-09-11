/**
 * Gevariya Jewels — API client.
 *
 * Every call goes through `request()`, which:
 *   • prefixes VITE_API_URL (default http://localhost:5000/api)
 *   • attaches the saved auth token
 *   • unwraps the { success, data } envelope the backend returns
 *   • throws an Error carrying the backend's own message
 *
 * The storefront degrades gracefully: if the backend is not running, callers
 * such as `getProducts()` fall back to the static catalog in src/data/products.js
 * so the site still renders.
 */
import { PRODUCTS, CATEGORIES } from '../data/products';

const BASE_URL = (import.meta.env?.VITE_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');
const TOKEN_KEY = 'gj_token';

/* ── Token helpers ───────────────────────────────────────────── */
export const getToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

export const setToken = (token) => {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* private browsing — stay signed out */
  }
};

/** Thrown for every non-2xx response. `maintenance` is true for a 503 gate. */
export class ApiError extends Error {
  constructor(message, { status, errors, maintenance, data } = {}) {
    super(message);
    this.status = status;
    this.errors = errors;
    this.maintenance = Boolean(maintenance);
    this.data = data;
  }
}

const request = async (path, { method = 'GET', body, auth = true, isForm = false } = {}) => {
  const headers = {};
  if (!isForm) headers['Content-Type'] = 'application/json';

  const token = auth ? getToken() : null;
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? (isForm ? body : JSON.stringify(body)) : undefined,
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ApiError(payload.message || `Request failed (${response.status})`, {
      status: response.status,
      errors: payload.errors,
      maintenance: payload.maintenance,
      data: payload.data,
    });
  }

  return payload.data ?? payload;
};

/* ── Storefront settings (maintenance mode + announcement) ───── */
export const getPublicSettings = () => request('/settings/public', { auth: false });

/* ── Catalog ─────────────────────────────────────────────────── */
const toQuery = (params = {}) => {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') search.set(key, value);
  });
  const query = search.toString();
  return query ? `?${query}` : '';
};

/**
 * Live catalog, with the bundled catalog as a safety net so the storefront
 * never renders empty when the API is down.
 */
export const getProducts = async (params = {}) => {
  try {
    const data = await request(`/products${toQuery({ limit: 100, ...params })}`, { auth: false });
    return { products: data.products, source: 'api', pagination: data.pagination };
  } catch (error) {
    if (error.maintenance) throw error;
    console.warn('[api] products fell back to the bundled catalog:', error.message);
    return { products: PRODUCTS, source: 'static' };
  }
};

export const getProduct = async (id) => {
  try {
    return await request(`/products/${id}`, { auth: false });
  } catch (error) {
    if (error.maintenance) throw error;
    const product = PRODUCTS.find((p) => p.id === id);
    if (!product) throw error;
    return { product, related: PRODUCTS.filter((p) => p.id !== id).slice(0, 4) };
  }
};

export const getCategories = async () => {
  try {
    const data = await request('/products/categories', { auth: false });
    return data.categories;
  } catch {
    return CATEGORIES;
  }
};

/* ── Auth ────────────────────────────────────────────────────── */
export const register = async (payload) => {
  const data = await request('/auth/register', { method: 'POST', body: payload, auth: false });
  setToken(data.token);
  return data.user;
};

export const login = async (payload) => {
  const data = await request('/auth/login', { method: 'POST', body: payload, auth: false });
  setToken(data.token);
  return data.user;
};

export const logout = () => setToken(null);

export const me = async () => {
  if (!getToken()) return null;
  try {
    const data = await request('/auth/me');
    return data.user;
  } catch {
    setToken(null);
    return null;
  }
};

/* ── Checkout ────────────────────────────────────────────────── */
export const validateCoupon = (code, subtotal) =>
  request('/coupons/validate', { method: 'POST', body: { code, subtotal }, auth: false });

/** Server-priced preview of the bag — the numbers checkout will actually use. */
export const quoteOrder = (items, couponCode) =>
  request('/orders/quote', { method: 'POST', body: { items, couponCode } });

export const createOrder = (payload) => request('/orders', { method: 'POST', body: payload });

export const getOrder = (orderNumber, email) =>
  request(`/orders/${orderNumber}${email ? `?email=${encodeURIComponent(email)}` : ''}`);

export const getMyOrders = async () => {
  const data = await request('/orders/my');
  return data.orders;
};

/* ── Payments ────────────────────────────────────────────────── */
export const getPaymentConfig = () => request('/payments/config', { auth: false });

export const createRazorpayOrder = (orderNumber) =>
  request('/payments/razorpay/order', { method: 'POST', body: { orderNumber } });

export const verifyRazorpayPayment = (response) =>
  request('/payments/razorpay/verify', { method: 'POST', body: response });

/* ── Forms ───────────────────────────────────────────────────── */
export const bookConsultation = (payload) =>
  request('/contact', { method: 'POST', body: payload, auth: false });

export const subscribeNewsletter = (email, source = 'footer') =>
  request('/newsletter/subscribe', { method: 'POST', body: { email, source }, auth: false });

/** The Customise page sends multipart data so the reference photo rides along. */
export const createCustomRequest = (fields, imageFile) => {
  const form = new FormData();
  Object.entries(fields).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') form.append(key, value);
  });
  if (imageFile) form.append('image', imageFile);

  return request('/custom-requests', { method: 'POST', body: form, isForm: true });
};

export const apiBaseUrl = BASE_URL;
