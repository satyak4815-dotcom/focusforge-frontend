import React, { useState } from 'react';
import { Bell, Settings, User, LogOut } from 'lucide-react';
import BottomNav from './components/BottomNav';
import Profile from './components/Profile';
import Leaderboard from './components/Leaderboard';
import SquadSync from './components/SquadSync';
import AuthPage from './components/AuthPage';
import ParentDashboard from './components/ParentDashboard';
import { AppProvider, useAppContext } from './AppContext';
import Skeleton from './components/Skeleton';
import NeoBrutalistStatCards from './components/NeoBrutalistStatCards';
import DashboardInteractiveLists from './components/DashboardInteractiveLists';

function Dashboard() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'squad' | 'leaderboard' | 'profile'>(
    (localStorage.getItem('focusforge_view') as any) || 'dashboard'
  );

  const handleSetView = (view: 'dashboard' | 'squad' | 'leaderboard' | 'profile') => {
    setCurrentView(view);
    localStorage.setItem('focusforge_view', view);
  };
  const [showDropdown, setShowDropdown] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showBlocklist, setShowBlocklist] = useState(false);
  const { username, logout, isLoadingProfile } = useAppContext();

  const toggleHistory = () => {
    setShowHistory((prev) => {
      const next = !prev;
      if (next) setShowBlocklist(false);
      return next;
    });
  };

  const toggleBlocklist = () => {
    setShowBlocklist((prev) => {
      const next = !prev;
      if (next) setShowHistory(false);
      return next;
    });
  };

  const iconBtn =
    'brutalist-button flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-full border-2 border-pop-maroon bg-pop-white p-0 text-pop-maroon transition-all duration-200 ease-in-out hover:-translate-y-0.5';

  return (
    <div className="flex min-h-dvh w-full min-w-0 flex-col bg-pop-cream px-3 pt-3 pb-[max(5.75rem,calc(env(safe-area-inset-bottom)+5.25rem))] sm:px-5 sm:pt-5 sm:pb-[max(6.25rem,calc(env(safe-area-inset-bottom)+5.75rem))]">
      <main className="neo-brutal-container flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-pop-white text-pop-maroon">
        <header className="sticky top-0 z-30 w-full shrink-0 border-b-4 border-pop-maroon bg-pop-teal text-pop-white">
          <div className="flex w-full flex-col px-4 py-5 sm:px-8 sm:py-6 lg:px-12">
            <div className="flex w-full flex-wrap items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                {isLoadingProfile ? (
                  <Skeleton width="280px" height="36px" className="max-w-full sm:h-11" />
                ) : (
                  <h1 className="font-display truncate text-2xl font-bold uppercase leading-tight tracking-tight text-pop-white sm:text-4xl lg:text-[2.75rem]">
                    What&apos;s up, {username ? username.toUpperCase() : 'WARRIOR'}!
                  </h1>
                )}
                <p className="mt-2 max-w-xl font-sans text-xs font-semibold uppercase tracking-widest text-pop-white/90 sm:text-sm">
                  Stay sharp. Color-block your day.
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-3 sm:gap-4">
                <button type="button" className={`relative ${iconBtn}`} aria-label="Notifications">
                  <Bell className="h-5 w-5" strokeWidth={2.25} />
                  <span className="absolute -right-1 -top-1 flex h-[22px] w-[22px] items-center justify-center rounded-full border-2 border-pop-maroon bg-red-500 text-[10px] font-bold text-pop-white">
                    2
                  </span>
                </button>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowDropdown(!showDropdown)}
                    className={iconBtn}
                    aria-expanded={showDropdown}
                    aria-label="Settings menu"
                  >
                    <Settings className="h-5 w-5" strokeWidth={2.25} />
                  </button>

                  {showDropdown && (
                    <div
                      className="absolute right-0 top-full z-50 mt-2 flex w-52 flex-col overflow-hidden rounded-3xl border-2 border-pop-maroon bg-pop-white shadow-pop-md"
                      role="menu"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setCurrentView('profile');
                          setShowDropdown(false);
                        }}
                        className="flex items-center gap-3 border-b-2 border-pop-maroon px-4 py-3 text-left font-display text-sm font-semibold uppercase tracking-wide text-pop-maroon transition-all duration-200 hover:bg-pop-mustard/30"
                        role="menuitem"
                      >
                        <User className="h-4 w-4 shrink-0" /> Profile
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          logout();
                          setShowDropdown(false);
                        }}
                        className="flex items-center gap-3 bg-pop-mustard px-4 py-3 text-left font-display text-sm font-semibold uppercase tracking-wide text-pop-maroon transition-all duration-200 hover:opacity-95"
                        role="menuitem"
                      >
                        <LogOut className="h-4 w-4 shrink-0" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col bg-pop-cream px-4 py-8 sm:px-8 lg:px-12 xl:px-14 pb-[calc(7.5rem+env(safe-area-inset-bottom))]">
          {currentView === 'squad' ? (
            <div className="mb-16">
              <SquadSync />
            </div>
          ) : currentView === 'leaderboard' ? (
            <div className="mb-16">
              <Leaderboard />
            </div>
          ) : currentView === 'profile' ? (
            <div className="mb-16">
              <Profile />
            </div>
          ) : (
            <div className="flex min-h-0 w-full flex-1 flex-col gap-10">
              <NeoBrutalistStatCards />

              <DashboardInteractiveLists
                showHistory={showHistory}
                showBlocklist={showBlocklist}
                onToggleHistory={toggleHistory}
                onToggleBlocklist={toggleBlocklist}
              />
            </div>
          )}
        </div>

        <footer className="mt-auto flex w-full flex-wrap items-center justify-between gap-x-8 gap-y-3 border-t-4 border-pop-maroon bg-pop-maroon px-4 py-6 font-sans text-sm font-semibold text-pop-white sm:px-8 lg:px-12 xl:px-14 pb-[calc(6.5rem+env(safe-area-inset-bottom))]">
          <p className="font-display uppercase tracking-widest">FocusForge v3.0.0</p>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
            <span className="cursor-pointer uppercase tracking-wide opacity-90 transition-opacity hover:opacity-100">
              Privacy
            </span>
            <span className="cursor-pointer uppercase tracking-wide opacity-90 transition-opacity hover:opacity-100">
              Terms
            </span>
            <span className="cursor-pointer uppercase tracking-wide opacity-90 transition-opacity hover:opacity-100">
              Help
            </span>
          </div>
        </footer>

        <BottomNav currentView={currentView} setCurrentView={handleSetView} />
      </main>
    </div>
  );
}

function MainApp() {
  const { isAuthenticated, isLoadingProfile } = useAppContext();
  const isParentAccount = localStorage.getItem('focusforge_role') === 'parent';

  if (isLoadingProfile && !isAuthenticated) {
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-pop-cream px-4"
        style={{ minHeight: '100vh' }}
      >
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-pop-maroon border-t-pop-teal" />
          <p className="font-display text-sm font-bold uppercase tracking-widest text-pop-maroon">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return isParentAccount ? <ParentDashboard /> : <Dashboard />;
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
