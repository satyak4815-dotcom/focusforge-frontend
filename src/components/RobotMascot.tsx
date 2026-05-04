import React from 'react';

export interface RobotMascotProps {
  /** When true, happy face; when false, sad face (e.g. bind to live XP gains on the kid dashboard). */
  isFocusing: boolean;
}

/**
 * Procedural robot mascot — CSS + inline SVG only (no <img>).
 * Face toggles with `isFocusing` (dashboard passes `true` while XP is climbing).
 */
export default function RobotMascot({ isFocusing }: RobotMascotProps) {
  return (
    <div
      className="flex w-full justify-center py-2"
      role="img"
      aria-label={isFocusing ? 'Focus companion — earning XP' : 'Focus companion — ready to cheer on XP'}
    >
      <svg
        viewBox="0 0 220 300"
        className="h-[min(280px,52vw)] w-auto max-w-[220px] [shape-rendering:geometricPrecision]"
      >
        <defs>
          <linearGradient id="robot-head-shell" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e4976" />
            <stop offset="100%" stopColor="#0d2f4d" />
          </linearGradient>
          <linearGradient id="robot-screen" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#c9f0ff" />
            <stop offset="45%" stopColor="#7ec8ea" />
            <stop offset="100%" stopColor="#4a9cc9" />
          </linearGradient>
          <linearGradient id="robot-torso-top" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1a4570" />
            <stop offset="100%" stopColor="#123456" />
          </linearGradient>
          <linearGradient id="robot-torso-bottom" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#7eb8dc" />
            <stop offset="100%" stopColor="#4a8eb8" />
          </linearGradient>
          <radialGradient id="robot-wheel" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#2a5f8f" />
            <stop offset="100%" stopColor="#0f2840" />
          </radialGradient>
          <filter id="robot-face-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#9fe8ff" floodOpacity="0.85" />
          </filter>
          <filter id="robot-body-shadow" x="-20%" y="-10%" width="140%" height="130%">
            <feDropShadow dx="0" dy="6" stdDeviation="0" floodColor="#000000" floodOpacity="0.22" />
          </filter>
        </defs>

        {/* Treads */}
        <ellipse cx="72" cy="278" rx="34" ry="18" fill="url(#robot-wheel)" stroke="#0a1f30" strokeWidth="3" />
        <ellipse cx="148" cy="278" rx="34" ry="18" fill="url(#robot-wheel)" stroke="#0a1f30" strokeWidth="3" />
        <rect x="48" y="268" width="48" height="10" rx="3" fill="#1a3d5c" stroke="#0a1f30" strokeWidth="2" />
        <rect x="124" y="268" width="48" height="10" rx="3" fill="#1a3d5c" stroke="#0a1f30" strokeWidth="2" />

        {/* Legs */}
        <path
          d="M78 220 L78 258 L66 268 M142 220 L142 258 L154 268"
          fill="none"
          stroke="#123456"
          strokeWidth="14"
          strokeLinecap="round"
        />

        {/* Torso */}
        <g filter="url(#robot-body-shadow)">
          <path
            d="M62 118 Q55 110 62 100 L158 100 Q165 110 158 118 L158 210 Q160 222 150 228 L70 228 Q60 222 62 210 Z"
            fill="url(#robot-torso-top)"
            stroke="#06182a"
            strokeWidth="3"
          />
          <path
            d="M62 168 L158 168 L158 210 Q160 222 150 228 L70 228 Q60 222 62 210 Z"
            fill="url(#robot-torso-bottom)"
            stroke="#06182a"
            strokeWidth="3"
          />
        </g>

        {/* Chest buttons */}
        <circle cx="92" cy="132" r="5" fill="#e63946" stroke="#06182a" strokeWidth="2" />
        <circle cx="110" cy="132" r="5" fill="#ffd60a" stroke="#06182a" strokeWidth="2" />
        <circle cx="128" cy="132" r="5" fill="#2a9d8f" stroke="#06182a" strokeWidth="2" />

        {/* Gear accent */}
        <g transform="translate(78 150)" fill="#a8d8f0" stroke="#06182a" strokeWidth="1.5">
          <circle r="12" />
          <circle r="5" fill="#4a8eb8" />
          <path d="M0 -14 L0 -8 M10 -10 L6 -6 M14 0 L8 0 M10 10 L6 6 M0 14 L0 8 M-10 10 L-6 6 M-14 0 L-8 0 M-10 -10 L-6 -6" strokeLinecap="round" />
        </g>

        {/* Rivets */}
        <circle cx="78" cy="198" r="3" fill="#cfe9f7" stroke="#06182a" strokeWidth="1" />
        <circle cx="110" cy="202" r="3" fill="#cfe9f7" stroke="#06182a" strokeWidth="1" />
        <circle cx="142" cy="198" r="3" fill="#cfe9f7" stroke="#06182a" strokeWidth="1" />

        {/* Arms */}
        {isFocusing ? (
          <g stroke="#123456" strokeWidth="10" strokeLinecap="round" fill="none">
            <path d="M58 150 Q40 145 32 125" />
            <path d="M162 150 Q188 120 198 98" />
            <circle cx="32" cy="125" r="9" fill="#7eb8dc" stroke="#06182a" strokeWidth="2" />
            <circle cx="198" cy="98" r="9" fill="#7eb8dc" stroke="#06182a" strokeWidth="2" />
          </g>
        ) : (
          <g stroke="#123456" strokeWidth="10" strokeLinecap="round" fill="none">
            <path d="M58 150 Q48 175 50 200" />
            <path d="M162 150 Q172 175 170 200" />
            <circle cx="50" cy="200" r="9" fill="#5a8eb0" stroke="#06182a" strokeWidth="2" />
            <circle cx="170" cy="200" r="9" fill="#5a8eb0" stroke="#06182a" strokeWidth="2" />
          </g>
        )}

        {/* Head shell */}
        <rect
          x="48"
          y="28"
          width="124"
          height="88"
          rx="28"
          fill="url(#robot-head-shell)"
          stroke="#06182a"
          strokeWidth="3"
          filter="url(#robot-body-shadow)"
        />

        {/* Screen */}
        <rect
          x="60"
          y="42"
          width="100"
          height="62"
          rx="16"
          fill="url(#robot-screen)"
          stroke="#0a1f30"
          strokeWidth="2"
        />

        {/* Antennae */}
        {isFocusing ? (
          <g stroke="#0d2f4d" strokeWidth="2.5" fill="#7fd7ff">
            <line x1="78" y1="28" x2="72" y2="8" />
            <circle cx="72" cy="6" r="5" stroke="#06182a" strokeWidth="2" filter="url(#robot-face-glow)" />
            <line x1="98" y1="26" x2="96" y2="4" />
            <circle cx="96" cy="2" r="5" stroke="#06182a" strokeWidth="2" filter="url(#robot-face-glow)" />
            <line x1="122" y1="26" x2="124" y2="4" />
            <circle cx="124" cy="2" r="5" stroke="#06182a" strokeWidth="2" filter="url(#robot-face-glow)" />
            <line x1="146" y1="28" x2="152" y2="8" />
            <circle cx="152" cy="6" r="5" stroke="#06182a" strokeWidth="2" filter="url(#robot-face-glow)" />
          </g>
        ) : (
          <g>
            <path
              d="M108 28 Q118 12 138 18"
              fill="none"
              stroke="#0d2f4d"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <circle cx="140" cy="16" r="6" fill="#5a8eb0" stroke="#06182a" strokeWidth="2" />
          </g>
        )}

        {/* Face */}
        {isFocusing ? (
          <g filter="url(#robot-face-glow)">
            {/* Happy eyes */}
            <path
              d="M78 62 Q88 72 98 62"
              fill="none"
              stroke="#e8fbff"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <path
              d="M122 62 Q132 72 142 62"
              fill="none"
              stroke="#e8fbff"
              strokeWidth="5"
              strokeLinecap="round"
            />
            {/* Blush */}
            <ellipse cx="82" cy="78" rx="8" ry="4" fill="#ffb4c4" opacity="0.75" />
            <ellipse cx="138" cy="78" rx="8" ry="4" fill="#ffb4c4" opacity="0.75" />
            {/* Smile */}
            <path
              d="M86 88 Q110 108 134 88"
              fill="none"
              stroke="#e8fbff"
              strokeWidth="6"
              strokeLinecap="round"
            />
          </g>
        ) : (
          <g>
            {/* Sad eyes */}
            <path
              d="M78 68 Q88 58 98 68"
              fill="none"
              stroke="#0d2f4d"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              d="M122 68 Q132 58 142 68"
              fill="none"
              stroke="#0d2f4d"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Tear */}
            <path d="M132 72 L130 84 Q132 88 134 84 Z" fill="#4a9cc9" stroke="#0a1f30" strokeWidth="1" />
            {/* Frown */}
            <path
              d="M88 98 Q110 86 132 98"
              fill="none"
              stroke="#0d2f4d"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </g>
        )}
      </svg>
    </div>
  );
}
