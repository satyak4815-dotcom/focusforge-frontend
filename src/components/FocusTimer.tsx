import React, { useState, useEffect } from 'react';
import { Timer, Play, Square, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useAppContext } from '../AppContext';

const SESSION_DURATION_MS = 25 * 60 * 1000;

export default function FocusTimer() {
  const { isSessionActive, sessionStartTime, startSession, endSession, failSession } = useAppContext();

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
    <div className="brutalist-card relative flex w-full flex-col items-center justify-center overflow-hidden bg-pop-mustard/50 p-6">
      {showCelebration && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center border-2 border-pop-maroon bg-pop-teal/95 p-6 text-pop-white">
          <CheckCircle2 className="mb-2 h-16 w-16 animate-bounce text-pop-mustard" />
          <h2 className="font-display text-3xl font-bold uppercase">Session complete</h2>
          <p className="mt-2 font-sans text-xl font-semibold">+25 XP earned</p>
        </div>
      )}

      {showConfirm && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center border-2 border-pop-maroon bg-pop-cream p-6 text-center">
          <AlertTriangle className="mb-2 h-12 w-12 text-zen-terracotta" />
          <h2 className="mb-4 font-display text-xl font-bold uppercase leading-tight text-pop-maroon md:text-2xl">
            Stopping early will cost you all session XP.
            <br />
            Are you sure?
          </h2>
          <div className="flex w-full max-w-sm gap-4">
            <button
              type="button"
              onClick={cancelFail}
              disabled={isLoading}
              className="btn-pop-secondary flex-1 py-3"
            >
              Cancel
            </button>
            <button type="button" onClick={confirmFail} disabled={isLoading} className="btn-pop-primary flex-1 py-3">
              {isLoading ? '...' : 'End session'}
            </button>
          </div>
        </div>
      )}

      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-pop-maroon bg-pop-white shadow-pop">
          <Timer className="h-5 w-5 text-pop-maroon" />
        </div>
        <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-pop-maroon">Focus timer</h2>
      </div>

      <div className="mb-6 rounded-3xl border-[3px] border-pop-maroon bg-pop-white px-8 py-6 shadow-pop">
        <div className="font-display text-6xl font-bold tabular-nums leading-none tracking-tighter text-pop-maroon md:text-8xl">
          {formatTime(timeLeftMs)}
        </div>
      </div>

      <div className="flex gap-4">
        {!isSessionActive ? (
          <button
            type="button"
            onClick={handleStart}
            disabled={isLoading}
            className="btn-pop-primary flex items-center gap-2 px-8 py-4 text-xl"
          >
            <Play className="h-6 w-6 fill-current" />
            <span className="font-display uppercase tracking-wider">{isLoading ? 'Starting…' : 'Start focus'}</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={handleStopClick}
            className="btn-pop-secondary flex items-center gap-2 border-zen-terracotta bg-zen-terracotta/30 px-8 py-4 text-xl text-pop-maroon"
          >
            <Square className="h-6 w-6 fill-current" />
            <span className="font-display uppercase tracking-wider">Stop early</span>
          </button>
        )}
      </div>
    </div>
  );
}
