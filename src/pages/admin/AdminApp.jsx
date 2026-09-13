import React, { useEffect, useState } from 'react';
import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Package, ShoppingCart, Users, Sparkles, Mail,
  Settings as SettingsIcon, UserCog, LogOut, Menu, X, ExternalLink, ShieldAlert,
} from 'lucide-react';
import * as api from '../../services/api';
import { GevariyaLogo } from '../../components/GevariyaLogo';
import { Button, ErrorNote, Field, Input, Loading } from './ui';
import { Dashboard } from './Dashboard';
import { Products } from './Products';
import { Orders } from './Orders';
import { Customers } from './Customers';
import { Bespoke } from './Bespoke';
import { Marketing } from './Marketing';
import { Emails } from './Emails';
import { StoreSettings } from './StoreSettings';
import { Staff } from './Staff';

/**
 * The staff area, mounted at /admin. It deliberately sits outside the
 * storefront layout: no announcement bar, no cart, no curtain loader, and it
 * stays reachable while maintenance mode is on.
 */

/* `permission` decides whether the tab is shown; the backend enforces it again
   on every request, so hiding here is convenience, not security. */
const NAV = [
  { path: '', label: 'Dashboard', icon: LayoutDashboard, element: <Dashboard /> },
  { path: 'products', label: 'Products', icon: Package, permission: 'products:read', element: <Products /> },
  { path: 'orders', label: 'Orders', icon: ShoppingCart, permission: 'orders:read', element: <Orders /> },
  { path: 'customers', label: 'Customers', icon: Users, permission: 'customers:read', element: <Customers /> },
  { path: 'bespoke', label: 'Custom Orders', icon: Sparkles, permission: 'custom:read', element: <Bespoke /> },
  { path: 'marketing', label: 'Enquiries', icon: Mail, permission: 'marketing:read', element: <Marketing /> },
  { path: 'emails', label: 'Email Automation', icon: Mail, permission: 'emails:read', element: <Emails /> },
  { path: 'settings', label: 'Store Settings', icon: SettingsIcon, permission: 'settings:read', element: <StoreSettings /> },
  { path: 'staff', label: 'Staff & Access', icon: UserCog, ownerOnly: true, element: <Staff /> },
];

/* ── Sign in ──────────────────────────────────────────────────── */
const AdminLogin = ({ onSignedIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const user = await api.login({ email, password });
      if (!user.isStaff) {
        api.logout();
        setError('This account does not have staff access.');
        return;
      }
      onSignedIn(user);
    } catch (err) {
      setError(err.message || 'Could not sign in.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F1EA] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <GevariyaLogo size="lg" />
          <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#7B3F42] mt-2">
            Staff Panel
          </div>
        </div>

        <form onSubmit={submit} className="bg-white border border-[#E3D9CE] rounded-2xl p-6 space-y-4 shadow-sm">
          <Field label="Email">
            <Input
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@gevariyajewels.com"
            />
          </Field>
          <Field label="Password">
            <Input
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </Field>

          <ErrorNote>{error}</ErrorNote>

          <Button type="submit" disabled={busy} className="w-full">
            {busy ? 'Signing in…' : 'Sign in'}
          </Button>

          <Link
            to="/"
            className="block text-center text-[10.5px] text-[#8A726A] hover:text-[#7B3F42] transition-colors"
          >
            ← Back to the store
          </Link>
        </form>
      </div>
    </div>
  );
};

/* ── Shell ────────────────────────────────────────────────────── */
export const AdminApp = () => {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    api.me().then((me) => {
      setUser(me);
      setChecking(false);
    });
  }, []);

  useEffect(() => setMenuOpen(false), [location.pathname]);

  if (checking) {
    return (
      <div className="min-h-screen bg-[#F5F1EA]">
        <Loading label="Checking your session…" />
      </div>
    );
  }

  if (!user) return <AdminLogin onSignedIn={setUser} />;

  if (!user.isStaff) {
    return (
      <div className="min-h-screen bg-[#F5F1EA] flex items-center justify-center px-4 text-center">
        <div className="max-w-sm bg-white border border-[#E3D9CE] rounded-2xl p-8">
          <ShieldAlert size={26} className="text-[#7B3F42] mx-auto mb-3" />
          <h1 className="font-serif text-xl text-[#2E2B2B] uppercase tracking-wide">No staff access</h1>
          <p className="text-xs text-[#5C4038] mt-2 leading-relaxed">
            You are signed in as {user.email}, which is a customer account. Ask the store owner to
            grant staff access.
          </p>
          <Button
            variant="secondary"
            className="mt-5"
            onClick={() => {
              api.logout();
              setUser(null);
            }}
          >
            Sign out
          </Button>
        </div>
      </div>
    );
  }

  const can = (permission) => !permission || (user.permissions || []).includes(permission);
  const visible = NAV.filter((item) => (item.ownerOnly ? user.role === 'superadmin' : can(item.permission)));

  const signOut = () => {
    api.logout();
    setUser(null);
  };

  const navLink = (item) => {
    const to = `/admin${item.path ? `/${item.path}` : ''}`;
    const active = location.pathname === to || (item.path && location.pathname.startsWith(`${to}/`));
    const Icon = item.icon;
    return (
      <Link
        key={item.path || 'dashboard'}
        to={to}
        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[11.5px] font-semibold transition-colors ${
          active ? 'bg-[#7B3F42] text-white' : 'text-[#3D3533] hover:bg-[#EFE7DE]'
        }`}
      >
        <Icon size={15} strokeWidth={1.8} className="shrink-0" />
        <span>{item.label}</span>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-[#F5F1EA] flex flex-col lg:flex-row">
      {/* Mobile bar */}
      <div className="lg:hidden flex items-center justify-between bg-white border-b border-[#E3D9CE] px-4 py-3 sticky top-0 z-30">
        <div className="flex items-center gap-2.5">
          <GevariyaLogo size="xs" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#7B3F42]">Staff</span>
        </div>
        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-[#EFE7DE] text-[#3D3533]"
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`${menuOpen ? 'block' : 'hidden'} lg:block w-full lg:w-60 bg-white border-b lg:border-b-0 lg:border-r border-[#E3D9CE] lg:min-h-screen shrink-0`}
      >
        <div className="hidden lg:block px-5 pt-6 pb-4 border-b border-[#EFE7DE] text-center">
          <GevariyaLogo size="sm" />
          <div className="text-[9px] font-bold uppercase tracking-[0.28em] text-[#7B3F42] mt-1.5">
            Staff Panel
          </div>
        </div>

        <nav className="p-3 space-y-1">{visible.map(navLink)}</nav>

        <div className="p-3 border-t border-[#EFE7DE] mt-auto space-y-1">
          <div className="px-3 py-2">
            <div className="text-[11px] font-semibold text-[#2E2B2B] truncate">{user.name}</div>
            <div className="text-[10px] text-[#8A726A] truncate">{user.email}</div>
            <div className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#7B3F42] mt-1">
              {user.role}
            </div>
          </div>
          <a
            href="/"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[11.5px] font-semibold text-[#3D3533] hover:bg-[#EFE7DE] transition-colors"
          >
            <ExternalLink size={15} strokeWidth={1.8} /> View store
          </a>
          <button
            onClick={signOut}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[11.5px] font-semibold text-[#8E1F18] hover:bg-[#FBE3E1] transition-colors"
          >
            <LogOut size={15} strokeWidth={1.8} /> Sign out
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
        <Routes>
          {visible.map((item) => (
            <Route key={item.path || 'dashboard'} path={item.path || undefined} index={!item.path} element={item.element} />
          ))}
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </main>
    </div>
  );
};
