'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, CheckCircle2, Calendar, MapPin, Building, 
  Sparkles, IndianRupee, AlertCircle, Loader2, Layers, PlusCircle, User, Mail, Phone 
} from 'lucide-react';

export default function Step4Review({ formData, updateFormData, onBack, onReset }) {
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [savedResult, setSavedResult] = useState(null);

  const { category } = formData;

  // Simple date formatter without needing external libraries
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitting(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

      // send payload to backend
      const res = await fetch(`${apiUrl}/requirements`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Failed to submit requirement');
      }

      // Success!
      setSavedResult(json.data);
    } catch (err) {
      console.error('Submission failed:', err);
      setSubmitError(err.message || 'Could not connect to backend server. Is it running on port 5000?');
    } finally {
      setSubmitting(false);
    }
  };

  // Helper updater for organizer contact info
  const updateContact = (field, val) => {
    updateFormData({
      contactInfo: {
        ...(formData.contactInfo || {}),
        [field]: val
      }
    });
  };

  // If already submitted successfully, show confirmation screen
  if (savedResult) {
    return (
      <div className="text-center py-8 space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
        </div>

        <div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wider">
            Successfully Posted
          </span>
          <h2 className="text-2xl font-bold text-slate-900 mt-2">
            Requirement Saved to MongoDB!
          </h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto mt-1">
            Your event requirement has been categorized under <strong className="text-indigo-600 uppercase">{savedResult.category}</strong> and stored in the database.
          </p>
        </div>

        {/* Reference details box */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 max-w-md mx-auto text-left space-y-2 text-xs">
          <div className="flex justify-between items-center pb-2 border-b border-slate-200">
            <span className="text-slate-500">Document ID:</span>
            <span className="font-mono font-medium text-slate-800">{savedResult._id}</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-slate-200">
            <span className="text-slate-500">Event:</span>
            <span className="font-semibold text-slate-800">{savedResult.eventName}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Category:</span>
            <span className="capitalize font-semibold text-indigo-600">{savedResult.category}</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Link
            href="/submissions"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm shadow-sm transition-colors"
          >
            <Layers className="w-4 h-4" />
            <span>View Submissions Dashboard</span>
          </Link>

          <button
            type="button"
            onClick={onReset}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 font-medium text-sm transition-colors cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post Another Requirement</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-xl font-bold text-slate-900">Step 4: Review &amp; Submit</h2>
        <p className="text-sm text-slate-500 mt-1">
          Review all requirement details before saving them to the database.
        </p>
      </div>

      {submitError && (
        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold">Submission failed</p>
            <p className="text-xs mt-0.5">{submitError}</p>
          </div>
        </div>
      )}

      {/* Summary Container */}
      <div className="space-y-4">
        
        {/* Card 1: Event Basics */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Event Overview
            </h3>
            <span className="text-xs uppercase font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
              Role: {category}
            </span>
          </div>

          <div>
            <h4 className="text-lg font-bold text-slate-900">{formData.eventName}</h4>
            <p className="text-xs font-medium text-indigo-600 mt-0.5">
              {formData.eventType === 'Other' ? formData.customEventType : formData.eventType}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 pt-1">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span>
                {formatDate(formData.startDate)}
                {formData.isDateRange && formData.endDate && ` → ${formatDate(formData.endDate)}`}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span>{formData.location}</span>
            </div>

            {formData.venue && (
              <div className="flex items-center gap-1.5 sm:col-span-2">
                <Building className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span>Venue: {formData.venue}</span>
              </div>
            )}
          </div>
        </div>

        {/* Card 2: Category Details */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-100">
            Category Specifics ({category})
          </h3>

          {/* PLANNER REVIEW */}
          {category === 'planner' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block">Service Scope</span>
                <span className="font-semibold text-slate-800">{formData.plannerDetails?.serviceScope || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Estimated Guests</span>
                <span className="font-semibold text-slate-800">{formData.plannerDetails?.guestCount || '0'} Attendees</span>
              </div>
              <div>
                <span className="text-slate-400 block">Estimated Budget</span>
                <span className="font-semibold text-emerald-600 text-sm">
                  ₹{Number(formData.plannerDetails?.budget || 0).toLocaleString('en-IN')}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Theme / Vibe</span>
                <span className="font-semibold text-slate-800">{formData.plannerDetails?.themeOrVibe || 'Not specified'}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-slate-400 block mb-1">Required Services</span>
                <div className="flex flex-wrap gap-1.5">
                  {(formData.plannerDetails?.servicesNeeded || []).map((s) => (
                    <span key={s} className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[11px] font-medium border border-indigo-100">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              {formData.plannerDetails?.specialNotes && (
                <div className="sm:col-span-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200/60">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Notes</span>
                  <p className="text-slate-700 text-xs mt-0.5">{formData.plannerDetails.specialNotes}</p>
                </div>
              )}
            </div>
          )}

          {/* PERFORMER REVIEW */}
          {category === 'performer' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block">Performer Role</span>
                <span className="font-semibold text-slate-800">{formData.performerDetails?.performanceType || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Duration / Slot</span>
                <span className="font-semibold text-slate-800">{formData.performerDetails?.duration || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Expected Budget</span>
                <span className="font-semibold text-emerald-600 text-sm">
                  ₹{Number(formData.performerDetails?.expectedBudget || 0).toLocaleString('en-IN')}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Sound Setup</span>
                <span className="font-semibold text-slate-800">{formData.performerDetails?.soundEquipmentProvided || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Genre / Language</span>
                <span className="font-semibold text-slate-800">{formData.performerDetails?.performanceLanguage || 'Any'}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Target Audience</span>
                <span className="font-semibold text-slate-800">{formData.performerDetails?.audienceProfile || 'Mixed'}</span>
              </div>
              {formData.performerDetails?.specialRequests && (
                <div className="sm:col-span-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200/60">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Special Requests</span>
                  <p className="text-slate-700 text-xs mt-0.5">{formData.performerDetails.specialRequests}</p>
                </div>
              )}
            </div>
          )}

          {/* CREW REVIEW */}
          {category === 'crew' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block">Crew Role</span>
                <span className="font-semibold text-slate-800">{formData.crewDetails?.crewRole || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Crew Count Needed</span>
                <span className="font-semibold text-slate-800">{formData.crewDetails?.crewCount || '0'} Members</span>
              </div>
              <div>
                <span className="text-slate-400 block">Shift Timings</span>
                <span className="font-semibold text-slate-800">{formData.crewDetails?.shiftTiming || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Daily Pay per Person</span>
                <span className="font-semibold text-emerald-600 text-sm">
                  ₹{Number(formData.crewDetails?.dailyPayPerPerson || 0).toLocaleString('en-IN')}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Experience Level</span>
                <span className="font-semibold text-slate-800">{formData.crewDetails?.experienceLevel || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Dress Code</span>
                <span className="font-semibold text-slate-800">{formData.crewDetails?.dressCode || 'N/A'}</span>
              </div>
              {formData.crewDetails?.specialInstructions && (
                <div className="sm:col-span-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200/60">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Instructions</span>
                  <p className="text-slate-700 text-xs mt-0.5">{formData.crewDetails.specialInstructions}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Card 3: Organizer Contact info */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Organizer / Contact Information
            </h3>
            <span className="text-[11px] text-slate-400">Optional for direct reachout</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Your Name</label>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="e.g. Anurag Sharma"
                  value={formData.contactInfo?.organizerName || ''}
                  onChange={(e) => updateContact('organizerName', e.target.value)}
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
                  placeholder="organizer@gmail.com"
                  value={formData.contactInfo?.email || ''}
                  onChange={(e) => updateContact('email', e.target.value)}
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
                  onChange={(e) => updateContact('phone', e.target.value)}
                  className="w-full pl-8 pr-2.5 py-2 rounded-lg border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Navigation actions */}
      <div className="pt-4 flex items-center justify-between border-t border-slate-100">
        <button
          type="button"
          onClick={onBack}
          disabled={submitting}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm font-medium transition-colors cursor-pointer disabled:opacity-50"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Step 3</span>
        </button>

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-sm transition-colors cursor-pointer disabled:opacity-50"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving to MongoDB...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Submit &amp; Publish Requirement</span>
            </>
          )}
        </button>
      </div>

    </form>
  );
}
