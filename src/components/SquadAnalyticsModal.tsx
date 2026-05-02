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
    <div className="w-full flex flex-col mt-4">
      <div 
        className="brutalist-card w-full flex flex-col overflow-hidden"
        style={{ backgroundColor: 'var(--neo-yellow)', padding: 0 }}
      >
        {/* Header */}
        <div className="p-4 md:p-6 flex items-center justify-between" style={{ borderBottom: '4px solid #000' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center" style={{ border: '4px solid #000' }}>
              <Activity className="w-5 h-5 text-black" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-black text-black uppercase">Squad Analytics</h2>
              <p className="text-black text-xs font-black uppercase tracking-widest">Focus vs Doomscrolling</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="brutalist-button px-4 py-2 bg-white flex items-center justify-center gap-2 text-black font-black uppercase hover:bg-black hover:text-white transition-colors"
          >
            <span>Close</span>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 flex flex-col gap-8 bg-white" style={{ borderBottomLeftRadius: '1.5rem', borderBottomRightRadius: '1.5rem' }}>
          
          <div className="h-[300px] w-full bg-white p-4" style={{ border: '4px solid #000', boxShadow: '4px 4px 0px #000' }}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fill: '#000', fontFamily: 'inherit', fontWeight: '900' }} />
                <YAxis tick={{ fill: '#000', fontFamily: 'inherit', fontWeight: '900' }} />
                <Tooltip 
                  contentStyle={{ 
                    border: '4px solid #000', 
                    borderRadius: '0',
                    boxShadow: '4px 4px 0px 0px #000',
                    fontWeight: '900',
                    color: '#000',
                    textTransform: 'uppercase'
                  }} 
                />
                <Legend wrapperStyle={{ fontWeight: '900', textTransform: 'uppercase', color: '#000' }} />
                <Bar dataKey="focus" name="Focus (mins)" fill="var(--neo-turquoise)" stroke="#000" strokeWidth={4} />
                <Bar dataKey="doomscrolling" name="Doomscrolling (mins)" fill="var(--neo-coral)" stroke="#000" strokeWidth={4} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockData.map((member) => (
              <div key={member.name} className="bg-white p-4 flex items-center justify-between" style={{ border: '4px solid #000', boxShadow: '4px 4px 0px #000' }}>
                <span className="font-black text-lg uppercase text-black">{member.name}</span>
                <div className="text-right">
                  <div className="text-sm font-black text-black uppercase">Focus: {member.focus}m</div>
                  <div className="text-sm font-black text-black uppercase">Doom: {member.doomscrolling}m</div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
