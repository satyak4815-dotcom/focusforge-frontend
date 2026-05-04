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

  const fetchLeaderboard = useCallback(
    async (silent = false) => {
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
    },
    [squadId],
  );

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
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-10 px-4 py-6 md:px-10 md:py-10">
        <Skeleton height="200px" />
        <Skeleton height="400px" />
      </div>
    );
  }

  if (!squadId) {
    return (
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-10 px-4 py-6 md:px-10 md:py-10">
        <h2 className="font-display text-3xl font-bold uppercase tracking-tight text-pop-maroon md:text-5xl">
          Live <span className="text-pop-teal">Leaderboard</span>
        </h2>
        <div className="brutalist-card flex flex-col items-center gap-6 bg-pop-mustard/30 p-10 text-center md:p-12">
          <Trophy className="h-16 w-16 text-pop-maroon/35" />
          <h3 className="font-display text-3xl font-bold uppercase text-pop-maroon">No active squad</h3>
          <p className="max-w-md font-sans text-sm font-semibold uppercase tracking-wide text-pop-maroon">
            You are not part of any squad. Open Squad Sync to create or join one.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-10 px-4 py-6 md:px-10 md:py-10">
      <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
        <h2 className="font-display text-3xl font-bold uppercase tracking-tight text-pop-maroon md:text-5xl">
          Live <span className="text-pop-teal">Leaderboard</span>
        </h2>
        <div className="rounded-full border-2 border-pop-maroon bg-pop-teal px-6 py-2 font-display text-sm font-bold uppercase tracking-wide text-pop-white shadow-pop">
          {isFetchingLeaderboard ? 'Syncing…' : 'Live sync active'}
        </div>
      </div>

      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-6 md:flex-row">
          <div className="brutalist-card flex flex-1 items-center justify-between bg-pop-white p-6">
            <div>
              <p className="mb-1 font-display text-[10px] font-bold uppercase tracking-widest text-pop-maroon/55">Active squad</p>
              <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-pop-maroon">
                {squadInfo?.name || 'Loading...'}
              </h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-pop-maroon bg-pop-mustard shadow-pop">
              <Users className="h-6 w-6 text-pop-maroon" />
            </div>
          </div>

          <div className="brutalist-card flex items-center gap-6 bg-pop-mustard/60 p-6">
            <div>
              <p className="mb-1 font-display text-[10px] font-bold uppercase tracking-widest text-pop-maroon/60">Join code</p>
              <div className="flex items-center gap-3">
                <span className="font-display text-3xl font-bold tracking-[0.2em] text-pop-maroon">{squadInfo?.code || '-----'}</span>
                <button
                  type="button"
                  onClick={() => {
                    if (squadInfo?.code) {
                      navigator.clipboard.writeText(squadInfo.code);
                      alert('Squad code copied to clipboard!');
                    }
                  }}
                  className="rounded-full border-2 border-pop-maroon bg-pop-maroon p-2 text-pop-white shadow-pop transition-all duration-200 hover:-translate-y-0.5"
                  title="Copy code"
                >
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="brutalist-card overflow-hidden bg-pop-white">
          <div className="flex items-center justify-between border-b-4 border-pop-maroon bg-pop-maroon p-6">
            <div className="flex items-center gap-3">
              <Trophy className="h-6 w-6 text-pop-mustard" />
              <h3 className="font-display text-xl font-bold uppercase tracking-widest text-pop-white">Squad rankings</h3>
            </div>
            <span className="font-display text-[10px] font-bold uppercase tracking-widest text-pop-white/70">
              Auto-refresh · 5s
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-pop-maroon bg-pop-mustard/50">
                  <th className="p-4 text-left font-display text-xs font-bold uppercase tracking-widest text-pop-maroon/75 md:p-6">
                    Rank
                  </th>
                  <th className="p-4 text-left font-display text-xs font-bold uppercase tracking-widest text-pop-maroon/75 md:p-6">
                    Warrior
                  </th>
                  <th className="p-4 text-center font-display text-xs font-bold uppercase tracking-widest text-pop-maroon/75 md:p-6">
                    Focus XP
                  </th>
                  <th className="p-4 text-center font-display text-xs font-bold uppercase tracking-widest text-pop-maroon/75 md:p-6">
                    Total focus
                  </th>
                  <th className="p-4 text-right font-display text-xs font-bold uppercase tracking-widest text-pop-maroon/75 md:p-6">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-pop-maroon/15">
                {leaderboard.map((member, index) => {
                  const isTop = index === 0;
                  return (
                    <tr
                      key={member.memberId}
                      className={`transition-colors duration-200 hover:bg-pop-mustard/25 ${isTop ? 'bg-pop-teal/10' : ''}`}
                    >
                      <td className="p-4 md:p-6">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-pop-maroon bg-pop-white font-display font-bold text-pop-maroon shadow-pop">
                          {index + 1}
                        </div>
                      </td>
                      <td className="p-4 md:p-6">
                        <div className="flex items-center gap-4">
                          <div
                            className={`flex h-12 w-12 items-center justify-center rounded-full border-2 border-pop-maroon font-display text-lg font-bold text-pop-maroon shadow-pop ${
                              isTop ? 'bg-pop-mustard' : 'bg-pop-cream'
                            }`}
                          >
                            {isTop ? <Crown className="h-6 w-6" /> : member.username[0].toUpperCase()}
                          </div>
                          <span className="font-display text-lg font-bold uppercase text-pop-maroon">{member.username}</span>
                        </div>
                      </td>
                      <td className="p-4 text-center md:p-6">
                        <div className="inline-flex items-center gap-2 rounded-2xl border-2 border-pop-maroon bg-pop-mustard/40 px-4 py-2 shadow-pop">
                          <Zap className="h-4 w-4 fill-pop-maroon text-pop-maroon" />
                          <span className="font-display text-xl font-bold text-pop-maroon">
                            {Math.floor(member.focusXP).toLocaleString()}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-center md:p-6">
                        <div className="inline-flex items-center gap-2 rounded-2xl border-2 border-pop-maroon bg-pop-teal/25 px-4 py-2 shadow-pop">
                          <Timer className="h-4 w-4 text-pop-maroon" />
                          <span className="font-display text-xl font-bold text-pop-maroon">{member.totalFocusMinutes}m</span>
                        </div>
                      </td>
                      <td className="p-4 text-right md:p-6">
                        {member.isLive ? (
                          <span className="inline-flex items-center gap-2 rounded-full border-2 border-pop-maroon bg-pop-teal px-3 py-2 font-display text-[10px] font-bold uppercase tracking-widest text-pop-white animate-pulse">
                            <span className="h-2 w-2 rounded-full bg-pop-white" />
                            Live now
                          </span>
                        ) : (
                          <span className="font-display text-[10px] font-bold uppercase tracking-widest text-pop-maroon/45">
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
        <div className="brutalist-card flex items-center gap-3 border-2 border-pop-maroon bg-pop-mustard/40 p-4">
          <div className="rounded-full border-2 border-pop-maroon bg-zen-terracotta p-1 text-pop-white">
            <Search className="h-4 w-4" />
          </div>
          <p className="font-display text-xs font-bold uppercase text-pop-maroon">{error}</p>
        </div>
      )}
    </div>
  );
}
