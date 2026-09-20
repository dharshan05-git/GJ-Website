import React from 'react';
import { Sparkles, Mail, Phone } from 'lucide-react';
import { GevariyaLogo } from '../components/GevariyaLogo';
import { useShop } from '../context/ShopContext';

/**
 * Shown in place of the whole storefront while the admin panel's Maintenance
 * Mode is on. Every word — heading, body and the announcement strip — is edited
 * from the panel, never in code.
 */
export const Maintenance = () => {
  const { maintenance, settings } = useShop();

  // The copy arrives either from the settings endpoint (`message`) or from the
  // 503 the API returns to shoppers (`body`).
  const title = maintenance?.title || 'Website Under Construction';
  const message = maintenance?.body || maintenance?.message || 'Please wait for a while.';
  const announcement = settings?.announcement || maintenance?.announcement;
  const store = settings?.store;

  const backAt = maintenance?.expectedBackAt
    ? new Date(maintenance.expectedBackAt).toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      })
    : null;

  return (
    <div className="min-h-screen bg-[#F5F1EA] flex flex-col items-center justify-center px-4 py-16 text-center">

      <div className="mb-8">
        <GevariyaLogo size="xl" />
      </div>

      <div className="w-full max-w-lg bg-white border border-[#D8CFC3] rounded-2xl shadow-sm px-6 sm:px-10 py-10">
        <div className="w-12 h-[2px] bg-[#C6A46A] mx-auto mb-6" />

        <h1 className="font-serif text-2xl sm:text-3xl text-[#2E2B2B] uppercase font-light tracking-wide">
          {title}
        </h1>

        <p className="text-xs sm:text-[13px] text-[#5C4038] leading-relaxed mt-4 max-w-sm mx-auto">
          {message}
        </p>

        {backAt && (
          <p className="text-[11px] text-[#8A726A] mt-4">
            Expected back by <span className="font-semibold text-[#7B3F42]">{backAt}</span>
          </p>
        )}

        {announcement?.enabled && announcement.text && (
          <div className="mt-8 bg-[#F5F1EA] border border-[#DBC5B8] rounded-xl px-5 py-4 text-left">
            <div className="flex items-center gap-2 text-[#7B3F42] text-[10px] font-bold tracking-[0.2em] uppercase mb-1.5">
              <Sparkles size={12} className="text-[#C6A46A]" />
              <span>Announcement</span>
            </div>
            <p className="text-xs text-[#2E2B2B] leading-relaxed">{announcement.text}</p>
            {announcement.link && (
              <a
                href={announcement.link}
                className="inline-block mt-2 text-[11px] font-bold text-[#7B3F42] underline underline-offset-2"
              >
                {announcement.linkLabel || 'Read more'}
              </a>
            )}
          </div>
        )}

        {store && (
          <div className="mt-8 pt-5 border-t border-[#EDE5DC] space-y-1.5 text-[11px] text-[#5C4038]">
            {store.supportEmail && (
              <p className="flex items-center justify-center gap-2">
                <Mail size={12} className="text-[#7B3F42]" /> {store.supportEmail}
              </p>
            )}
            {store.supportPhone && (
              <p className="flex items-center justify-center gap-2">
                <Phone size={12} className="text-[#7B3F42]" /> {store.supportPhone}
              </p>
            )}
          </div>
        )}
      </div>

      <p className="text-[10px] text-[#8A726A] tracking-[0.2em] uppercase mt-8">
        © {new Date().getFullYear()} {store?.name || 'Gevariya Jewels'}
      </p>
    </div>
  );
};
