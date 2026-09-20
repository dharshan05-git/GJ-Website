import React, { useEffect, useState } from 'react';
import { X as XIcon } from 'lucide-react';
import * as api from '../../services/api';
import { apiBaseUrl } from '../../services/api';
import {
  Badge, Button, Card, Cell, Empty, ErrorNote, Field, Input, Loading, Row, Select, Table,
  Textarea, formatDate, money, statusTone,
} from './ui';

const STATUSES = ['NEW', 'REVIEWING', 'QUOTED', 'APPROVED', 'IN_PRODUCTION', 'COMPLETED', 'REJECTED'];

/** Uploaded reference photos are served by the API, not the Vite dev server. */
const imageUrl = (path) => (path?.startsWith('/uploads') ? `${apiBaseUrl.replace(/\/api$/, '')}${path}` : path);

/**
 * Bespoke ("Customise Your Creation") requests get their own screen, kept
 * separate from Orders — these are quotes in progress, not paid orders.
 */
export const Bespoke = () => {
  const [requests, setRequests] = useState(null);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [open, setOpen] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    try {
      const data = await api.admin.customRequests(status ? { status } : {});
      setRequests(data.requests);
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => { load(); }, [status]);

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const { request } = await api.admin.updateCustomRequest(open._id, {
        status: open.status,
        quotedPrice: Number(open.quotedPrice) || 0,
        adminNote: open.adminNote || '',
      });
      setRequests((list) => list.map((r) => (r._id === request._id ? request : r)));
      setOpen(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  if (error && !requests) return <ErrorNote>{error}</ErrorNote>;
  if (!requests) return <Loading />;

  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-serif text-2xl text-[#2E2B2B] uppercase tracking-wide font-light">Custom Orders</h1>
        <p className="text-[11px] text-[#8A726A] mt-0.5">
          Bespoke briefs from the Customise page. Quote a price here and the customer can pay for it.
        </p>
      </header>

      <ErrorNote>{error}</ErrorNote>

      <Card>
        <Select value={status} onChange={(e) => setStatus(e.target.value)} className="sm:w-56 mb-4">
          <option value="">Every status</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
        </Select>

        {requests.length === 0 ? (
          <Empty>No custom requests yet.</Empty>
        ) : (
          <Table head={['Reference', 'Piece', 'Specs', 'Customer', 'Received', 'Status', 'Quote', '']}>
            {requests.map((r) => (
              <Row key={r._id}>
                <Cell className="font-semibold tracking-wide whitespace-nowrap">{r.reference}</Cell>
                <Cell>
                  <div className="flex items-center gap-2.5">
                    {r.referenceImage && (
                      <img src={imageUrl(r.referenceImage)} alt="" width="36" height="36" className="w-9 h-9 rounded object-cover border border-[#EFE7DE] shrink-0" />
                    )}
                    <span className="font-medium text-[#2E2B2B]">{r.productName}</span>
                  </div>
                </Cell>
                <Cell className="text-[10.5px] text-[#5C4038]">
                  {r.productType} · {r.plating}
                  {(r.ringSize || r.bangleSize) && <><br />{r.ringSize || r.bangleSize}</>}
                </Cell>
                <Cell className="text-[10.5px]">{r.contactEmail || '—'}</Cell>
                <Cell className="whitespace-nowrap">{formatDate(r.createdAt)}</Cell>
                <Cell><Badge tone={statusTone(r.status)}>{r.status.replace('_', ' ')}</Badge></Cell>
                <Cell className="font-semibold whitespace-nowrap">{r.quotedPrice ? money(r.quotedPrice) : '—'}</Cell>
                <Cell><Button size="sm" variant="secondary" onClick={() => setOpen({ ...r })}>Open</Button></Cell>
              </Row>
            ))}
          </Table>
        )}
      </Card>

      {open && (
        <>
          <div className="fixed inset-0 bg-black/40 z-[1400]" onClick={() => setOpen(null)} />
          <div className="fixed inset-0 z-[1401] flex items-start sm:items-center justify-center p-3 overflow-y-auto pointer-events-none">
            <form onSubmit={save} className="pointer-events-auto w-full max-w-lg bg-white border border-[#E3D9CE] rounded-2xl shadow-2xl my-4 overflow-hidden">
              <header className="flex items-center justify-between px-5 py-3.5 border-b border-[#EFE7DE] bg-[#FAF6F0]">
                <div>
                  <h2 className="font-semibold text-[#2E2B2B] text-sm">{open.productName}</h2>
                  <p className="text-[10px] text-[#8A726A]">{open.reference}</p>
                </div>
                <button type="button" onClick={() => setOpen(null)} aria-label="Close" className="w-8 h-8 rounded-full hover:bg-[#EFE7DE] flex items-center justify-center">
                  <XIcon size={15} />
                </button>
              </header>

              <div className="p-5 space-y-4">
                {open.referenceImage && (
                  <img
                    src={imageUrl(open.referenceImage)}
                    alt="Customer reference"
                    className="w-full max-h-56 object-contain bg-[#FAF6F0] border border-[#EFE7DE] rounded-lg"
                  />
                )}

                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[11.5px]">
                  <div><span className="text-[#8A726A]">Type</span><br /><strong>{open.productType}</strong></div>
                  <div><span className="text-[#8A726A]">Metal</span><br /><strong>{open.metal} · {open.plating}</strong></div>
                  {open.ringSize && <div><span className="text-[#8A726A]">Ring size</span><br /><strong>{open.ringSize}</strong></div>}
                  {open.bangleSize && <div><span className="text-[#8A726A]">Bangle size</span><br /><strong>{open.bangleSize}</strong></div>}
                  <div><span className="text-[#8A726A]">Contact</span><br /><strong>{open.contactEmail || '—'}</strong></div>
                  <div><span className="text-[#8A726A]">Received</span><br /><strong>{formatDate(open.createdAt, true)}</strong></div>
                </div>

                {open.notes && (
                  <div className="bg-[#FAF6F0] border-l-2 border-[#C6A46A] px-3 py-2 text-[11.5px] text-[#3D3533]">
                    <span className="text-[#8A726A]">Customer notes:</span><br />{open.notes}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <Field label="Status">
                    <Select value={open.status} onChange={(e) => setOpen({ ...open, status: e.target.value })}>
                      {STATUSES.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                    </Select>
                  </Field>
                  <Field label="Quoted price (₹)" hint="Charged when the customer orders it.">
                    <Input type="number" min="0" value={open.quotedPrice || ''} onChange={(e) => setOpen({ ...open, quotedPrice: e.target.value })} />
                  </Field>
                </div>

                <Field label="Internal note">
                  <Textarea rows={2} value={open.adminNote || ''} onChange={(e) => setOpen({ ...open, adminNote: e.target.value })} placeholder="Karigar assigned, material cost…" />
                </Field>
              </div>

              <footer className="flex gap-2 px-5 py-3.5 border-t border-[#EFE7DE] bg-[#FAF6F0]">
                <Button type="submit" disabled={busy} className="flex-1">{busy ? 'Saving…' : 'Save'}</Button>
                <Button type="button" variant="secondary" onClick={() => setOpen(null)}>Cancel</Button>
              </footer>
            </form>
          </div>
        </>
      )}
    </div>
  );
};
