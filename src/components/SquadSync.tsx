import React, { useState } from 'react';
import { Plus, UserPlus, Copy, Check, Users, Shield, Trash2, AlertCircle } from 'lucide-react';
import { useAppContext } from '../AppContext';
import { squads } from '../services/api';

export default function SquadSync() {
  const { squadId, setSquadId, squadInfo, setSquadInfo } = useAppContext();
  const [squadName, setSquadName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCreateSquad = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!squadName.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await squads.create(squadName.trim());
      setSquadId(res._id);
      setSquadInfo({ name: res.name, code: res.joinCode });
      setSquadName('');
    } catch (err: any) {
      setError(err.message || 'Failed to create squad. Try a different name.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinSquad = async (e: React.FormEvent) => {
    e.preventDefault();
    if (joinCode.trim().length !== 5) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await squads.join(joinCode.trim());
      setSquadId(res._id);
      setSquadInfo({ name: res.name, code: res.joinCode });
      setJoinCode('');
    } catch (err: any) {
      setError(err.message || 'Invalid code. Squad not found.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeave = () => {
    setSquadId(null);
    setSquadInfo(null);
  };

  const handleCopy = () => {
    if (squadInfo?.code) {
      navigator.clipboard.writeText(squadInfo.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex-1 px-4 md:px-10 py-6 md:py-10 flex flex-col gap-10 max-w-5xl mx-auto w-full">

      {/* ── PAGE HEADER ── */}
      <div>
        <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase">
          Squad <span className="text-pink-500">Sync</span>
        </h2>
        <p className="mt-2 text-slate-500 font-bold uppercase text-xs tracking-widest">
          Create or join a squad — then check the Leaderboard to track live rankings.
        </p>
      </div>

      {/* ── CREATE / JOIN CARDS ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* CREATE SQUAD */}
        <div className={`brutalist-card bg-yellow-300 p-8 flex flex-col gap-6 transition-all duration-300 ${squadId ? 'opacity-60 pointer-events-none grayscale' : ''}`}>
          <div className="flex items-center gap-4">
            <div className="bg-white p-3 border-2 border-[#111827] rounded-2xl shadow-[4px_4px_0px_#111827]">
              <Plus className="w-6 h-6 text-black" />
            </div>
            <h3 className="text-2xl font-black uppercase">Create Squad</h3>
          </div>
          <p className="font-bold text-slate-700 uppercase text-xs tracking-wider leading-relaxed">
            Form a new elite unit. You'll get a unique 5-digit code to share with friends.
          </p>
          <form onSubmit={handleCreateSquad} className="flex flex-col gap-4">
            <input
              type="text"
              id="squad-name-input"
              placeholder="E.G. ALPHA FOCUS"
              value={squadName}
              onChange={(e) => setSquadName(e.target.value)}
              disabled={!!squadId || isLoading}
              className="w-full bg-white border-2 border-[#111827] px-5 py-4 font-black uppercase text-sm focus:outline-none shadow-[4px_4px_0px_#111827] focus:shadow-none focus:translate-x-1 focus:translate-y-1 transition-all placeholder:text-slate-400"
            />
            <button
              type="submit"
              disabled={isLoading || !!squadId}
              className="brutalist-button bg-black text-white py-4 uppercase font-black tracking-widest hover:bg-slate-800 disabled:opacity-50"
            >
              {isLoading ? 'Establishing...' : 'Establish Squad'}
            </button>
          </form>
        </div>

        {/* JOIN SQUAD */}
        <div className={`brutalist-card bg-violet-300 p-8 flex flex-col gap-6 transition-all duration-300 ${squadId ? 'opacity-60 pointer-events-none grayscale' : ''}`}>
          <div className="flex items-center gap-4">
            <div className="bg-white p-3 border-2 border-[#111827] rounded-2xl shadow-[4px_4px_0px_#111827]">
              <UserPlus className="w-6 h-6 text-black" />
            </div>
            <h3 className="text-2xl font-black uppercase">Join Squad</h3>
          </div>
          <p className="font-bold text-slate-700 uppercase text-xs tracking-wider leading-relaxed">
            Enter the 5-digit code shared by your squad leader to join the fight.
          </p>
          <form onSubmit={handleJoinSquad} className="flex flex-col gap-4">
            <input
              type="text"
              id="join-code-input"
              placeholder="5-DIGIT CODE"
              maxLength={5}
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              disabled={!!squadId || isLoading}
              className="w-full bg-white border-2 border-[#111827] px-5 py-4 font-black uppercase text-center text-2xl tracking-[0.5em] focus:outline-none shadow-[4px_4px_0px_#111827] focus:shadow-none focus:translate-x-1 focus:translate-y-1 transition-all placeholder:tracking-normal placeholder:text-base placeholder:text-slate-400"
            />
            <button
              type="submit"
              disabled={isLoading || !!squadId || joinCode.trim().length !== 5}
              className="brutalist-button bg-black text-white py-4 uppercase font-black tracking-widest hover:bg-slate-800 disabled:opacity-50"
            >
              {isLoading ? 'Infiltrating...' : 'Infiltrate'}
            </button>
          </form>
        </div>
      </div>

      {/* ── ERROR BANNER ── */}
      {error && (
        <div className="bg-red-50 border-[3px] border-red-600 shadow-[4px_4px_0px_#dc2626] p-4 flex items-center gap-3 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <p className="text-red-700 font-bold uppercase text-xs">{error}</p>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-400 hover:text-red-700 font-black text-lg leading-none"
          >
            ×
          </button>
        </div>
      )}

      {/* ── ACTIVE SQUAD DETAILS (appears below after creation/join) ── */}
      {squadInfo && (
        <div
          id="active-squad-card"
          className="bg-white border-[3px] border-gray-900 shadow-[6px_6px_0px_#111827] rounded-2xl overflow-hidden"
          style={{ animation: 'slideUp 0.3s ease-out' }}
        >
          {/* Card Header */}
          <div className="bg-[#111827] px-8 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-emerald-400" />
              <span className="text-white font-black uppercase text-sm tracking-widest">Active Squad</span>
              {/* Mint green pill badge */}
              <span className="bg-emerald-400 text-[#111827] font-black uppercase text-[10px] tracking-widest px-3 py-1 rounded-full">
                YOUR ACTIVE SQUAD
              </span>
            </div>
            <button
              onClick={handleLeave}
              className="flex items-center gap-2 text-red-400 hover:text-red-300 font-black uppercase text-[10px] tracking-widest transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Leave
            </button>
          </div>

          {/* Card Body */}
          <div className="px-8 py-7 flex flex-col md:flex-row items-center gap-8">
            {/* Squad Avatar */}
            <div className="bg-emerald-100 border-[3px] border-[#111827] shadow-[4px_4px_0px_#111827] w-20 h-20 rounded-2xl flex items-center justify-center shrink-0">
              <Users className="w-10 h-10 text-emerald-700" />
            </div>

            {/* Squad Name */}
            <div className="flex-1 text-center md:text-left">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Squad Name</p>
              <h3 className="text-3xl md:text-4xl font-black uppercase text-[#111827] leading-tight">
                {squadInfo.name}
              </h3>
              <p className="mt-2 text-slate-500 font-bold uppercase text-xs tracking-wider">
                Squad is active — share your code to bring in teammates.
              </p>
            </div>

            {/* 5-Digit Code Block */}
            <div className="shrink-0 flex flex-col items-center gap-3">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">5-Digit Join Code</p>
              <div className="bg-yellow-300 border-[3px] border-[#111827] shadow-[4px_4px_0px_#111827] px-6 py-4 rounded-xl flex items-center gap-4">
                <span className="text-3xl font-black tracking-[0.5em] text-[#111827] font-mono">
                  {squadInfo.code || '-----'}
                </span>
                <button
                  onClick={handleCopy}
                  title="Copy code"
                  className={`p-2 border-2 border-[#111827] rounded-lg shadow-[2px_2px_0px_#111827] transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none ${
                    copied ? 'bg-emerald-400' : 'bg-white hover:bg-slate-100'
                  }`}
                >
                  {copied
                    ? <Check className="w-5 h-5 text-[#111827]" />
                    : <Copy className="w-5 h-5 text-[#111827]" />
                  }
                </button>
              </div>
              {copied && (
                <p className="text-emerald-600 font-black uppercase text-[10px] tracking-widest animate-pulse">
                  Copied to clipboard!
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
