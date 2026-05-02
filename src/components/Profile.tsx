import React from 'react';
import { User, Mail, Shield, Award } from 'lucide-react';
import { useAppContext } from '../AppContext';
import Skeleton from './Skeleton';

export default function Profile() {
  const { username, metrics, isLoadingProfile } = useAppContext();

  if (isLoadingProfile) {
    return (
      <div className="flex-1 px-4 md:px-10 py-6 md:py-10 flex flex-col gap-6 md:gap-10 max-w-4xl mx-auto w-full">
        <Skeleton width="300px" height="50px" />
        <Skeleton height="300px" />
        <Skeleton height="200px" />
      </div>
    );
  }

  return (
    <div className="flex-1 px-4 md:px-10 py-6 md:py-10 flex flex-col gap-6 md:gap-10 max-w-4xl mx-auto w-full">
      <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase mb-4">
        Your Profile
      </h2>
      
      <div className="brutalist-card bg-violet-300 p-6 md:p-10 flex flex-col md:flex-row items-center md:items-start gap-8 w-full">
        <div className="relative shrink-0">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-white border-2 border-[#111827] shadow-[4px_4px_0px_#111827] flex items-center justify-center text-slate-900 font-black text-6xl uppercase">
            {username ? username[0] : 'U'}
          </div>
          <div className="absolute bottom-0 right-0 bg-teal-400 p-2 border-2 border-[#111827] rounded-full shadow-[2px_2px_0px_#111827]">
            <Award className="w-6 h-6 text-slate-900" />
          </div>
        </div>
        
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-4xl font-black text-slate-900 uppercase">{username || 'Warrior'}</h3>
          <p className="text-slate-800 font-bold text-lg uppercase tracking-wider mt-1 mb-6">Lvl {metrics.level} Master</p>
          
          <div className="flex flex-col gap-4">
            <div className="bg-white border-2 border-[#111827] p-4 rounded-xl flex items-center gap-4 shadow-[2px_2px_0px_#111827]">
              <User className="w-6 h-6 text-slate-900" />
              <div className="text-left">
                <p className="text-xs font-bold uppercase text-slate-500">Username</p>
                <p className="text-base font-black text-slate-900 uppercase">{username}</p>
              </div>
            </div>
            
            <div className="bg-white border-2 border-[#111827] p-4 rounded-xl flex items-center gap-4 shadow-[2px_2px_0px_#111827]">
              <Shield className="w-6 h-6 text-slate-900" />
              <div className="text-left">
                <p className="text-xs font-bold uppercase text-slate-500">Rank Status</p>
                <p className="text-base font-black text-slate-900 uppercase">Focus Knight</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="brutalist-card bg-white p-6 w-full">
        <h4 className="text-xl font-black uppercase mb-6 text-slate-900 border-b-2 border-[#111827] pb-4">Account Settings</h4>
        <div className="flex flex-col gap-4">
          <button className="brutalist-button bg-yellow-300 text-slate-900 font-black uppercase text-sm py-3 text-left px-4">
            Change Password
          </button>
          <button className="brutalist-button bg-slate-200 text-slate-900 font-black uppercase text-sm py-3 text-left px-4">
            Notification Preferences
          </button>
          <button className="brutalist-button bg-rose-500 text-white font-black uppercase text-sm py-3 text-left px-4 mt-4">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
