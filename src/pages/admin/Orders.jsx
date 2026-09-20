import React, { useEffect, useState } from 'react';
import { Search, X as XIcon, Send } from 'lucide-react';
import * as api from '../../services/api';
import {
  Badge, Button, Card, Cell, Empty, ErrorNote, Field, Input, Loading, Row, Select, Table,
  formatDate, money, statusTone,
} from './ui';

const STATUSES = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

export const Orders = () => {
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [open, setOpen] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    try {
      const data = await api.admin.orders({ search, status, limit: 50 });
      setOrders(data.orders);
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => {
    const t = setTimeout(load, search ? 350 : 0);
    return () => clearTimeout(t);
  }, [search, status]);

  const changeStatus = async (order, next, notifyCustomer) => {
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const { order: updated } = await api.admin.setOrderStatus(order._id, {
        status: next,
        notifyCustomer,
      });
      setOrders((list) => list.map((o) => (o._id === updated._id ? { ...o, ...updated } : o)));
      setOpen((o) => (o && o._id === updated._id ? { ...o, ...updated } : o));
      setNotice(
        notifyCustomer
          ? `Marked ${next.toLowerCase()} — the customer has been emailed.`
          : `Marked ${next.toLowerCase()} without emailing.`
      );
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  const resend = async (order) => {
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const res = await api.admin.resendOrderEmail(order.orderNumber);
      setNotice(res?.log?.status === 'SENT' ? `Invoice resent to ${order.shippingAddress.email}.` : 'Could not resend — check Email Automation.');
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  if (error && !orders) return <ErrorNote>{error}</ErrorNote>;
  if (!orders) return <Loading />;

  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-serif text-2xl text-[#2E2B2B] uppercase tracking-wide font-light">Orders</h1>
        <p className="text-[11px] text-[#8A726A] mt-0.5">{orders.length} shown</p>
      </header>

      <ErrorNote>{error}</ErrorNote>
      {notice && (
        <div className="text-[11px] text-[#35573E] bg-[#E3EDE4] border border-[#C3D7C7] rounded-lg px-3 py-2">{notice}</div>
      )}

      <Card>
        <div className="flex flex-col sm:flex-row gap-2.5 mb-4">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A726A]" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Order number, name, email or phone" className="pl-9" />
          </div>
          <Select value={status} onChange={(e) => setStatus(e.target.value)} className="sm:w-48">
            <option value="">Every status</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </Select>
        </div>

        {orders.length === 0 ? (
          <Empty>No orders match.</Empty>
        ) : (
          <Table head={['Order', 'Customer', 'Placed', 'Payment', 'Status', 'Total', '']}>
            {orders.map((order) => (
              <Row key={order._id}>
                <Cell className="font-semibold tracking-wide whitespace-nowrap">{order.orderNumber}</Cell>
                <Cell>
                  <div className="font-medium text-[#2E2B2B]">{order.shippingAddress.fullName}</div>
                  <div className="text-[10px] text-[#8A726A]">{order.shippingAddress.city}</div>
                </Cell>
                <Cell className="whitespace-nowrap">{formatDate(order.createdAt)}</Cell>
                <Cell>
                  <div className="text-[10.5px]">{order.paymentMethod}</div>
                  <Badge tone={statusTone(order.paymentStatus)}>{order.paymentStatus}</Badge>
                </Cell>
                <Cell><Badge tone={statusTone(order.status)}>{order.status}</Badge></Cell>
                <Cell className="font-semibold whitespace-nowrap">{money(order.total)}</Cell>
                <Cell>
                  <Button size="sm" variant="secondary" onClick={() => { setOpen(order); setNotice(''); }}>
                    Open
                  </Button>
                </Cell>
              </Row>
            ))}
          </Table>
        )}
      </Card>

      {/* Order detail */}
      {open && (
        <>
          <div className="fixed inset-0 bg-black/40 z-[1400]" onClick={() => setOpen(null)} />
          <div className="fixed inset-0 z-[1401] flex items-start sm:items-center justify-center p-3 overflow-y-auto pointer-events-none">
            <div className="pointer-events-auto w-full max-w-2xl bg-white border border-[#E3D9CE] rounded-2xl shadow-2xl my-4 overflow-hidden">
              <header className="flex items-center justify-between px-5 py-3.5 border-b border-[#EFE7DE] bg-[#FAF6F0]">
                <div>
                  <h2 className="font-semibold text-[#2E2B2B] tracking-wide text-sm">{open.orderNumber}</h2>
                  <p className="text-[10px] text-[#8A726A]">{formatDate(open.createdAt, true)}</p>
                </div>
                <button onClick={() => setOpen(null)} aria-label="Close" className="w-8 h-8 rounded-full hover:bg-[#EFE7DE] flex items-center justify-center">
                  <XIcon size={15} />
                </button>
              </header>

              <div className="p-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="text-[9.5px] font-bold uppercase tracking-[0.16em] text-[#7B3F42] mb-1.5">Deliver to</div>
                    <div className="text-[11.5px] leading-relaxed text-[#3D3533]">
                      <strong className="text-[#2E2B2B]">{open.shippingAddress.fullName}</strong><br />
                      {open.shippingAddress.line1}{open.shippingAddress.line2 ? `, ${open.shippingAddress.line2}` : ''}<br />
                      {open.shippingAddress.city}, {open.shippingAddress.state} {open.shippingAddress.postalCode}<br />
                      {open.shippingAddress.phone}<br />
                      {open.shippingAddress.email}
                    </div>
                  </div>
                  <div>
                    <div className="text-[9.5px] font-bold uppercase tracking-[0.16em] text-[#7B3F42] mb-1.5">Payment</div>
                    <div className="text-[11.5px] leading-relaxed text-[#3D3533]">
                      {open.paymentMethod === 'COD' ? 'Cash on delivery' : 'Paid online'} ·{' '}
                      <Badge tone={statusTone(open.paymentStatus)}>{open.paymentStatus}</Badge>
                      {open.couponCode && <><br />Promo: <strong>{open.couponCode}</strong></>}
                      {open.notes && <><br /><span className="text-[#8A726A]">Note: {open.notes}</span></>}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-[9.5px] font-bold uppercase tracking-[0.16em] text-[#7B3F42] mb-1.5">Items</div>
                  <div className="border border-[#EFE7DE] rounded-lg divide-y divide-[#EFE7DE]">
                    {open.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-3 px-3 py-2.5">
                        {item.image && <img src={item.image} alt="" width="36" height="36" className="w-9 h-9 rounded object-cover border border-[#EFE7DE]" />}
                        <div className="flex-1 min-w-0">
                          <div className="text-[11.5px] font-medium text-[#2E2B2B] truncate">{item.name}</div>
                          <div className="text-[10px] text-[#8A726A]">{[item.metal, item.size].filter(Boolean).join(' · ')} × {item.quantity}</div>
                        </div>
                        <div className="text-[11.5px] font-semibold whitespace-nowrap">{money(item.price * item.quantity)}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#FAF6F0] border border-[#EFE7DE] rounded-lg px-4 py-3 text-[11.5px] space-y-1">
                  <div className="flex justify-between"><span>Subtotal</span><span>{money(open.subtotal)}</span></div>
                  {open.discount > 0 && <div className="flex justify-between text-[#7B3F42]"><span>Discount</span><span>− {money(open.discount)}</span></div>}
                  <div className="flex justify-between"><span>Shipping</span><span>{open.shipping > 0 ? money(open.shipping) : 'FREE'}</span></div>
                  <div className="flex justify-between pt-1.5 border-t border-[#E3D9CE] font-bold text-sm text-[#2E2B2B]">
                    <span>Total</span><span className="text-[#7B3F42]">{money(open.total)}</span>
                  </div>
                </div>

                <div>
                  <div className="text-[9.5px] font-bold uppercase tracking-[0.16em] text-[#7B3F42] mb-2">Move to</div>
                  <div className="flex flex-wrap gap-1.5">
                    {STATUSES.map((s) => (
                      <Button
                        key={s}
                        size="sm"
                        variant={open.status === s ? 'primary' : 'secondary'}
                        disabled={busy || open.status === s}
                        onClick={() => changeStatus(open, s, true)}
                      >
                        {s}
                      </Button>
                    ))}
                  </div>
                  <p className="text-[10px] text-[#8A726A] mt-2">
                    Changing status emails the customer automatically.
                  </p>
                </div>

                {open.statusHistory?.length > 0 && (
                  <div>
                    <div className="text-[9.5px] font-bold uppercase tracking-[0.16em] text-[#7B3F42] mb-1.5">History</div>
                    <ul className="text-[10.5px] text-[#5C4038] space-y-1">
                      {open.statusHistory.map((entry, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="text-[#8A726A] whitespace-nowrap">{formatDate(entry.at, true)}</span>
                          <span className="font-semibold">{entry.status}</span>
                          {entry.note && <span className="text-[#8A726A]">— {entry.note}</span>}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <footer className="flex gap-2 px-5 py-3.5 border-t border-[#EFE7DE] bg-[#FAF6F0]">
                <Button variant="secondary" disabled={busy} onClick={() => resend(open)}>
                  <Send size={12} className="inline mr-1.5 -mt-px" /> Resend invoice
                </Button>
                <Button variant="secondary" onClick={() => setOpen(null)} className="ml-auto">Close</Button>
              </footer>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
