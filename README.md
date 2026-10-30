# GoPratle — Event Requirement Posting Flow

A full-stack assignment built for the GoPratle Full-Stack Developer Intern role.

Stack: **Next.js + Tailwind CSS** (frontend) and **Node.js + Express + MongoDB** (backend).

---

## What this is

The idea was to build a multi-step form where event organizers can post requirements for three different types of roles — event planners, performers, and crew. The form adapts based on which role you select, so each category gets its own set of relevant fields rather than showing everything at once.

I also built out a submissions dashboard page (`/submissions`) that wasn't strictly required but made the whole thing feel more complete and was useful for demonstrating the MongoDB data flow in the walkthrough video.

---

## Features

**Step 1 — Event Basics**
- Event name, event type (with pill selectors for common types), single/multi-day date toggle, city + optional venue name
- 3-card category selector: Event Planner, Performer/Artist, Event Crew

**Step 2 & 3 — Category-Specific Fields** (changes based on what you picked in step 1)

- *Planner:* Planning scope (Full/Partial/Day-of), guest count, theme/vibe (step 2) → budget, multi-select services checklist, client notes (step 3)
- *Performer:* Artist type, duration, genre (step 2) → PA/sound arrangement, honorarium, audience type, setlist notes (step 3)
- *Crew:* Role, headcount, shift timing (step 2) → experience level, dress code, daily pay (with auto total), special instructions (step 3)

**Step 4 — Review & Submit**
- Summary card of all entered data
- Optional organizer contact fields (name, email, phone)
- Submits to the Express API → saved in MongoDB Atlas
- Success screen shows the generated MongoDB `_id`

**Bonus: Submissions Dashboard (`/submissions`)**
- Lists all posted requirements from MongoDB in real time
- Filter tabs by category (All, Planners, Performers, Crew) + search by event/city
- Click "View JSON & Details" to see the raw MongoDB document — useful for showing the data structure in the demo video
- Delete button for cleanup during testing

---

## How the data is structured in MongoDB

I went with a single collection and a polymorphic schema — one document per requirement, with category-specific fields stored in sub-documents (`plannerDetails`, `performerDetails`, `crewDetails`). Only the relevant block is populated based on the selected category.

The alternative was separate collections per category, but a single collection made filtering and the dashboard query much simpler. The tradeoff is that two of the three detail sub-documents will always be empty on any given document.

Example document (planner):
```json
{
  "_id": "...",
  "eventName": "GoPratle Creators Gala 2026",
  "eventType": "Corporate Event",
  "startDate": "2026-11-20",
  "endDate": "2026-11-22",
  "isDateRange": true,
  "location": "Bengaluru, Karnataka",
  "venue": "The Leela Palace Ballroom",
  "category": "planner",
  "plannerDetails": {
    "serviceScope": "Full Planning",
    "guestCount": 350,
    "themeOrVibe": "Futuristic Neon & Cyberpunk",
    "budget": 450000,
    "servicesNeeded": ["Decor & Floral Design", "Sound & Stage Lighting"]
  },
  "performerDetails": {},
  "crewDetails": {},
  "contactInfo": { "organizerName": "Pranjal Jha", "email": "...", "phone": "..." },
  "status": "open",
  "createdAt": "...",
  "updatedAt": "..."
}
```

---

## Local setup

**Prerequisites:** Node.js v18+, npm

```bash
git clone https://github.com/pranjal2004838/gopratle-assignment.git
cd gopratle-assignment

# install everything (root + backend + frontend)
npm run install:all
```

**Backend env** — create `backend/.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/gopratle_db
# or your Atlas URI:
# MONGODB_URI=mongodb+srv://admin:<password>@cluster0.xxx.mongodb.net/gopratle_db?retryWrites=true&w=majority
```

> If MongoDB isn't running locally, the backend falls back to an in-memory store automatically so you can still test the UI.

**Frontend env** — create `frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

**Run both together:**
```bash
npm run dev
```

- Frontend → http://localhost:3000
- Backend → http://localhost:5000

---

## API endpoints

| Method | Endpoint | What it does |
|---|---|---|
| GET | `/api/health` | Health check |
| POST | `/api/requirements` | Create a new requirement |
| GET | `/api/requirements` | Get all requirements (supports `?category=planner` and `?search=mumbai`) |
| GET | `/api/requirements/:id` | Get one requirement by ID |
| DELETE | `/api/requirements/:id` | Delete one (useful for testing cleanup) |

---

## Live links

- **Frontend (Vercel):** https://gopratle-assignment-three.vercel.app/
- **Submissions Dashboard:** https://gopratle-assignment-three.vercel.app/submissions
- **GitHub:** https://github.com/pranjal2004838/gopratle-assignment

---

## What I'd improve with more time

- User accounts so organizers can log in and manage their own postings
- Application flow on the other side — where talent/planners can apply to posted requirements
- File uploads (event briefs, artist riders as PDFs)
- Email notifications when someone applies
- Better validation on the backend (currently only checks required fields, doesn't deeply validate nested data)
- Search currently only covers event name and city — could be expanded
