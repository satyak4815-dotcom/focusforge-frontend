import React, { createContext, useContext, useState, useRef, ReactNode, useEffect, useCallback } from 'react';
import { UserProfile, user, sessions, squads } from './services/api';

interface DashboardMetrics {
  focusHours: number;
  distractionsBlocked: number;
  xpEarned: number;
  nextRewardGoal: number;
  streakDays: number;
  level: number;
}

interface AppContextType {
  username: string;
  setUsername: (name: string) => void;
  metrics: DashboardMetrics;
  setMetrics: React.Dispatch<React.SetStateAction<DashboardMetrics>>;
  isAuthenticated: boolean;
  login: (token: string, userObj: UserProfile) => void;
  logout: () => void;
  isLoadingProfile: boolean;
  profileError: string | null;
  activeSessionId: string | null;
  sessionStartTime: number | null;
  isSessionActive: boolean;
  startSession: () => Promise<void>;
  endSession: () => Promise<void>;
  failSession: () => Promise<void>;
  baseXP: number;
  squadId: string | null;
  setSquadId: (id: string | null) => void;
  squadInfo: { name: string; code: string } | null;
  setSquadInfo: (info: { name: string; code: string } | null) => void;
  fetchUserProfile: () => Promise<void>;
  blockedSites: string[];
  addBlockedSite: (domain: string) => Promise<void>;
  removeBlockedSite: (domain: string) => Promise<void>;
}

