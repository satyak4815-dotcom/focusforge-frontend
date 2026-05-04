import React from 'react';
import { X, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface SquadAnalyticsModalProps {
  onClose: () => void;
}

const mockData = [
  { name: 'Sarah', focus: 120, doomscrolling: 30 },
  { name: 'Alex', focus: 90, doomscrolling: 45 },
  { name: 'Jordan', focus: 60, doomscrolling: 80 },
  { name: 'Rahul', focus: 150, doomscrolling: 20 },
];

export default function SquadAnalyticsModal({ onClose }: SquadAnalyticsModalProps) {
  return (
    <div className="mt-4 flex w-full flex-col">
      <div className="brutalist-card flex w-full flex-col overflow-hidden border-2 border-pop-maroon bg-pop-mustard/40 p-0">
        <div className="flex items-center justify-between border-b-4 border-pop-maroon px-4 py-4 md:px-6 md:py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-pop-maroon bg-pop-white shadow-pop">
              <Activity className="h-5 w-5 text-pop-maroon" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold uppercase text-pop-maroon md:text-2xl">Squad analytics</h2>
              <p className="font-display text-xs font-bold uppercase tracking-widest text-pop-maroon/80">Focus vs scrolling</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn-pop-secondary flex items-center gap-2 px-4 py-2 text-xs"
          >
            <span>Close</span>
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col gap-8 bg-pop-cream px-4 py-6 md:px-8 md:py-8">
          <div className="h-[300px] w-full rounded-3xl border-2 border-pop-maroon bg-pop-white p-4 shadow-pop">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockData} margin={{ top: 12, right: 12, left: 8, bottom: 8 }}>
                <XAxis dataKey="name" tick={{ fill: '#4B2927', fontWeight: 700 }} />
                <YAxis tick={{ fill: '#4B2927', fontWeight: 700 }} />
                <Tooltip
                  contentStyle={{
                    border: '2px solid #4B2927',
                    borderRadius: '16px',
                    boxShadow: '0 10px 28px rgba(75, 41, 39, 0.12)',
                    fontWeight: 700,
                    color: '#4B2927',
                    textTransform: 'uppercase',
                    backgroundColor: '#FFFFFF',
                  }}
                />
                <Legend wrapperStyle={{ fontWeight: 700, textTransform: 'uppercase', color: '#4B2927' }} />
                <Bar dataKey="focus" name="Focus (mins)" fill="#2FB1A2" stroke="#4B2927" strokeWidth={2} radius={[8, 8, 0, 0]} />
                <Bar dataKey="doomscrolling" name="Doomscroll (mins)" fill="#F4C92E" stroke="#4B2927" strokeWidth={2} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {mockData.map((member) => (
              <div
                key={member.name}
                className="flex items-center justify-between rounded-3xl border-2 border-pop-maroon bg-pop-white p-4 shadow-pop transition-all duration-200 hover:-translate-y-0.5"
              >
                <span className="font-display text-lg font-bold uppercase text-pop-maroon">{member.name}</span>
                <div className="text-right">
                  <div className="font-display text-sm font-bold uppercase text-pop-maroon">Focus: {member.focus}m</div>
                  <div className="font-display text-sm font-bold uppercase text-pop-maroon/80">Scroll: {member.doomscrolling}m</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
