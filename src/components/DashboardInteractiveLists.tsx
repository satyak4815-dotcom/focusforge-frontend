import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, Loader2, Plus } from 'lucide-react';
import { sessions, Session } from '../services/api';
import { useAppContext } from '../AppContext';
import RobotMascot from './RobotMascot';
import MascotMessage from './MascotMessage';
import TreasureBoxRewards from './TreasureBoxRewards';

const panelChrome =
  'w-full max-w-2xl mx-auto rounded-3xl border-2 border-pop-maroon bg-pop-white px-4 py-4 mt-3 shadow-pop transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:shadow-pop-hover';

interface Props {
  showHistory: boolean;
  showBlocklist: boolean;
  onToggleHistory: () => void;
  onToggleBlocklist: () => void;
}

function formatSessionDate(dateString: string) {
  const d = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(d);
}

function sessionDuration(start: string, end?: string) {
  if (!end) return '—';
  const mins = Math.round((new Date(end).getTime() - new Date(start).getTime()) / 60000);
  return `${mins} min`;
}

export default function DashboardInteractiveLists({
  showHistory,
  showBlocklist,
  onToggleHistory,
  onToggleBlocklist,
}: Props) {
  const [history, setHistory] = useState<Session[]>([]);
  const [histLoading, setHistLoading] = useState(true);
  const [histError, setHistError] = useState<string | null>(null);

  const { blockedSites, addBlockedSite, removeBlockedSite, isSessionActive, metrics, isLoadingProfile } =
    useAppContext();
  const [newDomain, setNewDomain] = useState('');
  const [addingSite, setAddingSite] = useState(false);

  /** Robot face: happy while XP is rising (and briefly after), sad when flat. */
  const [xpBoostMood, setXpBoostMood] = useState(false);
  const prevXpRef = useRef<number | null>(null);
  const profileHydratedRef = useRef(false);
  const xpMoodTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isLoadingProfile) {
      profileHydratedRef.current = false;
      return;
    }
    const xp = metrics.xpEarned;
    if (!profileHydratedRef.current) {
      profileHydratedRef.current = true;
      prevXpRef.current = xp;
      return;
    }
    if (prevXpRef.current !== null && xp > prevXpRef.current) {
      setXpBoostMood(true);
      if (xpMoodTimeoutRef.current) clearTimeout(xpMoodTimeoutRef.current);
      // Session ticks XP every 1s; keep happy across gaps between bumps.
      xpMoodTimeoutRef.current = setTimeout(() => setXpBoostMood(false), 2200);
    }
    prevXpRef.current = xp;
  }, [metrics.xpEarned, isLoadingProfile]);

  useEffect(
    () => () => {
      if (xpMoodTimeoutRef.current) clearTimeout(xpMoodTimeoutRef.current);
    },
    []
  );

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await sessions.getHistory();
        if (mounted) {
          setHistory(res.sessions ?? []);
          setHistError(null);
        }
      } catch {
        if (mounted) setHistError('Could not load sessions.');
      } finally {
        if (mounted) setHistLoading(false);
      }
    };
    load();
    const id = setInterval(load, 15000);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, []);

  const paletteBtn =
    'inline-flex flex-1 min-w-[min(100%,200px)] max-w-[min(100vw-2rem,320px)] cursor-pointer items-center justify-center gap-2 rounded-full border-2 border-pop-maroon bg-pop-mustard px-5 py-3 font-display text-sm font-semibold uppercase tracking-tight text-pop-maroon shadow-pop transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:shadow-pop-md active:translate-y-0 sm:py-4';

  const handleAddBlocked = async (e: React.FormEvent) => {
    e.preventDefault();
    const d = newDomain.trim();
    if (!d || addingSite) return;
    setAddingSite(true);
    try {
      await addBlockedSite(d);
      setNewDomain('');
    } catch {
      /* optional toast */
    } finally {
      setAddingSite(false);
    }
  };

  return (
    <section className="flex w-full flex-col items-center gap-6" aria-label="Session history and blocklist toggles">
      <div className="flex w-full max-w-lg flex-col items-center gap-4 px-2">
        <RobotMascot isFocusing={xpBoostMood} />
        <MascotMessage isFocusing={isSessionActive} />
      </div>

      <div className="flex w-full flex-wrap justify-center gap-4 px-1">
        <button type="button" className={paletteBtn} onClick={onToggleHistory}>
          <ChevronDown
            className={`h-5 w-5 shrink-0 text-pop-maroon transition-transform duration-300 ${showHistory ? 'rotate-180' : ''}`}
            strokeWidth={2.5}
          />
          Session History
        </button>
        <button type="button" className={paletteBtn} onClick={onToggleBlocklist}>
          <ChevronDown
            className={`h-5 w-5 shrink-0 text-pop-maroon transition-transform duration-300 ${showBlocklist ? 'rotate-180' : ''}`}
            strokeWidth={2.5}
          />
          Blocked Sites
        </button>
      </div>

      {showHistory && (
        <div className={`${panelChrome} animate-[slideReveal_220ms_ease-out]`}>
          <h3 className="mb-3 border-b-2 border-pop-maroon pb-2 text-center font-display text-xs font-bold uppercase tracking-widest text-pop-maroon">
            Session History
          </h3>
          <div className="max-h-[300px] overflow-y-auto overscroll-contain">
            {histLoading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-pop-teal" />
              </div>
            ) : histError ? (
              <p className="py-8 text-center font-sans text-sm font-semibold text-zen-terracotta">{histError}</p>
            ) : history.length === 0 ? (
              <p className="py-10 text-center font-display text-sm font-bold uppercase tracking-wide text-pop-maroon/75">
                No missions finished yet. Take a lap when you&apos;re ready.
              </p>
            ) : (
              <ul className="divide-y-2 divide-pop-maroon/20">
                {history.map((s) => (
                  <li key={s._id} className="flex flex-wrap items-center justify-between gap-2 py-3 font-sans text-sm">
                    <span className="font-semibold text-pop-maroon">{formatSessionDate(s.startTime)}</span>
                    <span className="font-display tabular-nums font-bold text-pop-maroon/85">{sessionDuration(s.startTime, s.endTime)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {showBlocklist && (
        <div className={panelChrome}>
          <h3 className="mb-3 border-b-2 border-pop-maroon pb-2 text-center font-display text-xs font-bold uppercase tracking-widest text-pop-maroon">
            Blocked Sites
          </h3>
          <form onSubmit={handleAddBlocked} className="mb-3 flex flex-wrap gap-2 border-b-2 border-pop-maroon/15 pb-3">
            <input
              type="text"
              value={newDomain}
              onChange={(e) => setNewDomain(e.target.value)}
              placeholder="domain.com"
              disabled={addingSite}
              className="input-pop min-h-[44px] min-w-0 flex-1 py-2.5 text-sm"
            />
            <button
              type="submit"
              disabled={!newDomain.trim() || addingSite}
              className="btn-pop-primary inline-flex shrink-0 items-center justify-center gap-1 px-4 py-2.5 text-xs disabled:opacity-40"
              aria-label="Add blocked domain"
            >
              <Plus className="h-5 w-5" strokeWidth={2.5} /> Add
            </button>
          </form>

          <div className="max-h-[300px] overflow-y-auto overscroll-contain">
            {blockedSites.length === 0 ? (
              <p className="py-10 text-center font-display text-sm font-bold uppercase tracking-wide text-pop-maroon/70">
                Safe surfing. No sites blocked.
              </p>
            ) : (
              <ul className="space-y-2">
                {blockedSites.map((url) => (
                  <li
                    key={url}
                    className="flex items-center justify-between gap-3 rounded-2xl border-2 border-pop-maroon bg-pop-cream/80 px-3 py-2 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-pop"
                  >
                    <span className="flex min-w-0 flex-1 items-center gap-2 font-sans font-semibold text-pop-maroon">
                      <span className="shrink-0" aria-hidden>
                        ✕
                      </span>
                      <span className="truncate">{url}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => removeBlockedSite(url)}
                      className="shrink-0 rounded-full border-2 border-pop-maroon bg-pop-white px-3 py-1 font-display text-[10px] font-bold uppercase text-pop-maroon transition-all duration-200 hover:bg-pop-mustard/40"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      <TreasureBoxRewards history={history} isHistoryLoading={histLoading} />

      <style>{`
        @keyframes slideReveal {
          from {
            opacity: 0;
            transform: translateY(-6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
