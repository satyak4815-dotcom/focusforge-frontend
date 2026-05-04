import axios from 'axios';
import { API_BASE_URL as BASE_URL } from '../config';

// --- INTERFACES ---

export interface UserProfile {
  _id: string;
  username: string;
  email: string;
  focusXP: number;
  level: number;
  currentStreak: number;
  hardModeEnabled: boolean;
  squadId: string | null;
  distractionsBlocked: number;
  blockedSites: string[];
  /** Raw website visit log — shape varies by backend; kid dashboard aggregates for charts. */
  visitedWebsite?: unknown[];
  visitedWebsites?: unknown[];
  websiteVisits?: unknown[];
  visited_websites?: unknown[];
}

/** Pull `visitedWebsites` (and aliases) from a user/profile JSON blob — supports nested `user` / `profile`. */
function extractVisitedWebsitesFromUserDoc(doc: unknown): unknown[] {
  if (!doc || typeof doc !== 'object') return [];
  const root = doc as Record<string, unknown>;
  const nestedObjects: Record<string, unknown>[] = [root];
  for (const key of ['user', 'profile', 'data'] as const) {
    const inner = root[key];
    if (inner && typeof inner === 'object' && !Array.isArray(inner)) {
      nestedObjects.push(inner as Record<string, unknown>);
    }
  }

  const arrayKeys = [
    'visitedWebsites',
    'visitedWebsite',
    'websiteVisits',
    'visited_websites',
    'visited_website',
    'website_visits',
  ];

  for (const obj of nestedObjects) {
    for (const k of arrayKeys) {
      const v = obj[k];
      if (Array.isArray(v) && v.length > 0) return v;
    }
  }
  for (const obj of nestedObjects) {
    for (const k of arrayKeys) {
      const v = obj[k];
      if (Array.isArray(v)) return v;
    }
  }
  return [];
}

function normalizeVisitedWebsitesPayload(data: unknown): unknown[] {
  if (Array.isArray(data)) return data;
  if (data && typeof data === 'object') {
    const o = data as Record<string, unknown>;
    for (const k of ['visitedWebsites', 'visitedWebsite', 'websiteVisits', 'items', 'data']) {
      const v = o[k];
      if (Array.isArray(v)) return v;
    }
  }
  return [];
}

export interface UserStats {
  totalFocusMinutes: number;
  distractionsBlocked: number;
  focusXP: number;
  currentStreak: number;
  level: number;
}

export interface AuthResponse {
  token: string;
  user: UserProfile;
}

export interface Session {
  _id: string;
  userId: string;
  startTime: string;
  endTime?: string;
  status: 'active' | 'completed' | 'failed';
  xpYield: number;
}

export interface SessionHistoryResponse {
  sessions: Session[];
}

export interface Squad {
  _id: string;
  name: string;
  owner: string;
  members: string[];
  joinCode?: string;
}

export interface SquadMemberStat {
  memberId: string;
  username: string;
  focusXP: number;
  isLive: boolean;
  totalFocusMinutes: number;
}

// --- AXIOS CONFIGURATION ---
// Single axios instance used by all feature modules.
// Keeps base URL, auth token handling, and error behavior centralized.

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  // Attach JWT from localStorage on every request so protected routes work.
  const token = localStorage.getItem('focusforge_token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use((response) => response, (error) => {
  // When token is invalid/expired, emit a global event so AppContext can logout.
  if (error.response && (error.response.status === 401 || error.response.status === 403)) {
    window.dispatchEvent(new Event('focusforge_unauthorized'));
    return Promise.reject(new Error('Session expired. Please log in again.'));
  }

  // Normalize backend/network errors into readable messages for UI to display.
  let errorMessage = error.response?.data?.message || error.message || 'An unknown error occurred';
  return Promise.reject(new Error(errorMessage));
});

// --- API SERVICES ---

export const auth = {
  // Kid account signup.
  register: (username: string, email: string, password: string) =>
    api.post<AuthResponse>('/auth/register', { username, email, password }).then(res => res.data),

  // Shared login route used by both kid and parent.
  login: (identifier: string, password: string) =>
    api.post<AuthResponse>('/auth/login', { identifier, password }).then(res => res.data),

  // Parent-specific signup route.
  registerParent: (username: string, email: string, password: string) =>
    api.post<AuthResponse>('/parents/register', { username, email, password })
      .then(res => res.data)
      .catch(err => {
        throw new Error(err.message || 'Parent registration failed. Please try again.');
      }),
};

