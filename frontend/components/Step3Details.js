'use client'

import { useState } from 'react'
import { ArrowLeft, ArrowRight, AlertCircle, Check } from 'lucide-react'

const PLANNER_SERVICES = [
  'Decor & Floral Design',
  'Catering & Menu Curation',
  'Photography & Videography',
  'Sound & Stage Lighting',
  'Guest RSVP & Logistics',
  'Artist & Talent Booking',
  'Invitations & Gifting',
  'On-ground Hostesses'
]

export default function Step3Details({ formData, updateFormData, onNext, onBack }) {
  const [error, setError] = useState('')
  const { category } = formData

  const validate = () => {
    if (category === 'planner') {
      if (!formData.plannerDetails?.budget || formData.plannerDetails.budget <= 0) return 'Please enter the planning budget.'
      if (!formData.plannerDetails?.servicesNeeded?.length) return 'Please select at least one service.'
    } else if (category === 'performer') {
      if (!formData.performerDetails?.soundEquipmentProvided) return 'Please specify the sound/PA arrangement.'
      if (!formData.performerDetails?.expectedBudget || formData.performerDetails.expectedBudget <= 0) return 'Please enter the expected budget.'
    } else if (category === 'crew') {
      if (!formData.crewDetails?.experienceLevel) return 'Please select required experience level.'
      if (!formData.crewDetails?.dailyPayPerPerson || formData.crewDetails.dailyPayPerPerson <= 0) return 'Please enter daily pay per person.'
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

  const patchPlanner = (fields) => updateFormData({ plannerDetails: { ...formData.plannerDetails, ...fields } })
  const patchPerformer = (fields) => updateFormData({ performerDetails: { ...formData.performerDetails, ...fields } })
  const patchCrew = (fields) => updateFormData({ crewDetails: { ...formData.crewDetails, ...fields } })

  const toggleService = (svc) => {
    const current = formData.plannerDetails?.servicesNeeded || []
    const updated = current.includes(svc) ? current.filter(s => s !== svc) : [...current, svc]
    patchPlanner({ servicesNeeded: updated })
  }

  const step3Title = {
    planner: 'Services & Budget Breakdown',
    performer: 'Technical Rider & Compensation',
    crew: 'Pay Rate & Crew Specs'
  }[category]

  return (
    <form onSubmit={handleNext} className="space-y-6">

      <div className="border-b border-slate-200 pb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Step 3: {step3Title}</h2>
          <p className="text-sm text-slate-500 mt-1">Add the compensation and scope details.</p>
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
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Estimated Budget (INR) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold text-sm">₹</span>
              <input
                type="number"
                min="1000"
                step="500"
                placeholder="e.g. 150000"
                value={formData.plannerDetails?.budget || ''}
                onChange={e => patchPlanner({ budget: e.target.value })}
                className="w-full pl-8 pr-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              />
            </div>
            <p className="text-xs text-slate-400 mt-1">This helps planners tailor their proposal to your budget.</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Services Needed from the Planner <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PLANNER_SERVICES.map(svc => {
                const checked = (formData.plannerDetails?.servicesNeeded || []).includes(svc)
                return (
                  <button
                    type="button"
                    key={svc}
                    onClick={() => toggleService(svc)}
                    className={`flex items-center justify-between p-2.5 rounded-lg border text-left text-xs transition-colors ${checked ? 'bg-indigo-50 border-indigo-500 text-indigo-900 font-semibold' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                  >
                    <span>{svc}</span>
                    {checked && <Check className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0 ml-1" />}
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Special Notes / Client Instructions
            </label>
            <textarea
              rows={3}
              placeholder="Any specific decor colors, preferences, or things the planner should know..."
              value={formData.plannerDetails?.specialNotes || ''}
              onChange={e => patchPlanner({ specialNotes: e.target.value })}
              className="w-full p-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            />
          </div>
        </div>
      )}

      {/* ── PERFORMER ── */}
      {category === 'performer' && (
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Sound / PA Equipment Arrangement <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'Venue provides PA & Mic', label: 'Venue provides PA & Mic', desc: 'Venue has sound setup ready' },
                { id: 'Performer brings own sound', label: 'Performer brings own', desc: 'Artist carries speakers & mixer' },
                { id: 'Negotiable / Need Discussion', label: 'Negotiate / Discuss', desc: 'Will finalize based on tech rider' }
              ].map(opt => {
                const sel = formData.performerDetails?.soundEquipmentProvided === opt.id
                return (
                  <div
                    key={opt.id}
                    onClick={() => patchPerformer({ soundEquipmentProvided: opt.id })}
                    className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${sel ? 'border-indigo-600 bg-indigo-50/60 ring-1 ring-indigo-500' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                  >
                    <p className="text-xs font-bold text-slate-800">{opt.label}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{opt.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Expected Honorarium (INR) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold text-sm">₹</span>
                <input
                  type="number"
                  min="500"
                  placeholder="e.g. 25000"
                  value={formData.performerDetails?.expectedBudget || ''}
                  onChange={e => patchPerformer({ expectedBudget: e.target.value })}
                  className="w-full pl-8 pr-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Target Audience
              </label>
              <select
                value={formData.performerDetails?.audienceProfile || ''}
                onChange={e => patchPerformer({ audienceProfile: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="">Select audience...</option>
                <option value="Family & Kids">Family & Kids</option>
                <option value="Corporate Professionals">Corporate Professionals</option>
                <option value="Youth / College Students">Youth / College Students</option>
                <option value="High-Energy Party / Club Crowd">High-Energy Party / Club Crowd</option>
                <option value="Mixed / All Age Groups">Mixed / All Age Groups</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Song Requests / Performance Guidelines
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Start with acoustic set, then upbeat dance tracks. Must be family friendly..."
              value={formData.performerDetails?.specialRequests || ''}
              onChange={e => patchPerformer({ specialRequests: e.target.value })}
              className="w-full p-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            />
          </div>
        </div>
      )}

      {/* ── CREW ── */}
      {category === 'crew' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Experience Level Required <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.crewDetails?.experienceLevel || ''}
                onChange={e => patchCrew({ experienceLevel: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="">Select level...</option>
                <option value="Entry Level / Freshers Welcome">Entry Level / Freshers Welcome</option>
                <option value="Experienced (1-2 Years in Events)">Experienced (1-2 Years in Events)</option>
                <option value="Senior / Technical Specialist">Senior / Technical Specialist</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Dress Code / Attire
              </label>
              <select
                value={formData.crewDetails?.dressCode || ''}
                onChange={e => patchCrew({ dressCode: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="">Select...</option>
                <option value="All Black Formals (Standard Crew)">All Black Formals</option>
                <option value="Smart Casuals">Smart Casuals</option>
                <option value="Event T-shirt Provided on site">Event T-shirt (provided)</option>
                <option value="Security Uniform">Security Uniform</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Daily / Shift Pay per Person (INR) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold text-sm">₹</span>
              <input
                type="number"
                min="200"
                placeholder="e.g. 1500"
                value={formData.crewDetails?.dailyPayPerPerson || ''}
                onChange={e => patchCrew({ dailyPayPerPerson: e.target.value })}
                className="w-full pl-8 pr-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              />
            </div>
            {/* total payout calculator — small but useful UX touch */}
            {formData.crewDetails?.crewCount && formData.crewDetails?.dailyPayPerPerson && (
              <p className="text-xs text-indigo-600 font-semibold mt-1">
                Estimated total: ₹{(Number(formData.crewDetails.crewCount) * Number(formData.crewDetails.dailyPayPerPerson)).toLocaleString('en-IN')} for {formData.crewDetails.crewCount} crew members
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Special Instructions / Physical Requirements
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Heavy lifting involved, safety shoes required, meals will be provided on site..."
              value={formData.crewDetails?.specialInstructions || ''}
              onChange={e => patchCrew({ specialInstructions: e.target.value })}
              className="w-full p-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            />
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
          Review & Submit (Step 4)
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </form>
  )
}
