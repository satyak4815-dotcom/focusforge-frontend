import React, { useState, useEffect } from 'react';
import { Timer, Play, Square, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useAppContext } from '../AppContext';

const SESSION_DURATION_MS = 25 * 60 * 1000; // 25 minutes

export default function FocusTimer() {
  const { 
    isSessionActive, sessionStartTime, 
    startSession, endSession, failSession 
  } = useAppContext();

  const [timeLeftMs, setTimeLeftMs] = useState(SESSION_DURATION_MS);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isSessionActive || !sessionStartTime) {
      setTimeLeftMs(SESSION_DURATION_MS);
      return;
    }

    const intervalId = setInterval(() => {
      const elapsed = Date.now() - sessionStartTime;
      const remaining = Math.max(0, SESSION_DURATION_MS - elapsed);
      setTimeLeftMs(remaining);

      if (remaining === 0) {
        clearInterval(intervalId);
        handleComplete();
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isSessionActive, sessionStartTime]);

  const handleStart = async () => {
    setIsLoading(true);
    setShowCelebration(false);
    try {
      await startSession();
    } finally {
      setIsLoading(false);
    }
  };

  const handleStopClick = () => {
    setShowConfirm(true);
  };

  const confirmFail = async () => {
    setIsLoading(true);
    try {
      await failSession();
      setShowConfirm(false);
    } finally {
      setIsLoading(false);
    }
  };

  const cancelFail = () => {
    setShowConfirm(false);
  };

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      await endSession();
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="brutalist-card bg-[#FCD34D] p-6 w-full flex flex-col items-center justify-center relative overflow-hidden">
      {showCelebration && (
        <div className="absolute inset-0 bg-green-400 z-10 flex flex-col items-center justify-center border-2 border-[#111827]">
          <CheckCircle2 className="w-16 h-16 text-[#111827] mb-2 animate-bounce" />
          <h2 className="text-3xl font-black text-[#111827] uppercase">Session Complete!</h2>
          <p className="text-xl font-bold text-[#111827] mt-2">+25 XP Earned</p>
        </div>
      )}

      {showConfirm && (
        <div className="absolute inset-0 bg-red-400 z-10 flex flex-col items-center justify-center border-2 border-[#111827] p-6 text-center">
          <AlertTriangle className="w-12 h-12 text-[#111827] mb-2" />
          <h2 className="text-xl md:text-2xl font-black text-[#111827] uppercase mb-4 leading-tight">
            Stopping early will cost you all session XP.<br/>Are you sure?
          </h2>
          <div className="flex gap-4 w-full max-w-sm">
            <button 
              onClick={cancelFail}
              disabled={isLoading}
              className="flex-1 brutalist-button bg-white text-[#111827] font-black uppercase"
            >
              Cancel
            </button>
            <button 
              onClick={confirmFail}
              disabled={isLoading}
              className="flex-1 brutalist-button bg-[#111827] text-white font-black uppercase"
            >
              {isLoading ? '...' : 'I Give Up'}
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-white border-[2px] border-[#111827] rounded-full flex items-center justify-center shadow-[2px_2px_0px_#111827]">
          <Timer className="w-5 h-5 text-[#111827]" />
        </div>
        <h2 className="text-2xl font-black text-[#111827] uppercase tracking-tighter">Focus Timer</h2>
      </div>

      <div className="bg-white border-[3px] border-[#111827] shadow-[4px_4px_0px_#111827] rounded-3xl px-8 py-6 mb-6">
        <div className="text-6xl md:text-8xl font-black text-[#111827] tabular-nums tracking-tighter leading-none">
          {formatTime(timeLeftMs)}
        </div>
      </div>

      <div className="flex gap-4">
        {!isSessionActive ? (
          <button 
            onClick={handleStart}
            disabled={isLoading}
            className="brutalist-button bg-green-400 px-8 py-4 flex items-center gap-2 text-xl"
          >
            <Play className="w-6 h-6 fill-current" />
            <span className="font-black uppercase tracking-wider">{isLoading ? 'Starting...' : 'Start Focus'}</span>
          </button>
        ) : (
          <button 
            onClick={handleStopClick}
            className="brutalist-button bg-red-400 px-8 py-4 flex items-center gap-2 text-xl"
          >
            <Square className="w-6 h-6 fill-current" />
            <span className="font-black uppercase tracking-wider">Stop Early</span>
          </button>
        )}
      </div>
    </div>
  );
}
