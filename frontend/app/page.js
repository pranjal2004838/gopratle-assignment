'use client';

import { useState } from 'react';
import ProgressBar from '../components/ProgressBar';
import Step1Basics from '../components/Step1Basics';
import Step2Category from '../components/Step2Category';
import Step3Details from '../components/Step3Details';
import Step4Review from '../components/Step4Review';
import { Sparkles, Wand2 } from 'lucide-react';

const INITIAL_FORM_STATE = {
  eventName: '',
  eventType: 'Wedding',
  customEventType: '',
  startDate: '',
  endDate: '',
  isDateRange: false,
  location: '',
  venue: '',
  category: 'planner', // default planner
  plannerDetails: {
    serviceScope: 'Full Planning',
    guestCount: '',
    themeOrVibe: '',
    budget: '',
    servicesNeeded: ['Decor & Floral Design', 'Catering & Menu Curation'],
    specialNotes: ''
  },
  performerDetails: {
    performanceType: 'Singer / Vocalist',
    duration: '1 - 2 Hours',
    performanceLanguage: 'Bollywood & Hindi',
    soundEquipmentProvided: 'Venue provides PA & Mic',
    expectedBudget: '',
    audienceProfile: 'Family & Kids',
    specialRequests: ''
  },
  crewDetails: {
    crewRole: 'Stagehands & Riggers',
    crewCount: 4,
    shiftTiming: 'Full Day (8-10 Hours)',
    experienceLevel: 'Experienced (1-2 Years in Events)',
    dressCode: 'All Black Formals (Standard Crew)',
    dailyPayPerPerson: 1500,
    specialInstructions: ''
  },
  contactInfo: {
    organizerName: '',
    email: '',
    phone: ''
  }
};

