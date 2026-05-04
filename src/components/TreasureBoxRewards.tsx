import React, { useCallback, useMemo, useState } from 'react';
import type { Session } from '../services/api';

const AMAZON_CODE = 'AMZN-DEMO-8XK2';
const ZOMATO_CODE = 'ZMT-DEMO-4PL9';

interface TreasureBoxRewardsProps {
  history: Session[];
  isHistoryLoading: boolean;
}

export default function TreasureBoxRewards({ history, isHistoryLoading }: TreasureBoxRewardsProps) {
  const [isOpened, setIsOpened] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const isEligible = useMemo(() => {
    if (typeof window === 'undefined') return false;
    if (localStorage.getItem('focusforge_treasure_eligible') === '1') return true;
    return history.some((s) => s.status === 'completed');
  }, [history]);

  const copyCode = useCallback(async (code: string, label: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(label);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      setCopied(null);
    }
  }, []);

  if (isHistoryLoading || !isEligible) {
    return null;
  }

  return (
    <div className="mt-8 flex w-full max-w-2xl flex-col items-center gap-4 px-2 pb-16 sm:mt-10 sm:pb-24">
      {isOpened && (
        <div className="w-full animate-[mascot-message-in_0.4s_ease-out_both] rounded-3xl border-2 border-pop-maroon bg-pop-teal/30 px-4 py-4 text-pop-maroon shadow-pop sm:px-6 sm:py-5">
          <p className="text-center font-display text-xs font-bold uppercase leading-snug tracking-wide sm:text-sm">
            You did great today. Here is your prize.
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => copyCode(AMAZON_CODE, 'amazon')}
              className="rounded-full border-2 border-pop-maroon bg-pop-white px-3 py-2 font-mono text-[11px] font-bold uppercase tracking-wider text-pop-maroon shadow-pop transition-all duration-200 hover:-translate-y-0.5"
            >
              {copied === 'amazon' ? 'Copied!' : AMAZON_CODE}
            </button>
            <button
              type="button"
              onClick={() => copyCode(ZOMATO_CODE, 'zomato')}
              className="rounded-full border-2 border-pop-maroon bg-pop-white px-3 py-2 font-mono text-[11px] font-bold uppercase tracking-wider text-pop-maroon shadow-pop transition-all duration-200 hover:-translate-y-0.5"
            >
              {copied === 'zomato' ? 'Copied!' : ZOMATO_CODE}
            </button>
          </div>

          <p className="mt-3 text-center font-sans text-[10px] font-semibold uppercase tracking-wide text-pop-maroon/75">
            Tap a code to copy
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpened((o) => !o)}
        className="treasure-box-bounce flex h-20 w-20 shrink-0 cursor-pointer select-none items-center justify-center rounded-2xl border-2 border-pop-maroon bg-pop-mustard shadow-pop-md transition-transform hover:scale-[1.03] active:translate-y-px"
        aria-expanded={isOpened}
        aria-label={isOpened ? 'Close treasure rewards' : 'Open treasure box rewards'}
      >
        <span className="text-2xl" aria-hidden>
          🎁
        </span>
      </button>
    </div>
  );
}
