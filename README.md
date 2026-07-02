# 🚀 PulseX - AI Powered Workforce Management System

## 📌 Overview

PulseX is a full-stack AI-powered Workforce Management System that simplifies employee management through attendance tracking, work log management, leave management, AI-powered assistance, and analytics.

The application provides a modern dashboard for employees while enabling secure authentication and efficient workforce management using React, Node.js, Express, PostgreSQL, Prisma ORM, and Google Gemini AI.

---

# ✨ Features

## Authentication

* Secure JWT Authentication
* User Registration
* User Login
* Protected Routes
* Role-based Architecture (Employee, Manager, Admin)

---

## Dashboard

* Employee Dashboard
* Weekly Hours
* Attendance Score
* Recent Activity
* AI Assistant Widget
* Work Summary Cards

---

## Attendance Management

* Daily Attendance Tracking
* Check-in & Check-out
* Working Hours Calculation
* Attendance History
* Attendance Statistics

---

## Work Log Management

* Add Work Logs
* Update Work Logs
* Delete Work Logs
* Project-wise Tracking
* Hours Worked
* Task Status

---

## Leave Management

* Apply Leave
* Leave History
* Leave Status
* Leave Balance

---

## User Profile

* Update Personal Information
* Department Details
* Role Information

---

## AI Assistant

PulseX integrates Google Gemini AI to provide intelligent assistance.

Capabilities include:

* Productivity Suggestions
* Task Prioritization
* Coding Help
* Motivation Tips
* Work Summary
* General Employee Assistance

---

## Analytics

The dashboard provides insights including:

* Total Attendance
* Hours Worked
* Completed Tasks
* Pending Tasks
* Leave Statistics
* Productivity Overview

---

# 🛠 Tech Stack

## Frontend

* React.js
* Tailwind CSS
* React Router DOM
* Framer Motion
* Axios
* React Icons

---

## Backend

* Node.js
* Express.js
* JWT Authentication
* Prisma ORM
* BcryptJS

---

## Database

* PostgreSQL

---

## AI Integration

* Google Gemini API

---

# 📁 Project Structure

```
PulseX
│
├── backend
│   ├── prisma
│   │   ├── schema.prisma
│   │   └── seed.js
│   │
│   ├── src
│   │   ├── controllers
│   │   ├── middleware
│   │   ├── routes
│   │   ├── utils
│   │   └── index.js
│   │
│   └── package.json
│
├── frontend
│   ├── public
│   ├── src
│   │   ├── assets
│   │   ├── components
│   │   ├── layouts
│   │   ├── pages
│   │   ├── routes
│   │   └── data
│   │
│   └── package.json
│
├── docs
│   └── ER_Diagram.png
│
└── README.md
```

---

# 🗄 Database

The application uses PostgreSQL with Prisma ORM.

Main entities include:

* User
* Team
* Attendance
* WorkLog
* LeaveRequest

Relationships

* One Team → Many Users
* One User → Many Attendance Records
* One User → Many Work Logs
* One User → Many Leave Requests

---

# 📊 ER Diagram

The Entity Relationship Diagram is available inside the **docs** folder.

```
docs/
└── "C:\Users\Sunidhi\Downloads\pulsex_readme_er_diagram.html"
```

---

# ⚙ Installation

## Clone Repository

```bash
git clone https://github.com/SunidhiVyas/PulseX.git
```

---

## Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
DATABASE_URL=your_database_url
JWT_SECRET=your_secret
GEMINI_API_KEY=your_gemini_api_key
```

Run Prisma Migration

```bash
npx prisma generate
npx prisma migrate dev
```

Run Backend

```bash
npm run dev
```

Backend runs on

```
http://localhost:5000
```

---

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on

```
http://localhost:5173
```

---

# 🌱 Seed Script

The project includes a Prisma seed script to populate the database with sample data.

Run:

```bash
npx prisma db seed
```

The seed script creates:

* Sample Team
* Admin User
* Employee Users
* Attendance Records
* Work Logs
* Leave Requests

---

# 🔐 Authentication

Authentication is implemented using JSON Web Tokens (JWT).

Protected APIs require:

```
Authorization: Bearer <JWT_TOKEN>
```

---

# 📡 API Modules

* Authentication API
* User API
* Attendance API
* Work Log API
* Leave API
* Dashboard API
* AI Chat API

---


