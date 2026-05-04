import React from 'react';

export interface MascotMessageProps {
  isFocusing: boolean;
}

const MSG_FOCUS = "YOU CHOSE FOCUS OVER SCROLLING TODAY, THAT'S A WIN. KEEP GOING!";
const MSG_SCROLL = 'ANOTHER HOUR LOST TO SCROLLING… YOU KNOW YOU WANTED BETTER TODAY.';

export default function MascotMessage({ isFocusing }: MascotMessageProps) {
  const mode = isFocusing ? 'focus' : 'scroll';

  const palette = isFocusing
    ? {
        border: 'border-pop-teal',
        bg: 'bg-pop-teal/25',
        text: 'text-pop-maroon',
      }
    : {
        border: 'border-pop-mustard',
        bg: 'bg-pop-mustard/40',
        text: 'text-pop-maroon',
      };

  return (
    <div className="relative z-0 w-full max-w-lg px-2">
      <div
        key={mode}
        role="status"
        aria-live="polite"
        className={`mascot-msg-animate rounded-3xl border-2 px-4 py-3 text-center shadow-pop transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:shadow-pop-md sm:px-6 sm:py-4 ${palette.border} ${palette.bg}`}
      >
        <p
          className={`font-display text-[11px] font-bold uppercase leading-snug tracking-wide sm:text-xs sm:leading-relaxed ${palette.text}`}
        >
          {isFocusing ? MSG_FOCUS : MSG_SCROLL}
        </p>
      </div>
    </div>
  );
}
