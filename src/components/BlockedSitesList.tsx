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
    <div className="brutalist-card bg-white p-6 w-full h-full flex flex-col gap-6">
      <div className="flex items-center justify-between border-b-2 border-[#111827] pb-4">
        <div className="flex items-center gap-3">
          <div className="bg-rose-100 p-2 border-2 border-[#111827] rounded-xl shadow-[2px_2px_0px_#111827]">
            <Lock className="w-5 h-5 text-rose-600" />
          </div>
          <h3 className="text-xl font-black uppercase tracking-tight text-[#111827]">Blocklist</h3>
        </div>
        <span className="bg-teal-100 px-3 py-1 border-2 border-[#111827] rounded-full text-[10px] font-black uppercase tracking-widest shadow-[2px_2px_0px_#111827]">
          {blockedSites.length} Domains
        </span>
      </div>

      {/* ADD SITE INPUT */}
      <form onSubmit={handleAdd} className="flex gap-3">
        <div className="relative flex-1">
          <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={newDomain}
            onChange={(e) => setNewDomain(e.target.value)}
            placeholder="example.com"
            disabled={isSubmitting}
            className="w-full bg-slate-50 border-2 border-[#111827] rounded-xl py-3 pl-11 pr-4 font-bold text-sm focus:outline-none focus:bg-white transition-all shadow-[2px_2px_0px_#111827] focus:shadow-none focus:translate-x-[2px] focus:translate-y-[2px]"
          />
        </div>
        <button
          type="submit"
          disabled={!newDomain.trim() || isSubmitting}
          className="brutalist-button bg-teal-400 p-3 rounded-xl flex items-center justify-center disabled:opacity-50 disabled:grayscale"
        >
          <Plus className="w-6 h-6 text-black" />
        </button>
      </form>

      {/* SITES LIST */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar flex flex-col gap-3 min-h-[200px] max-h-[350px]">
        {blockedSites.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-10 text-center opacity-40 grayscale">
            <Shield className="w-12 h-12 mb-2" />
            <p className="text-xs font-black uppercase tracking-widest">No sites blocked yet</p>
          </div>
        ) : (
          blockedSites.map((site) => (
            <div
              key={site}
              className="group flex items-center justify-between p-4 bg-slate-50 border-2 border-[#111827] rounded-xl transition-all hover:bg-white shadow-[2px_2px_0px_rgba(0,0,0,0.1)] hover:shadow-[3px_3px_0px_#111827]"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shrink-0" />
                <span className="font-bold text-sm truncate">{site}</span>
              </div>
              <button
                onClick={() => removeBlockedSite(site)}
                className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-rose-100 border-2 border-transparent hover:border-[#111827] rounded-lg transition-all"
              >
                <X className="w-4 h-4 text-rose-600" />
              </button>
            </div>
          ))
        )}
      </div>

      <div className="pt-4 border-t-2 border-[#111827] border-dashed">
        <p className="text-[10px] font-bold text-slate-500 uppercase leading-tight italic">
          * Sites added here will be automatically blocked by your FocusForge Extension.
        </p>
      </div>
    </div>
  );
}
