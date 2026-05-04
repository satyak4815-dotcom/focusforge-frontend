import React, { useState } from 'react';
import { Shield, Plus, X, Globe, Lock } from 'lucide-react';
import { useAppContext } from '../AppContext';

export default function BlockedSitesList() {
  const { blockedSites, addBlockedSite, removeBlockedSite } = useAppContext();
  const [newDomain, setNewDomain] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDomain.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await addBlockedSite(newDomain.trim());
      setNewDomain('');
    } catch (err) {
      console.error('Failed to add site:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="brutalist-card flex h-full w-full flex-col gap-6 bg-pop-white p-6">
      <div className="flex items-center justify-between border-b-2 border-pop-maroon pb-4">
        <div className="flex items-center gap-3">
          <div className="rounded-xl border-2 border-pop-maroon bg-pop-mustard/40 p-2 shadow-pop">
            <Lock className="h-5 w-5 text-pop-maroon" />
          </div>
          <h3 className="font-display text-xl font-bold uppercase tracking-tight text-pop-maroon">Blocklist</h3>
        </div>
        <span className="rounded-full border-2 border-pop-maroon bg-pop-teal/25 px-3 py-1 font-display text-[10px] font-bold uppercase tracking-widest text-pop-maroon shadow-pop">
          {blockedSites.length} domains
        </span>
      </div>

      <form onSubmit={handleAdd} className="flex gap-3">
        <div className="relative flex-1">
          <Globe className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-pop-maroon/45" />
          <input
            type="text"
            value={newDomain}
            onChange={(e) => setNewDomain(e.target.value)}
            placeholder="example.com"
            disabled={isSubmitting}
            className="input-pop w-full py-3 pl-11 pr-4 text-sm"
          />
        </div>
        <button
          type="submit"
          disabled={!newDomain.trim() || isSubmitting}
          className="brutalist-button flex items-center justify-center rounded-full border-2 border-pop-maroon bg-pop-teal p-3 text-pop-white disabled:opacity-50"
          aria-label="Add domain"
        >
          <Plus className="h-6 w-6" />
        </button>
      </form>

      <div className="custom-scrollbar flex min-h-[200px] max-h-[350px] flex-1 flex-col gap-3 overflow-y-auto pr-2">
        {blockedSites.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center py-10 text-center opacity-50">
            <Shield className="mb-2 h-12 w-12 text-pop-maroon" />
            <p className="font-display text-xs font-bold uppercase tracking-widest text-pop-maroon">No sites blocked yet</p>
          </div>
        ) : (
          blockedSites.map((site) => (
            <div
              key={site}
              className="group flex items-center justify-between rounded-2xl border-2 border-pop-maroon bg-pop-mustard/25 p-4 shadow-pop transition-all duration-200 hover:-translate-y-0.5 hover:bg-pop-cream hover:shadow-pop-md"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-zen-terracotta" />
                <span className="truncate font-sans text-sm font-semibold text-pop-maroon">{site}</span>
              </div>
              <button
                type="button"
                onClick={() => removeBlockedSite(site)}
                className="rounded-lg border-2 border-transparent p-1.5 opacity-0 transition-all hover:border-pop-maroon hover:bg-zen-terracotta/15 group-hover:opacity-100"
                aria-label={`Remove ${site}`}
              >
                <X className="h-4 w-4 text-zen-terracotta" />
              </button>
            </div>
          ))
        )}
      </div>

      <div className="border-t-2 border-dashed border-pop-maroon pt-4">
        <p className="font-sans text-[10px] font-semibold uppercase leading-tight text-pop-maroon/65">
          Sites added here are blocked by your FocusForge extension.
        </p>
      </div>
    </div>
  );
}
