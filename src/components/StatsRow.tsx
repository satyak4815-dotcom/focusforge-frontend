import React from 'react';
import { Timer, ShieldAlert, Target } from 'lucide-react';
import { useAppContext } from '../AppContext';
import Skeleton from './Skeleton';

export default function StatsRow() {
  const { metrics, isLoadingProfile, blockedSites } = useAppContext();

  // Animation keys for stats
  const [statsKey, setStatsKey] = React.useState(0);
  React.useEffect(() => {
    setStatsKey(prev => prev + 1);
  }, [metrics.focusHours, blockedSites.length, metrics.nextRewardGoal]);

  const stats = [
    {
      icon: Timer,
      label: 'Focus Hours',
      value: `${metrics.focusHours}h`,
      bg: 'var(--neo-purple)',
    },
    {
      icon: ShieldAlert,
      label: 'Distractions Blocked',
      value: `${blockedSites.length}`,
      bg: 'var(--neo-turquoise)',
    },
    {
      icon: Target,
      label: 'Next Reward Goal',
      value: `${metrics.nextRewardGoal.toLocaleString()} XP`,
      bg: 'var(--neo-yellow)',
    },
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '24px',
      width: '100%',
      maxWidth: '1200px',
    }}>
      {stats.map((s) => {
        const Icon = s.icon;
        return (
          <div
            key={`${s.label}-${statsKey}`}
            className={`brutalist-card ${statsKey > 1 ? 'animate-stat-pop' : ''}`}
            style={{
              backgroundColor: s.bg,
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              maxWidth: '400px',
              width: '100%',
            }}
          >
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: '#fff',
              border: '2px solid var(--neo-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '14px',
            }}>
              <Icon className="w-7 h-7 text-black" />
            </div>
            {isLoadingProfile ? (
              <Skeleton width="120px" height="38px" className="mb-[6px]" />
            ) : (
              <p style={{ fontSize: '2.2rem', fontWeight: 900, color: '#000', letterSpacing: '-0.03em', marginBottom: '6px' }}>{s.value}</p>
            )}
            <div style={{ backgroundColor: '#fff', borderRadius: '9999px', padding: '4px 16px', border: '2px solid var(--neo-border)' }}>
              <p style={{ color: '#000', fontSize: '12px', fontWeight: 900, textTransform: 'uppercase' }}>{s.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
