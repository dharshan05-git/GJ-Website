import React, { useEffect, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import * as api from '../../services/api';
import { Button, Card, ErrorNote, Field, Input, Loading, Select, Textarea, Toggle } from './ui';

/**
 * Maintenance mode and the announcement bar live here — the two things the
 * store owner asked to be able to change without touching code.
 */
export const StoreSettings = () => {
  const [settings, setSettings] = useState(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState('');

  useEffect(() => {
    api.admin.settings().then((d) => setSettings(d.settings)).catch((e) => setError(e.message));
  }, []);

  const flash = (message) => {
    setNotice(message);
    setTimeout(() => setNotice(''), 4000);
  };

  const patch = (section, values) =>
    setSettings((s) => ({ ...s, [section]: { ...s[section], ...values } }));

  const toggleMaintenance = async (enabled) => {
    setBusy('maintenance');
    setError('');
    try {
      const { maintenance } = await api.admin.setMaintenance({
        enabled,
        title: settings.maintenance.title,
        message: settings.maintenance.message,
      });
      setSettings((s) => ({ ...s, maintenance }));
      flash(enabled ? 'Maintenance mode is ON — shoppers now see the construction page.' : 'Maintenance mode is OFF — the store is live.');
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy('');
    }
  };

  const saveSection = async (section, payload, message) => {
    setBusy(section);
    setError('');
    try {
      if (section === 'announcement') await api.admin.saveAnnouncement(payload);
      else await api.admin.saveSettings({ [section]: payload });
      flash(message);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy('');
    }
  };

  if (error && !settings) return <ErrorNote>{error}</ErrorNote>;
  if (!settings) return <Loading />;

  const m = settings.maintenance;
  const a = settings.announcement;

  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-serif text-2xl text-[#2E2B2B] uppercase tracking-wide font-light">Store Settings</h1>
        <p className="text-[11px] text-[#8A726A] mt-0.5">Changes apply to the live site immediately — no deploy needed.</p>
      </header>

      <ErrorNote>{error}</ErrorNote>
      {notice && <div className="text-[11px] text-[#35573E] bg-[#E3EDE4] border border-[#C3D7C7] rounded-lg px-3 py-2">{notice}</div>}

      {/* ── Maintenance mode ── */}
      <Card title="Maintenance mode">
        {m.enabled && (
          <div className="flex items-start gap-2.5 bg-[#FBEBDD] border border-[#EFC9A4] rounded-lg px-3 py-2.5 mb-4">
            <AlertTriangle size={14} className="text-[#8A4A08] shrink-0 mt-px" />
            <div className="text-[11px] text-[#8A4A08]">
              The store is closed to shoppers right now. You can still browse it yourself while signed in as staff.
            </div>
          </div>
        )}

        <Toggle
          checked={m.enabled}
          disabled={busy === 'maintenance'}
          onChange={toggleMaintenance}
          label={m.enabled ? 'Maintenance mode is ON' : 'Maintenance mode is OFF'}
          hint="When on, every visitor sees the construction page instead of the store."
        />

        <div className="space-y-3 mt-4 pt-4 border-t border-[#EFE7DE]">
          <Field label="Heading">
            <Input value={m.title} onChange={(e) => patch('maintenance', { title: e.target.value })} />
          </Field>
          <Field label="Message">
            <Textarea rows={2} value={m.message} onChange={(e) => patch('maintenance', { message: e.target.value })} />
          </Field>
          <Button
            variant="secondary"
            disabled={busy === 'maintenance'}
            onClick={() => saveSection('maintenance', { title: m.title, message: m.message }, 'Maintenance page wording saved.')}
          >
            Save wording
          </Button>
        </div>
      </Card>

      {/* ── Announcement ── */}
      <Card title="Announcement bar">
        <div className="space-y-3.5">
          <Toggle
            checked={a.enabled}
            onChange={(v) => patch('announcement', { enabled: v })}
            label="Show the announcement"
            hint="Replaces the rotating default messages at the top of every page."
          />

          <Field label="Text">
            <Input
              value={a.text}
              onChange={(e) => patch('announcement', { text: e.target.value })}
              placeholder="DIWALI PREVIEW — BRIDAL SETS AT 20% OFF"
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Link (optional)">
              <Input value={a.link || ''} onChange={(e) => patch('announcement', { link: e.target.value })} placeholder="https://…" />
            </Field>
            <Field label="Tone">
              <Select value={a.tone} onChange={(e) => patch('announcement', { tone: e.target.value })}>
                {['INFO', 'OFFER', 'LAUNCH', 'ALERT'].map((t) => <option key={t} value={t}>{t}</option>)}
              </Select>
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Starts" hint="Leave blank to start now.">
              <Input
                type="date"
                value={a.startsAt ? a.startsAt.slice(0, 10) : ''}
                onChange={(e) => patch('announcement', { startsAt: e.target.value || null })}
              />
            </Field>
            <Field label="Ends" hint="It hides itself after this date.">
              <Input
                type="date"
                value={a.endsAt ? a.endsAt.slice(0, 10) : ''}
                onChange={(e) => patch('announcement', { endsAt: e.target.value || null })}
              />
            </Field>
          </div>

          <div className="bg-[#EDE7DE] border border-[#D8CFC3] rounded-lg px-3 py-2.5 text-center">
            <div className="text-[9px] uppercase tracking-[0.16em] text-[#8A726A] mb-1">Preview</div>
            <div className="text-[11px] font-bold tracking-widest uppercase text-[#7B3F42]">
              {a.text || 'Your announcement appears here'}
            </div>
          </div>

          <Button
            disabled={busy === 'announcement'}
            onClick={() => saveSection('announcement', a, 'Announcement is live on the store.')}
          >
            {busy === 'announcement' ? 'Saving…' : 'Publish announcement'}
          </Button>
        </div>
      </Card>

      {/* ── Commerce ── */}
      <Card title="Shipping & payment">
        <div className="space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Field label="Free shipping above (₹)">
              <Input
                type="number"
                min="0"
                value={settings.commerce.freeShippingThreshold}
                onChange={(e) => patch('commerce', { freeShippingThreshold: Number(e.target.value) })}
              />
            </Field>
            <Field label="Shipping fee (₹)">
              <Input
                type="number"
                min="0"
                value={settings.commerce.shippingFee}
                onChange={(e) => patch('commerce', { shippingFee: Number(e.target.value) })}
              />
            </Field>
            <Field label="Low stock alert at">
              <Input
                type="number"
                min="0"
                value={settings.commerce.lowStockThreshold}
                onChange={(e) => patch('commerce', { lowStockThreshold: Number(e.target.value) })}
              />
            </Field>
          </div>

          <Toggle
            checked={settings.commerce.codEnabled}
            onChange={(v) => patch('commerce', { codEnabled: v })}
            label="Accept cash on delivery"
          />
          <Toggle
            checked={settings.commerce.onlinePaymentEnabled}
            onChange={(v) => patch('commerce', { onlinePaymentEnabled: v })}
            label="Accept online payment"
            hint="Needs Razorpay keys in backend/.env to actually work."
          />

          <Button disabled={busy === 'commerce'} onClick={() => saveSection('commerce', settings.commerce, 'Shipping and payment rules saved.')}>
            {busy === 'commerce' ? 'Saving…' : 'Save'}
          </Button>
        </div>
      </Card>

      {/* ── Contact details ── */}
      <Card title="Store details">
        <div className="space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Support email">
              <Input value={settings.store.supportEmail} onChange={(e) => patch('store', { supportEmail: e.target.value })} />
            </Field>
            <Field label="Support phone">
              <Input value={settings.store.supportPhone} onChange={(e) => patch('store', { supportPhone: e.target.value })} />
            </Field>
          </div>
          <Field label="Studio address">
            <Textarea rows={2} value={settings.store.address} onChange={(e) => patch('store', { address: e.target.value })} />
          </Field>
          <Button disabled={busy === 'store'} onClick={() => saveSection('store', settings.store, 'Store details saved — they appear in emails too.')}>
            {busy === 'store' ? 'Saving…' : 'Save'}
          </Button>
        </div>
      </Card>

      {/* ── Email toggles ── */}
      <Card title="Which emails go out automatically">
        <div className="space-y-3">
          {[
            ['orderConfirmationEnabled', 'Order confirmation (invoice to the customer)'],
            ['adminNotificationEnabled', 'New order alert to the store'],
            ['contactAckEnabled', 'Consultation acknowledgement'],
            ['customRequestAckEnabled', 'Custom request acknowledgement'],
            ['welcomeEmailEnabled', 'Welcome email on sign-up'],
          ].map(([key, label]) => (
            <Toggle key={key} checked={settings.email[key]} onChange={(v) => patch('email', { [key]: v })} label={label} />
          ))}

          <Field label="Daily send limit" hint="A safety cap so a mistake cannot burn your provider's quota.">
            <Input
              type="number"
              min="0"
              value={settings.email.dailyLimit}
              onChange={(e) => patch('email', { dailyLimit: Number(e.target.value) })}
              className="sm:w-40"
            />
          </Field>

          <Button disabled={busy === 'email'} onClick={() => saveSection('email', settings.email, 'Email settings saved.')}>
            {busy === 'email' ? 'Saving…' : 'Save'}
          </Button>
        </div>
      </Card>
    </div>
  );
};
