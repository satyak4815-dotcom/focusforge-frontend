import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAppContext } from '../AppContext';
import Skeleton from './Skeleton';

const data = [
  { day: 'Mon', focus: 4.5, doom: 2.1 },
  { day: 'Tue', focus: 5.2, doom: 1.8 },
  { day: 'Wed', focus: 4.8, doom: 2.5 },
  { day: 'Thu', focus: 6.1, doom: 1.2 },
  { day: 'Fri', focus: 5.9, doom: 1.5 },
  { day: 'Sat', focus: 3.5, doom: 3.2 },
  { day: 'Sun', focus: 4.2, doom: 2.8 },
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="brutalist-card p-4 !rounded-2xl bg-white border-2 border-[#111827] shadow-[4px_4px_0px_0px_rgba(17,24,39,1)]">
        <p className="text-slate-900 font-black mb-2 uppercase">{label}</p>
        {payload.map((p) => (
          <div key={p.name} className="flex items-center gap-2 text-sm mb-1">
            <span className="w-3 h-3 rounded-full border-2 border-[#111827]" style={{ backgroundColor: p.color }} />
            <span className="text-slate-700 font-bold uppercase">{p.name === 'focus' ? 'Focus' : 'Doomscrolling'}:</span>
            <span className="font-black text-slate-900">{p.value}h</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function DopamineChart() {
  const { isLoadingProfile } = useAppContext();

  if (isLoadingProfile) {
    return (
      <div className="brutalist-card p-8 bg-white w-full h-[450px]">
        <Skeleton width="250px" height="30px" className="mb-2" />
        <Skeleton width="200px" height="20px" className="mb-8" />
        <Skeleton width="100%" height="300px" />
      </div>
    );
  }

  return (
    <div className="brutalist-card p-4 md:p-8 h-full flex flex-col bg-white w-full">
      <div className="mb-4 md:mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0">
        <div>
          <h3 className="text-slate-900 font-black text-xl md:text-2xl uppercase tracking-tight">Focus vs Doomscrolling</h3>
          <p className="text-slate-700 font-bold text-sm md:text-base uppercase opacity-70">Your 7-day attention breakdown</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 md:w-4 md:h-4 rounded-full border-2 border-[#111827]" style={{ backgroundColor: 'var(--neo-purple)' }} />
            <span className="font-black text-slate-900 text-sm md:text-base uppercase">Focus</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 md:w-4 md:h-4 rounded-full border-2 border-[#111827]" style={{ backgroundColor: 'var(--neo-orange)' }} />
            <span className="font-black text-slate-900 text-sm md:text-base uppercase">Doom</span>
          </div>
        </div>
      </div>
      
      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="0" stroke="#cbd5e1" vertical={false} strokeWidth={2} />
            <XAxis 
              dataKey="day" 
              tick={{ fill: '#111827', fontSize: 12, fontWeight: 800 }} 
              axisLine={{ stroke: '#111827', strokeWidth: 2 }} 
              tickLine={false} 
              dy={15}
            />
            <YAxis 
              domain={[0, 8]}
              tick={{ fill: '#111827', fontSize: 12, fontWeight: 800 }} 
              axisLine={false} 
              tickLine={false} 
              dx={-15}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#111827', strokeWidth: 2, strokeDasharray: '4 4' }} />
            <Line 
              type="monotone" 
              dataKey="focus" 
              stroke="var(--neo-purple)" 
              strokeWidth={4}
              dot={{ r: 4, strokeWidth: 2, fill: '#fff', stroke: 'var(--neo-purple)' }}
              activeDot={{ r: 6, strokeWidth: 2, fill: 'var(--neo-purple)', stroke: '#111827' }}
            />
            <Line 
              type="monotone" 
              dataKey="doom" 
              stroke="var(--neo-orange)" 
              strokeWidth={4}
              dot={{ r: 4, strokeWidth: 2, fill: '#fff', stroke: 'var(--neo-orange)' }}
              activeDot={{ r: 6, strokeWidth: 2, fill: 'var(--neo-orange)', stroke: '#111827' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
