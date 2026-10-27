# GoPratle Full-Stack Developer Internship Assignment

> **Requirement Posting Flow (Next.js + Node.js/Express + MongoDB)**  
> Built with Next.js 16 (App Router), Tailwind CSS, Lucide Icons, Express, and Mongoose.

---

## 📌 Project Overview

This repository contains the complete full-stack implementation of the **Event Requirement Posting Flow** for the GoPratle Full-Stack Developer Intern assignment.

The platform allows event organizers to post and categorize requirements across three distinct event roles:
1. **Event Planner** (Full/partial coordination, guest logistics, vendor budgets, themes)
2. **Performer / Artist** (Singers, live bands, DJs, comedians, sound riders, honorarium)
3. **Event Crew** (Stagehands, sound/light operators, ushers, security, shifts, daily rates)

---

## 🚀 Key Features

* **Step 1 - Event Basics:**
  * Event Name, dynamic Event Type selector (Wedding, Corporate, Concert, Birthday, etc.).
  * Single Day vs. Multi-day Date Range toggle.
  * City/Location and optional Venue Name.
  * Interactive 3-card Category Selector (`planner`, `performer`, `crew`).

* **Step 2 & 3 - Adaptive Dynamic Form Steps:**
  * **Event Planner:**
    * *Step 2:* Service Scope (Full Planning, Partial, Day-of), Estimated Guests, Aesthetic Theme/Vibe.
    * *Step 3:* Budget allocation, multi-select services (Decor, Catering, Photography, Stage & Lighting), client brief notes.
  * **Performer:**
    * *Step 2:* Artist Category (Singer, DJ, Band, Comic, Dancer, Emcee), Performance Duration, Genre/Language.
    * *Step 3:* Sound/PA system arrangement, expected budget/honorarium, target audience profile, song requests.
  * **Crew:**
    * *Step 2:* Crew role required, number of personnel needed, shift timings (Full day, half day, overnight).
    * *Step 3:* Experience level, dress code/attire, daily pay per person (with automatic total payout calculation), physical instructions.

* **Step 4 - Review & Submission:**
  * Clean categorized visual summary card of all entered data.
  * Contact information fields for the organizer (Name, Email, Phone).
  * Direct submission to Express API and storage in MongoDB.
  * Success screen displaying the generated MongoDB Document ID (`_id`).

* **✨ Extra USP - Submissions Dashboard (`/submissions`):**
  * Real-time listing of all submitted requirements from MongoDB.
  * Quick filter tabs: `All Roles`, `Planners`, `Performers`, `Crew`.
  * Search bar (filter by event name or city).
  * Interactive modal displaying the **raw MongoDB Document JSON** to prove clean polymorphic categorization.
  * Instant delete action for quick testing cleanup.

---

## 🛠️ Architecture & Data Design

```
frontend/ (Next.js 16 App Router on :3000)
    │
    ▼ HTTP POST /api/requirements
backend/ (Express.js on :5000)
    │
    ▼ Mongoose Schema Validation
MongoDB / Atlas (Categorized Document Collection)
```

### MongoDB Polymorphic Schema
To keep documents organized and ensure data is strictly categorized under the selected role, the Mongoose schema isolates category-specific fields into dedicated sub-documents:

```js
{
  eventName: "Annual Gala 2026",
  eventType: "Corporate Event",
  startDate: "2026-11-15T00:00:00.000Z",
  endDate: "2026-11-16T00:00:00.000Z",
  isDateRange: true,
  location: "Bengaluru, Karnataka",
  venue: "The Leela Palace",
  category: "planner", // 'planner' | 'performer' | 'crew'
  
  // Categorized object (only the chosen role is persisted):
  plannerDetails: {
    serviceScope: "Full Planning",
    guestCount: 350,
    themeOrVibe: "Futuristic Glow",
    budget: 450000,
    servicesNeeded: ["Decor & Floral Design", "Catering & Menu Curation"]
  },
  
  contactInfo: {
    organizerName: "Anurag Sharma",
    email: "anurag@example.com",
    phone: "+91 9876543210"
  },
  status: "open",
  createdAt: "...",
  updatedAt: "..."
}
```

---

## 💻 Quick Start & Local Setup

### Prerequisites
- Node.js (v18 or higher - tested on v24)
- npm (v9 or higher)

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd intelligent-fermi
```

### 2. Install dependencies
```bash
# Install root, backend, and frontend dependencies in one command:
npm run install:all
```

### 3. Configure Environment Variables

**Backend (`backend/.env`):**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/gopratle_db
# Or your MongoDB Atlas URI:
# MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxx.mongodb.net/gopratle_db?retryWrites=true&w=majority
FRONTEND_URL=http://localhost:3000
```
> *Note: If a MongoDB instance is not connected locally, the backend automatically activates a graceful in-memory store so you can test the UI without errors.*

**Frontend (`frontend/.env.local`):**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 4. Run Both Frontend & Backend Concurrently
```bash
npm run dev
```
- Frontend will open at: **http://localhost:3000**
- Backend API will run at: **http://localhost:5000**

---

## 📡 REST API Reference

| Method | Endpoint | Description | Query Parameters |
|---|---|---|---|
| `GET` | `/api/health` | Service health status check | — |
| `POST` | `/api/requirements` | Submit a new requirement | — |
| `GET` | `/api/requirements` | Retrieve all requirements | `?category=planner\|performer\|crew`, `?search=mumbai` |
| `GET` | `/api/requirements/:id` | Get details of a single requirement | — |
| `DELETE` | `/api/requirements/:id`| Delete requirement (for demo cleanup)| — |

---

## 📹 Video Walkthrough Outline (5-7 mins)

Here is a recommended script/outline for your screen recording submission:

1. **Introduction & Approach (0:00 - 1:00)**:
   - Brief intro, understanding of the assignment (multi-step posting flow with category-adaptive forms).
   - Mention the tech stack: Next.js (App router), Express.js, MongoDB/Mongoose.

2. **Live Flow Demonstration (1:00 - 3:00)**:
   - Open `http://localhost:3000`.
   - Walk through **Step 1**: show Event Name, Date Range toggle, Location, and select **Event Planner**.
   - Show **Step 2 & 3** adapting dynamically (Guest count, Planning scope, Services checkboxes, Budget).
   - Go back to Step 1 and switch to **Performer** or **Crew** to show how the steps react dynamically to category changes.
   - Submit the requirement on **Step 4** and show the confirmation screen with the generated ID.

3. **USP Submissions Dashboard & MongoDB Flow (3:00 - 4:15)**:
   - Navigate to `/submissions`.
   - Filter by Planner, Performer, and Crew.
   - Click **"View JSON & Details"** to show the raw MongoDB document structure, demonstrating that category-specific data is cleanly categorized under `plannerDetails`, `performerDetails`, or `crewDetails`.

4. **Codebase Walkthrough (4:15 - 5:30)**:
   - Show `backend/src/models/Requirement.js` (Schema design & categorization).
   - Show `backend/src/routes/requirementRoutes.js` (Validation, payload preparation, status codes).
   - Show `frontend/app/page.js` & step components (State management, validation before next step).

5. **Edge Cases, Trade-offs & Next Steps (5:30 - 6:30)**:
   - *Key decisions*: Single consolidated schema with polymorphic sub-documents vs separate collections (easier unified querying, search, and dashboard filtering).
   - *Limitations & Future Improvements*: User authentication (organizer accounts vs talent login), file uploads for event decks / artist riders, email notifications when someone applies.
