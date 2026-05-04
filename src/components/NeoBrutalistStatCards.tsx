import React from 'react';
import { Clock, Trophy } from 'lucide-react';
import { useAppContext } from '../AppContext';
import Skeleton from './Skeleton';

function safeNumber(n: unknown): number {
  if (typeof n === 'number' && Number.isFinite(n)) return n;
  const p = typeof n === 'string' ? parseFloat(n) : Number(n);
  return Number.isFinite(p) ? p : 0;
}

function formatFocusHoursLabel(h: unknown): string {
  const v = safeNumber(h);
  const hasFraction = Math.abs(v % 1) > 1e-6;
  const body = hasFraction ? v.toFixed(1) : String(Math.floor(v));
  return `${body}h`;
}

function formatXpLabel(xp: unknown): string {
  const v = Math.floor(safeNumber(xp));
  return `${v.toLocaleString()} XP`;
}

export default function NeoBrutalistStatCards() {
  const { metrics, isLoadingProfile } = useAppContext();

  if (isLoadingProfile) {
    return (
      <div className="flex w-full flex-wrap items-stretch justify-center gap-6 sm:gap-8">
        <Skeleton
          width="min(100%,280px)"
          height="220px"
          className="!rounded-3xl !border-2 !border-pop-maroon !bg-pop-teal/25"
        />
        <Skeleton
          width="min(100%,280px)"
          height="220px"
          className="!rounded-3xl !border-2 !border-pop-maroon !bg-pop-mustard/35"
        />
      </div>
    );
  }

  const focusLabel = formatFocusHoursLabel(metrics.focusHours);
  const xpLabel = formatXpLabel(metrics.xpEarned);

  return (
    <div className="flex w-full flex-wrap items-stretch justify-center gap-6 sm:gap-8" aria-label="Focus and XP stats">
      <article className="statCard statCard--focus flex min-w-[min(100%,280px)] max-w-sm flex-1 flex-col items-center gap-5 text-center">
        <div className="statCard-icon text-pop-maroon" aria-hidden>
          <Clock className="h-8 w-8" strokeWidth={2.5} />
        </div>
        <p className="font-display text-4xl font-bold tabular-nums tracking-tight text-pop-maroon sm:text-5xl">{focusLabel}</p>
        <span className="statCard-pill statCard-pill--focus">Focus hours</span>
      </article>

      <article className="statCard statCard--xp flex min-w-[min(100%,280px)] max-w-sm flex-1 flex-col items-center gap-5 text-center">
        <div className="statCard-icon text-pop-maroon" aria-hidden>
          <Trophy className="h-8 w-8" strokeWidth={2.5} />
        </div>
        <p className="font-display text-4xl font-bold tabular-nums tracking-tight text-pop-maroon sm:text-5xl">{xpLabel}</p>
        <span className="statCard-pill statCard-pill--xp">XP earned</span>
      </article>
    </div>
  );
}
