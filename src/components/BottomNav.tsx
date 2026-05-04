import React from 'react';
import { LayoutDashboard, Trophy, Users, User } from 'lucide-react';

export type BottomNavView = 'dashboard' | 'squad' | 'leaderboard' | 'profile';

interface BottomNavProps {
  currentView: BottomNavView;
  setCurrentView: (view: BottomNavView) => void;
}

export default function BottomNav({ currentView, setCurrentView }: BottomNavProps) {
  const item = (
    view: BottomNavView,
    label: string,
    Icon: typeof LayoutDashboard,
    isActive: boolean,
  ) => (
    <button
      key={view}
      type="button"
      onClick={() => setCurrentView(view)}
      className={`flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 border-r-2 border-pop-maroon py-3 transition-all duration-200 ease-in-out last:border-r-0 ${
        isActive
          ? 'bg-pop-maroon text-pop-white'
          : 'bg-pop-mustard/90 text-pop-maroon hover:-translate-y-0.5 hover:bg-pop-mustard'
      }`}
    >
      <Icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-pop-white' : 'text-pop-maroon'}`} strokeWidth={2.25} />
      <span
        className={`max-w-full truncate px-0.5 font-display text-[9px] font-bold uppercase tracking-tight ${
          isActive ? 'text-pop-white' : 'text-pop-maroon'
        }`}
      >
        {label}
      </span>
    </button>
  );

  return (
    <nav
      className="fixed bottom-3 left-3 right-3 z-40 overflow-hidden rounded-full border-2 border-pop-maroon bg-pop-mustard shadow-pop-md sm:bottom-5 sm:left-5 sm:right-5"
      style={{ paddingBottom: 'max(8px, env(safe-area-inset-bottom))' }}
      aria-label="Primary navigation"
    >
      <div className="flex w-full">
        {item('dashboard', 'Home', LayoutDashboard, currentView === 'dashboard')}
        {item('squad', 'Squad', Users, currentView === 'squad')}
        {item('leaderboard', 'Board', Trophy, currentView === 'leaderboard')}
        {item('profile', 'Profile', User, currentView === 'profile')}
      </div>
    </nav>
  );
}
