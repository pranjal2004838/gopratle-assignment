'use client'

import { useState } from 'react'
import { ArrowLeft, ArrowRight, AlertCircle, Users2 } from 'lucide-react'

export default function Step2Category({ formData, updateFormData, onNext, onBack }) {
  const [error, setError] = useState('')
  const { category } = formData

  const validate = () => {
    if (category === 'planner') {
      if (!formData.plannerDetails?.serviceScope) return 'Please select the planning scope.'
      if (!formData.plannerDetails?.guestCount || formData.plannerDetails.guestCount <= 0) return 'Please enter expected guest count.'
    } else if (category === 'performer') {
      if (!formData.performerDetails?.performanceType) return 'Please select the type of performer.'
      if (!formData.performerDetails?.duration) return 'Please select performance duration.'
    } else if (category === 'crew') {
      if (!formData.crewDetails?.crewRole) return 'Please select the crew role.'
      if (!formData.crewDetails?.crewCount || formData.crewDetails.crewCount <= 0) return 'Please specify number of crew needed.'
      if (!formData.crewDetails?.shiftTiming) return 'Please select the shift timing.'
    }
    return null
  }

  const handleNext = (e) => {
    e.preventDefault()
    const err = validate()
    if (err) { setError(err); return }
    setError('')
    onNext()
  }

  // nested update helpers
  const patchPlanner = (fields) => updateFormData({ plannerDetails: { ...formData.plannerDetails, ...fields } })
  const patchPerformer = (fields) => updateFormData({ performerDetails: { ...formData.performerDetails, ...fields } })
  const patchCrew = (fields) => updateFormData({ crewDetails: { ...formData.crewDetails, ...fields } })

  const scopeLabel = {
    planner: 'Planner Scope & Event Vibe',
    performer: 'Performer Profile & Format',
    crew: 'Crew Roles & Staffing'
  }[category]

  return (
    <form onSubmit={handleNext} className="space-y-6">

      <div className="border-b border-slate-200 pb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Step 2: {scopeLabel}</h2>
          <p className="text-sm text-slate-500 mt-1">Fill in the specifics for this role.</p>
        </div>
        <span className="text-xs uppercase font-bold tracking-wider px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
          {category}
        </span>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ── PLANNER ── */}
      {category === 'planner' && (
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Planning Scope <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'Full Planning', desc: 'Ideation to full day-of execution' },
                { id: 'Partial Planning', desc: 'Vendor coordination & design only' },
                { id: 'Day-of Coordination', desc: 'On-site execution on event day' }
              ].map(opt => {
                const sel = formData.plannerDetails?.serviceScope === opt.id
                return (
                  <div
                    key={opt.id}
                    onClick={() => patchPlanner({ serviceScope: opt.id })}
                    className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${sel ? 'border-indigo-600 bg-indigo-50/60 ring-1 ring-indigo-500' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                  >
                    <p className="text-sm font-semibold text-slate-800">{opt.id}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{opt.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Expected Guest Count <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Users2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="number"
                  min="1"
                  placeholder="e.g. 150"
                  value={formData.plannerDetails?.guestCount || ''}
                  onChange={e => patchPlanner({ guestCount: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Theme / Vibe
              </label>
              <input
                type="text"
                placeholder="e.g. Royal Traditional, Boho Chic, Minimalist"
                value={formData.plannerDetails?.themeOrVibe || ''}
                onChange={e => patchPlanner({ themeOrVibe: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* ── PERFORMER ── */}
      {category === 'performer' && (
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Type of Performer / Artist <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {['Singer / Vocalist', 'Live Band', 'DJ', 'Stand-up Comic', 'Emcee / Anchor', 'Magician / Mentalist', 'Dance Troupe', 'Instrumentalist'].map(type => {
                const sel = formData.performerDetails?.performanceType === type
                return (
                  <button
                    type="button"
                    key={type}
                    onClick={() => patchPerformer({ performanceType: type })}
                    className={`p-2.5 rounded-lg border text-xs font-medium text-center transition-all ${sel ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}
                  >
                    {type}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Performance Duration <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.performerDetails?.duration || ''}
                onChange={e => patchPerformer({ duration: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="">Select...</option>
                <option value="30 - 45 Minutes">30 - 45 Minutes (Short Set)</option>
                <option value="1 - 2 Hours">1 - 2 Hours</option>
                <option value="2 - 3 Hours">2 - 3 Hours</option>
                <option value="3+ Hours / Multiple Sets">3+ Hours / Multiple Sets</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Genre / Language Preference
              </label>
              <input
                type="text"
                placeholder="e.g. Bollywood & Retro, English Pop, Sufi"
                value={formData.performerDetails?.performanceLanguage || ''}
                onChange={e => patchPerformer({ performanceLanguage: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* ── CREW ── */}
      {category === 'crew' && (
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Crew Role Needed <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {['Stagehands & Riggers', 'Sound / Audio Techs', 'Lighting Technicians', 'Ushers & Hospitality', 'Security & Bouncers', 'General Event Runners'].map(role => {
                const sel = formData.crewDetails?.crewRole === role
                return (
                  <button
                    type="button"
                    key={role}
                    onClick={() => patchCrew({ crewRole: role })}
                    className={`p-2.5 rounded-lg border text-xs font-medium text-center transition-all ${sel ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}
                  >
                    {role}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                How many crew members? <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                placeholder="e.g. 4"
                value={formData.crewDetails?.crewCount || ''}
                onChange={e => patchCrew({ crewCount: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Shift Timing <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.crewDetails?.shiftTiming || ''}
                onChange={e => patchCrew({ shiftTiming: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="">Select...</option>
                <option value="Full Day (8-10 Hours)">Full Day (8-10 Hours)</option>
                <option value="Half Day (4-5 Hours)">Half Day (4-5 Hours)</option>
                <option value="Evening / Night Production">Evening / Night Production</option>
                <option value="Overnight Setup / Tear Down">Overnight Setup / Tear Down</option>
              </select>
            </div>
          </div>
        </div>
      )}

      <div className="pt-4 flex items-center justify-between border-t border-slate-100">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm font-medium transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <button
          type="submit"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm shadow-sm transition-colors cursor-pointer"
        >
          Continue to Step 3
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </form>
  )
}
