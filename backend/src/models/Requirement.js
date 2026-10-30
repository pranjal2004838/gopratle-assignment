const mongoose = require('mongoose')

// I'm keeping all category-specific fields in their own sub-documents
// instead of separate collections — easier to filter and display on the dashboard
const requirementSchema = new mongoose.Schema(
  {
    // Step 1 fields
    eventName: {
      type: String,
      required: [true, 'Event name is required'],
      trim: true
    },
    eventType: {
      type: String,
      required: [true, 'Event type is required'],
      trim: true
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required']
    },
    endDate: {
      type: Date
      // only set if it's a multi-day event
    },
    isDateRange: {
      type: Boolean,
      default: false
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true
    },
    venue: {
      type: String,
      trim: true,
      default: ''
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['planner', 'performer', 'crew']
    },

    // Steps 2 & 3 — only one of these will have data depending on the category
    plannerDetails: {
      serviceScope: String,     // Full Planning / Partial / Day-of Coordination
      guestCount: Number,
      themeOrVibe: String,
      budget: Number,
      servicesNeeded: [String], // decor, catering, photography etc.
      specialNotes: String
    },

    performerDetails: {
      performanceType: String,        // Singer, DJ, Band, Comedian
      duration: String,               // e.g. "2 - 3 Hours"
      performanceLanguage: String,
      soundEquipmentProvided: String, // venue provides / performer brings / to discuss
      expectedBudget: Number,
      audienceProfile: String,
      specialRequests: String
    },

    crewDetails: {
      crewRole: String,            // Stagehand, Sound Tech, Usher, Security etc.
      crewCount: Number,
      shiftTiming: String,
      experienceLevel: String,     // entry / mid / senior
      dressCode: String,
      dailyPayPerPerson: Number,
      specialInstructions: String
    },

    // optional contact info the organizer can fill in step 4
    contactInfo: {
      organizerName: { type: String, default: '' },
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
)

// newest first by default
requirementSchema.index({ createdAt: -1 })

module.exports = mongoose.model('Requirement', requirementSchema)
