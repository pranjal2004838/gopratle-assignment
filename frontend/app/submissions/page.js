'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Layers, Search, Filter, Calendar, MapPin, Building, 
  Trash2, Eye, PlusCircle, RefreshCw, Users, Music2, ClipboardList,
  AlertCircle, X, CheckCircle2, Clock
} from 'lucide-react';

export default function SubmissionsDashboard() {
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // all, planner, performer, crew
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReq, setSelectedReq] = useState(null); // for detail modal

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  const fetchRequirements = async () => {
    setLoading(true);
    setError('');
    try {
      let url = `${apiUrl}/requirements`;
      const params = new URLSearchParams();

      if (activeTab !== 'all') {
        params.append('category', activeTab);
      }
      if (searchQuery.trim()) {
        params.append('search', searchQuery.trim());
      }

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const res = await fetch(url);
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message || 'Could not fetch requirements');
      }

      setRequirements(json.data || []);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message || 'Error connecting to backend server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequirements();
  }, [activeTab]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchRequirements();
  };

  const handleDelete = async (id, eventName) => {
    if (!confirm(`Are you sure you want to delete requirement for "${eventName}"?`)) {
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/requirements/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        // remove from local list
        setRequirements((prev) => prev.filter((r) => r._id !== id));
        if (selectedReq?._id === id) setSelectedReq(null);
      }
    } catch (err) {
      alert('Failed to delete item: ' + err.message);
    }
  };

  // Helper date formatter
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  // Stats calculation
  const totalCount = requirements.length;
  const plannerCount = requirements.filter(r => r.category === 'planner').length;
  const performerCount = requirements.filter(r => r.category === 'performer').length;
  const crewCount = requirements.filter(r => r.category === 'crew').length;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-2">
            <Layers className="w-3.5 h-3.5" />
            <span>Live MongoDB Records</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Submitted Requirements Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse and inspect requirement postings categorized by role in real-time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchRequirements}
            className="p-2.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
            title="Refresh list"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-sm transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post New</span>
          </Link>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
        
        {/* Category tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'all', label: 'All Roles' },
            { id: 'planner', label: 'Planners', icon: ClipboardList },
            { id: 'performer', label: 'Performers', icon: Music2 },
            { id: 'crew', label: 'Crew', icon: Users },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {Icon && <Icon className="w-3.5 h-3.5" />}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search input */}
        <form onSubmit={handleSearchSubmit} className="relative sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search event or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
          />
        </form>
      </div>

      {/* Error state */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Loading Skeleton / List */}
      {loading ? (
        <div className="py-16 text-center text-slate-400 text-sm flex flex-col items-center justify-center gap-2">
          <RefreshCw className="w-6 h-6 animate-spin text-indigo-500" />
          <span>Loading requirements from MongoDB...</span>
        </div>
      ) : requirements.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl p-6">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No requirements found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            {activeTab !== 'all' 
              ? `No requirements found under the "${activeTab}" category yet.` 
              : 'Be the first to post an event requirement!'}
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Create Requirement Now</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {requirements.map((item) => {
            const isPlanner = item.category === 'planner';
            const isPerformer = item.category === 'performer';
            const isCrew = item.category === 'crew';

            return (
              <div
                key={item._id}
                className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-4 shadow-sm hover:shadow transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-slate-100">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                        isPlanner
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                          : isPerformer
                          ? 'bg-violet-50 text-violet-700 border border-violet-100'
                          : 'bg-blue-50 text-blue-700 border border-blue-100'
                      }`}
                    >
                      {item.category}
                    </span>

                    <span className="text-[11px] text-slate-400">
                      {formatDate(item.createdAt)}
                    </span>
                  </div>

                  {/* Title & Type */}
                  <h3 className="font-bold text-slate-900 text-base line-clamp-1">
                    {item.eventName}
                  </h3>
                  <p className="text-xs font-medium text-indigo-600 mb-3">
                    {item.eventType}
                  </p>

                  {/* Date & Location */}
                  <div className="space-y-1.5 text-xs text-slate-600 mb-3">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span>{formatDate(item.startDate)}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span className="line-clamp-1">{item.location} {item.venue && `(${item.venue})`}</span>
                    </div>
                  </div>

                  {/* Category-specific highlight snippet */}
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-700 space-y-1 mb-4">
                    {isPlanner && item.plannerDetails && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Scope:</span>
                          <span className="font-semibold">{item.plannerDetails.serviceScope || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Guests:</span>
                          <span className="font-semibold">{item.plannerDetails.guestCount || '0'}</span>
                        </div>
                        {item.plannerDetails.budget && (
                          <div className="flex justify-between text-emerald-600 font-semibold pt-1 border-t border-slate-200/50">
                            <span>Budget:</span>
                            <span>₹{Number(item.plannerDetails.budget).toLocaleString('en-IN')}</span>
                          </div>
                        )}
                      </>
                    )}

                    {isPerformer && item.performerDetails && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Artist Role:</span>
                          <span className="font-semibold">{item.performerDetails.performanceType || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Duration:</span>
                          <span className="font-semibold">{item.performerDetails.duration || 'N/A'}</span>
                        </div>
                        {item.performerDetails.expectedBudget && (
                          <div className="flex justify-between text-emerald-600 font-semibold pt-1 border-t border-slate-200/50">
                            <span>Budget:</span>
                            <span>₹{Number(item.performerDetails.expectedBudget).toLocaleString('en-IN')}</span>
                          </div>
                        )}
                      </>
                    )}

                    {isCrew && item.crewDetails && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Role:</span>
                          <span className="font-semibold">{item.crewDetails.crewRole || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Count:</span>
                          <span className="font-semibold">{item.crewDetails.crewCount || '0'} People</span>
                        </div>
                        {item.crewDetails.dailyPayPerPerson && (
                          <div className="flex justify-between text-emerald-600 font-semibold pt-1 border-t border-slate-200/50">
                            <span>Pay/person:</span>
                            <span>₹{Number(item.crewDetails.dailyPayPerPerson).toLocaleString('en-IN')}</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setSelectedReq(item)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View JSON &amp; Details</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(item._id, item.eventName)}
                    className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded cursor-pointer"
                    title="Delete item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Detail & MongoDB Document Modal */}
      {selectedReq && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                  MongoDB Document &bull; {selectedReq.category}
                </span>
                <h3 className="font-bold text-lg text-slate-900 mt-1">
                  {selectedReq.eventName}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setSelectedReq(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs">
              {/* Event Basics details */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                  Event Basics (Step 1)
                </h4>
                <div className="grid grid-cols-2 gap-2 text-slate-600">
                  <div><strong>Event Type:</strong> {selectedReq.eventType}</div>
                  <div><strong>Location:</strong> {selectedReq.location}</div>
                  <div><strong>Start Date:</strong> {formatDate(selectedReq.startDate)}</div>
                  {selectedReq.isDateRange && (
                    <div><strong>End Date:</strong> {formatDate(selectedReq.endDate)}</div>
                  )}
                  {selectedReq.venue && <div><strong>Venue:</strong> {selectedReq.venue}</div>}
                  <div><strong>Category:</strong> <span className="uppercase font-semibold text-indigo-600">{selectedReq.category}</span></div>
                </div>
              </div>

              {/* Category specifics */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                  Category Specific Payload (Step 2 &amp; 3)
                </h4>
                {selectedReq.category === 'planner' && selectedReq.plannerDetails && (
                  <div className="grid grid-cols-2 gap-2 text-slate-600">
                    <div><strong>Scope:</strong> {selectedReq.plannerDetails.serviceScope}</div>
                    <div><strong>Guests:</strong> {selectedReq.plannerDetails.guestCount}</div>
                    <div><strong>Theme:</strong> {selectedReq.plannerDetails.themeOrVibe || 'None'}</div>
                    <div><strong>Budget:</strong> ₹{selectedReq.plannerDetails.budget?.toLocaleString('en-IN')}</div>
                    <div className="col-span-2">
                      <strong>Services:</strong> {selectedReq.plannerDetails.servicesNeeded?.join(', ') || 'None'}
                    </div>
                  </div>
                )}

                {selectedReq.category === 'performer' && selectedReq.performerDetails && (
                  <div className="grid grid-cols-2 gap-2 text-slate-600">
                    <div><strong>Performance Type:</strong> {selectedReq.performerDetails.performanceType}</div>
                    <div><strong>Duration:</strong> {selectedReq.performerDetails.duration}</div>
                    <div><strong>Language/Genre:</strong> {selectedReq.performerDetails.performanceLanguage}</div>
                    <div><strong>Budget:</strong> ₹{selectedReq.performerDetails.expectedBudget?.toLocaleString('en-IN')}</div>
                    <div><strong>Sound Equipment:</strong> {selectedReq.performerDetails.soundEquipmentProvided}</div>
                    <div><strong>Target Audience:</strong> {selectedReq.performerDetails.audienceProfile}</div>
                  </div>
                )}

                {selectedReq.category === 'crew' && selectedReq.crewDetails && (
                  <div className="grid grid-cols-2 gap-2 text-slate-600">
                    <div><strong>Crew Role:</strong> {selectedReq.crewDetails.crewRole}</div>
                    <div><strong>Crew Count:</strong> {selectedReq.crewDetails.crewCount}</div>
                    <div><strong>Shift Timing:</strong> {selectedReq.crewDetails.shiftTiming}</div>
                    <div><strong>Experience:</strong> {selectedReq.crewDetails.experienceLevel}</div>
                    <div><strong>Dress Code:</strong> {selectedReq.crewDetails.dressCode}</div>
                    <div><strong>Daily Pay:</strong> ₹{selectedReq.crewDetails.dailyPayPerPerson?.toLocaleString('en-IN')}</div>
                  </div>
                )}
              </div>

              {/* Raw MongoDB JSON object viewer */}
              <div>
                <h4 className="font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-1">
                  Raw MongoDB Document JSON
                </h4>
                <pre className="p-3 bg-slate-900 text-emerald-400 rounded-xl overflow-x-auto font-mono text-[11px] leading-relaxed max-h-56">
                  {JSON.stringify(selectedReq, null, 2)}
                </pre>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-3 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedReq(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-200 text-slate-700 hover:bg-slate-300 font-semibold text-xs cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
