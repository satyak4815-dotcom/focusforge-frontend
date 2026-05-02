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

// --- HELPER FUNCTION ---

async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('focusforge_token');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401 || response.status === 403) {
    window.dispatchEvent(new Event('focusforge_unauthorized'));
    throw new Error('Session expired. Please log in again.');
  }

  if (!response.ok) {
    let errorMessage = `API Error: ${response.status} ${response.statusText}`;
    try {
      const errorData = await response.json();
      if (errorData.message) {
        errorMessage = errorData.message;
      }
    } catch (e) {
      // Ignore JSON parse errors if response is not JSON
    }
    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

// --- API SERVICES ---

export const auth = {
  register: (username: string, email: string, password: string) => 
    apiFetch<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    }),
    
  login: (identifier: string, password: string) => 
    apiFetch<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ identifier, password }),
    }),
};

export const user = {
  getProfile: () => 
    apiFetch<UserProfile>('/user/profile', {
      method: 'GET',
    }),
    
  getStats: () => 
    apiFetch<UserStats>('/user/stats', {
      method: 'GET',
    }),
    
  addXP: (amount: number) => 
    apiFetch<{ success: boolean; newXP: number }>('/user/add-xp', {
      method: 'POST',
      body: JSON.stringify({ amount }),
    }),
};

export interface SessionEndResponse {
  xpEarned: number;
  newTotalXP: number;
  newLevel: number;
  currentStreak: number;
}

export const sessions = {
  start: () => 
    apiFetch<Session>('/sessions/start', {
      method: 'POST',
    }),
    
  end: (sessionId: string) => 
    apiFetch<SessionEndResponse>(`/sessions/${sessionId}/end`, {
      method: 'PATCH',
    }),
    
  fail: (sessionId: string) => 
    apiFetch<{ message: string; xpReverted: number }>(`/sessions/${sessionId}/fail`, {
      method: 'PATCH',
    }),
    
  getHistory: () => 
    apiFetch<SessionHistoryResponse>('/sessions/history', {
      method: 'GET',
    }),
};

export const squads = {
  create: (name: string) => 
    apiFetch<Squad>('/squads/create', {
      method: 'POST',
      body: JSON.stringify({ name }),
    }),
    
  join: (joinCode: string) => 
    apiFetch<Squad>(`/squads/join`, {
      method: 'POST',
      body: JSON.stringify({ joinCode }),
    }),
    
  getLeaderboard: (squadId: string) => 
    apiFetch<{ leaderboard: SquadMemberStat[]; squadName: string; joinCode: string }>(`/squads/${squadId}/leaderboard`, {
      method: 'GET',
    }),
    
  updateLiveStatus: (isLive: boolean) => 
    apiFetch<{ success: boolean }>(`/squads/live-status`, {
      method: 'PATCH',
      body: JSON.stringify({ isLive }),
    }),
};

export const blocklist = {
  get: () => 
    apiFetch<{ blockedSites: string[] }>('/blocklist', {
      method: 'GET',
    }),
    
  add: (domain: string) => 
    apiFetch<{ message: string; blockedSites: string[] }>('/blocklist/add', {
      method: 'POST',
      body: JSON.stringify({ domain }),
    }),
    
  remove: (domain: string) => 
    apiFetch<{ message: string; blockedSites: string[] }>('/blocklist/remove', {
      method: 'DELETE',
      body: JSON.stringify({ domain }),
    }),
};

