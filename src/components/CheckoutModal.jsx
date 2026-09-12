import React, { useEffect, useState } from 'react';
import { X, ShieldCheck, Loader2, CheckCircle2, Mail, ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import * as api from '../services/api';

const PAYMENT_METHODS = [
  { id: 'COD', label: 'Cash on Delivery', hint: 'Pay the courier when your parcel arrives' },
  { id: 'RAZORPAY', label: 'Pay Online', hint: 'UPI • Cards • Net Banking, secured by Razorpay' },
];

const EMPTY_FORM = {
  fullName: '',
  email: '',
  phone: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'India',
};

/** Loads the Razorpay widget once, on demand. */
const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

export const CheckoutModal = () => {
  const {
    cart,
    cartTotal,
    checkoutOpen,
    setCheckoutOpen,
    placeOrder,
    showToast,
    settings,
    couponCode,
    setCouponCode,
  } = useShop();

  const [form, setForm] = useState(EMPTY_FORM);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [notes, setNotes] = useState('');
  const [quote, setQuote] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [placedOrder, setPlacedOrder] = useState(null);
  const [onlineEnabled, setOnlineEnabled] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  useEffect(() => {
    if (!checkoutOpen) return;
    setError('');
    api
      .getPaymentConfig()
      .then((config) => setOnlineEnabled(Boolean(config.razorpayEnabled)))
      .catch(() => setOnlineEnabled(false));
  }, [checkoutOpen]);

  /** Ask the server for the real total — it, not the client, decides the amount. */
  useEffect(() => {
    if (!checkoutOpen || cart.length === 0) return;

    const items = cart.map((item) =>
      item.customReference
        ? { customRequest: item.customReference, quantity: item.quantity }
        : { productId: item.id, metal: item.metal, size: item.size, quantity: item.quantity }
    );

    let cancelled = false;
    api
      .quoteOrder(items, couponCode)
      .then((data) => !cancelled && setQuote(data))
      .catch((err) => {
        if (cancelled) return;
        setQuote(null);
        if (couponCode) setError(err.message);
      });

    return () => {
      cancelled = true;
    };
  }, [checkoutOpen, cart, couponCode]);

  if (!checkoutOpen) return null;

  const totals = quote || {
    subtotal: cartTotal,
    discount: 0,
    shipping: 0,
    total: cartTotal,
  };

  const payOnline = async (order) => {
    const loaded = await loadRazorpayScript();
    if (!loaded) throw new Error('Could not reach the payment gateway. Please try Cash on Delivery.');

    const session = await api.createRazorpayOrder(order.orderNumber);

    await new Promise((resolve, reject) => {
      const checkout = new window.Razorpay({
        key: session.keyId,
        amount: session.amount,
        currency: session.currency,
        name: settings?.store?.name || 'GEVARIYA JEWELS',
        description: `Order ${order.orderNumber}`,
        order_id: session.razorpayOrderId,
        prefill: session.customer,
        theme: { color: '#7B3F42' },
        handler: async (response) => {
          try {
            await api.verifyRazorpayPayment(response);
            resolve();
          } catch (err) {
            reject(err);
          }
        },
        modal: {
          ondismiss: () =>
            reject(new Error('Payment cancelled. Your order is saved — you can pay from the order email.')),
        },
      });
      checkout.open();
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const order = await placeOrder({
        shippingAddress: form,
        couponCode,
        paymentMethod,
        notes,
      });

      if (paymentMethod === 'RAZORPAY') await payOnline(order);

      setPlacedOrder(order);
      showToast(`Order ${order.orderNumber} placed`);
    } catch (err) {
      setError(err.message || 'Could not place the order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const close = () => {
    setCheckoutOpen(false);
    if (placedOrder) {
      setPlacedOrder(null);
      setForm(EMPTY_FORM);
      setCouponCode('');
      setNotes('');
    }
  };

  const inputCls =
    'w-full bg-[#F5F1EA] border border-[#D8CFC3] px-3.5 py-2.5 text-xs text-[#2E2B2B] placeholder-[#8A726A] outline-none focus:border-[#7B3F42] transition-colors rounded-lg';

  const money = (value) => `₹${Number(value || 0).toLocaleString('en-IN')}`;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-[1400] backdrop-blur-[2px]" onClick={close} />

      <div className="fixed inset-0 z-[1401] flex items-start sm:items-center justify-center p-3 sm:p-6 overflow-y-auto pointer-events-none">
        <div className="pointer-events-auto w-full max-w-3xl bg-white border border-[#D8CFC3] rounded-2xl shadow-2xl my-4 overflow-hidden">

          {/* Header */}
          <div className="flex items-center justify-between px-5 sm:px-7 py-4 border-b border-[#EDE5DC] bg-[#FAF7F2]">
            <div>
              <h2 className="font-serif text-lg sm:text-xl text-[#2E2B2B] uppercase tracking-wide font-light">
                {placedOrder ? 'Order Confirmed' : 'Secure Checkout'}
              </h2>
              {!placedOrder && (
                <p className="text-[10.5px] text-[#8A726A] mt-0.5">
                  {cart.length} piece{cart.length === 1 ? '' : 's'} • insured delivery
                </p>
              )}
            </div>
            <button
              onClick={close}
              className="w-8 h-8 rounded-full hover:bg-[#EDE5DC] flex items-center justify-center text-[#5C4038] transition-colors"
              aria-label="Close checkout"
            >
              <X size={18} />
            </button>
          </div>

          {placedOrder ? (
            /* ── Success ── */
            <div className="px-6 sm:px-10 py-10 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-[#7B3F42] text-white flex items-center justify-center mx-auto">
                <CheckCircle2 size={30} />
              </div>
              <h3 className="font-serif text-2xl text-[#2E2B2B] uppercase tracking-wide">Thank you</h3>

              <div className="inline-block bg-[#F5F1EA] border border-[#D8CFC3] rounded-xl px-6 py-3">
                <div className="text-[10px] uppercase tracking-[0.2em] text-[#8A726A]">Order number</div>
                <div className="font-bold text-[#7B3F42] tracking-[0.15em] text-sm mt-1">
                  {placedOrder.orderNumber}
                </div>
              </div>

              <p className="text-xs text-[#5C4038] max-w-sm mx-auto leading-relaxed flex items-center justify-center gap-1.5">
                <Mail size={13} className="text-[#7B3F42] shrink-0" />
                A confirmation with your invoice is on its way to {placedOrder.shippingAddress.email}
              </p>

              <div className="text-sm font-bold text-[#2E2B2B]">
                Total paid: <span className="text-[#7B3F42]">{money(placedOrder.total)}</span>
              </div>

              <button
                onClick={close}
                className="w-full sm:w-auto bg-[#7B3F42] hover:bg-[#623033] text-white text-xs font-bold uppercase tracking-[0.2em] px-8 py-3.5 rounded-lg transition-colors"
              >
                Continue shopping
              </button>
            </div>
          ) : (
            /* ── Form ── */
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12">

              <div className="lg:col-span-7 p-5 sm:p-7 space-y-4 border-b lg:border-b-0 lg:border-r border-[#EDE5DC]">
                <h3 className="text-[10.5px] font-bold uppercase tracking-[0.2em] text-[#7B3F42] border-b border-[#EDE5DC] pb-2">
                  1. Customer Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input required placeholder="Full Name" value={form.fullName} onChange={set('fullName')} className={inputCls} />
                  <input required type="tel" placeholder="Phone Number" value={form.phone} onChange={set('phone')} className={inputCls} />
                </div>
                <input required type="email" placeholder="Email Address" value={form.email} onChange={set('email')} className={inputCls} />

                <h3 className="text-[10.5px] font-bold uppercase tracking-[0.2em] text-[#7B3F42] border-b border-[#EDE5DC] pb-2 pt-2">
                  2. Shipping Address
                </h3>
                <input required placeholder="Street Address" value={form.line1} onChange={set('line1')} className={inputCls} />
                <input placeholder="Apartment / Suite (optional)" value={form.line2} onChange={set('line2')} className={inputCls} />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input required placeholder="City" value={form.city} onChange={set('city')} className={inputCls} />
                  <input required placeholder="State" value={form.state} onChange={set('state')} className={inputCls} />
                  <input required placeholder="PIN Code" value={form.postalCode} onChange={set('postalCode')} className={inputCls} />
                </div>

                <h3 className="text-[10.5px] font-bold uppercase tracking-[0.2em] text-[#7B3F42] border-b border-[#EDE5DC] pb-2 pt-2">
                  3. Payment Method
                </h3>
                <div className="space-y-2">
                  {PAYMENT_METHODS.map((method) => {
                    const disabled = method.id === 'RAZORPAY' && !onlineEnabled;
                    return (
                      <label
                        key={method.id}
                        className={`flex items-start gap-3 border rounded-lg px-3.5 py-3 transition-colors ${
                          disabled
                            ? 'border-[#EDE5DC] opacity-50 cursor-not-allowed'
                            : paymentMethod === method.id
                              ? 'border-[#7B3F42] bg-[#FAF7F2] cursor-pointer'
                              : 'border-[#D8CFC3] hover:border-[#7B3F42] cursor-pointer'
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.id}
                          disabled={disabled}
                          checked={paymentMethod === method.id}
                          onChange={() => setPaymentMethod(method.id)}
                          className="mt-0.5 accent-[#7B3F42]"
                        />
                        <span>
                          <span className="block text-xs font-bold text-[#2E2B2B]">{method.label}</span>
                          <span className="block text-[10.5px] text-[#8A726A] mt-0.5">
                            {disabled ? 'Not configured yet' : method.hint}
                          </span>
                        </span>
                      </label>
                    );
                  })}
                </div>

                <textarea
                  rows={2}
                  placeholder="Delivery notes (optional)"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className={`${inputCls} resize-none`}
                />
              </div>

              {/* Summary */}
              <div className="lg:col-span-5 p-5 sm:p-7 bg-[#FAF7F2] flex flex-col justify-between">
                <div className="space-y-4">
                  <h3 className="text-[10.5px] font-bold uppercase tracking-[0.2em] text-[#7B3F42] border-b border-[#EDE5DC] pb-2">
                    Order Review
                  </h3>

                  <div className="space-y-3 max-h-52 overflow-y-auto pr-1">
                    {cart.map((item, index) => (
                      <div key={`${item.id}-${index}`} className="flex gap-3">
                        <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-md border border-[#EDE5DC]" />
                        <div className="flex-1 min-w-0">
                          <div className="text-[11.5px] font-semibold text-[#2E2B2B] truncate">{item.name}</div>
                          <div className="text-[10px] text-[#8A726A]">
                            {[item.metal, item.size].filter(Boolean).join(' • ')} × {item.quantity}
                          </div>
                        </div>
                        <div className="text-[11.5px] font-bold text-[#2E2B2B]">
                          {money(item.price * item.quantity)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      placeholder="Promo code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      className={`${inputCls} bg-white`}
                    />
                  </div>

                  <div className="space-y-1.5 text-[11.5px] text-[#5C4038] border-t border-[#EDE5DC] pt-3">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-semibold text-[#2E2B2B]">{money(totals.subtotal)}</span>
                    </div>
                    {totals.discount > 0 && (
                      <div className="flex justify-between text-[#7B3F42]">
                        <span>Discount</span>
                        <span>− {money(totals.discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Insured shipping</span>
                      <span>{totals.shipping > 0 ? money(totals.shipping) : 'FREE'}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-[#EDE5DC] text-sm font-bold text-[#2E2B2B]">
                      <span className="uppercase tracking-wide">Total</span>
                      <span className="text-[#7B3F42]">{money(totals.total)}</span>
                    </div>
                  </div>

                  {error && (
                    <p className="text-[11px] text-[#B3261E] bg-[#FDECEA] border border-[#F5C6C0] rounded-lg px-3 py-2">
                      {error}
                    </p>
                  )}
                </div>

                <div className="space-y-2.5 pt-4">
                  <button
                    type="submit"
                    disabled={submitting || cart.length === 0}
                    className="w-full bg-[#7B3F42] hover:bg-[#623033] disabled:bg-[#B6ADA6] disabled:cursor-not-allowed text-white text-xs font-bold uppercase tracking-[0.2em] py-3.5 rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={15} className="animate-spin" /> Placing order…
                      </>
                    ) : (
                      <>
                        <span>{paymentMethod === 'COD' ? 'Place Order' : `Pay ${money(totals.total)}`}</span>
                        <ArrowRight size={14} />
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-1.5 text-[9.5px] text-[#8A726A] uppercase tracking-wide">
                    <ShieldCheck size={12} className="text-[#C6A46A]" />
                    <span>Encrypted & insured checkout</span>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
};
