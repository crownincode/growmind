# 🌿 GrowMind

> AI-powered plant health coach for hobby growers. Diagnose, track, and care for your plants — with smart reminders and personalized care plans.

---

## 📋 V1 Product Blueprint

### What GrowMind Does (V1 Scope)

GrowMind is a web app for hobby growers that:

1. **Diagnoses** plant health issues from a photo upload
2. **Generates** a personalized 2-week care plan + checklist via AI
3. **Logs** all your plants in one place (photo, name, species, location, status)
4. **Reminds** you when to water, check, or treat each plant

---

## 🗂️ Project Structure

```
growmind/
├── frontend/          # React + Tailwind (Vite)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx          # Landing / hero
│   │   │   ├── Diagnose.jsx      # Photo upload + Q&A flow
│   │   │   ├── CarePlan.jsx      # AI-generated plan output
│   │   │   ├── MyPlants.jsx      # Plant log / dashboard
│   │   │   └── PlantDetail.jsx   # Individual plant + history
│   │   ├── components/
│   │   │   ├── PlantCard.jsx     # Plant grid card
│   │   │   ├── Checklist.jsx     # 2-week care checklist
│   │   │   ├── ReminderBadge.jsx # Next watering / check badge
│   │   │   └── UploadZone.jsx    # Drag & drop photo upload
│   │   └── App.jsx
├── backend/           # Node.js + Express
│   ├── routes/
│   │   ├── diagnose.js    # POST /api/diagnose
│   │   ├── careplan.js    # POST /api/careplan
│   │   ├── plants.js      # CRUD /api/plants
│   │   └── reminders.js   # GET/POST /api/reminders
│   ├── services/
│   │   ├── kindwiseService.js   # Kindwise plant.health API
│   │   ├── openaiService.js     # GPT-4o for care plan agent
│   │   └── reminderService.js   # Email / push scheduler
│   ├── models/
│   │   ├── Plant.js       # Plant schema
│   │   └── Reminder.js    # Reminder schema
│   └── index.js
├── .env.example
├── .gitignore
├── LICENSE
└── README.md
```

---

## 🔧 Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Frontend | React + Vite + Tailwind CSS | Fast to build, easy to style |
| Backend | Node.js + Express | Lightweight API, JS everywhere |
| Database | Supabase (PostgreSQL) | Free tier, auth built-in, realtime |
| Plant ID API | Kindwise plant.health API | 548 diseases, 91% accuracy |
| AI Agent | OpenAI GPT-4o | Care plan + checklist generation |
| Image Storage | Supabase Storage | Same infra, simple |
| Reminders | node-cron + Nodemailer | Email reminders on a schedule |
| Deployment | Vercel (frontend) + Railway (backend) | Free tiers, fast deploys |

---

## 🤖 AI Agent: The GrowMind Brain

The AI agent is the core of the app. It takes structured inputs and returns a care plan.

### Inputs to the Agent
```json
{
  "diagnosis": "Fungal leaf spot (Cercospora)",
  "confidence": 0.87,
  "plant_name": "Monstera Deliciosa",
  "location": "Indoor - near east window",
  "light_level": "Bright indirect",
  "watering_habit": "Every 7 days",
  "pot_size": "10 inch",
  "symptoms_described": "Brown spots with yellow halo on lower leaves"
}
```

### Agent Prompt (System)
```
You are GrowMind, an expert plant health coach for hobby growers.
Given a diagnosis and plant context, you will:
1. Explain the issue in plain language (2-3 sentences, no jargon)
2. Generate a 14-day care plan with specific daily/every-X-day actions
3. Output a checklist of tasks with day numbers
4. Suggest a watering schedule based on the plant type and issue
5. Flag any urgent actions (e.g. isolate plant, repot immediately)

Always be encouraging. The user is a hobby grower, not a botanist.
Output must be valid JSON.
```

