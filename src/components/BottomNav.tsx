import React from 'react';
import { LayoutDashboard, Trophy } from 'lucide-react';

interface BottomNavProps {
  currentView: 'dashboard' | 'leaderboard' | 'profile';
  setCurrentView: (view: 'dashboard' | 'leaderboard' | 'profile') => void;
}

export default function BottomNav({ currentView, setCurrentView }: BottomNavProps) {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t-4 border-slate-900 flex">
      <button 
        onClick={() => setCurrentView('dashboard')}
        className={`flex-1 flex flex-col items-center justify-center py-3 gap-1 border-r-4 border-slate-900 ${currentView === 'dashboard' ? 'bg-teal-400 text-slate-900' : 'bg-white text-slate-500 hover:bg-slate-100'}`}
      >
        <LayoutDashboard className={`w-6 h-6 ${currentView === 'dashboard' ? 'fill-slate-900' : ''}`} />
        <span className="text-[10px] font-black uppercase">Dashboard</span>
      </button>
      
      <button 
        onClick={() => setCurrentView('leaderboard')}
        className={`flex-1 flex flex-col items-center justify-center py-3 gap-1 ${currentView === 'leaderboard' ? 'bg-teal-400 text-slate-900' : 'bg-white text-slate-500 hover:bg-slate-100'}`}
      >
        <Trophy className={`w-6 h-6 ${currentView === 'leaderboard' ? 'fill-slate-900' : ''}`} />
        <span className="text-[10px] font-black uppercase">Leaderboard</span>
      </button>
    </div>
  );
}
