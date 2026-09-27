# 🎓 CampusHire — Smart Campus Placement & Recruitment System

A full-stack web application that connects **students**, **recruiters**, and **placement administrators** in one smart platform.

![Tech Stack](https://img.shields.io/badge/Backend-Java%20Spring%20Boot-brightgreen)
![Tech Stack](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-blue)
![Tech Stack](https://img.shields.io/badge/Database-H2%20%2F%20MySQL-orange)
![Tech Stack](https://img.shields.io/badge/Security-JWT-red)

---

## 🚀 Live Demo

Once running, open: **http://localhost:5173**

### Quick Demo Credentials

| Role | Username | Password |
|------|----------|----------|
| 🎓 Student | `student_arun` | `student123` |
| 🎓 Student | `student_ananya` | `student123` |
| 💼 Recruiter (Google) | `recruiter_google` | `google123` |
| 💼 Recruiter (Zoho) | `recruiter_zoho` | `zoho123` |
| 🔑 Admin | `admin` | `admin123` |

---

## 🏗️ Architecture

```
CampusHire
    │
    ├── Backend  (Spring Boot REST API — port 8080)
    │       └── JWT Auth │ JPA/H2 │ Role-based Security
    │
    └── Frontend (React + Vite SPA — port 5173)
            └── Student Portal │ Recruiter Portal │ Admin Dashboard
```

---

## 🛠️ Technology Stack

### Backend
| Layer | Technology |
|-------|-----------|
| Framework | Spring Boot 3.x |
| Security | Spring Security + JWT |
| ORM | Spring Data JPA + Hibernate |
| Database | H2 (in-memory) / MySQL |
| Build | Maven |
| API | REST (JSON) |

### Frontend
| Layer | Technology |
|-------|-----------|
| Framework | React 18 + Vite |
| State | Context API + Hooks |
| HTTP | Axios |
| Icons | Lucide React |
| Styling | Vanilla CSS (Glassmorphism Dark Theme) |

---

## 📋 Main Modules

### 🎓 Student Portal
- Create and manage profile (CGPA, department, bio, resume)
- Add/remove skills with proficiency levels
- Browse job listings with eligibility check
- Apply to jobs with cover letter
- Track application status in real time:
  `Applied → Shortlisted → Interview Scheduled → Selected / Rejected`
- View upcoming interview schedule

### 💼 Recruiter Portal
- Post job openings with eligibility criteria (min CGPA, skills required)
- View all applicants per job
- Shortlist candidates
- Schedule interviews (Online / Offline)
- Update interview results

### 🔑 Admin Dashboard
- Platform-wide placement analytics
- User and company directory
- Job and application overview

---

## 🗃️ Database Schema

```
User ──┬── Student ──── StudentSkill ──── Skill
       └── Recruiter ── Company ────────── Job ──── Application ──── Interview
```

**Main Tables:**
`user`, `student`, `recruiter`, `company`, `job`, `application`, `interview`, `skill`, `student_skill`

---

## 🔗 REST API Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/login` | Login | Public |
| POST | `/api/auth/register` | Register | Public |
| GET | `/api/auth/me` | Current user | JWT |
| GET | `/api/jobs` | List all jobs | All |
| POST | `/api/jobs` | Create job | Recruiter |
| GET | `/api/jobs/recruiter` | My posted jobs | Recruiter |
| POST | `/api/applications/apply` | Apply to job | Student |
| GET | `/api/applications/my` | My applications | Student |
| GET | `/api/applications/job/{id}` | Job applicants | Recruiter |
| PATCH | `/api/applications/{id}/status` | Update status | Recruiter |
| POST | `/api/interviews/schedule` | Schedule interview | Recruiter |
| GET | `/api/interviews/student` | My interviews | Student |
| GET | `/api/students/profile` | Student profile | Student |
| PUT | `/api/students/profile` | Update profile | Student |
| POST | `/api/students/skills` | Add skill | Student |
| DELETE | `/api/students/skills/{id}` | Remove skill | Student |
| GET | `/api/analytics/dashboard` | Stats | Admin |

> **H2 Console:** `http://localhost:8080/h2-console`
> JDBC URL: `jdbc:h2:mem:placementdb` | User: `sa` | Password: *(blank)*

---

## ⚙️ Setup & Run

### Prerequisites
- Java 17+
- Node.js 18+
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/Gowrish2507/Smart-Campus-Placement-Recruitment-System.git
cd Smart-Campus-Placement-Recruitment-System
```

### 2. Start the Backend
```bash
cd backend
..\tools\apache-maven-3.9.6\bin\mvn spring-boot:run
```
Backend starts at: `http://localhost:8080`

### 3. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend starts at: `http://localhost:5173`

### One-Click Start (Windows)
```batch
start-all.cmd
```

---

## 🔒 Security

- JWT-based stateless authentication
- BCrypt password hashing
- Role-based access control: `ROLE_STUDENT` | `ROLE_RECRUITER` | `ROLE_ADMIN`
- CORS configured for local development

---

## 🔧 Switch to MySQL

Edit `backend/src/main/resources/application.properties`:

1. Comment out H2 configuration block
2. Uncomment MySQL configuration block
3. Update your MySQL credentials
4. Create database: `CREATE DATABASE campus_placement;`
5. Restart the backend

---

## 📂 Project Structure

```
Smart-Campus-Placement-Recruitment-System/
├── backend/
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/campus/placement/
│       │   ├── PlacementApplication.java
│       │   ├── config/          (Security, JWT, CORS, DataInitializer)
│       │   ├── controller/      (Auth, Jobs, Applications, Interviews, Students, Analytics)
│       │   ├── dto/             (Request/Response DTOs)
│       │   ├── model/           (JPA Entities)
│       │   ├── repository/      (Spring Data Repositories)
│       │   └── service/         (Business Logic)
│       └── resources/
│           └── application.properties
│
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── App.jsx
│       ├── index.css
│       ├── context/AuthContext.jsx
│       ├── services/api.js
│       ├── components/          (Navbar, Sidebar, Modal, ApplicationTracker)
│       └── pages/               (Login, Dashboards, Jobs, Profile, etc.)
│
├── tools/                       (Local Maven binary)
├── start-all.cmd
├── run-backend.cmd
├── run-frontend.cmd
└── README.md
```

---

## 👤 Author

**Gowrish** — [GitHub](https://github.com/Gowrish2507)

---

## 📄 License

This project is for educational purposes.
