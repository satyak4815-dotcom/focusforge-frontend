import React, { useState } from 'react';
import { Gift, ShoppingBag, CheckCircle2 } from 'lucide-react';

export default function RewardsStore() {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleRedeem = (brand: string) => {
    if (brand === 'zomato') {
      setToastMessage('₹10 successfully added to your Zomato wallet.');
    } else if (brand === 'amazon') {
      setToastMessage('₹10 successfully added to your Amazon Pay balance.');
    }

    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const rewards = [
    {
      id: 'zomato',
      title: 'Zomato ₹10 Off',
      subtitle: 'Food delivery',
      cost: 500,
      icon: Gift,
      color: 'bg-pop-mustard/80',
      btnText: 'Redeem reward',
      btnClass:
        'bg-pop-mustard text-pop-maroon rounded-full border-2 border-pop-maroon shadow-pop transition-all duration-200 hover:-translate-y-0.5 hover:shadow-pop-md',
    },
    {
      id: 'amazon',
      title: 'Amazon Gift Card',
      subtitle: '(₹50 value)',
      cost: 2000,
      icon: ShoppingBag,
      color: 'bg-pop-teal/40',
      btnText: 'Redeem reward',
      btnClass:
        'bg-pop-teal text-pop-white rounded-full border-2 border-pop-maroon shadow-pop transition-all duration-200 hover:-translate-y-0.5 hover:shadow-pop-md',
    },
  ];

  return (
    <>
      <div className="grid h-full w-full grid-cols-1 gap-4 md:grid-cols-2 md:gap-8">
        {rewards.map((r) => {
          const Icon = r.icon;
          return (
            <div
              key={r.id}
              className="brutalist-card group flex w-full flex-col justify-between bg-pop-cream p-4 transition-colors duration-200 hover:bg-pop-mustard/30 md:p-8"
            >
              <div className="mb-6 flex items-start justify-between md:mb-8">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full border-2 border-pop-maroon shadow-pop transition-all duration-200 group-hover:-translate-y-0.5 md:h-16 md:w-16 ${r.color}`}
                >
                  <Icon className="h-6 w-6 text-pop-maroon md:h-8 md:w-8" />
                </div>
                <div className="rounded-full border-2 border-pop-maroon bg-pop-white px-3 py-1.5 shadow-pop md:px-4 md:py-2">
                  <span className="font-display text-sm font-bold text-pop-maroon md:text-base">{r.cost} XP</span>
                </div>
              </div>

              <div>
                <p className="mb-1 font-display text-xl font-bold uppercase tracking-tight text-pop-maroon md:text-2xl">{r.title}</p>
                <p className="mb-4 font-sans text-xs font-semibold text-pop-maroon md:mb-6 md:text-sm">{r.subtitle}</p>

                <button
                  type="button"
                  onClick={() => handleRedeem(r.id)}
                  className={`w-full py-3 font-display text-sm font-bold uppercase tracking-wider md:py-4 md:text-base ${r.btnClass}`}
                >
                  {r.btnText}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {showToast && (
        <div className="fixed bottom-4 left-1/2 z-[100] -translate-x-1/2 duration-300 md:bottom-8 md:left-auto md:right-8 md:translate-x-0">
          <div className="flex w-max max-w-[90vw] items-center gap-3 rounded-2xl border-2 border-pop-maroon bg-pop-maroon px-6 py-4 text-pop-white shadow-pop-md">
            <CheckCircle2 className="h-6 w-6 shrink-0 text-pop-mustard" />
            <p className="font-sans text-sm font-semibold md:text-base">{toastMessage}</p>
          </div>
        </div>
      )}
    </>
  );
}
