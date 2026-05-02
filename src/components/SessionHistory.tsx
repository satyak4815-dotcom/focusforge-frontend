import React, { useEffect, useState } from 'react';
import { History, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { sessions, Session } from '../services/api';

export default function SessionHistory() {
  const [history, setHistory] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchHistory = async () => {
      try {
        const res = await sessions.getHistory();
        if (isMounted) {
          setHistory(res.sessions || []);
          setError(null);
        }
      } catch (err: any) {
        if (isMounted) {
          setError('Failed to load session history.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchHistory();

    // Set up polling every 5 seconds
    const intervalId = setInterval(fetchHistory, 5000);

    return () => { 
      isMounted = false; 
      clearInterval(intervalId);
    };
  }, []);

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(d);
  };

  const calculateDuration = (start: string, end?: string) => {
    if (!end) return '-';
    const s = new Date(start).getTime();
    const e = new Date(end).getTime();
    const mins = Math.round((e - s) / 60000);
    return `${mins}m`;
  };

  return (
    <div className="brutalist-card bg-white p-6 w-full flex flex-col mt-6">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-[#111827]">
        <div className="w-10 h-10 bg-violet-300 border-[2px] border-[#111827] rounded-full flex items-center justify-center shadow-[2px_2px_0px_#111827]">
          <History className="w-5 h-5 text-[#111827]" />
        </div>
        <h2 className="text-2xl font-black text-[#111827] uppercase tracking-tighter">Session History</h2>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="w-8 h-8 animate-spin text-[#111827]" />
        </div>
      ) : error ? (
        <div className="bg-red-100 border-[2px] border-[#111827] p-4 text-center font-bold text-red-700">
          {error}
        </div>
      ) : history.length === 0 ? (
        <div className="text-center p-8 font-bold text-slate-500 uppercase">
          No sessions recorded yet. Start focusing!
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#FCD34D] border-[2px] border-[#111827]">
                <th className="p-3 text-left font-black uppercase text-sm border-r-[2px] border-[#111827]">Date</th>
                <th className="p-3 text-left font-black uppercase text-sm border-r-[2px] border-[#111827]">Duration</th>
                <th className="p-3 text-left font-black uppercase text-sm border-r-[2px] border-[#111827]">XP</th>
                <th className="p-3 text-left font-black uppercase text-sm">Status</th>
              </tr>
            </thead>
            <tbody>
              {history.map((session) => (
                <tr key={session._id} className="border-x-[2px] border-b-[2px] border-[#111827] hover:bg-slate-50 transition-colors">
                  <td className="p-3 font-bold text-sm border-r-[2px] border-[#111827]">
                    {formatDate(session.startTime)}
                  </td>
                  <td className="p-3 font-bold text-sm border-r-[2px] border-[#111827]">
                    {calculateDuration(session.startTime, session.endTime)}
                  </td>
                  <td className={`p-3 font-black text-sm border-r-[2px] border-[#111827] ${session.xpYield > 0 ? 'text-green-600' : 'text-slate-400'}`}>
                    {session.xpYield > 0 ? `+${session.xpYield}` : '0'}
                  </td>
                  <td className="p-3 font-bold text-sm flex items-center gap-2 uppercase">
                    {session.status === 'completed' ? (
                      <><CheckCircle2 className="w-4 h-4 text-green-500" /> Success</>
                    ) : session.status === 'failed' ? (
                      <><XCircle className="w-4 h-4 text-red-500" /> Failed</>
                    ) : (
                      <span className="text-blue-500">Active</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
