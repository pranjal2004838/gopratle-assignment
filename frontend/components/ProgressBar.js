'use client';

import { Check } from 'lucide-react';

export default function ProgressBar({ currentStep, category, setStep }) {
  // get dynamic label based on category chosen in step 1
  const getCategoryLabel = () => {
    if (category === 'planner') return 'Planner Scope';
    if (category === 'performer') return 'Performance Info';
    if (category === 'crew') return 'Crew Roles';
    return 'Role Specifics';
  };

  const getStep3Label = () => {
    if (category === 'planner') return 'Services & Budget';
    if (category === 'performer') return 'Rider & Budget';
    if (category === 'crew') return 'Pay & Requirements';
    return 'Details & Pay';
  };

  const steps = [
    { number: 1, title: 'Event Basics', desc: 'Core event info & role' },
    { number: 2, title: getCategoryLabel(), desc: 'Category-specific fields' },
    { number: 3, title: getStep3Label(), desc: 'Scope, budget & rider' },
    { number: 4, title: 'Review & Submit', desc: 'Verify and publish' },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto mb-8 px-2">
      {/* Step Indicator Bar */}
      <div className="relative flex items-center justify-between">
        {/* Background track line */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -translate-y-1/2 z-0" />
        
        {/* Active progress fill */}
        <div 
          className="absolute top-1/2 left-0 h-1 bg-indigo-600 -translate-y-1/2 z-0 transition-all duration-300"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((s) => {
          const isCompleted = currentStep > s.number;
          const isCurrent = currentStep === s.number;

          return (
            <div 
              key={s.number} 
              className="relative z-10 flex flex-col items-center"
            >
              <button
                type="button"
                disabled={!isCompleted && !isCurrent}
                onClick={() => {
                  // allow jumping back to completed steps
                  if (isCompleted) {
                    setStep(s.number);
                  }
                }}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-200 ${
                  isCompleted
                    ? 'bg-indigo-600 text-white cursor-pointer hover:bg-indigo-700 shadow-sm'
                    : isCurrent
                    ? 'bg-indigo-600 text-white ring-4 ring-indigo-100 shadow-md'
                    : 'bg-white text-slate-400 border-2 border-slate-200 cursor-not-allowed'
                }`}
              >
                {isCompleted ? <Check className="w-5 h-5 stroke-[2.5]" /> : s.number}
              </button>

              <div className="mt-2 text-center hidden sm:block">
                <p className={`text-xs font-semibold ${isCurrent ? 'text-indigo-600' : isCompleted ? 'text-slate-700' : 'text-slate-400'}`}>
                  {s.title}
                </p>
                <p className="text-[11px] text-slate-400 max-w-[110px] truncate">
                  {s.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile step title text */}
      <div className="mt-3 text-center sm:hidden">
        <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
          Step {currentStep} of 4:
        </span>
        <span className="text-sm font-bold text-slate-800 ml-1.5">
          {steps[currentStep - 1]?.title}
        </span>
      </div>
    </div>
  );
}
