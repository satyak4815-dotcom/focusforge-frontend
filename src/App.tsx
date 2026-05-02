import React, { useState } from 'react';
import { Bell, Settings, Flame, User, LogOut } from 'lucide-react';
import Sidebar from './components/Sidebar';
import StatsRow from './components/StatsRow';
import DopamineChart from './components/DopamineChart';
import RewardsStore from './components/RewardsStore';
import Profile from './components/Profile';
import Leaderboard from './components/Leaderboard';
import SquadSync from './components/SquadSync';
import AuthPage from './components/AuthPage';
import { AppProvider, useAppContext } from './AppContext';
import Skeleton from './components/Skeleton';
import SessionHistory from './components/SessionHistory';
import BlockedSitesList from './components/BlockedSitesList';

function Dashboard() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'squad' | 'leaderboard' | 'profile'>(
    (localStorage.getItem('focusforge_view') as any) || 'dashboard'
  );

  const handleSetView = (view: 'dashboard' | 'squad' | 'leaderboard' | 'profile') => {
    setCurrentView(view);
    localStorage.setItem('focusforge_view', view);
  };
  const [showDropdown, setShowDropdown] = useState(false);
  const { username, metrics, logout, isLoadingProfile } = useAppContext();

  return (
    <div style={{ display: 'flex', flexDirection: 'row', minHeight: '100vh' }} className="text-slate-900">

      {/* LEFT COLUMN - Sidebar (Fixed 280px) */}
      <Sidebar currentView={currentView} setCurrentView={handleSetView} />

      {/* RIGHT COLUMN - Main Dashboard (flex: 1) */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh', overflowY: 'auto' }} className="bg-slate-50">
        {/* ===== HEADER ROW ===== */}
        <header style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px 40px',
          backgroundColor: '#fff',
          borderBottom: '2px solid var(--neo-border)',
          position: 'sticky',
          top: 0,
          zIndex: 20,
        }}>
          {/* Left: Greeting */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#22c55e', border: '2px solid var(--neo-border)' }} className="animate-bounce" />
              <span style={{ fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#000' }}>Flow Active</span>
            </div>
            {isLoadingProfile ? (
              <Skeleton width="300px" height="40px" />
            ) : (
              <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#000', letterSpacing: '-0.05em', textTransform: 'uppercase', lineHeight: 1 }}>
                What's up, {username ? username.toUpperCase() : 'WARRIOR'}!
              </h1>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Notification - CIRCLE */}
            <button
              className="brutalist-button"
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                backgroundColor: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                padding: 0,
                flexShrink: 0,
              }}
            >
              <Bell className="w-5 h-5 text-black" />
              <span style={{
                position: 'absolute',
                top: '-6px',
                right: '-6px',
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                backgroundColor: '#ef4444',
                border: '2px solid var(--neo-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                fontWeight: 900,
                color: '#fff',
              }}>
                2
              </span>
            </button>

            {/* Settings - CIRCLE */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="brutalist-button"
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  backgroundColor: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 0,
                  flexShrink: 0,
                }}
              >
                <Settings className="w-5 h-5 text-black" />
              </button>

              {showDropdown && (
                <div className="brutalist-card" style={{
                  position: 'absolute',
                  right: 0,
                  top: '100%',
                  marginTop: '8px',
                  width: '192px',
                  backgroundColor: '#fff',
                  zIndex: 50,
                  borderRadius: '1rem',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                }}>
                  <button
                    onClick={() => { setCurrentView('profile'); setShowDropdown(false); }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 16px',
                      fontSize: '14px',
                      fontWeight: 900,
                      textTransform: 'uppercase',
                      color: '#000',
                      borderBottom: '2px solid var(--neo-border)',
                      background: 'transparent',
                      cursor: 'pointer',
                      textAlign: 'left',
                      border: 'none',
                      borderBottomStyle: 'solid',
                      borderBottomWidth: '2px',
                      borderBottomColor: 'var(--neo-border)',
                    }}
                    className="hover:bg-slate-100 transition-colors"
                  >
                    <User className="w-4 h-4 text-black" /> Profile
                  </button>
                  <button
                    onClick={() => { logout(); setShowDropdown(false); }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 16px',
                      fontSize: '14px',
                      fontWeight: 900,
                      textTransform: 'uppercase',
                      color: '#000',
                      backgroundColor: 'var(--neo-orange)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      border: 'none',
                    }}
                    className="hover:opacity-90 transition-colors"
                  >
                    <LogOut className="w-4 h-4 text-black" /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px', width: '100%' }}>
          {currentView === 'squad' ? (
            <div style={{ marginBottom: '64px' }}>
              <SquadSync />
            </div>
          ) : currentView === 'leaderboard' ? (
            <div style={{ marginBottom: '64px' }}>
              <Leaderboard />
            </div>
          ) : currentView === 'profile' ? (
            <div style={{ marginBottom: '64px' }}>
              <Profile />
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
              {/* ===== 5-DAY STREAK BANNER ===== */}
              <div style={{ width: '100%' }}>
                {/* Streak Banner */}
                <div
                  className="brutalist-card"
                  style={{
                    backgroundColor: 'var(--neo-purple)',
                    padding: '20px 32px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                    width: '100%',
                  }}
                >
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--neo-orange)',
                    border: '2px solid var(--neo-border)',
                    boxShadow: '4px 4px 0px var(--neo-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Flame className="w-7 h-7 fill-white text-white" />
                  </div>
                  <div style={{ flex: 1 }}>
                    {isLoadingProfile ? (
                      <Skeleton width="180px" height="28px" className="mb-2" />
                    ) : (
                      <span style={{ fontWeight: 900, fontSize: '22px', textTransform: 'uppercase', marginRight: '8px', color: '#fff' }}>{metrics.streakDays}-Day Streak!</span>
                    )}
                    <p style={{ color: '#fff', fontWeight: 900, fontSize: '16px' }}>
                      You're in the top <span style={{ fontWeight: 900, fontSize: '18px', color: '#000', backgroundColor: 'var(--neo-yellow)', padding: '0 8px', border: '2px solid var(--neo-border)', borderRadius: '9999px' }}>12%</span> of all users this week.
                    </p>
                  </div>
                </div>
              </div>

              {/* ===== 3-COLUMN STAT GRID ===== */}
              <StatsRow />

              {/* ===== FOCUS VS DOOMSCROLLING CHART (Full Width) ===== */}
              <div style={{ width: '100%' }}>
                <DopamineChart />
              </div>

              {/* ===== SESSION HISTORY & BLOCKLIST ===== */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
                <SessionHistory />
                <BlockedSitesList />
              </div>

              {/* ===== REWARDS STORE ===== */}
              <div style={{ width: '100%' }}>
                <RewardsStore />
              </div>
            </div>
          )}
        </div>

        {/* ===== FOOTER ===== */}
        <footer style={{
          padding: '24px 40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: '#0f172a',
          fontSize: '14px',
          fontWeight: 700,
          borderTop: '2px solid var(--neo-border)',
          backgroundColor: '#fff',
          marginTop: 'auto',
        }}>
          <p style={{ textTransform: 'uppercase' }}>FocusForge v3.0.0</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
            <span style={{ cursor: 'pointer', textTransform: 'uppercase' }} className="hover:underline">Privacy</span>
            <span style={{ cursor: 'pointer', textTransform: 'uppercase' }} className="hover:underline">Terms</span>
            <span style={{ cursor: 'pointer', textTransform: 'uppercase' }} className="hover:underline">Help</span>
          </div>
        </footer>
      </main>
    </div>
  );
}

function MainApp() {
  const { isAuthenticated, isLoadingProfile } = useAppContext();

  if (isLoadingProfile && !isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F9FAFB' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '48px', height: '48px', border: '4px solid #111827', borderTopColor: '#FCD34D', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '14px' }}>Loading...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <Dashboard /> : <AuthPage />;
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