### Agent Output Format
```json
{
  "summary": "Your Monstera has a fungal infection...",
  "urgent": ["Isolate plant from others immediately"],
  "care_plan": [
    { "day": 1, "action": "Remove all affected leaves. Wipe remaining with neem oil solution." },
    { "day": 3, "action": "Check for new spots. Mist with diluted hydrogen peroxide." },
    { "day": 7, "action": "Water normally. Inspect soil moisture before watering." },
    { "day": 14, "action": "Reassess. If no new spots, plant is recovering." }
  ],
  "watering_schedule": "Every 8-10 days. Let top 2 inches of soil dry first.",
  "reminder_days": [1, 3, 7, 14]
}
```

---

## 📱 Core User Flows (V1)

### Flow 1: Diagnose a Plant
1. User lands on /diagnose
2. Uploads a photo (drag & drop or tap to select)
3. App calls Kindwise API → returns top 3 possible issues
4. User answers 5 context questions (location, light, watering, pot size, symptoms)
5. App calls GrowMind AI Agent → returns care plan JSON
6. User sees: diagnosis summary + urgent flags + 14-day checklist
7. User clicks "Save to My Plants" → plant is added to their log

### Flow 2: My Plants Dashboard
1. User sees grid of all their plants
2. Each card shows: photo, plant name, last diagnosis, next watering date, health status dot (green/yellow/red)
3. User clicks a plant → sees full detail + care history + checklist progress

### Flow 3: Reminders
1. When a plant is saved, reminders are scheduled based on care plan `reminder_days`
2. User receives email: "Time to check your Monstera 🌿 — Day 3 action: Check for new spots."
3. User can adjust reminder frequency in plant settings

---

## 🗃️ Database Schema (Supabase)

### Table: plants
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary key |
| user_id | uuid | Auth user |
| name | text | User's nickname for plant |
| species | text | From Kindwise or user input |
| location | text | e.g. "Bedroom window" |
| photo_url | text | Supabase storage URL |
| health_status | text | green / yellow / red |
| last_diagnosis | jsonb | Full Kindwise response |
| care_plan | jsonb | Full agent output |
| next_water_date | date | Calculated from schedule |
| next_check_date | date | Next reminder due |
| created_at | timestamp | Auto |

### Table: reminders
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary key |
| plant_id | uuid | FK → plants |
| user_id | uuid | FK → auth |
| due_date | date | When to send |
| action | text | What to do |
| sent | boolean | Track if sent |
| created_at | timestamp | Auto |

---

## 🛣️ Development Roadmap

### V1 — Ship It (2–4 weeks)
- [ ] Project setup: Vite + React + Tailwind + Express + Supabase
- [ ] Photo upload + Kindwise API integration
- [ ] Context question form (5 questions)
- [ ] GPT-4o agent: care plan generation
- [ ] Plant log: save, view, update plants
- [ ] Reminder scheduler: email via Nodemailer
- [ ] Basic auth: Supabase Auth (email login)
- [ ] Deploy: Vercel + Railway
- [ ] Record demo video (Loom)

### V2 — Get Smarter
- [ ] Plant health history tracking (log each check-in)
- [ ] AI learns from check-in feedback ("got better" / "got worse")
- [ ] Push notifications (PWA)
- [ ] Community: share your plants / get advice

### V3 — Go Hardware
- [ ] Sensor integration (soil moisture, temp, humidity via MQTT)
- [ ] Smart plug control (lights, fans) via Home Assistant API
- [ ] Automated environment recommendations
- [ ] "Grow Room Brain" mode for serious setups

---

## 🔑 Environment Variables

```env
# .env.example
KINDWISE_API_KEY=your_kindwise_key
OPENAI_API_KEY=your_openai_key
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
FRONTEND_URL=http://localhost:5173
```

---

## 🚀 Getting Started (Local Dev)

```bash
# Clone the repo
git clone https://github.com/crownincode/growmind.git
cd growmind

# Install backend
cd backend && npm install
cp .env.example .env  # fill in your keys
node index.js

# Install frontend (new terminal)
cd frontend && npm install
npm run dev
```

---

## 🤝 Built With Two AI Agents

This project is being built using a **dual AI architecture**:
- **Claude (Architect + Planner)** — system design, prompt engineering, API orchestration, feature planning
- **Qwen Coder (Implementation)** — component scaffolding, route writing, database queries, bug fixing

Both agents work from this README as the shared source of truth.

---

## 📄 License

MIT — see [LICENSE](./LICENSE)
