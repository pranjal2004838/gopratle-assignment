'use client'

import { useState } from 'react'
import { Calendar, MapPin, Building, Users, Music2, ClipboardList, AlertCircle, ArrowRight } from 'lucide-react'

const EVENT_TYPES = [
  'Wedding',
  'Corporate Event',
  'Birthday Party',
  'Live Concert / Festival',
  'Conference / Seminar',
  'College Fest',
  'Private Gathering',
  'Other'
]

const categories = [
  {
    id: 'planner',
    label: 'Event Planner',
    desc: 'Full planning, vendor management, day-of coordination',
    icon: ClipboardList
  },
  {
    id: 'performer',
    label: 'Performer / Artist',
    desc: 'Singers, DJs, live bands, comedians, dancers, anchors',
    icon: Music2
  },
  {
    id: 'crew',
    label: 'Event Crew',
    desc: 'Stagehands, sound/light techs, ushers, security staff',
    icon: Users
  }
]

export default function Step1Basics({ formData, updateFormData, onNext }) {
  const [error, setError] = useState('')

  const handleNext = (e) => {
    e.preventDefault()
    setError('')

    if (!formData.eventName?.trim()) return setError('Please enter the event name.')
    if (!formData.eventType) return setError('Please pick an event type.')
    if (!formData.startDate) return setError('Please set the event date.')
    if (formData.isDateRange && !formData.endDate) return setError('Please pick an end date for the multi-day event.')
    if (formData.isDateRange && formData.endDate < formData.startDate) return setError('End date should be after the start date.')
    if (!formData.location?.trim()) return setError('Please enter the event city or location.')
    if (!formData.category) return setError('Please select the type of role you are hiring for.')

    onNext()
  }

  return (
    <form onSubmit={handleNext} className="space-y-6">

      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-xl font-bold text-slate-900">Step 1: Event Basics</h2>
        <p className="text-sm text-slate-500 mt-1">Start with the event details and tell us who you need to hire.</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Event name */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Event Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="e.g. Sunkissed Music Fest 2026, Rahul's 25th Birthday"
          value={formData.eventName}
          onChange={e => updateFormData({ eventName: e.target.value })}
          className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm bg-white"
        />
      </div>

      {/* Event type pills */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Event Type <span className="text-red-500">*</span>
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {EVENT_TYPES.map(t => (
            <button
              type="button"
              key={t}
              onClick={() => updateFormData({ eventType: t })}
              className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                formData.eventType === t
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        {formData.eventType === 'Other' && (
          <input
            type="text"
            placeholder="Tell us what type of event this is..."
            value={formData.customEventType || ''}
            onChange={e => updateFormData({ customEventType: e.target.value })}
            className="w-full mt-1.5 px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        )}
      </div>

      {/* Date section */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-slate-400" />
            Event Date <span className="text-red-500">*</span>
          </label>
          <label className="text-xs text-slate-600 flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={formData.isDateRange}
              onChange={e => updateFormData({ isDateRange: e.target.checked })}
              className="rounded text-indigo-600 h-4 w-4"
            />
            Multi-day event
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <span className="block text-xs font-medium text-slate-500 mb-1">
              {formData.isDateRange ? 'Start Date' : 'Date'}
            </span>
            <input
              type="date"
              value={formData.startDate}
              onChange={e => updateFormData({ startDate: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {formData.isDateRange && (
            <div>
              <span className="block text-xs font-medium text-slate-500 mb-1">End Date</span>
              <input
                type="date"
                value={formData.endDate}
                onChange={e => updateFormData({ endDate: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}
        </div>
      </div>

      {/* Location + Venue */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            City / Location <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="e.g. Mumbai, Maharashtra"
              value={formData.location}
              onChange={e => updateFormData({ location: e.target.value })}
              className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Venue <span className="text-xs font-normal text-slate-400">(optional)</span>
          </label>
          <div className="relative">
            <Building className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="e.g. Grand Hyatt, Hall 2"
              value={formData.venue}
              onChange={e => updateFormData({ venue: e.target.value })}
              className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            />
          </div>
        </div>
      </div>

      {/* Category cards */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">
          Who are you hiring? <span className="text-red-500">*</span>
        </label>
        <p className="text-xs text-slate-500 mb-3">
          Steps 2 and 3 will change based on what you select here.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {categories.map(cat => {
            const Icon = cat.icon
            const selected = formData.category === cat.id

            return (
              <div
                key={cat.id}
                onClick={() => updateFormData({ category: cat.id })}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  selected
                    ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-500'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded-lg ${selected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">{cat.label}</h3>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{cat.desc}</p>
              </div>
            )
          })}
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <button
          type="submit"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm shadow-sm transition-colors cursor-pointer"
        >
          Continue to Step 2
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </form>
  )
}
