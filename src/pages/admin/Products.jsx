import React, { useEffect, useMemo, useState } from 'react';
import { Search, Check, X as XIcon } from 'lucide-react';
import * as api from '../../services/api';
import {
  Badge, Button, Card, Cell, Empty, ErrorNote, Field, Input, Loading, Row, Select, Table, money,
} from './ui';

/**
 * Catalog management. The headline feature is the availability switch: turning
 * a piece off leaves it in the catalog but marks it unavailable and blocks it
 * from carts and orders, with no deploy.
 */
export const Products = () => {
  const [products, setProducts] = useState(null);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [editing, setEditing] = useState(null);

  const load = async () => {
    try {
      const data = await api.admin.products();
      setProducts(data.products);
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => { load(); }, []);

  const shown = useMemo(() => {
    if (!products) return [];
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      if (filter === 'OFF' && p.isAvailable) return false;
      if (filter === 'OUT' && p.stock > 0) return false;
      if (filter === 'LOW' && !(p.stock > 0 && p.stock <= 5)) return false;
      if (!q) return true;
      return p.name.toLowerCase().includes(q) || p._id.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
    });
  }, [products, search, filter]);

  const toggle = async (product) => {
    setBusyId(product._id);
    setError('');
    try {
      const { product: updated } = await api.admin.setAvailability(product._id, {
        isAvailable: !product.isAvailable,
        note: product.isAvailable ? 'TEMPORARILY UNAVAILABLE' : '',
      });
      setProducts((list) => list.map((p) => (p._id === updated._id ? updated : p)));
    } catch (e) {
      setError(e.message);
    } finally {
      setBusyId('');
    }
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    setBusyId(editing._id);
    setError('');
    try {
      await api.admin.updateProduct(editing._id, {
        price: Number(editing.price),
        originalPrice: Number(editing.originalPrice) || 0,
        stock: Math.max(0, Number(editing.stock) || 0),
        badge: editing.badge,
      });
      await api.admin.setAvailability(editing._id, { note: editing.availabilityNote });
      setEditing(null);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId('');
    }
  };

  if (error && !products) return <ErrorNote>{error}</ErrorNote>;
  if (!products) return <Loading />;

  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-serif text-2xl text-[#2E2B2B] uppercase tracking-wide font-light">Products</h1>
        <p className="text-[11px] text-[#8A726A] mt-0.5">
          {products.length} in the catalog · {products.filter((p) => !p.isAvailable).length} switched off ·{' '}
          {products.filter((p) => p.stock <= 0).length} out of stock
        </p>
      </header>

      <ErrorNote>{error}</ErrorNote>

      <Card>
        <div className="flex flex-col sm:flex-row gap-2.5 mb-4">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A726A]" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, id or category"
              className="pl-9"
            />
          </div>
          <Select value={filter} onChange={(e) => setFilter(e.target.value)} className="sm:w-52">
            <option value="ALL">All products</option>
            <option value="OFF">Switched off</option>
            <option value="OUT">Out of stock</option>
            <option value="LOW">Low stock (≤5)</option>
          </Select>
        </div>

        {shown.length === 0 ? (
          <Empty>Nothing matches that filter.</Empty>
        ) : (
          <Table head={['Piece', 'Category', 'Price', 'Stock', 'On sale', '']}>
            {shown.map((product) => (
              <Row key={product._id}>
                <Cell>
                  <div className="flex items-center gap-2.5">
                    {product.image && (
                      <img
                        src={product.image}
                        alt=""
                        width="36"
                        height="36"
                        className="w-9 h-9 rounded object-cover border border-[#EFE7DE] shrink-0"
                      />
                    )}
                    <div className="min-w-0">
                      <div className="font-semibold text-[#2E2B2B] truncate max-w-[220px]">{product.name}</div>
                      <div className="text-[10px] text-[#8A726A] truncate max-w-[220px]">{product._id}</div>
                    </div>
                  </div>
                </Cell>
                <Cell className="whitespace-nowrap">{product.category}</Cell>
                <Cell className="whitespace-nowrap font-semibold">{money(product.price)}</Cell>
                <Cell>
                  <span className={product.stock <= 0 ? 'text-[#B3261E] font-bold' : product.stock <= 5 ? 'text-[#C25E00] font-semibold' : ''}>
                    {product.stock}
                  </span>
                </Cell>
                <Cell>
                  <button
                    onClick={() => toggle(product)}
                    disabled={busyId === product._id}
                    role="switch"
                    aria-checked={product.isAvailable}
                    aria-label={`${product.isAvailable ? 'Disable' : 'Enable'} ${product.name}`}
                    className="flex items-center gap-2 disabled:opacity-50"
                  >
                    <span className={`w-9 h-5 rounded-full relative transition-colors shrink-0 ${product.isAvailable ? 'bg-[#4A6B52]' : 'bg-[#D8CFC3]'}`}>
                      <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${product.isAvailable ? 'left-[18px]' : 'left-0.5'}`} />
                    </span>
                    <Badge tone={product.isAvailable ? 'good' : 'bad'}>
                      {product.isAvailable ? 'Live' : product.availabilityNote || 'Off'}
                    </Badge>
                  </button>
                </Cell>
                <Cell>
                  <Button size="sm" variant="secondary" onClick={() => setEditing({ ...product })}>
                    Edit
                  </Button>
                </Cell>
              </Row>
            ))}
          </Table>
        )}
      </Card>

      {/* Edit panel */}
      {editing && (
        <>
          <div className="fixed inset-0 bg-black/40 z-[1400]" onClick={() => setEditing(null)} />
          <div className="fixed inset-0 z-[1401] flex items-center justify-center p-4 pointer-events-none">
            <form
              onSubmit={saveEdit}
              className="pointer-events-auto w-full max-w-md bg-white border border-[#E3D9CE] rounded-2xl shadow-2xl overflow-hidden"
            >
              <header className="flex items-center justify-between px-5 py-3.5 border-b border-[#EFE7DE] bg-[#FAF6F0]">
                <h2 className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#7B3F42]">Edit product</h2>
                <button type="button" onClick={() => setEditing(null)} aria-label="Close" className="w-8 h-8 rounded-full hover:bg-[#EFE7DE] flex items-center justify-center">
                  <XIcon size={15} />
                </button>
              </header>

              <div className="p-5 space-y-3.5">
                <div className="text-sm font-semibold text-[#2E2B2B]">{editing.name}</div>

                <div className="grid grid-cols-2 gap-3">
                  <Field label="Price (₹)">
                    <Input type="number" min="0" value={editing.price} onChange={(e) => setEditing({ ...editing, price: e.target.value })} />
                  </Field>
                  <Field label="Was (₹)">
                    <Input type="number" min="0" value={editing.originalPrice || ''} onChange={(e) => setEditing({ ...editing, originalPrice: e.target.value })} />
                  </Field>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Field label="Stock">
                    <Input type="number" min="0" value={editing.stock} onChange={(e) => setEditing({ ...editing, stock: e.target.value })} />
                  </Field>
                  <Field label="Badge">
                    <Input value={editing.badge || ''} onChange={(e) => setEditing({ ...editing, badge: e.target.value })} placeholder="HOT, NEW…" />
                  </Field>
                </div>

                <Field label="Unavailable label" hint="Shown on the card when the switch is off.">
                  <Input
                    value={editing.availabilityNote || ''}
                    onChange={(e) => setEditing({ ...editing, availabilityNote: e.target.value })}
                    placeholder="TEMPORARILY UNAVAILABLE"
                  />
                </Field>
              </div>

              <footer className="flex gap-2 px-5 py-3.5 border-t border-[#EFE7DE] bg-[#FAF6F0]">
                <Button type="submit" disabled={busyId === editing._id} className="flex-1">
                  <Check size={13} className="inline mr-1.5 -mt-px" />
                  {busyId === editing._id ? 'Saving…' : 'Save'}
                </Button>
                <Button type="button" variant="secondary" onClick={() => setEditing(null)}>
                  Cancel
                </Button>
              </footer>
            </form>
          </div>
        </>
      )}
    </div>
  );
};
