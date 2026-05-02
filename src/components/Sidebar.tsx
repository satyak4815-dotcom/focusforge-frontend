import React from 'react';
import { Zap, Users, LayoutDashboard, Trophy } from 'lucide-react';
import { useAppContext } from '../AppContext';
import Skeleton from './Skeleton';

interface SidebarProps {
  currentView: 'dashboard' | 'squad' | 'leaderboard' | 'profile';
  setCurrentView: (view: 'dashboard' | 'squad' | 'leaderboard' | 'profile') => void;
}

export default function Sidebar({ currentView, setCurrentView }: SidebarProps) {
  const { username, metrics, isLoadingProfile } = useAppContext();

  // Animation trigger for XP updates
  const [xpKey, setXpKey] = React.useState(0);
  React.useEffect(() => {
    if (metrics.xpEarned > 0) {
      setXpKey(prev => prev + 1);
    }
  }, [metrics.xpEarned]);

  return (
    <aside style={{
      width: '280px',
      flexShrink: 0,
      height: '100vh',
      position: 'sticky',
      top: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      padding: '24px',
      backgroundColor: '#fff',
      borderRight: '2px solid var(--neo-border)',
      zIndex: 10,
      overflowY: 'auto',
    }}>
      {/* Profile Card */}
      <div
        className="brutalist-card"
        style={{ backgroundColor: 'var(--neo-orange)', padding: '16px', display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer' }}
        onClick={() => setCurrentView('profile')}
      >
        <div style={{ position: 'relative' }}>
          {isLoadingProfile ? (
            <Skeleton width="56px" height="56px" pill />
          ) : (
            <>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'var(--neo-purple)',
                border: '2px solid var(--neo-border)',
                boxShadow: '4px 4px 0px var(--neo-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 900,
                fontSize: '20px',
              }}>
                {username ? username.charAt(0).toUpperCase() : 'U'}
              </div>
              <span style={{
                position: 'absolute',
                bottom: '-2px',
                right: '-2px',
                width: '16px',
                height: '16px',
                backgroundColor: '#22c55e',
                border: '2px solid var(--neo-border)',
                borderRadius: '50%',
              }} />
            </>
          )}
        </div>
        <div>
          {isLoadingProfile ? (
            <>
              <Skeleton width="100px" height="20px" className="mb-2" />
              <Skeleton width="70px" height="14px" />
            </>
          ) : (
            <>
              <p style={{ color: '#000', fontWeight: 900, fontSize: '18px', lineHeight: 1.2 }}>{username || 'User'}</p>
              <p style={{ color: '#000', fontWeight: 700, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Lvl {metrics.level} Master</p>
            </>
          )}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <button
          onClick={() => setCurrentView('dashboard')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 16px',
            textTransform: 'uppercase',
            fontSize: '13px',
            fontWeight: 900,
            color: '#000',
            backgroundColor: currentView === 'dashboard' ? 'var(--neo-turquoise)' : '#fff',
            border: '2px solid var(--neo-border)',
            borderRadius: '16px',
            boxShadow: '4px 4px 0px var(--neo-border)',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          <LayoutDashboard style={{ width: '20px', height: '20px', color: '#000' }} /> Dashboard
        </button>
        <button
          onClick={() => setCurrentView('squad')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 16px',
            textTransform: 'uppercase',
            fontSize: '13px',
            fontWeight: 900,
            color: '#000',
            backgroundColor: currentView === 'squad' ? 'var(--neo-pink)' : '#fff',
            border: '2px solid var(--neo-border)',
            borderRadius: '16px',
            boxShadow: '4px 4px 0px var(--neo-border)',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          <Users style={{ width: '20px', height: '20px', color: '#000' }} /> Squad Sync
        </button>
        <button
          onClick={() => setCurrentView('leaderboard')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 16px',
            textTransform: 'uppercase',
            fontSize: '13px',
            fontWeight: 900,
            color: '#000',
            backgroundColor: currentView === 'leaderboard' ? 'var(--neo-yellow)' : '#fff',
            border: '2px solid var(--neo-border)',
            borderRadius: '16px',
            boxShadow: '4px 4px 0px var(--neo-border)',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          <Trophy style={{ width: '20px', height: '20px', color: '#000' }} /> Leaderboard
        </button>
      </div>

      {/* Focus Wallet Card */}
      <div
        key={xpKey}
        className={`brutalist-card ${xpKey > 0 ? 'animate-stat-pop' : ''}`}
        style={{ backgroundColor: 'var(--neo-yellow)', padding: '20px', width: '100%' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
          <Zap className="w-5 h-5 text-black" style={{ fill: '#000' }} />
          <p style={{ fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#000' }}>Focus Wallet</p>
        </div>
        {isLoadingProfile ? (
          <Skeleton width="120px" height="48px" className="mb-2" />
        ) : (
          <p style={{ fontSize: '3rem', fontWeight: 900, color: '#000', letterSpacing: '-0.05em', marginBottom: '8px', lineHeight: 1 }}>{Math.floor(metrics.xpEarned).toLocaleString()}</p>
        )}
        <div style={{ display: 'inline-block', backgroundColor: '#fff', borderRadius: '9999px', padding: '4px 12px', border: '2px solid var(--neo-border)' }}>
          <p style={{ color: '#000', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase' }}>XP Earned</p>
        </div>
      </div>

      {/* Squad Sync Leaderboard */}
      <div className="brutalist-card" style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#fff', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
          <Users className="w-5 h-5 text-black" />
          <p style={{ color: '#000', fontWeight: 900, fontSize: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Squad Sync</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[
            { name: 'Sarah', status: 'Focused', active: true, color: 'var(--neo-turquoise)' },
            { name: 'Alex', status: 'Focused', active: true, color: 'var(--neo-purple)' },
            { name: 'Jordan', status: 'Resting', active: false, color: '#fff' },
          ].map((m, idx) => (
            <div key={m.name}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: m.color,
                  border: '2px solid var(--neo-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: 900,
                  fontSize: '16px',
                  flexShrink: 0,
                }}>
                  {m.name[0]}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ color: '#000', fontWeight: 900, fontSize: '14px' }}>{m.name}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                    <span style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: m.active ? '#22c55e' : '#ef4444',
                      border: '2px solid var(--neo-border)',
                    }} />
                    <p style={{ color: '#000', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>{m.status}</p>
                  </div>
                </div>
              </div>
              {idx < 2 && <div style={{ height: '2px', width: '100%', backgroundColor: 'var(--neo-border)', marginTop: '14px' }} />}
            </div>
          ))}
        </div>

        <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
          <button className="brutalist-button" style={{ width: '100%', padding: '12px', backgroundColor: '#fff', textTransform: 'uppercase', fontSize: '13px' }}>
            + Invite Friend
          </button>
        </div>
      </div>
    </aside>
  );
}
