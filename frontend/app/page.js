'use client'

import { useState } from 'react'
import ProgressBar from '../components/ProgressBar'
import Step1Basics from '../components/Step1Basics'
import Step2Category from '../components/Step2Category'
import Step3Details from '../components/Step3Details'
import Step4Review from '../components/Step4Review'
import { Sparkles, Wand2 } from 'lucide-react'

// default state — keeping everything here so resetForm is easy
const blankForm = {
  eventName: '',
  eventType: 'Wedding',
  customEventType: '',
  startDate: '',
  endDate: '',
  isDateRange: false,
  location: '',
  venue: '',
  category: 'planner',
  plannerDetails: {
    serviceScope: '',
    guestCount: '',
    themeOrVibe: '',
    budget: '',
    servicesNeeded: [],
    specialNotes: ''
  },
  performerDetails: {
    performanceType: '',
    duration: '',
    performanceLanguage: '',
    soundEquipmentProvided: '',
    expectedBudget: '',
    audienceProfile: '',
    specialRequests: ''
  },
  crewDetails: {
    crewRole: '',
    crewCount: '',
    shiftTiming: '',
    experienceLevel: '',
    dressCode: '',
    dailyPayPerPerson: '',
    specialInstructions: ''
  },
  contactInfo: {
    organizerName: '',
    email: '',
    phone: ''
  }
}

export default function HomePage() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState(blankForm)

  const updateForm = (fields) => {
    setForm(prev => ({ ...prev, ...fields }))
  }

  const goNext = () => setStep(prev => Math.min(prev + 1, 4))
  const goBack = () => setStep(prev => Math.max(prev - 1, 1))
  const resetAll = () => {
    setForm(blankForm)
    setStep(1)
  }

  // pre-fill with demo data — makes walkthrough recordings a lot faster
  const fillDemo = (role) => {
    const base = new Date()
    const start = new Date(base.setDate(base.getDate() + 15)).toISOString().split('T')[0]
    const end = new Date(base.setDate(base.getDate() + 2)).toISOString().split('T')[0]

    if (role === 'planner') {
      setForm({
        ...blankForm,
        eventName: 'GoPratle Annual Creators Gala 2026',
        eventType: 'Corporate Event',
        startDate: start,
        endDate: end,
        isDateRange: true,
        location: 'Bengaluru, Karnataka',
        venue: 'The Leela Palace Ballroom',
        category: 'planner',
        plannerDetails: {
          serviceScope: 'Full Planning',
          guestCount: 350,
          themeOrVibe: 'Futuristic Neon & Cyberpunk',
          budget: 450000,
          servicesNeeded: ['Decor & Floral Design', 'Sound & Stage Lighting', 'Catering & Menu Curation', 'Guest RSVP & Logistics'],
          specialNotes: 'Need experiential stage setup with branded backdrop and seamless VIP guest reception.'
        },
        contactInfo: {
          organizerName: 'Pranjal Jha',
          email: 'pranjaljha58@gmail.com',
          phone: '+91 98765 43210'
        }
      })
    } else if (role === 'performer') {
      setForm({
        ...blankForm,
        eventName: 'Sunset Acoustics & Live Jam',
        eventType: 'Live Concert / Festival',
        startDate: start,
        location: 'Goa (North)',
        venue: 'Thalassa Beach Lounge',
        category: 'performer',
        performerDetails: {
          performanceType: 'DJ',
          duration: '2 - 3 Hours',
          performanceLanguage: 'Deep House / Melodic Techno',
          soundEquipmentProvided: 'Venue provides PA & Mic',
          expectedBudget: 60000,
          audienceProfile: 'High-Energy Party / Club Crowd',
          specialRequests: 'Sunset slot 5:30 PM to 8:30 PM. Need Pioneer CDJ 3000 setup.'
        },
        contactInfo: {
          organizerName: 'Pranjal Jha',
          email: 'pranjaljha58@gmail.com',
          phone: '+91 91234 56789'
        }
      })
    } else if (role === 'crew') {
      setForm({
        ...blankForm,
        eventName: 'India Tech Expo 2026',
        eventType: 'Conference / Seminar',
        startDate: start,
        endDate: end,
        isDateRange: true,
        location: 'Pragati Maidan, New Delhi',
        venue: 'Hall 5 & Exhibition Arena',
        category: 'crew',
        crewDetails: {
          crewRole: 'Stagehands & Riggers',
          crewCount: 8,
          shiftTiming: 'Full Day (8-10 Hours)',
          experienceLevel: 'Experienced (1-2 Years in Events)',
          dressCode: 'All Black Formals (Standard Crew)',
          dailyPayPerPerson: 2000,
          specialInstructions: 'Heavy LED screen setup and audio trussing involved. Safety boots required.'
        },
        contactInfo: {
          organizerName: 'Pranjal Jha',
          email: 'pranjaljha58@gmail.com',
          phone: '+91 98111 22334'
        }
      })
    }
  }

  return (
    <div className="max-w-4xl mx-auto">

      {/* Page header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>4-Step Requirement Flow</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
          Post an Event Requirement
        </h1>
        <p className="text-slate-600 text-sm mt-2 max-w-xl mx-auto">
          Looking for an event planner, performer, or on-ground crew? Post your requirement and get matched.
        </p>

        {/* quick demo fill buttons — good for testing without manually typing everything */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="text-slate-400 flex items-center gap-1 font-medium">
            <Wand2 className="w-3.5 h-3.5" /> Try demo:
          </span>
          {['planner', 'performer', 'crew'].map(role => (
            <button
              key={role}
              type="button"
              onClick={() => fillDemo(role)}
              className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-300 transition-colors cursor-pointer capitalize"
            >
              Fill {role}
            </button>
          ))}
        </div>
      </div>

      <ProgressBar currentStep={step} category={form.category} setStep={setStep} />

      <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 sm:p-8">
        {step === 1 && (
          <Step1Basics formData={form} updateFormData={updateForm} onNext={goNext} />
        )}
        {step === 2 && (
          <Step2Category formData={form} updateFormData={updateForm} onNext={goNext} onBack={goBack} />
        )}
        {step === 3 && (
          <Step3Details formData={form} updateFormData={updateForm} onNext={goNext} onBack={goBack} />
        )}
        {step === 4 && (
          <Step4Review formData={form} updateFormData={updateForm} onBack={goBack} onReset={resetAll} />
        )}
      </div>

    </div>
  )
}