export const parents = {
  // Link an existing kid user to the current parent account.
  linkChild: (username: string) =>
    api.post('/parents/link-child', { username }).then(res => res.data),

  // Fetch children linked to the logged-in parent for dashboard rendering.
  getLinkedChildren: () =>
    api.get<any[]>('/parents/linked-children')
      .then(res => res.data)
      .catch((err: Error) => {
        // If route is unavailable in older backend versions, return empty list
        // so parent dashboard can render without a hard crash.
        if (err.message.includes('404')) return [];
        throw err;
      }),

  // Compatibility endpoint for child web activity on older backend designs.
  getChildActivity: (kidId: string) =>
    api.get(`/parents/child-activity?kidId=${kidId}`).then(res => res.data),
};

export const user = {
  // Main kid profile payload used for username, XP, level, squad, blocklist.
  getProfile: () =>
    api.get<UserProfile>('/user/profile').then(res => res.data),

  /**
   * Website visit rows for the logged-in kid — reads `visitedWebsites` from the user document
   * via `/user/profile` (including nested shapes), then tries dedicated routes if the array is missing.
   */
  getDashboardVisitedWebsites: async (): Promise<unknown[]> => {
    try {
      const raw = await api.get<Record<string, unknown>>('/user/profile').then((res) => res.data);
      const fromProfile = extractVisitedWebsitesFromUserDoc(raw);
      if (fromProfile.length > 0) return fromProfile;
    } catch {
      /* continue to fallbacks */
    }
    for (const path of ['/user/visited-websites', '/user/visitedWebsites']) {
      try {
        const data = await api.get<unknown>(path).then((res) => res.data);
        const arr = normalizeVisitedWebsitesPayload(data);
        if (arr.length > 0) return arr;
      } catch {
        /* try next path */
      }
    }
    return [];
  },

  // Numerical stats payload used for dashboard metrics.
  getStats: () =>
    api.get<UserStats>('/user/stats').then(res => res.data),

  // Increment XP (used by periodic sync while session is active).
  addXP: (xpDelta: number) =>
    api.post<{ message: string; currentXP: number; level: number; xpToNextLevel: number }>('/user/add-xp', { xpDelta }).then(res => res.data),
};

export interface SessionEndResponse {
  message: string;
  focusXP: number;
  level: number;
  currentStreak: number;
}

export const sessions = {
  // Start a focus session and receive session metadata.
  start: (domain?: string, durationMins?: number, hardMode?: boolean) =>
    api.post<Session>('/sessions/start', { domain, durationMins, hardMode }).then(res => res.data),

  // Complete a session and return updated progress values.
  end: (sessionId: string) =>
    api.patch<SessionEndResponse>(`/sessions/${sessionId}/end`).then(res => res.data),

  // Mark session as failed (distraction/exit in hard mode).
  fail: (sessionId: string) =>
    api.patch<{ message: string; xpReverted: number }>(`/sessions/${sessionId}/fail`).then(res => res.data),

  // Load historical sessions for reports/timelines.
  getHistory: () =>
    api.get<SessionHistoryResponse>('/sessions/history').then(res => res.data),
};

export const squads = {
  // Create a new squad owned by current user.
  create: (name: string) =>
    api.post<Squad>('/squads/create', { name }).then(res => res.data),

  // Join an existing squad using invite/join code.
  join: (joinCode: string) =>
    api.post<Squad>(`/squads/join`, { joinCode }).then(res => res.data),

  // Get leaderboard and squad identity details.
  getLeaderboard: (squadId: string) =>
    api.get<{ leaderboard: SquadMemberStat[]; squadName: string; joinCode: string }>(`/squads/${squadId}/leaderboard`).then(res => res.data),

  // Broadcast whether the user is actively focusing.
  updateLiveStatus: (isLive: boolean) =>
    api.patch<{ success: boolean }>(`/squads/live-status`, { isLive }).then(res => res.data),
};

export const blocklist = {
  // Fetch current blocked domains for active user.
  get: () =>
    api.get<{ blockedSites: string[] }>('/blocklist').then(res => res.data),

  // Add a domain to backend blocklist.
  add: (domain: string) =>
    api.post<{ message: string; blockedSites: string[] }>('/blocklist/add', { domain }).then(res => res.data),

  // Remove a domain from backend blocklist.
  remove: (domain: string) =>
    api.request<{ message: string; blockedSites: string[] }>({ url: '/blocklist/remove', method: 'DELETE', data: { domain } }).then(res => res.data),
};
