const mongoose = require('mongoose');

// Main requirement schema
// Keeping category details in separate sub-documents so Mongo docs are clean and easy to inspect
const requirementSchema = new mongoose.Schema(
  {
    // Step 1: Event Basics
    eventName: {
      type: String,
      required: [true, 'Please provide an event name'],
      trim: true,
    },
    eventType: {
      type: String,
      required: [true, 'Please select or enter an event type'],
      trim: true,
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      // only used if date range selected
    },
    isDateRange: {
      type: Boolean,
      default: false
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    venue: {
      type: String,
      trim: true,
      default: ''
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['planner', 'performer', 'crew'],
    },

    // Step 2 & 3: Category specific data
    plannerDetails: {
      serviceScope: String, // Full Planning, Partial, Day-of Coordination
      guestCount: Number,
      themeOrVibe: String,
      budget: Number,
      servicesNeeded: [String], // catering, decor, photography etc.
      specialNotes: String
    },

    performerDetails: {
      performanceType: String, // Singer, DJ, Band, Comedian, etc.
      duration: String, // e.g. "2 hours"
      performanceLanguage: String,
      soundEquipmentProvided: String, // "Venue provides", "Performer brings", etc.
      expectedBudget: Number,
      audienceProfile: String,
      specialRequests: String
    },

    crewDetails: {
      crewRole: String, // Stagehand, Sound Tech, Usher, Security
      crewCount: Number,
      shiftTiming: String,
      experienceLevel: String, // Beginner, Intermediate, Pro
      dressCode: String,
      dailyPayPerPerson: Number,
      specialInstructions: String
    },

    // Contact details for poster
    contactInfo: {
      organizerName: { type: String, default: 'Anonymous Organizer' },
      email: { type: String, default: '' },
      phone: { type: String, default: '' }
    },

    status: {
      type: String,
      enum: ['open', 'in-review', 'fulfilled'],
      default: 'open'
    }
  },
  {
    timestamps: true
  }
);

// quick index to sort by newest first
requirementSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Requirement', requirementSchema);
