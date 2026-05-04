import React, { useState, useEffect } from 'react';
import { Users, LogOut, ShieldAlert, CheckCircle, XCircle, Clock, Zap, Target, ChevronDown, AlertTriangle, Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useAppContext } from '../AppContext';
import { parents } from '../services/api';

// Mock Data
const MOCK_KIDS = [
  { id: '1', name: 'Alex', level: 12, xp: 12500, focusMinutes: 840 },
  { id: '2', name: 'Sam', level: 8, xp: 8200, focusMinutes: 520 },
  { id: '3', name: 'Jordan', level: 15, xp: 15800, focusMinutes: 1120 },
];

const MOCK_WEEKLY_DATA = [
  { day: 'Mon', minutes: 120, isRecent: false },
  { day: 'Tue', minutes: 90, isRecent: false },
  { day: 'Wed', minutes: 150, isRecent: false },
  { day: 'Thu', minutes: 80, isRecent: false },
  { day: 'Fri', minutes: 110, isRecent: true },
  { day: 'Sat', minutes: 60, isRecent: true },
  { day: 'Sun', minutes: 140, isRecent: true },
];

const MOCK_WEB_ACTIVITY_DATA: Record<string, any[]> = {
  'Today': [
    { id: 't1', domain: 'youtube.com', timestamp: '10 mins ago', status: 'Blocked' },
    { id: 't2', domain: 'khanacademy.org', timestamp: '3 hours ago', status: 'Allowed' },
  ],
  'Yesterday': [
    { id: 'y1', domain: 'wikipedia.org', timestamp: 'Yesterday', status: 'Allowed' },
    { id: 'y2', domain: 'tiktok.com', timestamp: 'Yesterday', status: 'Blocked' },
  ],
  '2 Days Before': [
    { id: 'd1', domain: 'instagram.com', timestamp: '2 days ago', status: 'Blocked' },
  ],
  'Last 3 Days': [
    { id: 'l1', domain: 'youtube.com', timestamp: '10 mins ago', status: 'Blocked' },
    { id: 'l2', domain: 'wikipedia.org', timestamp: '1 hour ago', status: 'Allowed' },
    { id: 'l3', domain: 'tiktok.com', timestamp: '2 hours ago', status: 'Blocked' },
    { id: 'l4', domain: 'khanacademy.org', timestamp: '3 hours ago', status: 'Allowed' },
    { id: 'l5', domain: 'instagram.com', timestamp: '5 hours ago', status: 'Blocked' },
  ]
};

const FILTER_OPTIONS = ['Today', 'Yesterday', '2 Days Before', 'Last 3 Days'];

const MOCK_DISTRACTION_DATA = {
  totalAttempts: 47,
  topSites: [
    { domain: 'instagram.com', count: 12 },
    { domain: 'tiktok.com', count: 8 },
    { domain: 'youtube.com', count: 5 },
  ]
};

const FALLBACK_ACTIVITY = [
  { url: 'youtube.com', visitCount: 15, accessTimes: [new Date().toISOString(), new Date(Date.now() - 3600000).toISOString()] },
  { url: 'tiktok.com', visitCount: 8, accessTimes: [new Date(Date.now() - 7200000).toISOString()] },
  { url: 'instagram.com', visitCount: 12, accessTimes: [new Date(Date.now() - 10800000).toISOString()] },
  { url: 'khanacademy.org', visitCount: 5, accessTimes: [new Date(Date.now() - 14400000).toISOString()] },
];

/** Readable label for URLs/domains; full string preserved for title/tooltip. */
function formatSiteLabel(raw: string): { label: string; full: string } {
  const full = String(raw || '').trim();
  if (!full) return { label: '—', full: '' };
  try {
    const href = /:\/\//.test(full) ? full : `https://${full}`;
    const u = new URL(href);
    const path = u.pathname && u.pathname !== '/' ? u.pathname : '';
    let label = u.hostname + path;
    if (label.length > 96) label = `${label.slice(0, 93)}…`;
    return { label, full };
  } catch {
    const label = full.length > 96 ? `${full.slice(0, 93)}…` : full;
    return { label, full };
  }
}

