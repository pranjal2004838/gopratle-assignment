'use client';

import { useState } from 'react';
import { ArrowLeft, ArrowRight, AlertCircle, IndianRupee, Check, HelpCircle } from 'lucide-react';

const PLANNER_SERVICES = [
  'Decor & Floral Design',
  'Catering & Menu Curation',
  'Photography & Videography',
  'Sound & Stage Lighting',
  'Guest RSVP & Logistics',
  'Artist & Talent Booking',
  'Invitations & Gifting',
  'On-ground Hostesses'
];

export default function Step3Details({ formData, updateFormData, onNext, onBack }) {
  const [errorMsg, setErrorMsg] = useState('');
  const { category } = formData;

  const handleNext = (e) => {
    e.preventDefault();
    setErrorMsg('');

    // category-specific validation for step 3
    if (category === 'planner') {
      const details = formData.plannerDetails || {};
      if (!details.budget || Number(details.budget) <= 0) {
        setErrorMsg('Please specify an estimated planning budget.');
        return;
      }
      if (!details.servicesNeeded || details.servicesNeeded.length === 0) {
        setErrorMsg('Please select at least one service needed from the planner.');
        return;
      }
    } else if (category === 'performer') {
      const details = formData.performerDetails || {};
      if (!details.soundEquipmentProvided) {
        setErrorMsg('Please indicate the sound/PA equipment arrangement.');
        return;
      }
      if (!details.expectedBudget || Number(details.expectedBudget) <= 0) {
        setErrorMsg('Please specify the budget/honorarium for the performance.');
        return;
      }
    } else if (category === 'crew') {
      const details = formData.crewDetails || {};
      if (!details.experienceLevel) {
        setErrorMsg('Please select the required experience level for the crew.');
        return;
      }
      if (!details.dailyPayPerPerson || Number(details.dailyPayPerPerson) <= 0) {
        setErrorMsg('Please specify the daily/shift pay per crew member.');
        return;
      }
    }

    onNext();
  };

  // Updaters
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

  // Toggle helper for multi-select services
  const toggleService = (svc) => {
    const current = formData.plannerDetails?.servicesNeeded || [];
    let updated;
    if (current.includes(svc)) {
      updated = current.filter((item) => item !== svc);
    } else {
      updated = [...current, svc];
    }
    updatePlanner({ servicesNeeded: updated });
  };

  return (
    <form onSubmit={handleNext} className="space-y-6">
      
      {/* Header */}
      <div className="border-b border-slate-200 pb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Step 3: {category === 'planner' && 'Services & Budget Allocation'}
            {category === 'performer' && 'Technical Rider & Compensation'}
            {category === 'crew' && 'Pay Rate & Crew Specifications'}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Fill in the compensation and specific scope details.
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
          {/* Estimated Budget */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Estimated Planning & Vendor Budget (INR) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold text-sm">₹</span>
              <input
                type="number"
                min="1000"
                step="500"
                placeholder="e.g. 150000"
                value={formData.plannerDetails?.budget || ''}
                onChange={(e) => updatePlanner({ budget: e.target.value })}
                className="w-full pl-8 pr-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              />
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Give planners a realistic ball-park to tailor their proposals.
            </p>
          </div>

          {/* Services Needed */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Services Required from Planner <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PLANNER_SERVICES.map((svc) => {
                const isChecked = (formData.plannerDetails?.servicesNeeded || []).includes(svc);
                return (
                  <button
                    type="button"
                    key={svc}
                    onClick={() => toggleService(svc)}
                    className={`flex items-center justify-between p-2.5 rounded-lg border text-left text-xs transition-colors ${
                      isChecked
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-900 font-semibold'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{svc}</span>
                    {isChecked && <Check className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0 ml-1" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Special Notes */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Special Instructions / Vibe Notes
            </label>
            <textarea
              rows={3}
              placeholder="Any specific decor colors, client preferences, or key milestones..."
              value={formData.plannerDetails?.specialNotes || ''}
              onChange={(e) => updatePlanner({ specialNotes: e.target.value })}
              className="w-full p-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            />
          </div>
        </div>
      )}

      {/* ======================= CASE 2: PERFORMER ======================= */}
      {category === 'performer' && (
        <div className="space-y-5">
          {/* Sound / Equipment Arrangement */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Audio / Sound Setup Arrangement <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'Venue provides PA & Mic', label: 'Venue provides PA & Mic', desc: 'Venue has adequate sound setup ready' },
                { id: 'Performer brings own sound', label: 'Performer brings sound', desc: 'Performer must bring speakers & mixer' },
                { id: 'Negotiable / Need Discussion', label: 'Negotiable / Discuss', desc: 'To be finalized based on tech rider' }
              ].map((item) => {
                const isSelected = formData.performerDetails?.soundEquipmentProvided === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => updatePerformer({ soundEquipmentProvided: item.id })}
                    className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/60 font-semibold ring-1 ring-indigo-500'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <p className="text-xs font-bold text-slate-800">{item.label}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Budget & Target Audience */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Expected Budget / Honorarium (INR) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold text-sm">₹</span>
                <input
                  type="number"
                  min="500"
                  placeholder="e.g. 25000"
                  value={formData.performerDetails?.expectedBudget || ''}
                  onChange={(e) => updatePerformer({ expectedBudget: e.target.value })}
                  className="w-full pl-8 pr-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Target Audience Profile
              </label>
              <select
                value={formData.performerDetails?.audienceProfile || ''}
                onChange={(e) => updatePerformer({ audienceProfile: e.target.value })}
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

          {/* Song Requests / Rider Notes */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Specific Song Requests / Performance Guidelines
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Need acoustic set first followed by upbeat dance tracks, strictly family friendly lyrics..."
              value={formData.performerDetails?.specialRequests || ''}
              onChange={(e) => updatePerformer({ specialRequests: e.target.value })}
              className="w-full p-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            />
          </div>
        </div>
      )}

      {/* ======================= CASE 3: CREW ======================= */}
      {category === 'crew' && (
        <div className="space-y-5">
          {/* Experience Level & Dress Code */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Experience Level Required <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.crewDetails?.experienceLevel || ''}
                onChange={(e) => updateCrew({ experienceLevel: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="">Select experience level...</option>
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
                onChange={(e) => updateCrew({ dressCode: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="">Select dress code...</option>
                <option value="All Black Formals (Standard Crew)">All Black Formals (Standard Crew)</option>
                <option value="Smart Casuals">Smart Casuals</option>
                <option value="Event T-shirt Provided on site">Event T-shirt Provided on site</option>
                <option value="Security Uniform">Security Uniform</option>
              </select>
            </div>
          </div>

          {/* Daily Pay per person */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Daily / Shift Pay Per Person (INR) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold text-sm">₹</span>
              <input
                type="number"
                min="200"
                placeholder="e.g. 1500"
                value={formData.crewDetails?.dailyPayPerPerson || ''}
                onChange={(e) => updateCrew({ dailyPayPerPerson: e.target.value })}
                className="w-full pl-8 pr-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              />
            </div>
            {formData.crewDetails?.crewCount && formData.crewDetails?.dailyPayPerPerson && (
              <p className="text-xs text-indigo-600 font-medium mt-1">
                Total estimated crew payout: ₹{Number(formData.crewDetails.crewCount) * Number(formData.crewDetails.dailyPayPerPerson)} ({formData.crewDetails.crewCount} crew members)
              </p>
            )}
          </div>

          {/* Special Instructions */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Special Instructions / Physical Demands
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Heavy lifting involved for stage rigging, meals will be provided on-site..."
              value={formData.crewDetails?.specialInstructions || ''}
              onChange={(e) => updateCrew({ specialInstructions: e.target.value })}
              className="w-full p-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            />
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
          <span>Review Requirement (Step 4)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </form>
  );
}
