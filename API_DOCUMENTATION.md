# CampusAI Backend — API Documentation

**Base URL:** `http://localhost:5000/api`  
**Organization Domain:** `@bitsathy.ac.in`  
**Version:** 1.0.0

---

## Authentication

All protected endpoints require the `Authorization: Bearer <token>` header.  
Roles are determined **server-side** — never trust or accept a role from the frontend.

---

## Auth Endpoints

### `POST /api/auth/login`

Authenticate a user with organization credentials.

**Auth Required:** No  
**Rate Limited:** Yes (30 req / 15 min per IP)

**Request Body:**
```json
{
  "email": "arun.kumar@bitsathy.ac.in",
  "password": "password123"
}
```

**Success Response `200`:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "<jwt_token>",
    "user": {
      "id": "student_1",
      "name": "Arun Kumar",
      "email": "arun.kumar@bitsathy.ac.in",
      "role": "STUDENT",
      "department": "Computer Science",
      "rollNumber": "21CS001",
      "batch": "2026",
      "phone": "+91 98765 43210",
      "cgpa": 8.4
    }
  }
}
```

**Error Responses:**
| Code | Message |
|------|---------|
| `400` | Email and password are required. |
| `400` | Only official organization accounts (@bitsathy.ac.in) are permitted. |
| `401` | Invalid email or password. |
| `429` | Too many attempts. Please try again after N seconds. |

---

### `POST /api/auth/register`

Self-register a new STUDENT account. **Staff accounts cannot be self-registered.**

**Auth Required:** No  
**Rate Limited:** Yes (30 req / 15 min per IP)

> [!IMPORTANT]
> The server **always** assigns `STUDENT` role on self-registration.  
> Any `role` field in the request body is ignored.

**Request Body:**
```json
{
  "name": "New Student",
  "email": "newstudent@bitsathy.ac.in",
  "password": "securepassword",
  "department": "Computer Science",
  "rollNumber": "21CS102",
  "batch": "2026",
  "phone": "+91 98765 00000"
}
```

**Success Response `201`:**
```json
{
  "success": true,
  "message": "Registration successful. Welcome to CampusAI!",
  "data": {
    "token": "<jwt_token>",
    "user": { "id": "...", "name": "...", "email": "...", "role": "STUDENT", ... }
  }
}
```

**Error Responses:**
| Code | Message |
|------|---------|
| `400` | Name, email, and password are required. |
| `400` | Only official organization accounts (@bitsathy.ac.in) are permitted. |
| `400` | Password must be at least 6 characters long. |
| `409` | An account with this email address already exists. |

---

### `GET /api/auth/me`

Restore the authenticated session and fetch the current user's profile.

**Auth Required:** Yes (Bearer token)  
**Role:** Any

**Success Response `200`:**
```json
{
  "success": true,
  "message": "Session restored successfully",
  "data": {
    "user": { "id": "...", "name": "...", "email": "...", "role": "STUDENT", ... }
  }
}
```

**Error Responses:**
| Code | Message |
|------|---------|
| `401` | Authentication token missing or invalid format. |
| `401` | Session expired. Please log in again. |
| `404` | User account not found. |

---

### `POST /api/auth/logout`

Logout endpoint. Clears server-side state (future token blocklist). Client must clear token.

**Auth Required:** No (client clears token)

**Success Response `200`:**
```json
{
  "success": true,
  "message": "Logged out successfully."
}
```

---

## Student Endpoints

All student endpoints require:
- `Authorization: Bearer <token>` (authenticated user)
- Role: `STUDENT`

> [!IMPORTANT]
> Student ID is always derived from the authenticated token — **never** from URL params or query strings. A student cannot access another student's data.

---

### `GET /api/student/profile`

Returns the authenticated student's profile.

**Auth:** STUDENT only

**Success Response `200`:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "student_1",
      "name": "Arun Kumar",
      "email": "arun.kumar@bitsathy.ac.in",
      "role": "STUDENT",
      "department": "Computer Science",
      "rollNumber": "21CS001",
      "cgpa": 8.4
    }
  }
}
```

---

### `GET /api/student/dashboard`

Returns the authenticated student's dashboard summary.

**Auth:** STUDENT only

**Success Response `200`:**
```json
{
  "success": true,
  "data": {
    "student": { ... },
    "attendance": { "percentage": 92.4, "streak": 12, ... },
    "academics": { "cgpa": 8.4, "semesterGpa": 8.7, ... },
    "coding": { "totalSolved": 248, "streak": 18, ... },
    "placement": { "score": 78, "maxScore": 100, ... },
    "upcomingEvents": [ ... ],
    "notifications": [ ... ]
  }
}
```

---

### `GET /api/student/attendance`

