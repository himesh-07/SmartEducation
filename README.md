# 🎓 EduBridge — Connecting Teachers, Parents & Students

**Smarter Education. Better Communication. Brighter Futures.**

EduBridge is a centralized education management platform that brings **teachers, parents & students** together in one digital system. It lets schools handle day-to-day academic tasks while giving parents a clear, simple way to track their child's progress — attendance, exam results, notices, assignments, and school events — all from a single dashboard.

---

##  Overview

Traditional school communication is scattered across notebooks, phone calls, and paper circulars. EduBridge solves this by giving every stakeholder a dedicated portal:

- **Teachers** manage attendance, marks, and feedback in one place.
- **Parents** get a real-time view of their child's academic journey.
- **Students** benefit from AI-driven insights that highlight strengths and areas needing support.

<img width="1908" height="1035" alt="image" src="https://github.com/user-attachments/assets/46093da8-4126-44da-9f3c-2dbafcabe3d6" />




##  Key Features

###  Landing Experience
- Unified entry point with **Teacher Login** & **Parent Login**
- Instant demo access (no setup needed) to explore the platform as a sample Teacher or Parent
- Live student snapshot preview showing attendance, latest exam scores and AI insights at a glance

###  Teacher Portal
- Take and manage class attendance
- Record and update examination marks
- Post school notices and circulars
- Schedule and confirm Parent-Teacher Meetings (PTMs)
- Share teacher feedback with parents

###  Parent Portal
- **Overview dashboard** — attendance %, latest exam average, upcoming PTMs, and priority notices
- **Attendance tracker** — day-wise present/absent/late record
- **Exam Marks & Grades** — subject-wise performance and grade history
- **AI Learning Insights** — automatically generated academic insight summaries
- **School Notices** — real-time circulars and announcements
- **PTM Booking** — book and confirm parent-teacher meeting slots
- **Timetable & Events** and **Teacher Feedback** tabs
- Digital, downloadable **Report Cards**
- Support for multiple children under one parent account

###  Trust & Compliance
- Zero data leakage design principles
- FERPA & privacy-compliant data handling

---

##  AI Performance Analyzer

EduBridge includes an **AI-powered Learning Insight Engine** that automatically analyzes a student's academic data and produces plain-language, actionable feedback for parents and teachers.

**How it works:**

1. **Data aggregation** — Pulls a student's exam scores (subject-wise), attendance records, and historical trends from Firestore.
2. **Subject-strength detection** — Compares subject-wise scores against class averages and the student's own historical performance to flag strong subjects (e.g. Mathematics, Computer Science) and weaker ones (e.g. English).
3. **Trend analysis** — Calculates score deltas between exams (e.g. *"+8.2% from Mid-Term"*) to detect improvement or decline over time.
4. **Attendance correlation** — Cross-references attendance percentage with performance dips to surface early warning signs.
5. **Natural-language summary generation** — Converts the analysis into a short, human-readable insight, for example:
   > *"Excelling in Mathematics (89%) and Computer Science (98%). Targeted English grammar practice recommended prior to final examinations."*
6. **Recommendation output** — Surfaces the summary on the parent dashboard under **AI Learning Insights**, with an option to view the complete AI Learning Profile for deeper subject-by-subject breakdowns.

This engine is designed to be model-agnostic — it can be powered by a hosted LLM API (e.g. via a backend call in `server.ts`) that receives structured student data and returns a concise insight string, which the frontend then renders inside the `AI Learning Insights` components.

---

##  Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + TypeScript (Vite) |
| Styling | CSS (`index.css`) |
| Backend / Server | Node.js / TypeScript (`server.ts`) |
| Database & Auth | Firebase (Firestore, Auth, Hosting) |
| Package Manager | Bun |
| Prototyping | Built and iterated using **Google AI Studio** |
| Hosting / Deployment | Firebase Hosting via **Google Cloud Console** |

---

##  Folder Structure

```
new/
├── .agents/skills/            # Agent/skill configuration
├── .github/workflows/         # CI/CD workflows
├── dist/                      # Production build output
├── node_modules/              # Installed dependencies
├── src/
│   ├── components/
│   │   ├── auth/              # Login & authentication components
│   │   ├── common/            # Shared/reusable UI components
│   │   ├── landing/           # Landing page components
│   │   ├── parent/            # Parent portal components
│   │   └── teacher/           # Teacher portal components
│   ├── context/                # React context providers
│   ├── data/                   # Static/sample/mock data
│   ├── lib/                     # Utility functions & helpers
│   ├── App.tsx                  # Root application component
│   ├── index.css                # Global styles
│   ├── main.tsx                  # Application entry point
│   └── types.ts                   # TypeScript type definitions
├── .env.example                 # Sample environment variables
├── .firebaserc                   # Firebase project aliases
├── .gitignore
├── bun.lock                       # Bun lockfile
├── firebase-applet-config.json    # Firebase applet configuration
├── firebase-blueprint.json        # Firebase project blueprint
├── firebase.json                  # Firebase hosting/config
├── firestore.rules                # Firestore security rules
├── index.html                     # HTML entry point
├── metadata.json                  # Project metadata
├── package.json / package-lock.json
├── README.md                      # This file
├── security_spec.md               # Security specifications
├── server.ts                      # Backend server logic
└── skills-lock.json                # Skills lockfile
```

---

##  Getting Started (Run Locally)

### Prerequisites
- [Bun](https://bun.sh/) installed
- A Firebase project (for Auth + Firestore)
- Node.js (for tooling compatibility)

### Steps

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd new

# 2. Install dependencies
bun install

# 3. Set up environment variables
cp .env.example .env
# Fill in your Firebase config keys inside .env

# 4. Run the development server
bun run dev
```

The app should now be running locally — open the URL shown in your terminal (typically `http://localhost:5173`).

### Build for production

```bash
bun run build
```

This generates the optimized production build inside the `dist/` folder.

---

##  Built with Google AI Studio

The initial UI & application logic for EduBridge were prototyped & iterated using **Google AI Studio**, then refined & structured into a production-ready React + Firebase codebase.

---

##  Deployment (Firebase + Google Cloud Console)

### 1. Set up Firebase
```bash
npm install -g firebase-tools
firebase login
```

### 2. Initialize Firebase (if not already configured)
```bash
firebase init
```
- Select **Hosting**, **Firestore**, and **Authentication**
- Choose your existing Firebase project (linked via Google Cloud Console) or create a new one
- Set the public directory to `dist`
- Configure as a single-page app: **Yes**

### 3. Link with Google Cloud Console
- Go to [Google Cloud Console](https://console.cloud.google.com/)
- Select the project matching your Firebase project ID (Firebase projects are backed by Google Cloud projects)
- Enable required APIs (Firestore API, Identity Toolkit API, Cloud Functions API if used)
- Manage billing, IAM permissions, & monitoring from here if scaling beyond Firebase's free tier

### 4. Build & Deploy
```bash
bun run build
firebase deploy
```

Once deployed, Firebase will provide a live Hosting URL for your EduBridge instance.

### 5. Firestore Security Rules
Ensure `firestore.rules` is reviewed and deployed to protect student & parent data:
```bash
firebase deploy --only firestore:rules
```

---

##  License

This project is licensed under the **MIT License.


##  Created By

 himesh-07 ❤️
 Contact: *https://github.com/himesh-07/SmartEducation*

*EduBridge — because education works best when everyone stays connected.*