const defaultMetrics: DashboardMetrics = {
  focusHours: 0,
  distractionsBlocked: 0,
  xpEarned: 0,
  nextRewardGoal: 3000,
  streakDays: 0,
  level: 1,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [username, setUsername] = useState<string>('');
  const [metrics, setMetrics] = useState<DashboardMetrics>(defaultMetrics);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState<boolean>(true);
  const [profileError, setProfileError] = useState<string | null>(null);
  
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [isSessionActive, setIsSessionActive] = useState<boolean>(false);
  const [baseXP, setBaseXP] = useState<number>(0);
  const [squadId, _setSquadId] = useState<string | null>(localStorage.getItem('focusforge_squad_id'));
  const [squadInfo, _setSquadInfo] = useState<{ name: string; code: string } | null>(
    JSON.parse(localStorage.getItem('focusforge_squad_info') || 'null')
  );
  const [blockedSites, setBlockedSites] = useState<string[]>([]);

  // Helpers to keep localStorage in sync
  const setSquadId = useCallback((id: string | null) => {
    _setSquadId(id);
    if (id) localStorage.setItem('focusforge_squad_id', id);
    else localStorage.removeItem('focusforge_squad_id');
  }, []);

  const setSquadInfo = useCallback((info: { name: string; code: string } | null) => {
    _setSquadInfo(info);
    if (info) localStorage.setItem('focusforge_squad_info', JSON.stringify(info));
    else localStorage.removeItem('focusforge_squad_info');
  }, []);

  // Refs so fetchUserProfile can read current values without being re-created
  const squadIdRef = useRef(squadId);
  const squadInfoRef = useRef(squadInfo);
  useEffect(() => { squadIdRef.current = squadId; }, [squadId]);
  useEffect(() => { squadInfoRef.current = squadInfo; }, [squadInfo]);

  const logout = useCallback(() => {
    localStorage.removeItem('focusforge_token');
    localStorage.removeItem('focusforge_user');
    localStorage.removeItem('focusforge_squad_id');
    localStorage.removeItem('focusforge_squad_info');
    localStorage.removeItem('focusforge_view');
    setIsAuthenticated(false);
    setUsername('');
    setMetrics(defaultMetrics);
    setIsSessionActive(false);
    setActiveSessionId(null);
    setSessionStartTime(null);
    setIsLoadingProfile(false);
    setSquadId(null);
    setSquadInfo(null);
    setBlockedSites([]);
  }, [setSquadId, setSquadInfo]);

  // 1. Global 401 Handler
  useEffect(() => {
    const handleUnauthorized = () => logout();
    window.addEventListener('focusforge_unauthorized', handleUnauthorized);
    return () => window.removeEventListener('focusforge_unauthorized', handleUnauthorized);
  }, [logout]);

  // 2. Fetch Profile when authenticated
  // Uses refs so the function is STABLE (no squadId/squadInfo deps) — prevents
  // polling from restarting every time squad state changes, which caused the
  // "flickering revert" race condition on squad creation.
  const fetchUserProfile = useCallback(async (silent = false) => {
    if (!silent) setIsLoadingProfile(true);
    setProfileError(null);
    try {
      const [profileRes, statsRes] = await Promise.all([
        user.getProfile(),
        user.getStats(),
      ]);

      setUsername(profileRes.username);

      const currentSquadId = squadIdRef.current;
      const currentSquadInfo = squadInfoRef.current;

      if (profileRes.squadId) {
        // Backend has a squadId for this user
        setSquadId(profileRes.squadId);
        // Only fetch squad info if we don't have it yet or it changed
        if (!currentSquadInfo || profileRes.squadId !== currentSquadId) {
          try {
            const res = await squads.getLeaderboard(profileRes.squadId);
            setSquadInfo({ name: res.squadName, code: res.joinCode });
          } catch (e) {
            console.error('Failed to fetch squad info in background', e);
          }
        }
      } else {
        // Backend says no squad — but ONLY clear local state if we don't
        // have locally-set squad info (prevents race condition right after creation)
        if (!currentSquadInfo) {
          setSquadId(null);
        }
      }

      setBlockedSites(profileRes.blockedSites || []);

      const totalXP = profileRes.focusXP;
      setBaseXP(totalXP);

      setMetrics({
        focusHours: Number((statsRes.totalFocusMinutes / 60).toFixed(1)),
        distractionsBlocked: statsRes.distractionsBlocked,
        xpEarned: totalXP,
        nextRewardGoal: calculateNextGoal(profileRes.level),
        streakDays: profileRes.currentStreak,
        level: profileRes.level,
      });

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch user profile.';
      if (!silent) setProfileError(message);
    } finally {
      if (!silent) setIsLoadingProfile(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Stable — reads squad state via refs, not closure

  const addBlockedSite = async (domain: string) => {
    try {
      const { blocklist } = await import('./services/api');
      const res = await blocklist.add(domain);
      setBlockedSites(res.blockedSites);
    } catch (err) {
      throw err;
    }
  };

  const removeBlockedSite = async (domain: string) => {
    try {
      const { blocklist } = await import('./services/api');
      const res = await blocklist.remove(domain);
      setBlockedSites(res.blockedSites);
    } catch (err) {
      throw err;
    }
  };


  // 3. Initial Auth Check & Fast Fetch
  useEffect(() => {
    const token = localStorage.getItem('focusforge_token');
    if (token) {
      setIsAuthenticated(true);
      fetchUserProfile(); // Immediate fetch on mount
    } else {
      setIsLoadingProfile(false);
    }
  }, [fetchUserProfile]);

  // 4. Polling for "Quick" Updates (every 5 seconds for "Live Sync" feel)
  useEffect(() => {
    if (!isAuthenticated) return;
    const intervalId = setInterval(() => {
      fetchUserProfile(true); // Silent poll
    }, 5000);
    return () => clearInterval(intervalId);
  }, [isAuthenticated, fetchUserProfile]);

  // 5. Smooth XP Ticking Logic
  useEffect(() => {
    if (!isSessionActive || !sessionStartTime) return;

    const intervalId = setInterval(() => {
      const elapsedTimeMs = Date.now() - sessionStartTime;
      const displayXP = Math.max(0, (elapsedTimeMs / 60000));
      
      setMetrics(prev => ({
        ...prev,
        xpEarned: Math.floor(baseXP + displayXP),
      }));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isSessionActive, sessionStartTime, baseXP]);

  const calculateNextGoal = (level: number) => {
    return level * 1000;
  };

  const login = (token: string, userObj: UserProfile) => {
    localStorage.setItem('focusforge_token', token);
    localStorage.setItem('focusforge_user', JSON.stringify(userObj));
    setIsAuthenticated(true);
    fetchUserProfile(); // Fetch immediately after login
  };

  const startSession = async () => {
    try {
      const res = await sessions.start();
      setActiveSessionId(res._id);
      setSessionStartTime(new Date(res.startTime).getTime());
      setIsSessionActive(true);
      await squads.updateLiveStatus(true);
    } catch (err) {
      throw err instanceof Error ? err : new Error('Start session failed');
    }
  };

  const endSession = async () => {
    if (!activeSessionId) return;
    try {
      const res = await sessions.end(activeSessionId);
      setIsSessionActive(false);
      setActiveSessionId(null);
      setSessionStartTime(null);
      await squads.updateLiveStatus(false);
      
      // Force update metrics with new totals from end-session response
      setBaseXP(res.newTotalXP);
      setMetrics(prev => ({
        ...prev,
        xpEarned: res.newTotalXP,
        level: res.newLevel,
        streakDays: res.currentStreak,
        nextRewardGoal: calculateNextGoal(res.newLevel)
      }));

      await fetchUserProfile(true); // Immediate silent refresh
    } catch (err) {
      throw err instanceof Error ? err : new Error('End session failed');
    }
  };

  const failSession = async () => {
    if (!activeSessionId) return;
    try {
      await sessions.fail(activeSessionId);
      setIsSessionActive(false);
      setActiveSessionId(null);
      setSessionStartTime(null);
      await squads.updateLiveStatus(false);
      await fetchUserProfile(true);
    } catch (err) {
      throw err instanceof Error ? err : new Error('Fail session failed');
    }
  };

  return (
    <AppContext.Provider value={{ 
      username, setUsername, 
      metrics, setMetrics, 
      isAuthenticated, login, logout,
      isLoadingProfile, profileError,
      activeSessionId, sessionStartTime, isSessionActive,
      startSession, endSession, failSession,
      baseXP,
      squadId, setSquadId,
      squadInfo, setSquadInfo,
      fetchUserProfile,
      blockedSites,
      addBlockedSite,
      removeBlockedSite
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
