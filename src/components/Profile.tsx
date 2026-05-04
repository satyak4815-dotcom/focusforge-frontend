import React from 'react';
import { User, Shield, Award } from 'lucide-react';
import { useAppContext } from '../AppContext';
import Skeleton from './Skeleton';

export default function Profile() {
  const { username, metrics, isLoadingProfile } = useAppContext();

  if (isLoadingProfile) {
    return (
      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-4 py-6 md:gap-10 md:px-10 md:py-10">
        <Skeleton width="300px" height="50px" />
        <Skeleton height="300px" />
        <Skeleton height="200px" />
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 px-4 py-6 md:gap-10 md:px-10 md:py-10">
      <h2 className="font-display text-3xl font-bold uppercase tracking-tight text-pop-maroon md:text-5xl">Your Profile</h2>

      <div className="brutalist-card flex w-full flex-col items-center gap-8 bg-pop-teal/20 p-6 md:flex-row md:items-start md:p-10">
        <div className="relative shrink-0">
          <div className="flex h-32 w-32 items-center justify-center rounded-full border-2 border-pop-maroon bg-pop-white font-display text-5xl font-bold uppercase text-pop-maroon shadow-pop md:h-40 md:w-40 md:text-6xl">
            {username ? username[0] : 'U'}
          </div>
          <div className="absolute bottom-0 right-0 rounded-full border-2 border-pop-maroon bg-pop-mustard p-2 shadow-pop">
            <Award className="h-6 w-6 text-pop-maroon" />
          </div>
        </div>

        <div className="flex-1 text-center md:text-left">
          <h3 className="font-display text-4xl font-bold uppercase text-pop-maroon">{username || 'Warrior'}</h3>
          <p className="mt-1 font-sans text-lg font-semibold uppercase tracking-wider text-pop-maroon">
            Lvl {metrics.level} Master
          </p>

          <div className="mt-6 flex flex-col gap-4">
            <div className="flex items-center gap-4 rounded-2xl border-2 border-pop-maroon bg-pop-white p-4 shadow-pop transition-all duration-200 hover:-translate-y-0.5">
              <User className="h-6 w-6 shrink-0 text-pop-maroon" />
              <div className="text-left">
                <p className="font-display text-xs font-bold uppercase tracking-wider text-pop-maroon/70">Username</p>
                <p className="font-sans text-base font-bold uppercase text-pop-maroon">{username}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-2xl border-2 border-pop-maroon bg-pop-white p-4 shadow-pop transition-all duration-200 hover:-translate-y-0.5">
              <Shield className="h-6 w-6 shrink-0 text-pop-maroon" />
              <div className="text-left">
                <p className="font-display text-xs font-bold uppercase tracking-wider text-pop-maroon/70">Rank status</p>
                <p className="font-sans text-base font-bold uppercase text-pop-maroon">Focus Knight</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="brutalist-card bg-pop-white p-6 md:p-8">
        <h4 className="mb-6 border-b-2 border-pop-maroon pb-4 font-display text-xl font-bold uppercase text-pop-maroon">
          Account settings
        </h4>
        <div className="flex flex-col gap-3">
          <button type="button" className="btn-pop-secondary w-full justify-start py-3 text-left">
            Change password
          </button>
          <button type="button" className="btn-pop-secondary w-full justify-start border-pop-maroon bg-pop-cream py-3 text-left">
            Notification preferences
          </button>
          <button type="button" className="mt-2 w-full rounded-full border-2 border-pop-maroon bg-zen-terracotta py-3 font-display text-sm font-bold uppercase tracking-wide text-pop-white shadow-pop transition-all duration-200 hover:-translate-y-0.5">
            Delete account
          </button>
        </div>
      </div>
    </div>
  );
}
