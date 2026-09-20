import React from 'react';
import { Loader2, AlertCircle, Inbox } from 'lucide-react';

/* Shared primitives for the admin panel. Denser and plainer than the
   storefront — this is a working tool, not a shop window — but on the
   same palette so it still reads as Gevariya. */

export const money = (value) => `₹${Number(value || 0).toLocaleString('en-IN')}`;

export const formatDate = (value, withTime = false) =>
  value
    ? new Date(value).toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        ...(withTime ? { hour: '2-digit', minute: '2-digit' } : {}),
      })
    : '—';

export const Card = ({ title, action, children, className = '' }) => (
  <section className={`bg-white border border-[#E3D9CE] rounded-xl ${className}`}>
    {(title || action) && (
      <header className="flex items-center justify-between gap-3 px-4 sm:px-5 py-3 border-b border-[#EFE7DE]">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#7B3F42]">{title}</h2>
        {action}
      </header>
    )}
    <div className="p-4 sm:p-5">{children}</div>
  </section>
);

export const Stat = ({ label, value, hint, tone = 'default' }) => {
  const tones = {
    default: 'text-[#2E2B2B]',
    good: 'text-[#4A6B52]',
    warn: 'text-[#C25E00]',
    bad: 'text-[#B3261E]',
  };
  return (
    <div className="bg-white border border-[#E3D9CE] rounded-xl px-4 py-3.5">
      <div className="text-[9.5px] font-bold uppercase tracking-[0.16em] text-[#8A726A]">{label}</div>
      <div className={`font-serif text-[22px] leading-tight mt-1 ${tones[tone]}`}>{value}</div>
      {hint && <div className="text-[10.5px] text-[#8A726A] mt-0.5">{hint}</div>}
    </div>
  );
};

const BADGE_TONES = {
  neutral: 'bg-[#EFE7DE] text-[#5C4038]',
  info: 'bg-[#E6EDF3] text-[#2F5871]',
  good: 'bg-[#E3EDE4] text-[#35573E]',
  warn: 'bg-[#FBEBDD] text-[#8A4A08]',
  bad: 'bg-[#FBE3E1] text-[#8E1F18]',
  brand: 'bg-[#F1E4E6] text-[#7B3F42]',
};

export const Badge = ({ children, tone = 'neutral' }) => (
  <span
    className={`inline-block text-[9.5px] font-bold uppercase tracking-[0.1em] px-2 py-0.5 rounded ${BADGE_TONES[tone] || BADGE_TONES.neutral}`}
  >
    {children}
  </span>
);

export const statusTone = (status) =>
  ({
    PENDING: 'warn',
    CONFIRMED: 'info',
    PROCESSING: 'info',
    SHIPPED: 'brand',
    DELIVERED: 'good',
    CANCELLED: 'bad',
    PAID: 'good',
    FAILED: 'bad',
    REFUNDED: 'warn',
    SENT: 'good',
    SKIPPED: 'neutral',
    NEW: 'warn',
    REVIEWING: 'info',
    QUOTED: 'brand',
    APPROVED: 'good',
    IN_PRODUCTION: 'info',
    COMPLETED: 'good',
    REJECTED: 'bad',
    CONTACTED: 'info',
    SCHEDULED: 'brand',
    CLOSED: 'neutral',
  })[status] || 'neutral';

export const Button = ({ variant = 'primary', size = 'md', className = '', ...props }) => {
  const variants = {
    primary: 'bg-[#7B3F42] hover:bg-[#623033] text-white border-transparent',
    secondary: 'bg-white hover:bg-[#FAF6F0] text-[#2E2B2B] border-[#D8CFC3]',
    danger: 'bg-white hover:bg-[#FBE3E1] text-[#8E1F18] border-[#E8C4C0]',
  };
  const sizes = { sm: 'px-2.5 py-1.5 text-[10px]', md: 'px-4 py-2.5 text-[11px]' };
  return (
    <button
      {...props}
      className={`font-bold uppercase tracking-[0.12em] rounded-lg border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
    />
  );
};

const FIELD =
  'w-full bg-white border border-[#D8CFC3] rounded-lg px-3 py-2 text-xs text-[#2E2B2B] placeholder-[#8A726A] outline-none focus:border-[#7B3F42] transition-colors disabled:bg-[#F5F1EA]';

export const Field = ({ label, hint, children }) => (
  <label className="block">
    {label && (
      <span className="block text-[9.5px] font-bold uppercase tracking-[0.16em] text-[#7B3F42] mb-1.5">
        {label}
      </span>
    )}
    {children}
    {hint && <span className="block text-[10px] text-[#8A726A] mt-1">{hint}</span>}
  </label>
);

export const Input = (props) => <input {...props} className={`${FIELD} ${props.className || ''}`} />;
export const Select = (props) => <select {...props} className={`${FIELD} ${props.className || ''}`} />;
export const Textarea = (props) => (
  <textarea {...props} className={`${FIELD} resize-none ${props.className || ''}`} />
);

export const Toggle = ({ checked, onChange, label, hint, disabled }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    disabled={disabled}
    onClick={() => onChange(!checked)}
    className="flex items-start gap-3 w-full text-left disabled:opacity-50"
  >
    <span
      className={`mt-0.5 w-9 h-5 rounded-full shrink-0 relative transition-colors ${checked ? 'bg-[#7B3F42]' : 'bg-[#D8CFC3]'}`}
    >
      <span
        className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${checked ? 'left-[18px]' : 'left-0.5'}`}
      />
    </span>
    <span>
      <span className="block text-xs font-semibold text-[#2E2B2B]">{label}</span>
      {hint && <span className="block text-[10.5px] text-[#8A726A] mt-0.5">{hint}</span>}
    </span>
  </button>
);

export const Loading = ({ label = 'Loading…' }) => (
  <div className="flex items-center justify-center gap-2 py-12 text-xs text-[#8A726A]">
    <Loader2 size={15} className="animate-spin" />
    {label}
  </div>
);

export const ErrorNote = ({ children }) =>
  children ? (
    <div className="flex items-start gap-2 text-[11px] text-[#8E1F18] bg-[#FBE3E1] border border-[#E8C4C0] rounded-lg px-3 py-2 my-2">
      <AlertCircle size={13} className="shrink-0 mt-px" />
      <span>{children}</span>
    </div>
  ) : null;

export const Empty = ({ children }) => (
  <div className="flex flex-col items-center justify-center gap-2 py-12 text-xs text-[#8A726A]">
    <Inbox size={22} className="text-[#D8CFC3]" />
    {children}
  </div>
);

/** Horizontally scrollable table wrapper — admin tables are wide by nature. */
export const Table = ({ head, children }) => (
  <div className="overflow-x-auto -mx-4 sm:-mx-5 px-4 sm:px-5">
    <table className="w-full min-w-[640px] border-collapse text-xs">
      <thead>
        <tr>
          {head.map((cell) => (
            <th
              key={cell}
              className="text-left text-[9.5px] font-bold uppercase tracking-[0.14em] text-[#7B3F42] bg-[#FAF6F0] border-b border-[#E3D9CE] px-2.5 py-2 whitespace-nowrap"
            >
              {cell}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  </div>
);

export const Row = ({ children }) => (
  <tr className="border-b border-[#EFE7DE] hover:bg-[#FAF6F0] transition-colors">{children}</tr>
);

export const Cell = ({ children, className = '' }) => (
  <td className={`px-2.5 py-2.5 align-middle text-[#3D3533] ${className}`}>{children}</td>
);
