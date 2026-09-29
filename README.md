FieldOps

FieldOps is a full-stack recovery operations platform connecting managers and field agents for case assignment, location tracking, navigation, field reporting, evidence collection, and direct communication.

🚀 Features

🔐 JWT Manager & Agent authentication

📋 Recovery case management

📍 GPS agent location tracking

🤖 Nearest-agent assignment

🗺️ Route & map navigation with Leaflet

📝 Field updates and visit outcomes

📸 Evidence / proof upload

✅ Check-in and case completion

💬 Individual Manager ↔ Agent messaging

📊 Manager dashboard and reports

🕒 Operational activity tracking

🛠️ Tech Stack

Frontend: React 19, Vite, React Router, Axios, Leaflet, React Leaflet, Lucide React

Backend: Node.js, Express, JWT, bcryptjs, Multer, CORS, dotenv

Storage: Local JSON database + local evidence files

📁 Project Structure

fieldops/
├── src/
│   ├── api/
│   ├── components/
│   ├── pages/
│   │   ├── manager/
│   │   └── agent/
│   └── App.jsx
├── server/
│   ├── middleware/
│   ├── routes/
│   ├── utils/
│   ├── data/db.json
│   └── uploads/
└── package.json

⚙️ Setup

Install

npm install

Start Backend

npm run dev:server

Backend: http://localhost:4000

Health check: http://localhost:4000/api/health

Start Frontend

Open a second terminal:

npm run dev

Frontend: http://localhost:5173

If port 5173 is busy, Vite will use another available port.

🔑 Demo Credentials

Manager

Email: manager@fieldops.local
Password: manager123

Agent

Email: agent@fieldops.local
Password: agent123

🔄 Core Workflow

Manager
   ↓
View / Create Recovery Case
   ↓
Find Nearest Agent
   ↓
Assign Case
   ↓
Agent Receives Case
   ↓
Navigate to Location
   ↓
Check In
   ↓
Submit Field Update
   ↓
Upload Evidence
   ↓
Complete Case
   ↓
Manager Reviews Result

📍 Assignment

Recovery Case
      ↓
Case Coordinates
      ↓
Available Agents
      ↓
Agent GPS Locations
      ↓
Distance Calculation
      ↓
Nearest Agent
      ↓
Assignment

💬 Communication

Private Manager ↔ Agent conversations are persisted in the backend database.

Manager
 ├── Field Agent → Private Chat
 ├── Rahul Kumar → Private Chat
 └── Arjun Rao   → Private Chat

📸 Evidence

Uploaded proof is stored in:

server/uploads/

Evidence metadata is stored in:

server/data/db.json

🗄️ Database

The prototype uses:

server/data/db.json

Main collections:

users
agents
cases
assignments
locations
fieldUpdates
evidence
activity
messages

🌐 Main API

Authentication

POST /api/auth/login

Manager

GET  /api/manager/dashboard
GET  /api/manager/cases
POST /api/manager/cases
GET  /api/manager/agents
GET  /api/manager/cases/:caseId/nearest-agent
POST /api/manager/cases/:caseId/assign-nearest
POST /api/manager/cases/:caseId/assign
POST /api/manager/cases/:caseId/unassign
GET  /api/manager/reports

Agent

GET  /api/agent/dashboard
GET  /api/agent/cases
GET  /api/agent/cases/:caseId
POST /api/agent/location
POST /api/agent/location/consent
GET  /api/agent/cases/:caseId/route
POST /api/agent/cases/:caseId/check-in
POST /api/agent/cases/:caseId/updates
POST /api/agent/cases/:caseId/evidence
POST /api/agent/cases/:caseId/complete

Messaging

GET  /api/messages/conversations
GET  /api/messages/agent/:agentId
POST /api/messages/agent/:agentId
GET  /api/messages/manager
POST /api/messages/manager

Health

GET /api/health

🎯 Objective

FieldOps centralizes field recovery operations into a location-aware workflow that helps managers assign agents, monitor cases, track field activity, review evidence, communicate with agents, and measure operational performance.

🚧 Future Improvements

PostgreSQL / MongoDB

WebSocket real-time messaging

Cloud evidence storage

Advanced route optimization

Push notifications

Advanced analytics

Agent performance scoring

Automated case prioritization

Production deployment

📌 Status

Functional full-stack prototype with authentication, case management, nearest-agent assignment, location tracking, mapping, field updates, evidence upload, case completion, reporting, and Manager ↔ Agent communication.

👨‍💻 Development

npm run dev:server
npm run dev

Check code quality:

npm run lint

Build:

npm run build