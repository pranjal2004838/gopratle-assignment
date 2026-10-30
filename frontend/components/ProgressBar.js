'use client'

import { Check } from 'lucide-react'

export default function ProgressBar({ currentStep, category, setStep }) {

  const step2Label = () => {
    if (category === 'planner') return 'Planner Scope'
    if (category === 'performer') return 'Performer Info'
    if (category === 'crew') return 'Crew Roles'
    return 'Role Details'
  }

  const step3Label = () => {
    if (category === 'planner') return 'Services & Budget'
    if (category === 'performer') return 'Rider & Budget'
    if (category === 'crew') return 'Pay & Requirements'
    return 'Budget & Details'
  }

  const steps = [
    { n: 1, title: 'Event Basics' },
    { n: 2, title: step2Label() },
    { n: 3, title: step3Label() },
    { n: 4, title: 'Review & Submit' }
  ]

  return (
    <div className="w-full max-w-4xl mx-auto mb-8 px-2">
      <div className="relative flex items-center justify-between">

        {/* grey track behind everything */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -translate-y-1/2 z-0" />

        {/* colored fill based on how far we are */}
        <div
          className="absolute top-1/2 left-0 h-1 bg-indigo-600 -translate-y-1/2 z-0 transition-all duration-300"
          style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
        />

        {steps.map((s) => {
          const done = currentStep > s.n
          const active = currentStep === s.n

          return (
            <div key={s.n} className="relative z-10 flex flex-col items-center">
              <button
                type="button"
                disabled={!done}
                onClick={() => done && setStep(s.n)}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                  done
                    ? 'bg-indigo-600 text-white cursor-pointer hover:bg-indigo-700 shadow-sm'
                    : active
                    ? 'bg-indigo-600 text-white ring-4 ring-indigo-100 shadow-md cursor-default'
                    : 'bg-white text-slate-400 border-2 border-slate-200 cursor-not-allowed'
                }`}
              >
                {done ? <Check className="w-5 h-5 stroke-[2.5]" /> : s.n}
              </button>

              <p className={`mt-2 text-xs font-semibold hidden sm:block ${active ? 'text-indigo-600' : done ? 'text-slate-700' : 'text-slate-400'}`}>
                {s.title}
              </p>
            </div>
          )
        })}
      </div>

      {/* mobile — show step title as text below the bar */}
      <div className="mt-3 text-center sm:hidden">
        <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
          Step {currentStep} of 4 —
        </span>
        <span className="text-sm font-semibold text-slate-800 ml-1">
          {steps[currentStep - 1]?.title}
        </span>
      </div>
    </div>
  )
}
