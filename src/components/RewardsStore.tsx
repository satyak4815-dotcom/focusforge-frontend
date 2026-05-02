import React, { useState } from 'react';
import { Gift, ShoppingBag, CheckCircle2 } from 'lucide-react';

export default function RewardsStore() {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleRedeem = (brand: string) => {
    if (brand === 'zomato') {
      setToastMessage('🎉 ₹10 successfully added to your Zomato Wallet!');
    } else if (brand === 'amazon') {
      setToastMessage('🎉 ₹10 successfully added to your Amazon Pay balance!');
    }
    
    setShowToast(true);
    
    // Auto-hide the toast after 3 seconds
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const rewards = [
    {
      id: 'zomato',
      title: 'Zomato ₹10 Off',
      subtitle: 'Food Delivery',
      cost: 500,
      icon: Gift,
      color: 'bg-[#FDA4AF]',
      btnText: 'REDEEM REWARD',
      btnClass: 'bg-[#FDA4AF] text-slate-900 rounded-full border-2 border-[#111827] shadow-[4px_4px_0px_#111827] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_#111827] active:shadow-none active:translate-y-[4px] active:translate-x-[4px] transition-all',
    },
    {
      id: 'amazon',
      title: 'Amazon Gift Card',
      subtitle: '(₹50 Value)',
      cost: 2000,
      icon: ShoppingBag,
      color: 'bg-[#7DD3FC]',
      btnText: 'REDEEM REWARD',
      btnClass: 'bg-[#7DD3FC] text-slate-900 rounded-full border-2 border-[#111827] shadow-[4px_4px_0px_#111827] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_#111827] active:shadow-none active:translate-y-[4px] active:translate-x-[4px] transition-all',
    },
  ];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 h-full w-full">
        {rewards.map((r) => {
          const Icon = r.icon;
          return (
            <div key={r.id} className="brutalist-card p-4 md:p-8 flex flex-col justify-between bg-white group hover:bg-slate-50 w-full">
              <div className="flex items-start justify-between mb-6 md:mb-8">
                <div className={`w-12 h-12 md:w-16 md:h-16 rounded-full border-2 border-[#111827] ${r.color} flex items-center justify-center shadow-[4px_4px_0px_#111827] group-hover:translate-x-[2px] group-hover:translate-y-[2px] group-hover:shadow-[2px_2px_0px_#111827] transition-all`}>
                  <Icon className="w-6 h-6 md:w-8 md:h-8 text-slate-900" />
                </div>
                <div className="bg-white border-2 border-[#111827] px-3 md:px-4 py-1.5 md:py-2 rounded-full shadow-[2px_2px_0px_#111827]">
                  <span className="text-slate-900 font-black text-sm md:text-base">{r.cost} XP</span>
                </div>
              </div>
              
              <div>
                <p className="text-slate-900 font-black text-xl md:text-2xl uppercase tracking-tight mb-1">{r.title}</p>
                <p className="text-slate-700 font-bold text-xs md:text-sm mb-4 md:mb-6">{r.subtitle}</p>
                
                <button 
                  onClick={() => handleRedeem(r.id)}
                  className={`w-full py-3 md:py-4 font-black uppercase tracking-wider text-sm md:text-base ${r.btnClass}`}
                >
                  {r.btnText}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 md:bottom-8 md:right-8 md:left-auto md:translate-x-0 z-[100] animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="bg-[#111827] text-white px-6 py-4 rounded-xl shadow-[4px_4px_0px_#111827] border-2 border-slate-900 flex items-center gap-3 w-max max-w-[90vw]">
            <CheckCircle2 className="w-6 h-6 text-[#6EE7B7] shrink-0" />
            <p className="font-bold text-sm md:text-base">{toastMessage}</p>
          </div>
        </div>
      )}
    </>
  );
}
