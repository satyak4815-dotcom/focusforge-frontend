import React, { useState } from 'react';
import { Plus, UserPlus, Copy, Check, Users, Shield, Trash2, AlertCircle } from 'lucide-react';
import { useAppContext } from '../AppContext';
import { squads } from '../services/api';

export default function SquadSync() {
  const { squadId, setSquadId, squadInfo, setSquadInfo } = useAppContext();
  const [squadName, setSquadName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCreateSquad = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!squadName.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await squads.create(squadName.trim());
      setSquadId(res._id);
      setSquadInfo({ name: res.name, code: res.joinCode });
      setSquadName('');
    } catch (err: any) {
      setError(err.message || 'Failed to create squad. Try a different name.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinSquad = async (e: React.FormEvent) => {
    e.preventDefault();
    if (joinCode.trim().length !== 5) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await squads.join(joinCode.trim());
      setSquadId(res._id);
      setSquadInfo({ name: res.name, code: res.joinCode });
      setJoinCode('');
    } catch (err: any) {
      setError(err.message || 'Invalid code. Squad not found.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeave = () => {
    setSquadId(null);
    setSquadInfo(null);
  };

  const handleCopy = () => {
    if (squadInfo?.code) {
      navigator.clipboard.writeText(squadInfo.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const disabledCard = squadId ? 'pointer-events-none opacity-60 grayscale' : '';

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-10 px-4 py-6 md:px-10 md:py-10">
      <div>
        <h2 className="font-display text-3xl font-bold uppercase tracking-tight text-pop-maroon md:text-5xl">
          Squad <span className="text-pop-teal">Sync</span>
        </h2>
        <p className="mt-2 font-sans text-xs font-semibold uppercase tracking-widest text-pop-maroon">
          Create or join a squad, then open the leaderboard for live rankings.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className={`brutalist-card flex flex-col gap-6 bg-pop-mustard/50 p-8 transition-all duration-300 ${disabledCard}`}>
          <div className="flex items-center gap-4">
            <div className="rounded-2xl border-2 border-pop-maroon bg-pop-white p-3 shadow-pop">
              <Plus className="h-6 w-6 text-pop-maroon" />
            </div>
            <h3 className="font-display text-2xl font-bold uppercase text-pop-maroon">Create squad</h3>
          </div>
          <p className="font-sans text-xs font-semibold uppercase leading-relaxed tracking-wider text-pop-maroon">
            Name your unit and receive a five-digit code to share with friends.
          </p>
          <form onSubmit={handleCreateSquad} className="flex flex-col gap-4">
            <input
              type="text"
              id="squad-name-input"
              placeholder="E.g. Alpha Focus"
              value={squadName}
              onChange={(e) => setSquadName(e.target.value)}
              disabled={!!squadId || isLoading}
              className="input-pop font-display text-sm font-bold uppercase placeholder:font-sans placeholder:normal-case"
            />
            <button type="submit" disabled={isLoading || !!squadId} className="btn-pop-primary w-full py-4 disabled:opacity-50">
              {isLoading ? 'Establishing…' : 'Establish squad'}
            </button>
          </form>
        </div>

        <div className={`brutalist-card flex flex-col gap-6 bg-pop-teal/25 p-8 transition-all duration-300 ${disabledCard}`}>
          <div className="flex items-center gap-4">
            <div className="rounded-2xl border-2 border-pop-maroon bg-pop-white p-3 shadow-pop">
              <UserPlus className="h-6 w-6 text-pop-maroon" />
            </div>
            <h3 className="font-display text-2xl font-bold uppercase text-pop-maroon">Join squad</h3>
          </div>
          <p className="font-sans text-xs font-semibold uppercase leading-relaxed tracking-wider text-pop-maroon">
            Enter the code from your squad leader to join instantly.
          </p>
          <form onSubmit={handleJoinSquad} className="flex flex-col gap-4">
            <input
              type="text"
              id="join-code-input"
              placeholder="5-digit code"
              maxLength={5}
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              disabled={!!squadId || isLoading}
              className="input-pop text-center font-display text-2xl font-bold tracking-[0.45em] placeholder:tracking-normal placeholder:font-sans placeholder:text-base placeholder:font-semibold"
            />
            <button
              type="submit"
              disabled={isLoading || !!squadId || joinCode.trim().length !== 5}
              className="btn-pop-primary w-full py-4 disabled:opacity-50"
            >
              {isLoading ? 'Joining…' : 'Join squad'}
            </button>
          </form>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-3xl border-2 border-pop-maroon bg-pop-mustard/40 p-4 shadow-pop">
          <AlertCircle className="h-5 w-5 shrink-0 text-zen-terracotta" />
          <p className="font-display text-xs font-bold uppercase text-pop-maroon">{error}</p>
          <button
            type="button"
            onClick={() => setError(null)}
            className="ml-auto font-display text-lg font-bold leading-none text-pop-maroon/50 transition-colors hover:text-pop-maroon"
          >
            ×
          </button>
        </div>
      )}

      {squadInfo && (
        <div
          id="active-squad-card"
          className="overflow-hidden rounded-3xl border-2 border-pop-maroon bg-pop-white shadow-pop-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-pop-hover"
          style={{ animation: 'slideUp 0.3s ease-out' }}
        >
          <div className="flex items-center justify-between border-b-4 border-pop-maroon bg-pop-maroon px-6 py-5 md:px-8">
            <div className="flex flex-wrap items-center gap-3">
              <Shield className="h-5 w-5 text-pop-mustard" />
              <span className="font-display text-sm font-bold uppercase tracking-widest text-pop-white">Active squad</span>
              <span className="rounded-full border-2 border-pop-white/40 bg-pop-teal px-3 py-1 font-display text-[10px] font-bold uppercase tracking-widest text-pop-white">
                Your crew
              </span>
            </div>
            <button
              type="button"
              onClick={handleLeave}
              className="flex items-center gap-2 font-display text-[10px] font-bold uppercase tracking-widest text-pop-mustard transition-opacity hover:opacity-90"
            >
              <Trash2 className="h-4 w-4" />
              Leave
            </button>
          </div>

          <div className="flex flex-col items-center gap-8 px-6 py-8 md:flex-row md:px-8 md:py-10">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border-2 border-pop-maroon bg-pop-teal/30 shadow-pop">
              <Users className="h-10 w-10 text-pop-maroon" />
            </div>

            <div className="flex-1 text-center md:text-left">
              <p className="mb-1 font-display text-[10px] font-bold uppercase tracking-widest text-pop-maroon/55">Squad name</p>
              <h3 className="font-display text-3xl font-bold uppercase leading-tight text-pop-maroon md:text-4xl">{squadInfo.name}</h3>
              <p className="mt-2 font-sans text-xs font-semibold uppercase tracking-wider text-pop-maroon">
                Squad is live. Share your join code to recruit teammates.
              </p>
            </div>

            <div className="flex shrink-0 flex-col items-center gap-3">
              <p className="font-display text-[10px] font-bold uppercase tracking-widest text-pop-maroon/55">Join code</p>
              <div className="flex items-center gap-4 rounded-2xl border-2 border-pop-maroon bg-pop-mustard px-5 py-4 shadow-pop">
                <span className="font-mono text-3xl font-bold tracking-[0.5em] text-pop-maroon">{squadInfo.code || '-----'}</span>
                <button
                  type="button"
                  onClick={handleCopy}
                  title="Copy code"
                  className={`rounded-xl border-2 border-pop-maroon p-2 shadow-pop transition-all duration-200 hover:-translate-y-0.5 ${
                    copied ? 'bg-pop-teal text-pop-white' : 'bg-pop-white text-pop-maroon'
                  }`}
                >
                  {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                </button>
              </div>
              {copied && (
                <p className="animate-pulse font-display text-[10px] font-bold uppercase tracking-widest text-pop-teal">
                  Copied to clipboard
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
