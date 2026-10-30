'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Layers, Search, Calendar, MapPin, Building,
  Trash2, Eye, PlusCircle, RefreshCw, Users, Music2, ClipboardList,
  AlertCircle, X
} from 'lucide-react'

// normalize the API base URL — same logic as Step4Review
const getApiBase = () => {
  let url = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').trim().replace(/\/+$/, '')
  if (!url.endsWith('/api') && !url.includes('localhost')) {
    url += '/api'
  }
  return url
}

const API = getApiBase()

export default function SubmissionsPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')
  const [tab, setTab] = useState('all')
  const [search, setSearch] = useState('')
  const [modalItem, setModalItem] = useState(null)

  const load = async () => {
    setLoading(true)
    setErr('')
    try {
      let url = `${API}/requirements`
      const params = new URLSearchParams()
      if (tab !== 'all') params.append('category', tab)
      if (search.trim()) params.append('search', search.trim())
      if (params.toString()) url += `?${params.toString()}`

      const res = await fetch(url)
      const json = await res.json()

      if (!res.ok) throw new Error(json.message || 'Could not load requirements')
      setItems(json.data || [])
    } catch (e) {
      console.error('fetch error:', e)
      setErr(e.message || 'Failed to connect to the backend')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [tab])

  const handleSearch = (e) => {
    e.preventDefault()
    load()
  }

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete requirement for "${name}"?`)) return
    try {
      await fetch(`${API}/requirements/${id}`, { method: 'DELETE' })
      setItems(prev => prev.filter(r => r._id !== id))
      if (modalItem?._id === id) setModalItem(null)
    } catch (e) {
      alert('Delete failed: ' + e.message)
    }
  }

  const fmtDate = (d) => {
    if (!d) return ''
    try {
      return new Date(d).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })
    } catch { return d }
  }

  const tabs = [
    { id: 'all', label: 'All Roles' },
    { id: 'planner', label: 'Planners', icon: ClipboardList },
    { id: 'performer', label: 'Performers', icon: Music2 },
    { id: 'crew', label: 'Crew', icon: Users }
  ]

  const categoryBadge = {
    planner: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    performer: 'bg-violet-50 text-violet-700 border-violet-100',
    crew: 'bg-blue-50 text-blue-700 border-blue-100'
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">

      {/* header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-2">
            <Layers className="w-3.5 h-3.5" />
            Live MongoDB Records
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Submissions Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            All posted event requirements, categorized and searchable.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={load}
            title="Refresh"
            className="p-2.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-sm transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            Post New
          </Link>
        </div>
      </div>

      {/* filters + search */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-center gap-1.5">
          {tabs.map(t => {
            const Icon = t.icon
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                  tab === t.id ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {Icon && <Icon className="w-3.5 h-3.5" />}
                {t.label}
              </button>
            )
          })}
        </div>

        <form onSubmit={handleSearch} className="relative sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by event or city..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
          />
        </form>
      </div>

      {/* error state */}
      {err && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{err}</span>
        </div>
      )}

      {/* loading */}
      {loading ? (
        <div className="py-16 text-center text-slate-400 text-sm flex flex-col items-center gap-2">
          <RefreshCw className="w-6 h-6 animate-spin text-indigo-500" />
          <span>Loading from MongoDB...</span>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">Nothing here yet</h3>
          <p className="text-xs text-slate-500 mt-1 mb-4">
            {tab !== 'all' ? `No "${tab}" requirements posted yet.` : 'Post your first requirement to get started.'}
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Post One Now
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map(item => (
            <div
              key={item._id}
              className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-4 shadow-sm hover:shadow transition-all flex flex-col justify-between"
            >
              <div>
                {/* top row */}
                <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-slate-100">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${categoryBadge[item.category]}`}>
                    {item.category}
                  </span>
                  <span className="text-[11px] text-slate-400">{fmtDate(item.createdAt)}</span>
                </div>

                <h3 className="font-bold text-slate-900 text-base line-clamp-1">{item.eventName}</h3>
                <p className="text-xs font-medium text-indigo-600 mb-3">{item.eventType}</p>

                <div className="space-y-1.5 text-xs text-slate-600 mb-3">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span>{fmtDate(item.startDate)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="line-clamp-1">{item.location}{item.venue ? ` (${item.venue})` : ''}</span>
                  </div>
                </div>

                {/* category snapshot */}
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-700 space-y-1 mb-4">
                  {item.category === 'planner' && item.plannerDetails && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Scope</span>
                        <span className="font-semibold">{item.plannerDetails.serviceScope || '—'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Guests</span>
                        <span className="font-semibold">{item.plannerDetails.guestCount || '—'}</span>
                      </div>
                      {item.plannerDetails.budget && (
                        <div className="flex justify-between text-emerald-600 font-semibold pt-1 border-t border-slate-200/50">
                          <span>Budget</span>
                          <span>₹{Number(item.plannerDetails.budget).toLocaleString('en-IN')}</span>
                        </div>
                      )}
                    </>
                  )}
                  {item.category === 'performer' && item.performerDetails && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Artist</span>
                        <span className="font-semibold">{item.performerDetails.performanceType || '—'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Duration</span>
                        <span className="font-semibold">{item.performerDetails.duration || '—'}</span>
                      </div>
                      {item.performerDetails.expectedBudget && (
                        <div className="flex justify-between text-emerald-600 font-semibold pt-1 border-t border-slate-200/50">
                          <span>Budget</span>
                          <span>₹{Number(item.performerDetails.expectedBudget).toLocaleString('en-IN')}</span>
                        </div>
                      )}
                    </>
                  )}
                  {item.category === 'crew' && item.crewDetails && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Role</span>
                        <span className="font-semibold">{item.crewDetails.crewRole || '—'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Count</span>
                        <span className="font-semibold">{item.crewDetails.crewCount || '—'} people</span>
                      </div>
                      {item.crewDetails.dailyPayPerPerson && (
                        <div className="flex justify-between text-emerald-600 font-semibold pt-1 border-t border-slate-200/50">
                          <span>Pay/person</span>
                          <span>₹{Number(item.crewDetails.dailyPayPerPerson).toLocaleString('en-IN')}</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* card footer */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalItem(item)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  View JSON & Details
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(item._id, item.eventName)}
                  className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded cursor-pointer"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* detail modal */}
      {modalItem && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">

            <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                  MongoDB Document — {modalItem.category}
                </span>
                <h3 className="font-bold text-lg text-slate-900 mt-1">{modalItem.eventName}</h3>
              </div>
              <button
                type="button"
                onClick={() => setModalItem(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs">
              {/* summary grid */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">Event Info</h4>
                <div className="grid grid-cols-2 gap-2 text-slate-600">
                  <div><strong>Type:</strong> {modalItem.eventType}</div>
                  <div><strong>Location:</strong> {modalItem.location}</div>
                  <div><strong>Date:</strong> {fmtDate(modalItem.startDate)}</div>
                  {modalItem.venue && <div><strong>Venue:</strong> {modalItem.venue}</div>}
                  <div><strong>Category:</strong> <span className="uppercase font-semibold text-indigo-600">{modalItem.category}</span></div>
                </div>
              </div>

              {/* category payload */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                  Category Payload ({modalItem.category}Details)
                </h4>
                {modalItem.category === 'planner' && modalItem.plannerDetails && (
                  <div className="grid grid-cols-2 gap-2 text-slate-600">
                    <div><strong>Scope:</strong> {modalItem.plannerDetails.serviceScope}</div>
                    <div><strong>Guests:</strong> {modalItem.plannerDetails.guestCount}</div>
                    <div><strong>Theme:</strong> {modalItem.plannerDetails.themeOrVibe || '—'}</div>
                    <div><strong>Budget:</strong> ₹{modalItem.plannerDetails.budget?.toLocaleString('en-IN')}</div>
                    <div className="col-span-2"><strong>Services:</strong> {modalItem.plannerDetails.servicesNeeded?.join(', ') || '—'}</div>
                  </div>
                )}
                {modalItem.category === 'performer' && modalItem.performerDetails && (
                  <div className="grid grid-cols-2 gap-2 text-slate-600">
                    <div><strong>Type:</strong> {modalItem.performerDetails.performanceType}</div>
                    <div><strong>Duration:</strong> {modalItem.performerDetails.duration}</div>
                    <div><strong>Genre:</strong> {modalItem.performerDetails.performanceLanguage}</div>
                    <div><strong>Budget:</strong> ₹{modalItem.performerDetails.expectedBudget?.toLocaleString('en-IN')}</div>
                    <div><strong>Sound:</strong> {modalItem.performerDetails.soundEquipmentProvided}</div>
                    <div><strong>Audience:</strong> {modalItem.performerDetails.audienceProfile}</div>
                  </div>
                )}
                {modalItem.category === 'crew' && modalItem.crewDetails && (
                  <div className="grid grid-cols-2 gap-2 text-slate-600">
                    <div><strong>Role:</strong> {modalItem.crewDetails.crewRole}</div>
                    <div><strong>Count:</strong> {modalItem.crewDetails.crewCount}</div>
                    <div><strong>Shift:</strong> {modalItem.crewDetails.shiftTiming}</div>
                    <div><strong>Experience:</strong> {modalItem.crewDetails.experienceLevel}</div>
                    <div><strong>Dress code:</strong> {modalItem.crewDetails.dressCode}</div>
                    <div><strong>Daily pay:</strong> ₹{modalItem.crewDetails.dailyPayPerPerson?.toLocaleString('en-IN')}</div>
                  </div>
                )}
              </div>

              {/* raw JSON */}
              <div>
                <h4 className="font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-1.5">Raw MongoDB Document</h4>
                <pre className="p-3 bg-slate-900 text-emerald-400 rounded-xl overflow-x-auto font-mono text-[11px] leading-relaxed max-h-56">
                  {JSON.stringify(modalItem, null, 2)}
                </pre>
              </div>
            </div>

            <div className="p-3 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button
                type="button"
                onClick={() => setModalItem(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-200 text-slate-700 hover:bg-slate-300 font-semibold text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
