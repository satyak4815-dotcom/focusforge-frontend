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
      } catch {
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
    <div className="brutalist-card mt-6 flex w-full flex-col bg-pop-cream p-6">
      <div className="mb-6 flex items-center gap-3 border-b-2 border-pop-maroon pb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-pop-maroon bg-pop-teal/30 shadow-pop">
          <History className="h-5 w-5 text-pop-maroon" />
        </div>
        <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-pop-maroon">Session history</h2>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-pop-teal" />
        </div>
      ) : error ? (
        <div className="rounded-2xl border-2 border-pop-maroon bg-zen-terracotta/20 p-4 text-center font-sans font-semibold text-pop-maroon">
          {error}
        </div>
      ) : history.length === 0 ? (
        <div className="p-8 text-center font-display font-bold uppercase text-pop-maroon/60">No sessions recorded yet. Start focusing.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-2 border-pop-maroon bg-pop-mustard/50">
                <th className="border-r-2 border-pop-maroon p-3 text-left font-display text-sm font-bold uppercase text-pop-maroon">
                  Date
                </th>
                <th className="border-r-2 border-pop-maroon p-3 text-left font-display text-sm font-bold uppercase text-pop-maroon">
                  Duration
                </th>
                <th className="border-r-2 border-pop-maroon p-3 text-left font-display text-sm font-bold uppercase text-pop-maroon">XP</th>
                <th className="p-3 text-left font-display text-sm font-bold uppercase text-pop-maroon">Status</th>
              </tr>
            </thead>
            <tbody>
              {history.map((session) => (
                <tr
                  key={session._id}
                  className="border-x-2 border-b-2 border-pop-maroon transition-colors hover:bg-pop-mustard/30"
                >
                  <td className="border-r-2 border-pop-maroon p-3 font-sans text-sm font-semibold text-pop-maroon">
                    {formatDate(session.startTime)}
                  </td>
                  <td className="border-r-2 border-pop-maroon p-3 font-sans text-sm font-semibold text-pop-maroon">
                    {calculateDuration(session.startTime, session.endTime)}
                  </td>
                  <td
                    className={`border-r-2 border-pop-maroon p-3 font-display text-sm font-bold ${
                      session.xpYield > 0 ? 'text-pop-teal' : 'text-pop-maroon/45'
                    }`}
                  >
                    {session.xpYield > 0 ? `+${session.xpYield}` : '0'}
                  </td>
                  <td className="flex items-center gap-2 p-3 font-display text-sm font-bold uppercase text-pop-maroon">
                    {session.status === 'completed' ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-pop-teal" /> Success
                      </>
                    ) : session.status === 'failed' ? (
                      <>
                        <XCircle className="h-4 w-4 text-zen-terracotta" /> Failed
                      </>
                    ) : (
                      <span className="text-pop-teal">Active</span>
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
