import React, { useState, useEffect, useCallback } from 'react';
import { Trophy, Crown, Timer, Zap, Search, Users } from 'lucide-react';
import { useAppContext } from '../AppContext';
import { squads, SquadMemberStat } from '../services/api';
import Skeleton from './Skeleton';

export default function Leaderboard() {
  const { squadId, squadInfo } = useAppContext();
  const [leaderboard, setLeaderboard] = useState<SquadMemberStat[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingLeaderboard, setIsFetchingLeaderboard] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = useCallback(async (silent = false) => {
    if (!squadId) return;
    if (!silent) setIsFetchingLeaderboard(true);
    try {
      const res = await squads.getLeaderboard(squadId);
      setLeaderboard(res.leaderboard);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch leaderboard:', err);
      setError('Squad not found or session expired.');
    } finally {
      if (!silent) setIsFetchingLeaderboard(false);
    }
  }, [squadId]);

  useEffect(() => {
    fetchLeaderboard();
    if (!squadId) return;

    const intervalId = setInterval(() => {
      fetchLeaderboard(true);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [fetchLeaderboard, squadId]);

  if (isLoading && !squadId) {
    return (
      <div className="flex-1 px-4 md:px-10 py-6 md:py-10 flex flex-col gap-10 max-w-5xl mx-auto w-full">
        <Skeleton height="200px" />
        <Skeleton height="400px" />
      </div>
    );
  }

  if (!squadId) {
    return (
      <div className="flex-1 px-4 md:px-10 py-6 md:py-10 flex flex-col gap-10 max-w-5xl mx-auto w-full">
        <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase">
          Live <span className="text-violet-500">Leaderboard</span>
        </h2>
        <div className="brutalist-card bg-white p-12 text-center flex flex-col items-center gap-6">
          <Trophy className="w-16 h-16 text-slate-300" />
          <h3 className="text-3xl font-black uppercase">No Active Squad</h3>
          <p className="font-bold text-slate-500 uppercase text-sm max-w-md">
            You are not part of any squad. Visit the <span className="text-pink-500">Squad Sync</span> tab to create or join one.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 px-4 md:px-10 py-6 md:py-10 flex flex-col gap-10 max-w-5xl mx-auto w-full">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase">
          Live <span className="text-violet-500">Leaderboard</span>
        </h2>
        <div className="bg-teal-400 border-2 border-[#111827] px-6 py-2 rounded-full shadow-[4px_4px_0px_#111827] font-black uppercase text-sm">
          Live Sync Active
        </div>
      </div>

      <div className="flex flex-col gap-8">
        {/* SQUAD INFO BAR */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="brutalist-card bg-white flex-1 p-6 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Active Squad</p>
              <h3 className="text-2xl font-black uppercase tracking-tighter">{squadInfo?.name || 'Loading...'}</h3>
            </div>
            <div className="w-12 h-12 bg-violet-100 border-2 border-[#111827] rounded-full flex items-center justify-center shadow-[3px_3px_0px_#111827]">
              <Users className="w-6 h-6" />
            </div>
          </div>

          <div className="brutalist-card bg-yellow-300 p-6 flex items-center gap-6">
            <div>
              <p className="text-[10px] font-black uppercase text-black/40 mb-1">Infiltration Code</p>
              <div className="flex items-center gap-3">
                <span className="text-3xl font-black tracking-[0.2em]">{squadInfo?.code || '-----'}</span>
                <button 
                  onClick={() => {
                    if (squadInfo?.code) {
                      navigator.clipboard.writeText(squadInfo.code);
                      alert('Squad code copied to clipboard!');
                    }
                  }}
                  className="p-2 bg-black text-white rounded-lg hover:scale-110 transition-transform active:scale-95"
                  title="Copy Code"
                >
                  <Search className="w-4 h-4" /> 
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* LEADERBOARD TABLE */}
        <div className="brutalist-card bg-white overflow-hidden">
          <div className="bg-[#111827] p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Trophy className="w-6 h-6 text-yellow-400" />
              <h3 className="text-white text-xl font-black uppercase tracking-widest">Squad Rankings</h3>
            </div>
            <span className="text-white/40 font-black text-[10px] uppercase tracking-widest">
              Auto-Refreshing every 5s
            </span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-4 border-[#111827] bg-slate-50">
                  <th className="p-6 text-left font-black uppercase text-xs tracking-widest text-slate-500">Rank</th>
                  <th className="p-6 text-left font-black uppercase text-xs tracking-widest text-slate-500">Warrior</th>
                  <th className="p-6 text-center font-black uppercase text-xs tracking-widest text-slate-500">Focus XP</th>
                  <th className="p-6 text-center font-black uppercase text-xs tracking-widest text-slate-500">Total Focus</th>
                  <th className="p-6 text-right font-black uppercase text-xs tracking-widest text-slate-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-slate-100">
                {leaderboard.map((member, index) => {
                  const isTop = index === 0;
                  return (
                    <tr 
                      key={member.memberId}
                      className={`transition-colors hover:bg-slate-50 ${isTop ? 'bg-yellow-50/50' : ''}`}
                    >
                      <td className="p-6">
                        <div className="flex items-center justify-center w-10 h-10 bg-white border-2 border-[#111827] rounded-lg font-black shadow-[2px_2px_0px_#111827]">
                          {index + 1}
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-full border-2 border-[#111827] flex items-center justify-center font-black text-lg shadow-[3px_3px_0px_#111827] ${isTop ? 'bg-yellow-300' : 'bg-slate-200'}`}>
                            {isTop ? <Crown className="w-6 h-6" /> : member.username[0].toUpperCase()}
                          </div>
                          <span className="font-black text-lg uppercase">{member.username}</span>
                        </div>
                      </td>
                      <td className="p-6 text-center">
                        <div className="inline-flex items-center gap-2 bg-yellow-100 px-4 py-2 border-2 border-[#111827] rounded-xl">
                          <Zap className="w-4 h-4 text-yellow-600 fill-yellow-600" />
                          <span className="font-black text-xl">{Math.floor(member.focusXP).toLocaleString()}</span>
                        </div>
                      </td>
                      <td className="p-6 text-center">
                        <div className="inline-flex items-center gap-2 bg-blue-100 px-4 py-2 border-2 border-[#111827] rounded-xl">
                          <Timer className="w-4 h-4 text-blue-600" />
                          <span className="font-black text-xl">{member.totalFocusMinutes}m</span>
                        </div>
                      </td>
                      <td className="p-6 text-right">
                        {member.isLive ? (
                          <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full border-2 border-green-700 font-black text-xs uppercase tracking-widest animate-pulse">
                            <div className="w-2 h-2 rounded-full bg-green-700" />
                            Live Now
                          </span>
                        ) : (
                          <span className="text-slate-400 font-black text-[10px] uppercase tracking-widest">
                            Resting
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {error && (
        <div className="brutalist-card bg-red-100 border-red-500 p-4 flex items-center gap-3">
          <div className="bg-red-500 text-white p-1 rounded-full">
            <Search className="w-4 h-4" />
          </div>
          <p className="text-red-700 font-bold uppercase text-xs">{error}</p>
        </div>
      )}
    </div>
  );
}