Returns attendance data (trend, subjects, calendar, stats) for the authenticated student.

**Auth:** STUDENT only

**Success Response `200`:**
```json
{
  "success": true,
  "data": {
    "trend": [ { "week": "Week 1", "percentage": 88 }, ... ],
    "subjects": [ { "subject": "Data Structures & Algorithms", "attended": 32, "total": 35, "percentage": 91.4, "status": "Good" }, ... ],
    "calendar": [ { "date": 1, "month": 8, "year": 2026, "status": "holiday" }, ... ],
    "stats": { "overallPercentage": 92.4, "classesAttended": 186, "totalClasses": 201, "safeBunksAvailable": 4 }
  }
}
```

---

### `GET /api/student/academics`

Returns academic data (subject scores, performance trends, weak subjects, study plan) for the authenticated student.

**Auth:** STUDENT only

---

### `GET /api/student/placement`

Returns placement data (score, breakdown, career roadmap, companies, resume checklist) for the authenticated student.

**Auth:** STUDENT only

---

## Staff Endpoints

All staff endpoints require:
- `Authorization: Bearer <token>` (authenticated user)
- Role: `STAFF`

> [!CAUTION]
> A student attempting to call any `/api/staff/*` endpoint will receive `403 Forbidden` even with a valid token.

---

### `GET /api/staff/profile`

Returns the authenticated staff member's profile.

**Auth:** STAFF only

---

### `GET /api/staff/dashboard`

Returns the staff dashboard: cohort overview, recent students, recent announcements.

**Auth:** STAFF only

