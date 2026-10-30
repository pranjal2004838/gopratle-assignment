'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, Calendar, MapPin, Building, AlertCircle, Loader2, Layers, PlusCircle, User, Mail, Phone } from 'lucide-react'

export default function Step4Review({ formData, updateFormData, onBack, onReset }) {
  const [submitting, setSubmitting] = useState(false)
  const [submitErr, setSubmitErr] = useState('')
  const [saved, setSaved] = useState(null)

  const { category } = formData

  const fmtDate = (d) => {
    if (!d) return ''
    try {
      return new Date(d).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })
    } catch {
      return d
    }
  }

  const patchContact = (key, val) => {
    updateFormData({ contactInfo: { ...(formData.contactInfo || {}), [key]: val } })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitErr('')
    setSubmitting(true)

    try {
      // normalize the API URL — handles cases where Vercel env var has trailing slash or no /api
      let api = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').trim().replace(/\/+$/, '')
      if (!api.endsWith('/api') && !api.includes('localhost')) {
        api = api + '/api'
      }

      const res = await fetch(`${api}/requirements`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const json = await res.json()

      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Server returned an error')
      }

      setSaved(json.data)
    } catch (err) {
      console.error('Submit failed:', err)
      setSubmitErr(err.message || 'Could not reach the backend. Make sure the server is running.')
    } finally {
      setSubmitting(false)
    }
  }

  // success screen after submission
  if (saved) {
    return (
      <div className="text-center py-8 space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
        </div>

        <div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wider">
            Saved to MongoDB
          </span>
          <h2 className="text-2xl font-bold text-slate-900 mt-2">Requirement Posted!</h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto mt-1">
            Your requirement has been saved under{' '}
            <strong className="text-indigo-600 uppercase">{saved.category}</strong>.
          </p>
        </div>

        {/* show MongoDB document reference */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 max-w-md mx-auto text-left space-y-2 text-xs">
          <div className="flex justify-between items-center pb-1.5 border-b border-slate-200">
            <span className="text-slate-500">MongoDB _id</span>
            <span className="font-mono font-semibold text-slate-800">{saved._id}</span>
          </div>
          <div className="flex justify-between items-center pb-1.5 border-b border-slate-200">
            <span className="text-slate-500">Event</span>
            <span className="font-semibold text-slate-800">{saved.eventName}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Category</span>
            <span className="capitalize font-semibold text-indigo-600">{saved.category}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/submissions"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm shadow-sm transition-colors"
          >
            <Layers className="w-4 h-4" />
            View Submissions Dashboard
          </Link>

          <button
            type="button"
            onClick={onReset}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 font-medium text-sm transition-colors cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            Post Another
          </button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-xl font-bold text-slate-900">Step 4: Review & Submit</h2>
        <p className="text-sm text-slate-500 mt-1">Check everything before saving to the database.</p>
      </div>

      {submitErr && (
        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold">Submission failed</p>
            <p className="text-xs mt-0.5">{submitErr}</p>
          </div>
        </div>
      )}

      {/* Event overview card */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Event Overview</h3>
          <span className="text-xs uppercase font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
            {category}
          </span>
        </div>

        <div>
          <h4 className="text-lg font-bold text-slate-900">{formData.eventName}</h4>
          <p className="text-xs font-medium text-indigo-600 mt-0.5">
            {formData.eventType === 'Other' ? formData.customEventType : formData.eventType}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <span>
              {fmtDate(formData.startDate)}
              {formData.isDateRange && formData.endDate && ` → ${fmtDate(formData.endDate)}`}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <span>{formData.location}</span>
          </div>
          {formData.venue && (
            <div className="flex items-center gap-1.5 sm:col-span-2">
              <Building className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span>{formData.venue}</span>
            </div>
          )}
        </div>
      </div>

      {/* Category details summary */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-100">
          {category} — Requirement Details
        </h3>

        {category === 'planner' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-400 block">Planning Scope</span>
              <span className="font-semibold text-slate-800">{formData.plannerDetails?.serviceScope || '—'}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Guest Count</span>
              <span className="font-semibold text-slate-800">{formData.plannerDetails?.guestCount || '—'}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Budget</span>
              <span className="font-semibold text-emerald-600 text-sm">₹{Number(formData.plannerDetails?.budget || 0).toLocaleString('en-IN')}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Theme / Vibe</span>
              <span className="font-semibold text-slate-800">{formData.plannerDetails?.themeOrVibe || '—'}</span>
            </div>
            <div className="sm:col-span-2">
              <span className="text-slate-400 block mb-1">Services Needed</span>
              <div className="flex flex-wrap gap-1.5">
                {(formData.plannerDetails?.servicesNeeded || []).map(s => (
                  <span key={s} className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[11px] font-medium border border-indigo-100">{s}</span>
                ))}
              </div>
            </div>
            {formData.plannerDetails?.specialNotes && (
              <div className="sm:col-span-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200/60">
                <p className="text-slate-700 text-xs">{formData.plannerDetails.specialNotes}</p>
              </div>
            )}
          </div>
        )}

        {category === 'performer' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-400 block">Performer Type</span>
              <span className="font-semibold text-slate-800">{formData.performerDetails?.performanceType || '—'}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Duration</span>
              <span className="font-semibold text-slate-800">{formData.performerDetails?.duration || '—'}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Budget / Honorarium</span>
              <span className="font-semibold text-emerald-600 text-sm">₹{Number(formData.performerDetails?.expectedBudget || 0).toLocaleString('en-IN')}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Sound Setup</span>
              <span className="font-semibold text-slate-800">{formData.performerDetails?.soundEquipmentProvided || '—'}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Genre / Language</span>
              <span className="font-semibold text-slate-800">{formData.performerDetails?.performanceLanguage || '—'}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Audience</span>
              <span className="font-semibold text-slate-800">{formData.performerDetails?.audienceProfile || '—'}</span>
            </div>
            {formData.performerDetails?.specialRequests && (
              <div className="sm:col-span-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200/60">
                <p className="text-slate-700 text-xs">{formData.performerDetails.specialRequests}</p>
              </div>
            )}
          </div>
        )}

        {category === 'crew' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-400 block">Crew Role</span>
              <span className="font-semibold text-slate-800">{formData.crewDetails?.crewRole || '—'}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Number of People</span>
              <span className="font-semibold text-slate-800">{formData.crewDetails?.crewCount || '—'}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Shift</span>
              <span className="font-semibold text-slate-800">{formData.crewDetails?.shiftTiming || '—'}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Pay / Person</span>
              <span className="font-semibold text-emerald-600 text-sm">₹{Number(formData.crewDetails?.dailyPayPerPerson || 0).toLocaleString('en-IN')}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Experience Level</span>
              <span className="font-semibold text-slate-800">{formData.crewDetails?.experienceLevel || '—'}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Dress Code</span>
              <span className="font-semibold text-slate-800">{formData.crewDetails?.dressCode || '—'}</span>
            </div>
            {formData.crewDetails?.specialInstructions && (
              <div className="sm:col-span-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200/60">
                <p className="text-slate-700 text-xs">{formData.crewDetails.specialInstructions}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Contact info — optional but nice to have */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">Your Contact Info</h3>
          <span className="text-[11px] text-slate-400">Optional</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Name</label>
            <div className="relative">
              <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Your name"
                value={formData.contactInfo?.organizerName || ''}
                onChange={e => patchContact('organizerName', e.target.value)}
                className="w-full pl-8 pr-2.5 py-2 rounded-lg border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Email</label>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="email"
                placeholder="you@email.com"
                value={formData.contactInfo?.email || ''}
                onChange={e => patchContact('email', e.target.value)}
                className="w-full pl-8 pr-2.5 py-2 rounded-lg border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Phone</label>
            <div className="relative">
              <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="tel"
                placeholder="+91 9876543210"
                value={formData.contactInfo?.phone || ''}
                onChange={e => patchContact('phone', e.target.value)}
                className="w-full pl-8 pr-2.5 py-2 rounded-lg border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 flex items-center justify-between border-t border-slate-100">
        <button
          type="button"
          onClick={onBack}
          disabled={submitting}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm font-medium transition-colors cursor-pointer disabled:opacity-50"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-sm transition-colors cursor-pointer disabled:opacity-50"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving to MongoDB...
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              Submit Requirement
            </>
          )}
        </button>
      </div>

    </form>
  )
}
