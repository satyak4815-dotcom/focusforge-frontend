import React, { useState } from 'react';
import { X, CheckCircle, XCircle } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export default function InterceptorModal({ onClose }: Props) {
  const [answer, setAnswer] = useState('');
  const [submitted, setSubmitted] = useState<'idle' | 'correct' | 'wrong'>('idle');

  const correctAnswer = '2';

  const handleSubmit = () => {
    if (answer.trim() === correctAnswer) {
      setSubmitted('correct');
    } else {
      setSubmitted('wrong');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-pop-maroon/40 backdrop-blur-sm" onClick={onClose} />

      <div
        className="relative w-full max-w-md overflow-hidden rounded-3xl border-[3px] border-pop-maroon bg-pop-cream shadow-pop-md"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex flex-col gap-6 p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <h2 className="font-display text-3xl font-bold uppercase leading-none tracking-tight text-pop-maroon">
              Instagram
              <br />
              Blocked
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-pop-maroon bg-pop-white text-pop-maroon shadow-pop transition-all duration-200 hover:-translate-y-0.5 hover:bg-pop-mustard/50"
            >
              <X className="h-5 w-5" strokeWidth={2.5} />
            </button>
          </div>

          <div>
            <p className="font-display text-base font-bold uppercase tracking-wide text-pop-maroon">Take a mindful moment.</p>
            <p className="mt-1 font-sans text-sm font-semibold text-pop-maroon">Solve this to unlock access for 15 minutes.</p>
          </div>

          <div className="rounded-3xl border-2 border-pop-maroon bg-pop-mustard/50 p-5 font-mono text-base font-bold text-pop-maroon shadow-pop">
            <div className="mb-3 font-sans text-sm font-semibold text-pop-maroon/75">{'// What is the output?'}</div>
            <div>
              <span className="text-[#3d5a80]">int</span> <span>arr[]</span> <span>= </span>
              <span>{'{'}</span>
              <span className="text-zen-terracotta">1</span>
              <span>, </span>
              <span className="text-zen-terracotta">2</span>
              <span>, </span>
              <span className="text-zen-terracotta">3</span>
              <span>{'}'}</span>
              <span>;</span>
            </div>
            <div className="mt-1">
              <span className="text-[#5c6b7a]">cout</span> <span>{'<<'}</span> <span>arr</span>
              <span>[</span>
              <span className="text-zen-terracotta">1</span>
              <span>];</span>
            </div>
          </div>

          {submitted === 'idle' && (
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="Type the output here..."
              className="input-pop py-4 font-sans text-base"
            />
          )}

          {submitted === 'correct' && (
            <div className="flex items-center gap-4 rounded-3xl border-2 border-pop-maroon bg-pop-teal/25 p-4 shadow-pop">
              <CheckCircle className="h-8 w-8 shrink-0 text-pop-maroon" />
              <div>
                <p className="font-display text-lg font-bold uppercase leading-tight text-pop-maroon">Access granted</p>
                <p className="font-sans text-sm font-semibold text-pop-maroon">+25 XP for your focus journey.</p>
              </div>
            </div>
          )}

          {submitted === 'wrong' && (
            <div className="flex items-center gap-4 rounded-3xl border-2 border-pop-maroon bg-zen-terracotta/25 p-4 shadow-pop">
              <XCircle className="h-8 w-8 shrink-0 text-pop-maroon" />
              <div>
                <p className="font-display text-lg font-bold uppercase leading-tight text-pop-maroon">Try again</p>
                <p className="font-sans text-sm font-semibold text-pop-maroon">Hint: arrays start at 0.</p>
              </div>
            </div>
          )}

          <div className="mt-2 flex flex-col gap-3">
            {submitted === 'idle' && (
              <button type="button" onClick={handleSubmit} className="btn-pop-primary w-full py-4 text-base">
                Submit and unlock
              </button>
            )}
            {submitted === 'correct' && (
              <button type="button" onClick={onClose} className="btn-pop-secondary w-full py-4 text-base">
                Go to Instagram
              </button>
            )}
            {submitted === 'wrong' && (
              <button
                type="button"
                onClick={() => {
                  setAnswer('');
                  setSubmitted('idle');
                }}
                className="btn-pop-secondary w-full py-4 text-base"
              >
                Try again
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="mt-1 w-full rounded-full py-3 font-display text-sm font-bold uppercase text-pop-maroon/70 transition-colors hover:text-pop-maroon"
            >
              Skip for now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