**Success Response `200`:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalStudents": 20,
      "avgAttendance": 83.8,
      "atRiskStudentsCount": 4,
      "placementRate": 81.2,
      ...
    },
    "recentStudents": [ ... ],
    "recentAnnouncements": [ ... ]
  }
}
```

---

### `GET /api/staff/students`

Returns the full student cohort roster. Supports filtering.

**Auth:** STAFF only  
**Query Params:**

| Param | Type | Description |
|-------|------|-------------|
| `riskLevel` | `High` \| `Medium` \| `Low` | Filter by AI risk classification |
| `department` | string | Filter by department |
| `search` | string | Search by name or roll number |

---

### `GET /api/staff/students/:studentId`

Returns detailed data for a specific student.

**Auth:** STAFF only  
**URL Param:** `studentId` — the student's ID or roll number

**Error Response `404`:** `Student with ID 'X' not found.`

---

### `GET /api/staff/attendance`

Returns all attendance sessions.

**Auth:** STAFF only

---

### `POST /api/staff/attendance`

Records a new attendance session.

**Auth:** STAFF only

**Request Body:**
```json
{
  "subject": "Data Structures & Algorithms",
  "date": "2026-08-10",
  "faculty": "Dr. Priya Sharma",
  "totalPresent": 18,
  "totalStudents": 20,
  "entries": [
    { "studentId": "STU_101", "studentName": "Rahul Kumar", "rollNumber": "21CS045", "status": "Absent" },
    { "studentId": "STU_106", "studentName": "Arun Kumar", "rollNumber": "21CS001", "status": "Present" }
  ]
}
```

**Success Response `201`:** Saved session object.

---

### `GET /api/staff/academics`

Returns academic mark entries. Optionally filtered by subject.

**Auth:** STAFF only  
**Query Param:** `subject` (optional)

---

### `POST /api/staff/academics`

Saves academic mark entries (array or single object).

**Auth:** STAFF only

**Request Body:** Array of mark entries or single entry:
```json
[
  {
    "studentId": "STU_106",
    "studentName": "Arun Kumar",
    "rollNumber": "21CS001",
    "subject": "Data Structures",
    "assessmentType": "Internal 2",
    "marks": 45,
    "maxMarks": 50,
    "grade": "O",
    "date": "2026-08-15"
  }
]
```

---

### `GET /api/staff/placement`

Returns the placement roster for all cohort students.

**Auth:** STAFF only

---

### `GET /api/staff/support`

Returns AI student support cases. Optionally filtered by status.

**Auth:** STAFF only  
**Query Param:** `status` — `Open` | `In Progress` | `Resolved` | `Monitoring`

---

### `PATCH /api/staff/support/:id`

Updates a student support case (add remarks, change status, set follow-up).

**Auth:** STAFF only  
**URL Param:** `id` — support case ID

**Request Body (partial):**
```json
{
  "staffRemarks": "Student attended remedial session.",
  "supportStatus": "Monitoring",
  "followUpDate": "2026-08-25",
  "intervention": "Remedial Class Attendance"
}
```

**Error Response `404`:** `Support case 'X' not found.`

---

### `GET /api/staff/announcements`

Returns all announcements.

**Auth:** STAFF only

---

### `POST /api/staff/announcements`

Creates a new announcement. Author is set from the authenticated user's token.

**Auth:** STAFF only

**Request Body:**
```json
{
  "title": "Upcoming Exam Rescheduled",
  "description": "The Internal 2 examination for Sem 5 is rescheduled to August 22.",
  "audience": "All Students",
  "category": "Exam",
  "pinned": true
}
```

**Success Response `201`:** Created announcement with server-assigned `id` and `author`.

---

### `GET /api/staff/reports`

Returns available staff reports (Attendance, Academics, At-Risk, Placement).

**Auth:** STAFF only

---

## Health Check

### `GET /api/health`

No authentication required.

**Success Response `200`:**
```json
{
  "success": true,
  "data": {
    "status": "online",
    "timestamp": "2026-09-14T03:30:00.000Z",
    "service": "CampusAI Backend API",
    "environment": "development",
    "orgDomain": "bitsathy.ac.in"
  }
}
```

---

## Standard Error Response Format

All error responses follow this structure:

```json
{
  "success": false,
  "message": "Human-readable error description"
}
```

| HTTP Code | Meaning |
|-----------|---------|
| `200` | Success |
| `201` | Created |
| `400` | Bad Request (validation error) |
| `401` | Unauthenticated (missing/invalid/expired token) |
| `403` | Forbidden (wrong role — RBAC) |
| `404` | Not Found |
| `409` | Conflict (duplicate email) |
| `422` | Unprocessable Entity |
| `429` | Too Many Requests (rate limited) |
| `500` | Internal Server Error |

---

## JWT Token

**Algorithm:** HS256  
**Expiry:** 7 days (configurable via `JWT_EXPIRES_IN`)

**Token Payload:**
```json
{
  "sub": "student_1",
  "id": "student_1",
  "email": "arun.kumar@bitsathy.ac.in",
  "role": "STUDENT",
  "name": "Arun Kumar",
  "department": "Computer Science",
  "iat": 1234567890,
  "exp": 1235000000
}
```

> **Never** store sensitive fields (passwordHash, secrets) in the JWT payload.

---

## Development Mock Accounts

> These accounts exist only in `NODE_ENV=development` and use the in-memory mock repository.

| Name | Email | Password | Role |
|------|-------|----------|------|
| Arun Kumar | `arun.kumar@bitsathy.ac.in` | `password123` | STUDENT |
| Priya Sharma | `priya.sharma@bitsathy.ac.in` | `password123` | STUDENT |
| Rahul Verma | `rahul.verma@bitsathy.ac.in` | `password123` | STUDENT |
| Dr. Priya Sharma | `priya.faculty@bitsathy.ac.in` | `password123` | STAFF |
| Prof. Rajesh Kumar | `rajesh.faculty@bitsathy.ac.in` | `password123` | STAFF |

---

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Backend server port | `5000` |
| `JWT_SECRET` | Secret key for signing JWTs | `super_secret_...` |
| `JWT_EXPIRES_IN` | Token expiry duration | `7d` |
| `REFRESH_TOKEN_SECRET` | Secret for refresh tokens (future) | `super_refresh_...` |
| `FRONTEND_URL` | Allowed CORS origin | `http://localhost:5173` |
| `ORG_EMAIL_DOMAIN` | Enforced email domain | `bitsathy.ac.in` |
| `NODE_ENV` | Environment mode | `development` |
| `GEMINI_API_KEY` | (Optional) Google Gemini API key for live LLM responses | `AIzaSy...` |

---

## AI & Placement Mentor Endpoints

### `POST /api/ai/chat`
Context-aware AI conversation analyzing student academics, attendance risks, and company recruitment intelligence.

**Auth Required:** Yes (`STUDENT` or `STAFF`)  
**Request Body:**
```json
{
  "message": "Explain the complete Zoho recruitment process and rounds.",
  "history": [],
  "companyId": "zoho",
  "studyMaterialContext": "Optional PDF summary context"
}
```

---

### `POST /api/ai/summarize-pdf`
Summarizes student lecture notes or PDFs into high-yield exam points, key concepts, formulas, and 16-mark/2-mark questions.

**Auth Required:** Yes  
**Payload Format:** Supports `multipart/form-data` with `file` (PDF/TXT) OR `application/json` with `{ "text": "...", "documentName": "..." }`.

---

### `POST /api/ai/analyze-company`
Calculates student eligibility, estimated readiness percentage, and returns round-by-round recruitment procedure for a target company (Zoho, TCS, Infosys, Accenture, Product tier).

**Auth Required:** Yes  
**Request Body:**
```json
{
  "companyId": "zoho"
}
```

---

### `GET /api/ai/companies`
Retrieves all supported recruitment company intelligence profiles.

**Auth Required:** Yes

