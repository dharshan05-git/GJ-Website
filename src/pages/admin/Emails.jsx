import React, { useEffect, useState } from 'react';
import { Send, ExternalLink } from 'lucide-react';
import * as api from '../../services/api';
import {
  Badge, Button, Card, Cell, Empty, ErrorNote, Field, Input, Loading, Row, Stat, Table,
  formatDate, statusTone,
} from './ui';

const MODE_COPY = {
  SMTP: { tone: 'good', label: 'Live SMTP', hint: 'Emails are being delivered to real inboxes.' },
  ETHEREAL_PREVIEW: {
    tone: 'warn',
    label: 'Preview mode',
    hint: 'No SMTP configured — emails are captured in a test inbox. Set SMTP_* in backend/.env to go live.',
  },
  DISABLED: { tone: 'bad', label: 'Disabled', hint: 'Production with no SMTP configured — nothing is being sent.' },
};

export const Emails = () => {
  const [status, setStatus] = useState(null);
  const [logs, setLogs] = useState(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [testTo, setTestTo] = useState('');
  const [busy, setBusy] = useState(false);

  const load = () => {
    api.admin.emailStatus().then(setStatus).catch((e) => setError(e.message));
    api.admin.emailLogs({ limit: 50 }).then((d) => setLogs(d.logs)).catch((e) => setError(e.message));
  };

  useEffect(load, []);

  const sendTest = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const res = await api.admin.sendTestEmail(testTo);
      setNotice(res?.log?.previewUrl ? 'Sent — open the preview link in the log below.' : `Sent to ${testTo}.`);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  if (error && !status) return <ErrorNote>{error}</ErrorNote>;
  if (!status || !logs) return <Loading />;

  const mode = MODE_COPY[status.mode] || MODE_COPY.DISABLED;

  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-serif text-2xl text-[#2E2B2B] uppercase tracking-wide font-light">Email Automation</h1>
        <p className="text-[11px] text-[#8A726A] mt-0.5">
          Order invoices, status updates and acknowledgements go out on their own. This is the record.
        </p>
      </header>

      <ErrorNote>{error}</ErrorNote>
      {notice && <div className="text-[11px] text-[#35573E] bg-[#E3EDE4] border border-[#C3D7C7] rounded-lg px-3 py-2">{notice}</div>}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat label="Transport" value={<Badge tone={mode.tone}>{mode.label}</Badge>} hint={status.host || 'no host set'} />
        <Stat label="Sent today" value={status.sentToday} tone="good" />
        <Stat label="Failed today" value={status.failedToday} tone={status.failedToday > 0 ? 'bad' : 'default'} />
        <Stat label="Left today" value={status.remainingToday} hint={`daily cap ${status.dailyLimit}`} />
      </div>

      <div className={`text-[11px] rounded-lg px-3 py-2 border ${
        mode.tone === 'good' ? 'text-[#35573E] bg-[#E3EDE4] border-[#C3D7C7]' : 'text-[#8A4A08] bg-[#FBEBDD] border-[#EFC9A4]'
      }`}>
        {mode.hint}
      </div>

      <Card title="Send a test">
        <form onSubmit={sendTest} className="flex flex-col sm:flex-row gap-2.5 sm:items-end">
          <div className="flex-1">
            <Field label="Recipient">
              <Input type="email" required value={testTo} onChange={(e) => setTestTo(e.target.value)} placeholder="you@example.com" />
            </Field>
          </div>
          <Button type="submit" disabled={busy}>
            <Send size={12} className="inline mr-1.5 -mt-px" /> {busy ? 'Sending…' : 'Send test'}
          </Button>
        </form>
        <p className="text-[10px] text-[#8A726A] mt-2">
          Sender: {status.from}
        </p>
      </Card>

      <Card title="Recent emails" action={<Button size="sm" variant="secondary" onClick={load}>Refresh</Button>}>
        {logs.length === 0 ? (
          <Empty>Nothing sent yet.</Empty>
        ) : (
          <Table head={['Sent', 'Type', 'To', 'Subject', 'Status', '']}>
            {logs.map((log) => (
              <Row key={log._id}>
                <Cell className="whitespace-nowrap">{formatDate(log.createdAt, true)}</Cell>
                <Cell><Badge tone="brand">{log.type.replace(/_/g, ' ')}</Badge></Cell>
                <Cell className="text-[10.5px]">{log.to}</Cell>
                <Cell className="max-w-[240px] truncate text-[10.5px]">{log.subject}</Cell>
                <Cell>
                  <Badge tone={statusTone(log.status)}>{log.status}</Badge>
                  {log.error && <div className="text-[9.5px] text-[#B3261E] mt-0.5 max-w-[160px]">{log.error}</div>}
                </Cell>
                <Cell>
                  {log.previewUrl && (
                    <a
                      href={log.previewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#7B3F42] hover:underline whitespace-nowrap"
                    >
                      Preview <ExternalLink size={10} className="inline -mt-px" />
                    </a>
                  )}
                </Cell>
              </Row>
            ))}
          </Table>
        )}
      </Card>
    </div>
  );
};
