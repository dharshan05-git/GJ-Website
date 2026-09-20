import React, { useEffect, useState } from 'react';
import { X as XIcon, UserPlus } from 'lucide-react';
import * as api from '../../services/api';
import {
  Badge, Button, Card, Cell, Empty, ErrorNote, Field, Input, Loading, Row, Select, Table, formatDate,
} from './ui';

/**
 * Owner-only. Roles give a starting set of permissions; the extra/denied lists
 * are how one admin gets "a little more access than the basic admin" without
 * inventing a whole new role for them.
 */
const ROLE_HINTS = {
  staff: 'Order desk — reads the catalog, works orders and enquiries.',
  manager: 'Adds catalog, marketing and coupons. No settings, no staff.',
  admin: 'Adds deletes, store settings and maintenance mode.',
  superadmin: 'The owner. Everything, including managing this page.',
};

export const Staff = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(null);

  const load = () => api.admin.staff().then(setData).catch((e) => setError(e.message));
  useEffect(load, []);

  const flash = (m) => { setNotice(m); setTimeout(() => setNotice(''), 4000); };

  const saveAccess = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await api.admin.updateStaff(editing.id, {
        role: editing.role,
        extraPermissions: editing.extraPermissions,
      });
      setEditing(null);
      flash('Access updated. They will see the change the next time they sign in.');
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const createMember = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await api.admin.createStaff(creating);
      setCreating(null);
      flash('Team member added.');
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  if (error && !data) return <ErrorNote>{error}</ErrorNote>;
  if (!data) return <Loading />;

  /* Permissions the role already grants are shown ticked and locked; the rest
     can be granted individually. */
  const rolePermissions = (role) => {
    const member = data.staff.find((s) => s.role === role && s.extraPermissions?.length === 0);
    return member ? member.permissions : [];
  };

  return (
    <div className="space-y-5">
      <header className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="font-serif text-2xl text-[#2E2B2B] uppercase tracking-wide font-light">Staff & Access</h1>
          <p className="text-[11px] text-[#8A726A] mt-0.5">Who can get into this panel, and how much they can do.</p>
        </div>
        <Button onClick={() => setCreating({ name: '', email: '', password: '', role: 'staff' })}>
          <UserPlus size={13} className="inline mr-1.5 -mt-px" /> Add member
        </Button>
      </header>

      <ErrorNote>{error}</ErrorNote>
      {notice && <div className="text-[11px] text-[#35573E] bg-[#E3EDE4] border border-[#C3D7C7] rounded-lg px-3 py-2">{notice}</div>}

      <Card>
        {data.staff.length === 0 ? (
          <Empty>No staff accounts yet.</Empty>
        ) : (
          <Table head={['Member', 'Role', 'Extra access', 'Last sign-in', '']}>
            {data.staff.map((member) => (
              <Row key={member.id}>
                <Cell>
                  <div className="font-semibold text-[#2E2B2B]">{member.name}</div>
                  <div className="text-[10px] text-[#8A726A]">{member.email}</div>
                </Cell>
                <Cell>
                  <Badge tone={member.role === 'superadmin' ? 'brand' : 'info'}>{member.role}</Badge>
                  {!member.isActive && <Badge tone="bad">disabled</Badge>}
                </Cell>
                <Cell className="text-[10px] text-[#5C4038] max-w-[220px]">
                  {member.permissions.length} permissions
                </Cell>
                <Cell className="whitespace-nowrap">{formatDate(member.lastLoginAt, true)}</Cell>
                <Cell>
                  {member.role !== 'superadmin' && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setEditing({ ...member, extraPermissions: member.extraPermissions || [] })}
                    >
                      Access
                    </Button>
                  )}
                </Cell>
              </Row>
            ))}
          </Table>
        )}
      </Card>

      <Card title="What each role can do">
        <div className="space-y-2">
          {data.roles.map((role) => (
            <div key={role} className="flex gap-3 text-[11.5px]">
              <Badge tone={role === 'superadmin' ? 'brand' : 'info'}>{role}</Badge>
              <span className="text-[#5C4038]">{ROLE_HINTS[role]}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Edit access */}
      {editing && (
        <>
          <div className="fixed inset-0 bg-black/40 z-[1400]" onClick={() => setEditing(null)} />
          <div className="fixed inset-0 z-[1401] flex items-start sm:items-center justify-center p-3 overflow-y-auto pointer-events-none">
            <form onSubmit={saveAccess} className="pointer-events-auto w-full max-w-lg bg-white border border-[#E3D9CE] rounded-2xl shadow-2xl my-4 overflow-hidden">
              <header className="flex items-center justify-between px-5 py-3.5 border-b border-[#EFE7DE] bg-[#FAF6F0]">
                <div>
                  <h2 className="font-semibold text-[#2E2B2B] text-sm">{editing.name}</h2>
                  <p className="text-[10px] text-[#8A726A]">{editing.email}</p>
                </div>
                <button type="button" onClick={() => setEditing(null)} aria-label="Close" className="w-8 h-8 rounded-full hover:bg-[#EFE7DE] flex items-center justify-center">
                  <XIcon size={15} />
                </button>
              </header>

              <div className="p-5 space-y-4">
                <Field label="Role" hint={ROLE_HINTS[editing.role]}>
                  <Select value={editing.role} onChange={(e) => setEditing({ ...editing, role: e.target.value })}>
                    {data.roles.filter((r) => r !== 'superadmin').map((r) => <option key={r} value={r}>{r}</option>)}
                  </Select>
                </Field>

                <div>
                  <div className="text-[9.5px] font-bold uppercase tracking-[0.16em] text-[#7B3F42] mb-2">
                    Extra permissions
                  </div>
                  <p className="text-[10px] text-[#8A726A] mb-2.5">
                    Tick anything this person should have on top of their role.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-56 overflow-y-auto pr-1">
                    {data.permissions.map((permission) => {
                      const fromRole = rolePermissions(editing.role).includes(permission);
                      const granted = editing.extraPermissions.includes(permission);
                      return (
                        <label
                          key={permission}
                          className={`flex items-center gap-2 text-[10.5px] px-2.5 py-1.5 rounded border ${
                            fromRole ? 'bg-[#FAF6F0] border-[#EFE7DE] text-[#8A726A]' : 'border-[#E3D9CE] text-[#3D3533]'
                          }`}
                        >
                          <input
                            type="checkbox"
                            className="accent-[#7B3F42]"
                            disabled={fromRole}
                            checked={fromRole || granted}
                            onChange={(e) =>
                              setEditing({
                                ...editing,
                                extraPermissions: e.target.checked
                                  ? [...editing.extraPermissions, permission]
                                  : editing.extraPermissions.filter((p) => p !== permission),
                              })
                            }
                          />
                          <span className="truncate">{permission}</span>
                          {fromRole && <span className="ml-auto text-[8.5px] uppercase">role</span>}
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>

              <footer className="flex gap-2 px-5 py-3.5 border-t border-[#EFE7DE] bg-[#FAF6F0]">
                <Button type="submit" disabled={busy} className="flex-1">{busy ? 'Saving…' : 'Save access'}</Button>
                <Button type="button" variant="secondary" onClick={() => setEditing(null)}>Cancel</Button>
              </footer>
            </form>
          </div>
        </>
      )}

      {/* Add member */}
      {creating && (
        <>
          <div className="fixed inset-0 bg-black/40 z-[1400]" onClick={() => setCreating(null)} />
          <div className="fixed inset-0 z-[1401] flex items-center justify-center p-3 pointer-events-none">
            <form onSubmit={createMember} className="pointer-events-auto w-full max-w-sm bg-white border border-[#E3D9CE] rounded-2xl shadow-2xl overflow-hidden">
              <header className="flex items-center justify-between px-5 py-3.5 border-b border-[#EFE7DE] bg-[#FAF6F0]">
                <h2 className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#7B3F42]">Add team member</h2>
                <button type="button" onClick={() => setCreating(null)} aria-label="Close" className="w-8 h-8 rounded-full hover:bg-[#EFE7DE] flex items-center justify-center">
                  <XIcon size={15} />
                </button>
              </header>

              <div className="p-5 space-y-3.5">
                <Field label="Name">
                  <Input required value={creating.name} onChange={(e) => setCreating({ ...creating, name: e.target.value })} />
                </Field>
                <Field label="Email">
                  <Input type="email" required value={creating.email} onChange={(e) => setCreating({ ...creating, email: e.target.value })} />
                </Field>
                <Field label="Temporary password" hint="At least 8 characters. Ask them to change it after signing in.">
                  <Input type="text" required minLength={8} value={creating.password} onChange={(e) => setCreating({ ...creating, password: e.target.value })} />
                </Field>
                <Field label="Role" hint={ROLE_HINTS[creating.role]}>
                  <Select value={creating.role} onChange={(e) => setCreating({ ...creating, role: e.target.value })}>
                    {data.roles.filter((r) => r !== 'superadmin').map((r) => <option key={r} value={r}>{r}</option>)}
                  </Select>
                </Field>
              </div>

              <footer className="flex gap-2 px-5 py-3.5 border-t border-[#EFE7DE] bg-[#FAF6F0]">
                <Button type="submit" disabled={busy} className="flex-1">{busy ? 'Adding…' : 'Add member'}</Button>
                <Button type="button" variant="secondary" onClick={() => setCreating(null)}>Cancel</Button>
              </footer>
            </form>
          </div>
        </>
      )}
    </div>
  );
};
