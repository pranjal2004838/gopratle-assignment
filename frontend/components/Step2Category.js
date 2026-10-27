'use client';

import { useState } from 'react';
import { ArrowLeft, ArrowRight, AlertCircle, Sparkles, Music2, Users, Clock, Users2 } from 'lucide-react';

export default function Step2Category({ formData, updateFormData, onNext, onBack }) {
  const [errorMsg, setErrorMsg] = useState('');
  const { category } = formData;

  const handleNext = (e) => {
    e.preventDefault();
    setErrorMsg('');

    // category-specific validation
    if (category === 'planner') {
      const details = formData.plannerDetails || {};
      if (!details.serviceScope) {
        setErrorMsg('Please select the planning service scope.');
        return;
      }
      if (!details.guestCount || Number(details.guestCount) <= 0) {
        setErrorMsg('Please enter an estimated guest count.');
        return;
      }
    } else if (category === 'performer') {
      const details = formData.performerDetails || {};
      if (!details.performanceType) {
        setErrorMsg('Please select the type of performer you need.');
        return;
      }
      if (!details.duration) {
        setErrorMsg('Please specify the expected performance duration.');
        return;
      }
    } else if (category === 'crew') {
      const details = formData.crewDetails || {};
      if (!details.crewRole) {
        setErrorMsg('Please select the crew role required.');
        return;
      }
      if (!details.crewCount || Number(details.crewCount) <= 0) {
        setErrorMsg('Please specify how many crew members are needed.');
        return;
      }
      if (!details.shiftTiming) {
        setErrorMsg('Please select the expected shift timing.');
        return;
      }
    }

    onNext();
  };

  // Helper updater for nested category details
  const updatePlanner = (fields) => {
    updateFormData({
      plannerDetails: { ...(formData.plannerDetails || {}), ...fields }
    });
  };

  const updatePerformer = (fields) => {
    updateFormData({
      performerDetails: { ...(formData.performerDetails || {}), ...fields }
    });
  };

  const updateCrew = (fields) => {
    updateFormData({
      crewDetails: { ...(formData.crewDetails || {}), ...fields }
    });
  };

  return (
    <form onSubmit={handleNext} className="space-y-6">
      
      {/* Step header with dynamic badge */}
      <div className="border-b border-slate-200 pb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Step 2: {category === 'planner' && 'Planner Scope & Atmosphere'}
            {category === 'performer' && 'Performer Profile & Format'}
            {category === 'crew' && 'Crew Roles & Staffing'}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Specify the operational requirements for your chosen role.
          </p>
        </div>

        <span className="text-xs uppercase font-bold tracking-wider px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
          {category}
        </span>
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* ======================= CASE 1: PLANNER ======================= */}
      {category === 'planner' && (
        <div className="space-y-5">
          {/* Service Scope */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Service Scope Required <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'Full Planning', title: 'Full Planning', desc: 'From ideation to day-of coordination' },
                { id: 'Partial Planning', title: 'Partial Planning', desc: 'Vendor management & design execution' },
                { id: 'Day-of Coordination', title: 'Day-of Coordination', desc: 'On-site execution only on the event day' }
              ].map((item) => {
                const isSelected = formData.plannerDetails?.serviceScope === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => updatePlanner({ serviceScope: item.id })}
                    className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/60 font-semibold ring-1 ring-indigo-500'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <p className="text-sm text-slate-800">{item.title}</p>
                    <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Guest Count & Venue Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Estimated Guest Count <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Users2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="number"
                  min="1"
                  placeholder="e.g. 150"
                  value={formData.plannerDetails?.guestCount || ''}
                  onChange={(e) => updatePlanner({ guestCount: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Theme / Aesthetic Vibe
              </label>
              <input
                type="text"
                placeholder="e.g. Royal Traditional, Boho Chic, Minimalist"
                value={formData.plannerDetails?.themeOrVibe || ''}
                onChange={(e) => updatePlanner({ themeOrVibe: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* ======================= CASE 2: PERFORMER ======================= */}
      {category === 'performer' && (
        <div className="space-y-5">
          {/* Performer Type */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Performer / Artist Type <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                'Singer / Vocalist',
                'Live Band',
                'DJ',
                'Stand-up Comic',
                'Emcee / Anchor',
                'Magician / Mentalist',
                'Dance Troupe',
                'Instrumentalist'
              ].map((type) => {
                const isSelected = formData.performerDetails?.performanceType === type;
                return (
                  <button
                    type="button"
                    key={type}
                    onClick={() => updatePerformer({ performanceType: type })}
                    className={`p-2.5 rounded-lg border text-xs font-medium text-center transition-all ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-600 text-white shadow-sm'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Duration & Preferred Language */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Performance Duration / Slot <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.performerDetails?.duration || ''}
                onChange={(e) => updatePerformer({ duration: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="">Select duration...</option>
                <option value="30 - 45 Minutes">30 - 45 Minutes (Short Set)</option>
                <option value="1 - 2 Hours">1 - 2 Hours (Standard)</option>
                <option value="2 - 3 Hours">2 - 3 Hours</option>
                <option value="3+ Hours / Multiple Sets">3+ Hours / Multiple Sets</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Preferred Genre or Language
              </label>
              <input
                type="text"
                placeholder="e.g. Bollywood & Retro, English Pop, Sufi, Hinglish"
                value={formData.performerDetails?.performanceLanguage || ''}
                onChange={(e) => updatePerformer({ performanceLanguage: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* ======================= CASE 3: CREW ======================= */}
      {category === 'crew' && (
        <div className="space-y-5">
          {/* Crew Role */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Specific Crew Role Needed <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {[
                'Stagehands & Riggers',
                'Sound / Audio Techs',
                'Lighting Technicians',
                'Ushers & Hospitality',
                'Security & Bouncers',
                'General Event Runners'
              ].map((role) => {
                const isSelected = formData.crewDetails?.crewRole === role;
                return (
                  <button
                    type="button"
                    key={role}
                    onClick={() => updateCrew({ crewRole: role })}
                    className={`p-2.5 rounded-lg border text-xs font-medium text-center transition-all ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-600 text-white shadow-sm'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {role}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Number of Crew & Shift Timing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Number of Crew Members Needed <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                placeholder="e.g. 4"
                value={formData.crewDetails?.crewCount || ''}
                onChange={(e) => updateCrew({ crewCount: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Shift Timings <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.crewDetails?.shiftTiming || ''}
                onChange={(e) => updateCrew({ shiftTiming: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="">Select shift...</option>
                <option value="Full Day (8-10 Hours)">Full Day (8-10 Hours)</option>
                <option value="Half Day / Single Shift (4-5 Hours)">Half Day / Single Shift (4-5 Hours)</option>
                <option value="Evening / Night Production">Evening / Night Production</option>
                <option value="Overnight Setup / Tear Down">Overnight Setup / Tear Down</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Navigation actions */}
      <div className="pt-4 flex items-center justify-between border-t border-slate-100">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm font-medium transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          type="submit"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm shadow-sm transition-colors cursor-pointer"
        >
          <span>Continue to Step 3</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </form>
  );
}