export default function RequirementPostingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);

  // Merge updates into formData
  const updateFormData = (fields) => {
    setFormData((prev) => ({
      ...prev,
      ...fields
    }));
  };

  // Step navigation
  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));
  const resetForm = () => {
    setFormData(INITIAL_FORM_STATE);
    setCurrentStep(1);
  };

  // Quick fill helper for demo walkthroughs
  // makes testing and video recording super fast!
  const loadDemoData = (cat = 'planner') => {
    // get a future date
    const today = new Date();
    const futureDate = new Date(today.setDate(today.getDate() + 15)).toISOString().split('T')[0];
    const futureEndDate = new Date(today.setDate(today.getDate() + 2)).toISOString().split('T')[0];

    if (cat === 'planner') {
      setFormData({
        eventName: 'GoPratle Annual Creators Gala 2026',
        eventType: 'Corporate Event',
        customEventType: '',
        startDate: futureDate,
        endDate: futureEndDate,
        isDateRange: true,
        location: 'Bengaluru, Karnataka',
        venue: 'The Leela Palace Ballroom',
        category: 'planner',
        plannerDetails: {
          serviceScope: 'Full Planning',
          guestCount: 350,
          themeOrVibe: 'Futuristic Glow & Neon Cyberpunk',
          budget: 450000,
          servicesNeeded: ['Decor & Floral Design', 'Sound & Stage Lighting', 'Catering & Menu Curation', 'Guest RSVP & Logistics'],
          specialNotes: 'Need experiential stage setup with branded backdrop and seamless VIP guest reception.'
        },
        performerDetails: INITIAL_FORM_STATE.performerDetails,
        crewDetails: INITIAL_FORM_STATE.crewDetails,
        contactInfo: {
          organizerName: 'Anurag Sharma',
          email: 'anurag.sharma@example.com',
          phone: '+91 98765 43210'
        }
      });
    } else if (cat === 'performer') {
      setFormData({
        eventName: 'Sunset Acoustics & Live Jam',
        eventType: 'Live Concert / Festival',
        customEventType: '',
        startDate: futureDate,
        endDate: '',
        isDateRange: false,
        location: 'Goa (North)',
        venue: 'Thalassa Beach Lounge',
        category: 'performer',
        plannerDetails: INITIAL_FORM_STATE.plannerDetails,
        performerDetails: {
          performanceType: 'DJ',
          duration: '2 - 3 Hours',
          performanceLanguage: 'Deep House / Melodic Techno',
          soundEquipmentProvided: 'Venue provides PA & Mic',
          expectedBudget: 60000,
          audienceProfile: 'High-Energy Party / Club Crowd',
          specialRequests: 'Sunset slot from 5:30 PM to 8:30 PM. Needs Pioneer CDJ 3000 setup.'
        },
        crewDetails: INITIAL_FORM_STATE.crewDetails,
        contactInfo: {
          organizerName: 'Pooja Verma',
          email: 'pooja.verma@example.com',
          phone: '+91 91234 56789'
        }
      });
    } else if (cat === 'crew') {
      setFormData({
        eventName: 'India Tech Expo 2026',
        eventType: 'Conference / Seminar',
        customEventType: '',
        startDate: futureDate,
        endDate: futureEndDate,
        isDateRange: true,
        location: 'Pragati Maidan, New Delhi',
        venue: 'Hall 5 & Exhibition Arena',
        category: 'crew',
        plannerDetails: INITIAL_FORM_STATE.plannerDetails,
        performerDetails: INITIAL_FORM_STATE.performerDetails,
        crewDetails: {
          crewRole: 'Stagehands & Riggers',
          crewCount: 8,
          shiftTiming: 'Full Day (8-10 Hours)',
          experienceLevel: 'Experienced (1-2 Years in Events)',
          dressCode: 'All Black Formals (Standard Crew)',
          dailyPayPerPerson: 2000,
          specialInstructions: 'Setup heavy LED screens and audio trussing. High safety boots recommended.'
        },
        contactInfo: {
          organizerName: 'Rohit Mehrotra',
          email: 'rohit.m@example.com',
          phone: '+91 98111 22334'
        }
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      
      {/* Intro Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>4-Step Requirement Flow</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
          Post an Event Requirement
        </h1>
        <p className="text-slate-600 text-sm mt-2 max-w-xl mx-auto">
          Hire vetted event planners, top-tier artists &amp; performers, or reliable on-ground crew for your next event.
        </p>

        {/* Demo data quick-fill bar */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="text-slate-400 flex items-center gap-1 font-medium">
            <Wand2 className="w-3.5 h-3.5" /> Demo presets:
          </span>
          <button
            type="button"
            onClick={() => loadDemoData('planner')}
            className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-300 transition-colors cursor-pointer"
          >
            Fill Planner
          </button>
          <button
            type="button"
            onClick={() => loadDemoData('performer')}
            className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-300 transition-colors cursor-pointer"
          >
            Fill Performer
          </button>
          <button
            type="button"
            onClick={() => loadDemoData('crew')}
            className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-300 transition-colors cursor-pointer"
          >
            Fill Crew
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <ProgressBar
        currentStep={currentStep}
        category={formData.category}
        setStep={setCurrentStep}
      />

      {/* Form Card */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 sm:p-8">
        {currentStep === 1 && (
          <Step1Basics
            formData={formData}
            updateFormData={updateFormData}
            onNext={nextStep}
          />
        )}

        {currentStep === 2 && (
          <Step2Category
            formData={formData}
            updateFormData={updateFormData}
            onNext={nextStep}
            onBack={prevStep}
          />
        )}

        {currentStep === 3 && (
          <Step3Details
            formData={formData}
            updateFormData={updateFormData}
            onNext={nextStep}
            onBack={prevStep}
          />
        )}

        {currentStep === 4 && (
          <Step4Review
            formData={formData}
            updateFormData={updateFormData}
            onBack={prevStep}
            onReset={resetForm}
          />
        )}
      </div>

    </div>
  );
}
