import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, Loader2, Plus } from 'lucide-react';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { sessions, Session, user } from '../services/api';
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

/** Slice colors for the Analysis pie — Retro-Modern Flat Pop palette. */
const PIE_SLICE_COLORS = [
  '#2FB1A2',
  '#F4C92E',
  '#b84a3d',
  '#7ec8ea',
  '#c8ebe4',
  '#4B2927',
  '#9fe8ff',
] as const;

/**
 * DATA PROCESSING (pie chart): takes the raw visited-websites array from the user profile,
 * groups by normalized domain (same rules as parent activity), sorts by visit count descending,
 * keeps the top 5 sites, and rolls remaining traffic into a single "Other" bucket.
 */
function processWebsiteVisitsForPieChart(raw: unknown[]): { name: string; count: number }[] {
  if (!Array.isArray(raw) || raw.length === 0) return [];

  const grouped = new Map<string, { name: string; count: number }>();

  const ensureGroup = (url: string) => {
    const normalized = String(url || '').trim().toLowerCase();
    if (!normalized) return null;
    if (!grouped.has(normalized)) {
      grouped.set(normalized, { name: normalized, count: 0 });
    }
    return grouped.get(normalized)!;
  };

  raw.forEach((entry: unknown) => {
    if (typeof entry === 'string') {
      const g = ensureGroup(entry);
      if (g) g.count += 1;
      return;
    }
    if (!entry || typeof entry !== 'object') return;
    const o = entry as Record<string, unknown>;
    const siteKey =
      o.url ?? o.domain ?? o.website ?? o.site ?? o.hostname ?? o.host ?? o.name ?? o.title;
    const g = ensureGroup(String(siteKey ?? ''));
    if (!g) return;

    const times = Array.isArray(o.accessTimes)
      ? (o.accessTimes as unknown[]).filter(Boolean)
      : [o.timestamp, o.visitedAt, o.createdAt].filter(Boolean);
    const nCount = Number(o.count);
    const nVisitCount = Number(o.visitCount);
    const safeCount = Number.isFinite(nCount) && nCount > 0 ? Math.floor(nCount) : 0;
    const safeVisitCount = Number.isFinite(nVisitCount) && nVisitCount > 0 ? Math.floor(nVisitCount) : 0;

    if (safeCount > 0) {
      g.count += safeCount;
    } else if (safeVisitCount > 0) {
      g.count += safeVisitCount;
    } else if (times.length > 0) {
      g.count += times.length;
    } else {
      g.count += 1;
    }
  });

  const rows = Array.from(grouped.values())
    .map((r) => ({ name: r.name, count: Math.max(0, Math.round(Number(r.count)) || 0) }))
    .filter((r) => r.count > 0);
  rows.sort((a, b) => b.count - a.count);

  const top = rows.slice(0, 5);
  const rest = rows.slice(5);
  if (rest.length === 0) return top;

  const sumOther = rest.reduce((acc, r) => acc + r.count, 0);
  if (sumOther <= 0) return top;
  return [...top, { name: 'Other', count: sumOther }];
}

function AnalysisTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: ReadonlyArray<{ name?: string; value?: number }>;
}) {
  if (!active || !payload?.length) return null;
  const row = payload[0];
  const label = row?.name ?? '';
  const value = row?.value ?? 0;
  return (
    <div className="rounded-2xl border-2 border-pop-maroon bg-pop-white px-3 py-2 shadow-pop">
      <p className="font-display text-[11px] font-bold uppercase tracking-wide text-pop-maroon">{label}</p>
      <p className="font-sans text-sm font-semibold text-pop-maroon">{value} visits</p>
    </div>
  );
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

  const [pieData, setPieData] = useState<{ name: string; count: number }[]>([]);
  const [analysisLoading, setAnalysisLoading] = useState(true);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  /** Recharts pie layout: keep desktop geometry; scale down for narrow viewports. */
  const [isMdUp, setIsMdUp] = useState(
    typeof window !== 'undefined' ? window.matchMedia('(min-width: 768px)').matches : true
  );

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

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const onChange = () => setIsMdUp(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    let mounted = true;
    const loadAnalysis = async () => {
      try {
        const arr = await user.getDashboardVisitedWebsites();
        if (!mounted) return;
        setPieData(processWebsiteVisitsForPieChart(arr));
        setAnalysisError(null);
      } catch {
        if (mounted) setAnalysisError('Could not load analysis.');
      } finally {
        if (mounted) setAnalysisLoading(false);
      }
    };
    loadAnalysis();
    const id = setInterval(loadAnalysis, 15000);
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
      {/*
        Mobile: single column — mascot + message, then Analysis pie, then toggles (pie sits between mascot and Session History).
        md+: unchanged two-column row — mascot (left), Analysis pie (right).
      */}
      <div className="flex w-full max-w-5xl flex-col items-center justify-center gap-6 px-2 md:flex-row md:items-center md:gap-12">
        <div className="flex w-full min-w-0 flex-col items-center gap-3 md:max-w-md md:flex-1 md:items-start md:gap-4">
          <RobotMascot isFocusing={xpBoostMood} />
          <MascotMessage isFocusing={isSessionActive} />
        </div>

        <div
          className="flex w-full min-w-0 shrink-0 flex-col items-center gap-3 md:max-w-md md:flex-1 md:items-stretch md:gap-4"
          aria-label="Website visit analysis"
        >
          <h2 className="w-full text-center font-display text-xs font-bold uppercase tracking-[0.2em] text-[#4B2927] md:text-left">
            ANALYSIS
          </h2>
          <div className="relative w-full min-h-[260px] max-w-[min(100%,22rem)] rounded-3xl border-2 border-pop-maroon bg-pop-white px-2 py-3 shadow-pop md:min-h-[300px] md:max-w-none md:px-2 md:py-4">
            {analysisLoading ? (
              <div className="flex min-h-[260px] items-center justify-center md:min-h-[300px]">
                <Loader2 className="h-8 w-8 animate-spin text-pop-teal" aria-hidden />
              </div>
            ) : analysisError ? (
              <p className="px-3 py-12 text-center font-sans text-sm font-semibold text-zen-terracotta">{analysisError}</p>
            ) : pieData.length === 0 ? (
              <p className="px-3 py-12 text-center font-display text-sm font-bold uppercase tracking-wide text-pop-maroon/70">
                No site visits logged yet. Your chart will light up after browsing data syncs.
              </p>
            ) : (
              <div
                className={
                  isMdUp
                    ? 'h-[300px] w-full min-w-0'
                    : 'h-[min(280px,calc(100vw-4rem))] min-h-[220px] w-full min-w-0'
                }
              >
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                  minWidth={0}
                  {...(!isMdUp ? { debounce: 50 } : {})}
                >
                  <PieChart
                    margin={
                      isMdUp
                        ? { top: 4, right: 8, bottom: 4, left: 8 }
                        : { top: 4, right: 4, bottom: 2, left: 4 }
                    }
                  >
                    <Pie
                      data={pieData}
                      dataKey="count"
                      nameKey="name"
                      cx="50%"
                      cy={isMdUp ? '46%' : '42%'}
                      innerRadius={0}
                      outerRadius={isMdUp ? 78 : '62%'}
                      paddingAngle={2}
                      stroke="#4B2927"
                      strokeWidth={2}
                      isAnimationActive={false}
                    >
                      {pieData.map((_, index) => (
                        <Cell key={`slice-${pieData[index]?.name}-${index}`} fill={PIE_SLICE_COLORS[index % PIE_SLICE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={AnalysisTooltip} />
                    <Legend
                      verticalAlign="bottom"
                      align="center"
                      layout="horizontal"
                      wrapperStyle={{
                        fontFamily: 'Oswald, Impact, Arial Narrow, sans-serif',
                        paddingTop: isMdUp ? 8 : 4,
                        width: '100%',
                      }}
                      formatter={(value, entry) => {
                        const count = (entry as { payload?: { count?: number } })?.payload?.count;
                        return (
                          <span
                            className={`font-bold uppercase text-pop-maroon ${isMdUp ? 'text-[10px]' : 'text-[9px]'}`}
                          >
                            {value} ({typeof count === 'number' ? count : '—'})
                          </span>
                        );
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex w-full flex-wrap justify-center gap-4 px-1 max-md:-mt-1 md:mt-0">
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
