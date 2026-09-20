import React, { useEffect, useState } from 'react';
import { Search, X as XIcon } from 'lucide-react';
import * as api from '../../services/api';
import {
  Badge, Button, Card, Cell, Empty, ErrorNote, Input, Loading, Row, Select, Table,
  formatDate, money, statusTone,
} from './ui';

/** The customer directory — every buyer, guests included, keyed by email. */
export const Customers = () => {
  const [customers, setCustomers] = useState(null);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('recent');
  const [detail, setDetail] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => {
      api.admin
        .customers({ search, sort, limit: 50 })
        .then((d) => setCustomers(d.customers))
        .catch((e) => setError(e.message));
    }, search ? 350 : 0);
    return () => clearTimeout(t);
  }, [search, sort]);

  const openDetail = async (email) => {
    setDetail({ loading: true });
    try {
      setDetail(await api.admin.customer(email));
    } catch (e) {
      setError(e.message);
      setDetail(null);
    }
  };

  if (error && !customers) return <ErrorNote>{error}</ErrorNote>;
  if (!customers) return <Loading />;

  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-serif text-2xl text-[#2E2B2B] uppercase tracking-wide font-light">Customers</h1>
        <p className="text-[11px] text-[#8A726A] mt-0.5">
          Everyone who has ordered, including guests who never made an account.
        </p>
      </header>

      <ErrorNote>{error}</ErrorNote>

      <Card>
        <div className="flex flex-col sm:flex-row gap-2.5 mb-4">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A726A]" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Name, email or phone" className="pl-9" />
          </div>
          <Select value={sort} onChange={(e) => setSort(e.target.value)} className="sm:w-48">
            <option value="recent">Most recent order</option>
            <option value="spend">Highest spend</option>
            <option value="orders">Most orders</option>
            <option value="name">Name A–Z</option>
          </Select>
        </div>

        {customers.length === 0 ? (
          <Empty>No customers yet.</Empty>
        ) : (
          <Table head={['Customer', 'Contact', 'Orders', 'Lifetime value', 'Last order', '']}>
            {customers.map((c) => (
              <Row key={c.email}>
                <Cell>
                  <div className="font-semibold text-[#2E2B2B]">{c.name || '—'}</div>
                  <div className="text-[10px] text-[#8A726A]">{c.addresses?.[0]?.city || ''}</div>
                </Cell>
                <Cell>
                  <div className="text-[10.5px]">{c.email}</div>
                  <div className="text-[10px] text-[#8A726A]">{c.phone}</div>
                </Cell>
                <Cell className="font-semibold">{c.ordersCount}</Cell>
                <Cell className="font-semibold whitespace-nowrap">{money(c.totalSpent)}</Cell>
                <Cell className="whitespace-nowrap">{formatDate(c.lastOrderAt)}</Cell>
                <Cell>
                  <Button size="sm" variant="secondary" onClick={() => openDetail(c.email)}>Open</Button>
                </Cell>
              </Row>
            ))}
          </Table>
        )}
      </Card>

      {detail && (
        <>
          <div className="fixed inset-0 bg-black/40 z-[1400]" onClick={() => setDetail(null)} />
          <div className="fixed inset-0 z-[1401] flex items-start sm:items-center justify-center p-3 overflow-y-auto pointer-events-none">
            <div className="pointer-events-auto w-full max-w-xl bg-white border border-[#E3D9CE] rounded-2xl shadow-2xl my-4 overflow-hidden">
              {detail.loading ? (
                <Loading />
              ) : (
                <>
                  <header className="flex items-center justify-between px-5 py-3.5 border-b border-[#EFE7DE] bg-[#FAF6F0]">
                    <div>
                      <h2 className="font-semibold text-[#2E2B2B] text-sm">{detail.customer.name}</h2>
                      <p className="text-[10px] text-[#8A726A]">{detail.customer.email} · {detail.customer.phone}</p>
                    </div>
                    <button onClick={() => setDetail(null)} aria-label="Close" className="w-8 h-8 rounded-full hover:bg-[#EFE7DE] flex items-center justify-center">
                      <XIcon size={15} />
                    </button>
                  </header>

                  <div className="p-5 space-y-4">
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="bg-[#FAF6F0] border border-[#EFE7DE] rounded-lg py-2.5">
                        <div className="font-serif text-lg text-[#2E2B2B]">{detail.customer.ordersCount}</div>
                        <div className="text-[9px] uppercase tracking-[0.14em] text-[#8A726A]">Orders</div>
                      </div>
                      <div className="bg-[#FAF6F0] border border-[#EFE7DE] rounded-lg py-2.5">
                        <div className="font-serif text-lg text-[#7B3F42]">{money(detail.customer.totalSpent)}</div>
                        <div className="text-[9px] uppercase tracking-[0.14em] text-[#8A726A]">Lifetime</div>
                      </div>
                      <div className="bg-[#FAF6F0] border border-[#EFE7DE] rounded-lg py-2.5">
                        <div className="font-serif text-lg text-[#2E2B2B]">{money(detail.customer.averageOrderValue)}</div>
                        <div className="text-[9px] uppercase tracking-[0.14em] text-[#8A726A]">Average</div>
                      </div>
                    </div>

                    {detail.customer.addresses?.length > 0 && (
                      <div>
                        <div className="text-[9.5px] font-bold uppercase tracking-[0.16em] text-[#7B3F42] mb-1.5">Addresses</div>
                        {detail.customer.addresses.map((a, i) => (
                          <div key={i} className="text-[11px] text-[#3D3533] border border-[#EFE7DE] rounded-lg px-3 py-2 mb-1.5">
                            {a.line1}{a.line2 ? `, ${a.line2}` : ''}, {a.city}, {a.state} {a.postalCode}
                          </div>
                        ))}
                      </div>
                    )}

                    <div>
                      <div className="text-[9.5px] font-bold uppercase tracking-[0.16em] text-[#7B3F42] mb-1.5">Order history</div>
                      {detail.orders?.length ? (
                        <div className="border border-[#EFE7DE] rounded-lg divide-y divide-[#EFE7DE]">
                          {detail.orders.map((o) => (
                            <div key={o._id} className="flex items-center gap-3 px-3 py-2 text-[11px]">
                              <span className="font-semibold tracking-wide">{o.orderNumber}</span>
                              <Badge tone={statusTone(o.status)}>{o.status}</Badge>
                              <span className="text-[#8A726A] ml-auto whitespace-nowrap">{formatDate(o.createdAt)}</span>
                              <span className="font-semibold whitespace-nowrap">{money(o.total)}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[11px] text-[#8A726A]">No orders.</p>
                      )}
                    </div>

                    {detail.customRequests?.length > 0 && (
                      <div>
                        <div className="text-[9.5px] font-bold uppercase tracking-[0.16em] text-[#7B3F42] mb-1.5">Custom requests</div>
                        <div className="border border-[#EFE7DE] rounded-lg divide-y divide-[#EFE7DE]">
                          {detail.customRequests.map((r) => (
                            <div key={r._id} className="flex items-center gap-3 px-3 py-2 text-[11px]">
                              <span className="font-semibold">{r.productName}</span>
                              <Badge tone={statusTone(r.status)}>{r.status}</Badge>
                              <span className="text-[#8A726A] ml-auto">{r.reference}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
