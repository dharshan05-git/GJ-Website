import React, { useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import * as api from '../../services/api';
import {
  Badge, Button, Card, Cell, Empty, ErrorNote, Loading, Row, Select, Table, formatDate, statusTone,
} from './ui';

const ENQUIRY_STATUSES = ['NEW', 'CONTACTED', 'SCHEDULED', 'CLOSED'];

/** Consultation bookings from the Contact page, plus the newsletter list. */
export const Marketing = () => {
  const [tab, setTab] = useState('enquiries');
  const [enquiries, setEnquiries] = useState(null);
  const [subscribers, setSubscribers] = useState(null);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState('');

  useEffect(() => {
    api.admin.enquiries({ limit: 50 }).then((d) => setEnquiries(d.enquiries)).catch((e) => setError(e.message));
    api.admin.subscribers().then((d) => setSubscribers(d.subscribers)).catch(() => setSubscribers([]));
  }, []);

  const setStatus = async (enquiry, status) => {
    setBusyId(enquiry._id);
    try {
      const { enquiry: updated } = await api.admin.updateEnquiry(enquiry._id, { status });
      setEnquiries((list) => list.map((e) => (e._id === updated._id ? updated : e)));
    } catch (e) {
      setError(e.message);
    } finally {
      setBusyId('');
    }
  };

  /** Exports the list as CSV for whichever email tool the store uses. */
  const exportSubscribers = () => {
    const rows = [['email', 'source', 'subscribed_on'], ...subscribers.map((s) => [s.email, s.source, new Date(s.createdAt).toISOString().slice(0, 10)])];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gevariya-subscribers.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (error && !enquiries) return <ErrorNote>{error}</ErrorNote>;
  if (!enquiries) return <Loading />;

  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-serif text-2xl text-[#2E2B2B] uppercase tracking-wide font-light">Enquiries</h1>
        <p className="text-[11px] text-[#8A726A] mt-0.5">Consultation bookings and the Gevariya Circle list.</p>
      </header>

      <ErrorNote>{error}</ErrorNote>

      <div className="flex gap-1.5">
        {[['enquiries', `Consultations (${enquiries.length})`], ['subscribers', `Newsletter (${subscribers?.length ?? 0})`]].map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`px-3.5 py-2 rounded-lg text-[11px] font-bold uppercase tracking-[0.1em] transition-colors ${
              tab === id ? 'bg-[#7B3F42] text-white' : 'bg-white border border-[#D8CFC3] text-[#3D3533] hover:bg-[#FAF6F0]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'enquiries' && (
        <Card>
          {enquiries.length === 0 ? (
            <Empty>No consultation requests yet.</Empty>
          ) : (
            <Table head={['Name', 'Contact', 'Preferred date', 'Message', 'Received', 'Status']}>
              {enquiries.map((e) => (
                <Row key={e._id}>
                  <Cell className="font-semibold text-[#2E2B2B]">{e.name}</Cell>
                  <Cell className="text-[10.5px]">{e.email}<br /><span className="text-[#8A726A]">{e.phone}</span></Cell>
                  <Cell className="whitespace-nowrap">{formatDate(e.preferredDate)}</Cell>
                  <Cell className="max-w-[240px] text-[10.5px] text-[#5C4038]">{e.message || '—'}</Cell>
                  <Cell className="whitespace-nowrap">{formatDate(e.createdAt)}</Cell>
                  <Cell>
                    <Select
                      value={e.status}
                      disabled={busyId === e._id}
                      onChange={(ev) => setStatus(e, ev.target.value)}
                      className="text-[10px] py-1"
                    >
                      {ENQUIRY_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </Select>
                  </Cell>
                </Row>
              ))}
            </Table>
          )}
        </Card>
      )}

      {tab === 'subscribers' && (
        <Card
          title={`${subscribers?.length ?? 0} subscribers`}
          action={
            subscribers?.length > 0 && (
              <Button size="sm" variant="secondary" onClick={exportSubscribers}>
                <Download size={12} className="inline mr-1.5 -mt-px" /> Export CSV
              </Button>
            )
          }
        >
          {!subscribers?.length ? (
            <Empty>Nobody has subscribed yet.</Empty>
          ) : (
            <Table head={['Email', 'Source', 'Joined']}>
              {subscribers.map((s) => (
                <Row key={s._id}>
                  <Cell>{s.email}</Cell>
                  <Cell><Badge>{s.source}</Badge></Cell>
                  <Cell className="whitespace-nowrap">{formatDate(s.createdAt)}</Cell>
                </Row>
              ))}
            </Table>
          )}
        </Card>
      )}
    </div>
  );
};