export default function ParentDashboard() {
  const [kids, setKids] = useState<any[]>([]);
  const [selectedKidId, setSelectedKidId] = useState<string | null>(null);
  const [isLoadingKids, setIsLoadingKids] = useState(true);
  const [activeFilter, setActiveFilter] = useState('Last 3 Days');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { logout, username } = useAppContext();

  const [activityData, setActivityData] = useState<any[]>([]);
  const [isLoadingActivity, setIsLoadingActivity] = useState(false);
  const [activityError, setActivityError] = useState('');

  // Normalize total focus minutes across possible backend response shapes.
  // This keeps the stat card stable even if field names vary by deployment.
  const extractTotalFocusMinutes = (kid: any): number => {
    if (!kid) return 0;
    if (typeof kid.totalFocusMinutes === 'number') return kid.totalFocusMinutes;
    if (typeof kid.focusMinutes === 'number') return kid.focusMinutes;
    if (typeof kid.totalMinutes === 'number') return kid.totalMinutes;
    if (typeof kid.focusHours === 'number') return Math.round(kid.focusHours * 60);
    if (kid.stats && typeof kid.stats.totalFocusMinutes === 'number') return kid.stats.totalFocusMinutes;
    return 0;
  };

  // Convert raw `visitedWebsite` array from backend user docs into
  // a grouped activity structure used by the dashboard UI.
  const buildActivityFromVisitedWebsite = (visitedWebsite: any[]): any[] => {
    if (!Array.isArray(visitedWebsite) || visitedWebsite.length === 0) return [];

    // Group by normalized domain so repeated entries merge into one row/site.
    const grouped = new Map<string, { url: string; visitCount: number; accessTimes: string[] }>();

    // Ensure a domain bucket exists before incrementing counts/timestamps.
    const ensureGroup = (url: string) => {
      const normalizedUrl = String(url || '').trim().toLowerCase();
      if (!normalizedUrl) return null;
      if (!grouped.has(normalizedUrl)) {
        grouped.set(normalizedUrl, { url: normalizedUrl, visitCount: 0, accessTimes: [] });
      }
      return grouped.get(normalizedUrl)!;
    };

    // Support both compact string entries and object entries from backend.
    visitedWebsite.forEach((entry: any) => {
      if (typeof entry === 'string') {
        const group = ensureGroup(entry);
        if (!group) return;
        group.visitCount += 1;
        group.accessTimes.push(new Date().toISOString());
        return;
      }

      const url = entry?.url || entry?.domain || entry?.website || entry?.site;
      const group = ensureGroup(url);
      if (!group) return;

      // Collect timestamp candidates from different known field names.
      const times = Array.isArray(entry?.accessTimes)
        ? entry.accessTimes
        : [entry?.timestamp || entry?.visitedAt || entry?.createdAt].filter(Boolean);
      const explicitVisitCount = Number(entry?.visitCount);
      const safeVisitCount = Number.isFinite(explicitVisitCount) && explicitVisitCount > 0 ? explicitVisitCount : 0;

      // Prefer backend-provided visitCount when available; otherwise infer from times.
      if (safeVisitCount > 0) {
        group.visitCount += safeVisitCount;
      } else if (times.length > 0) {
        group.visitCount += times.length;
      } else {
        group.visitCount += 1;
      }

      if (times.length > 0) {
        times.forEach((time: string) => group.accessTimes.push(time));
      }
    });

    return Array.from(grouped.values());
  };

  // Fetch children on mount
  useEffect(() => {
    async function fetchKids() {
      try {
        const linkedKids = await parents.getLinkedChildren();
        // Pre-normalize child stats once so render code can be simple.
        const hydratedKids = linkedKids.map((kid: any) => ({
          ...kid,
          totalFocusMinutes: extractTotalFocusMinutes(kid),
        }));

        setKids(hydratedKids);
        if (hydratedKids.length > 0) {
          setSelectedKidId(hydratedKids[0]._id);
        }
      } catch (err: any) {
        console.error('Failed to fetch linked children:', err.message);
      } finally {
        setIsLoadingKids(false);
      }
    }
    fetchKids();
  }, []);

  useEffect(() => {
    if (!selectedKidId) return;

    async function fetchActivity() {
      setIsLoadingActivity(true);
      setActivityError('');
      try {
        // Read latest linked children from backend and locate selected kid record.
        const linkedKids = await parents.getLinkedChildren();
        const selectedKidFromBackend = linkedKids.find((kid: any) => kid._id === selectedKidId);

        if (!selectedKidFromBackend) {
          setActivityData([]);
          setActivityError('Selected kid not found in linked children.');
          return;
        }

        // Pull website history from likely backend keys for compatibility.
        const visitedWebsiteArray =
          selectedKidFromBackend.visitedWebsite ||
          selectedKidFromBackend.visitedWebsites ||
          selectedKidFromBackend.websiteVisits ||
          [];

        // Build dashboard-ready activity model from raw visitedWebsite entries.
        const derivedActivity = buildActivityFromVisitedWebsite(visitedWebsiteArray);

        if (derivedActivity.length > 0) {
          setActivityData(derivedActivity);
          // Cache visitedWebsite locally on the selected kid for UI continuity.
          setKids(prev =>
            prev.map(kid =>
              kid._id === selectedKidId ? { ...kid, visitedWebsite: visitedWebsiteArray } : kid
            )
          );
          return;
        }

        // Fallback path for older backend versions that still use child-activity endpoint.
        const data = await parents.getChildActivity(selectedKidId);
        setActivityData(data?.activity || data || []);
      } catch (err: any) {
        console.warn('Failed to load backend web activity:', err.message);
        setActivityData([]);
        setActivityError('Unable to fetch recent web activity from backend.');
      } finally {
        setIsLoadingActivity(false);
      }
    }
    fetchActivity();
  }, [selectedKidId]);

  const selectedKid = kids.find(k => k._id === selectedKidId) || kids[0] || null;

  // Expand grouped site activity into table rows (one row per timestamped visit),
  // then order from newest to oldest for the "Recent Web Activity" list.
  const allMappedWebActivity = activityData.flatMap(item => 
    (item.accessTimes || []).map((time: string, idx: number) => ({
      id: `${item.url}-${idx}`,
      domain: item.url,
      isoTime: new Date(time).toISOString(),
      timestamp: new Date(time).toLocaleString(),
      status: 'Blocked'
    }))
  ).sort((a, b) => new Date(b.isoTime).getTime() - new Date(a.isoTime).getTime());

  const now = Date.now();
  // Apply dropdown time filter windows (today/yesterday/etc.) on recent events.
  const mappedWebActivity = allMappedWebActivity.filter(activity => {
    const activityMs = new Date(activity.isoTime).getTime();
    if (Number.isNaN(activityMs)) return false;
    const ageMs = now - activityMs;
    if (activeFilter === 'Today') return ageMs <= 24 * 60 * 60 * 1000;
    if (activeFilter === 'Yesterday') return ageMs > 24 * 60 * 60 * 1000 && ageMs <= 48 * 60 * 60 * 1000;
    if (activeFilter === '2 Days Before') return ageMs > 48 * 60 * 60 * 1000 && ageMs <= 72 * 60 * 60 * 1000;
    return ageMs <= 72 * 60 * 60 * 1000;
  });

  // Compute "Attempts Today" using real visit events if timestamps exist.
  // If backend only sends aggregated visitCount, treat that payload as today's snapshot.
  const getTodayAttemptsFromVisitCount = (items: any[]) => {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayStartMs = todayStart.getTime();
    const tomorrowStartMs = todayStartMs + 24 * 60 * 60 * 1000;

    const withTimestamps = items
      .filter(item => Array.isArray(item.accessTimes) && item.accessTimes.length > 0)
      .reduce((sum, item) => {
        const todayHits = item.accessTimes.filter((time: string) => {
          const timestamp = new Date(time).getTime();
          return !Number.isNaN(timestamp) && timestamp >= todayStartMs && timestamp < tomorrowStartMs;
        }).length;
        return sum + todayHits;
      }, 0);

    if (withTimestamps > 0) return withTimestamps;

    // If backend entries only contain visitCount (no per-visit timestamps),
    // treat the current payload as today's snapshot.
    return items.reduce((sum, item) => sum + Number(item.visitCount || 0), 0);
  };

  // Main metric shown in Distraction Counter card.
  const totalAttempts = getTodayAttemptsFromVisitCount(activityData);
  // Top domains by visit frequency (high to low) from backend-derived data.
  const topSites = [...activityData].sort((a, b) => (b.visitCount || 0) - (a.visitCount || 0)).slice(0, 3).map(item => ({
    domain: item.url,
    count: item.visitCount || 0
  }));

  const handleLogout = () => {
    logout();
  };

  // Custom tooltip for the Recharts bar chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border-2 border-pop-maroon p-3 shadow-pop font-bold">
          <p className="text-pop-maroon uppercase tracking-widest text-xs mb-1">{label}</p>
          <p className="text-xl text-[var(--neo-turquoise)]">{payload[0].value} <span className="text-xs text-pop-maroon uppercase">mins</span></p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex min-h-screen min-w-0 max-w-[100vw] flex-row overflow-x-hidden bg-pop-cream text-pop-maroon">
      
      {/* SIDEBAR */}
      <aside
        className="sticky top-0 flex h-screen w-[280px] shrink-0 flex-col border-r-2 border-pop-maroon bg-pop-white"
      >
        <div className="border-b-2 border-pop-maroon bg-pop-teal px-5 py-6 text-pop-white">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-pop-maroon bg-pop-white shadow-pop">
              <Users className="h-5 w-5 text-pop-maroon" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold uppercase leading-none tracking-tight">Parent</h2>
              <p className="font-display text-[10px] font-bold uppercase tracking-widest text-pop-white/90">Dashboard</p>
            </div>
          </div>
        </div>

        {/* Kids Selector */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          <h3 className="text-xs font-black uppercase tracking-widest mb-2 px-2 text-pop-maroon/55">Linked Accounts</h3>
          {isLoadingKids ? (
            <div className="flex justify-center p-4">
              <Loader2 className="w-6 h-6 animate-spin text-pop-maroon" />
            </div>
          ) : kids.length === 0 ? (
            <div className="p-4 text-sm font-bold text-pop-maroon/45 text-center uppercase tracking-widest border-2 border-dashed border-pop-maroon/20 rounded-xl">
              No Linked Kids
            </div>
          ) : (
            kids.map(kid => {
              const isSelected = kid._id === selectedKidId;
              return (
                <button
                  key={kid._id}
                  onClick={() => setSelectedKidId(kid._id)}
                  type="button"
                  className={`group relative w-full overflow-hidden rounded-3xl border-2 border-pop-maroon px-4 py-4 text-left transition-all duration-200 ease-in-out ${
                    isSelected
                      ? 'bg-pop-mustard shadow-pop-md -translate-y-0.5'
                      : 'bg-pop-white shadow-pop hover:-translate-y-0.5 hover:shadow-pop-md'
                  }`}
                >
                  <div className="relative z-10 flex items-center justify-between">
                    <div>
                      <h4 className="font-display text-lg font-bold uppercase tracking-tight">{kid.username}</h4>
                      <p className="font-sans text-xs font-semibold opacity-85">Level {kid.level || 1}</p>
                    </div>
                    {isSelected && (
                      <div className="h-3 w-3 animate-pulse rounded-full bg-pop-maroon" />
                    )}
                  </div>
                </button>
              )
            })
          )}
        </div>

        {/* Bottom Navigation */}
        <div className="border-t-2 border-pop-maroon bg-pop-maroon p-5">
          <button
            type="button"
            onClick={handleLogout}
            className="btn-pop-secondary flex w-full items-center justify-center gap-2 py-3 text-sm"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-w-0 min-h-0 h-screen overflow-y-auto overflow-x-hidden">
        {/* Header */}
        <header className="sticky top-0 z-20 flex items-center justify-between border-b-4 border-pop-maroon bg-pop-teal px-6 py-8 text-pop-white sm:px-10">
          <div>
            <p className="mb-1 font-display text-xs font-bold uppercase tracking-widest text-pop-white/85">Viewing profile for</p>
            <h1 className="flex items-center gap-4 font-display text-3xl font-bold uppercase tracking-tight sm:text-4xl">
              {selectedKid ? selectedKid.username : '...'}
              {selectedKid && (
                <span className="rounded-full border-2 border-pop-maroon bg-pop-mustard px-3 py-1 font-display text-sm font-bold text-pop-maroon shadow-pop">
                  Level {selectedKid.level || 1}
                </span>
              )}
            </h1>
          </div>
          <div className="text-right">
            <p className="font-sans text-sm font-semibold text-pop-white/90">Welcome back,</p>
            <p className="font-display uppercase tracking-widest text-pop-white">{username || 'Parent'}</p>
          </div>
        </header>

        <div className="p-4 sm:p-8 max-w-6xl mx-auto w-full min-w-0 max-w-full flex flex-col gap-8 box-border">
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="brutalist-card bg-[var(--neo-yellow)] p-6 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-black uppercase tracking-widest text-sm">Current XP</h3>
                <Zap className="w-6 h-6" />
              </div>
              <div className="flex items-end gap-2">
                <span className="text-5xl font-black tracking-tighter">
                  {selectedKid ? (selectedKid.focusXP || 0).toLocaleString() : '0'}
                </span>
                <span className="text-sm font-bold uppercase pb-1">XP</span>
              </div>
              
              {/* Level Progress Bar */}
              <div className="mt-6">
                <div className="flex justify-between text-xs font-black uppercase mb-2">
                  <span>Level {selectedKid?.level || 1}</span>
                  <span>Level {(selectedKid?.level || 1) + 1}</span>
                </div>
                <div className="w-full h-6 border-2 border-pop-maroon bg-white rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[var(--neo-turquoise)] border-r-2 border-pop-maroon" 
                    style={{ width: `${((selectedKid?.focusXP || 0) % 1000) / 10}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="brutalist-card bg-[var(--neo-blue)] p-6 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-black uppercase tracking-widest text-sm">Total Focus Time</h3>
                <Target className="w-6 h-6" />
              </div>
              <div className="flex items-end gap-2">
                <span className="text-5xl font-black tracking-tighter">
                  {selectedKid ? (
                    <>
                      {Math.floor((selectedKid.totalFocusMinutes || 0) / 60)}<span className="text-2xl">h</span> {(selectedKid.totalFocusMinutes || 0) % 60}<span className="text-2xl">m</span>
                    </>
                  ) : (
                    <>0<span className="text-2xl">h</span> 0<span className="text-2xl">m</span></>
                  )}
                </span>
              </div>
              <p className="text-sm font-bold mt-6 opacity-80">
                Lifetime focus minutes accumulated.
              </p>
            </div>
          </div>

          {/* Bottom Grid: Analytics & Web Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Focus Analytics Chart */}
            <div className="brutalist-card bg-white p-6 flex flex-col min-w-0 overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4 shrink-0">
                <h3 className="font-black uppercase tracking-widest text-sm">Focus Analytics (7 Days)</h3>
                <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
                  <span className="flex items-center gap-1"><div className="w-3 h-3 bg-[var(--neo-yellow)] border border-pop-maroon shrink-0" /> Older</span>
                  <span className="flex items-center gap-1"><div className="w-3 h-3 bg-[var(--neo-turquoise)] border border-pop-maroon shrink-0" /> Last 3 Days</span>
                </div>
              </div>
              
              <div className="w-full h-[280px] sm:h-[300px] shrink-0" aria-label="Focus minutes per day chart">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={MOCK_WEEKLY_DATA} margin={{ top: 12, right: 8, left: 4, bottom: 8 }} barCategoryGap="18%">
                    <XAxis 
                      dataKey="day" 
                      axisLine={{ stroke: '#4B2927', strokeWidth: 2 }} 
                      tickLine={false} 
                      tick={{ fill: '#4B2927', fontWeight: 900, fontSize: 12, textTransform: 'uppercase' }} 
                      interval={0}
                      dy={8}
                    />
                    <YAxis 
                      width={44}
                      axisLine={{ stroke: '#4B2927', strokeWidth: 2 }} 
                      tickLine={false} 
                      tick={{ fill: '#4B2927', fontWeight: 900, fontSize: 11 }} 
                      domain={[0, 'dataMax']}
                      padding={{ top: 24 }}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f1f5f9' }} />
                    <Bar dataKey="minutes" radius={[4, 4, 0, 0]} stroke="#4B2927" strokeWidth={2} maxBarSize={56}>
                      {MOCK_WEEKLY_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.isRecent ? 'var(--neo-turquoise)' : 'var(--neo-yellow)'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Web Activity Log */}
            <div className="brutalist-card bg-white p-0 flex flex-col min-w-0 overflow-hidden relative z-10">
              <div className="flex items-center justify-between border-b-2 border-pop-maroon bg-pop-mustard/55 p-6">
                <h3 className="font-black uppercase tracking-widest text-sm flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5" /> Recent Web Activity
                </h3>
                
                <div className="relative">
                  <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 text-xs font-bold bg-white px-3 py-1.5 rounded border-2 border-pop-maroon shadow-pop hover:bg-[var(--neo-yellow)] transition-colors"
                  >
                    {activeFilter} <ChevronDown className="w-3 h-3" />
                  </button>
                  
                  {isDropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-40 bg-white border-2 border-pop-maroon shadow-pop rounded overflow-hidden z-50">
                      {FILTER_OPTIONS.map(option => (
                        <button
                          key={option}
                          onClick={() => {
                            setActiveFilter(option);
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 border-pop-maroon last:border-b-0 transition-colors ${activeFilter === option ? 'bg-[var(--neo-yellow)]' : 'hover:bg-[var(--neo-turquoise)]'}`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex-1 min-h-[200px] max-h-[min(420px,50vh)] overflow-y-auto overflow-x-hidden bg-white">
                <table className="w-full min-w-0 table-fixed text-left border-collapse relative z-0">
                  <colgroup>
                    <col className="w-[45%]" />
                    <col className="w-[35%]" />
                    <col className="w-[20%]" />
                  </colgroup>
                  <thead>
                    <tr className="bg-[var(--neo-yellow)] border-b-2 border-pop-maroon">
                      <th className="px-3 sm:px-4 py-3 text-xs font-black uppercase tracking-widest border-r-2 border-pop-maroon align-top">Site</th>
                      <th className="px-3 sm:px-4 py-3 text-xs font-black uppercase tracking-widest border-r-2 border-pop-maroon align-top">Time</th>
                      <th className="px-3 sm:px-4 py-3 text-xs font-black uppercase tracking-widest align-top">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoadingActivity && (
                      <tr>
                        <td colSpan={3} className="px-6 py-8 text-center text-sm font-bold text-pop-maroon/55">
                          <Loader2 className="w-6 h-6 animate-spin mx-auto text-pop-maroon" />
                        </td>
                      </tr>
                    )}
                    {!isLoadingActivity && activityError && (
                      <tr>
                        <td colSpan={3} className="px-6 py-8">
                          <div className="p-3 rounded-xl text-sm font-bold bg-[var(--neo-yellow)] text-pop-maroon border-2 border-pop-maroon shadow-pop text-center">
                            ⚠️ {activityError}
                          </div>
                        </td>
                      </tr>
                    )}
                    {!isLoadingActivity && !activityError && mappedWebActivity.map((activity, index) => {
                      const isBlocked = activity.status === 'Blocked';
                      const { label: siteLabel, full: siteFull } = formatSiteLabel(activity.domain);
                      return (
                        <tr key={activity.id} className={`${index !== mappedWebActivity.length - 1 ? 'border-b border-pop-maroon/15' : ''} hover:bg-[var(--neo-yellow)]/40 transition-colors`}>
                          <td className="px-3 sm:px-4 py-3 font-bold border-r-2 border-pop-maroon align-top min-w-0">
                            <span className="block break-words [overflow-wrap:anywhere] text-sm leading-snug" title={siteFull || siteLabel}>
                              {siteLabel}
                            </span>
                          </td>
                          <td className="px-3 sm:px-4 py-3 text-sm font-bold text-pop-maroon/70 border-r-2 border-pop-maroon align-top min-w-0">
                            <div className="flex items-start gap-1.5 min-w-0">
                              <Clock className="w-3 h-3 shrink-0 mt-0.5" />
                              <span className="break-words [overflow-wrap:anywhere] leading-snug">{activity.timestamp}</span>
                            </div>
                          </td>
                          <td className="px-3 sm:px-4 py-3 align-top min-w-0">
                            <span className={`inline-flex flex-wrap items-center gap-1 px-2 py-1 text-[10px] sm:text-xs font-black uppercase tracking-wider rounded-full border-2 border-pop-maroon shadow-pop max-w-full ${isBlocked ? 'bg-zen-terracotta text-pop-white' : 'bg-[var(--neo-turquoise)] text-pop-maroon'}`}>
                              {isBlocked ? <XCircle className="w-3 h-3 shrink-0" /> : <CheckCircle className="w-3 h-3 shrink-0" />}
                              {activity.status}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                    {!isLoadingActivity && !activityError && mappedWebActivity.length === 0 && (
                      <tr>
                        <td colSpan={3} className="px-6 py-8 text-center text-sm font-bold text-pop-maroon/55">
                          No activity found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* Distraction Frequency Card */}
          <div className="box-border flex w-full min-w-0 max-w-full flex-col gap-6 rounded-3xl border-[3px] border-pop-maroon bg-pop-mustard/45 p-6 shadow-pop-md transition-all duration-200 ease-in-out hover:-translate-y-1 hover:shadow-pop-hover md:p-8 lg:flex-row lg:gap-8">
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <div className="flex items-start gap-3 mb-6 min-w-0">
                <AlertTriangle className="w-8 h-8 text-zen-terracotta stroke-[3px] shrink-0" />
                <h2 className="text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-tight text-pop-maroon m-0 leading-tight break-words">Distraction Counter</h2>
              </div>
              <div className="flex flex-col gap-2 mt-auto">
                <p className="text-sm md:text-base font-black uppercase tracking-widest text-pop-maroon opacity-90">Attempts Today</p>
                <span className="text-6xl sm:text-7xl md:text-8xl font-black tracking-tighter text-pop-maroon leading-none drop-shadow-[2px_2px_0px_rgba(253,251,247,0.9)] tabular-nums">{totalAttempts}</span>
              </div>
            </div>
            
            <div className="flex-1 min-w-0 max-w-full bg-white p-4 sm:p-6 border-[3px] border-pop-maroon shadow-pop flex flex-col justify-center overflow-hidden">
              <h3 className="text-base font-black uppercase tracking-widest text-pop-maroon mb-4 border-b-[3px] border-pop-maroon pb-3 shrink-0">Top Visited Blocked Sites</h3>
              <div className="flex flex-col gap-4 min-w-0">
                {isLoadingActivity ? (
                   <Loader2 className="w-6 h-6 animate-spin text-pop-maroon mx-auto" />
                ) : activityError ? (
                   <p className="text-sm font-bold text-pop-maroon bg-zen-terracotta/25 p-2 border-2 border-pop-maroon break-words">⚠️ {activityError}</p>
                ) : topSites.length === 0 ? (
                   <p className="text-sm font-bold text-pop-maroon/55 text-center">No blocked sites visited.</p>
                ) : (
                  topSites.map((site, idx) => {
                    const { label: siteLabel, full: siteFull } = formatSiteLabel(site.domain);
                    return (
                      <div key={idx} className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 border-b-2 border-dashed border-pop-maroon/25 pb-3 last:border-b-0 last:pb-0 min-w-0">
                        <span className="font-black text-pop-maroon uppercase tracking-wide text-xs sm:text-sm min-w-0 flex-1 break-words [overflow-wrap:anywhere]" title={siteFull || siteLabel}>
                          {siteLabel}
                        </span>
                        <span className="bg-[var(--neo-yellow)] text-pop-maroon font-black text-xs sm:text-sm px-2 sm:px-3 py-1 border-[3px] border-pop-maroon shadow-pop shrink-0 self-start whitespace-nowrap">
                          {site.count} TIMES
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
