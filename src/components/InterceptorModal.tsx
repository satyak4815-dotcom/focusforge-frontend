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
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md rounded-[2rem] border-[3px] border-slate-900 bg-white shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] overflow-hidden">
        
        <div className="p-8 flex flex-col gap-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <h2 className="text-slate-900 font-black text-3xl uppercase tracking-tighter leading-none">
              Instagram<br/>Blocked 🛑
            </h2>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full border-2 border-slate-900 hover:bg-slate-100 flex items-center justify-center transition-colors shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] active:translate-y-0.5 active:shadow-none"
            >
              <X className="w-5 h-5 text-slate-900 font-black" />
            </button>
          </div>

          {/* Subtitle */}
          <div>
            <p className="text-slate-900 text-base font-bold uppercase tracking-wide">
              Take a mindful moment.
            </p>
            <p className="text-slate-700 text-sm font-semibold mt-1">
              Solve this to unlock access for 15 minutes.
            </p>
          </div>

          {/* Code Challenge */}
          <div className="rounded-2xl bg-yellow-100 border-2 border-slate-900 p-5 font-mono text-base font-bold text-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
            <div className="text-slate-600 text-sm mb-3 font-semibold">{'// What is the output?'}</div>
            <div>
              <span className="text-blue-700">int</span>{' '}
              <span>arr[]</span>{' '}
              <span>= </span>
              <span>{'{'}</span>
              <span className="text-rose-600">1</span>
              <span>, </span>
              <span className="text-rose-600">2</span>
              <span>, </span>
              <span className="text-rose-600">3</span>
              <span>{'}'}</span>
              <span>;</span>
            </div>
            <div className="mt-1">
              <span className="text-violet-700">cout</span>{' '}
              <span>{'<<'}</span>{' '}
              <span>arr</span>
              <span>[</span>
              <span className="text-rose-600">1</span>
              <span>];</span>
            </div>
          </div>

          {/* Answer Input */}
          {submitted === 'idle' && (
            <div>
              <input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                placeholder="Type the output here..."
                className="w-full bg-white border-2 border-slate-900 focus:outline-none rounded-full px-5 py-4 text-slate-900 font-bold placeholder-slate-400 text-base shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] focus:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] transition-shadow"
              />
            </div>
          )}

          {/* Feedback States */}
          {submitted === 'correct' && (
            <div className="rounded-2xl bg-teal-300 border-2 border-slate-900 p-4 flex items-center gap-4 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
              <CheckCircle className="w-8 h-8 text-slate-900 shrink-0" />
              <div>
                <p className="text-slate-900 font-black uppercase text-lg leading-tight">Access Granted!</p>
                <p className="text-slate-800 font-bold text-sm">+25 XP for your focus journey.</p>
              </div>
            </div>
          )}

          {submitted === 'wrong' && (
            <div className="rounded-2xl bg-rose-300 border-2 border-slate-900 p-4 flex items-center gap-4 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
              <XCircle className="w-8 h-8 text-slate-900 shrink-0" />
              <div>
                <p className="text-slate-900 font-black uppercase text-lg leading-tight">Try Again!</p>
                <p className="text-slate-800 font-bold text-sm">Hint: Arrays start at 0.</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 mt-2">
            {submitted === 'idle' && (
              <button
                onClick={handleSubmit}
                className="w-full py-4 brutalist-button bg-orange-500 text-slate-900 font-black uppercase text-lg tracking-wider"
              >
                Submit & Unlock
              </button>
            )}
            {submitted === 'correct' && (
              <button
                onClick={onClose}
                className="w-full py-4 brutalist-button bg-teal-400 text-slate-900 font-black uppercase text-lg tracking-wider"
              >
                Go to Instagram
              </button>
            )}
            {submitted === 'wrong' && (
              <button
                onClick={() => { setAnswer(''); setSubmitted('idle'); }}
                className="w-full py-4 brutalist-button bg-violet-400 text-slate-900 font-black uppercase text-lg tracking-wider"
              >
                Try Again
              </button>
            )}
            <button
              onClick={onClose}
              className="w-full py-3 rounded-full text-slate-600 hover:text-slate-900 font-black uppercase text-sm transition-colors mt-2"
            >
              Skip for now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
