# QuizWhiz

A full-stack quiz platform built with **FastAPI**, **PostgreSQL**, and **Next.js**, featuring JWT-based authentication, role-based access control, question management, automated scoring, and a real-time leaderboard.

## Overview

QuizWhiz is designed to provide a secure and scalable quiz experience for users while giving administrators complete control over question management. The platform follows a layered architecture with clear separation between API routing, business logic, database models, validation schemas, and infrastructure components.

### Key Features

* User registration and login
* JWT-based authentication and authorization
* Role-based access control (User/Admin)
* Question management system
* Quiz participation with attempt tracking
* Automatic answer evaluation and scoring
* Leaderboard ranking system
* PostgreSQL database integration
* RESTful API architecture
* Responsive Next.js frontend

---

# System Architecture

```text
Frontend (Next.js)
        │
        ▼
 FastAPI REST API
        │
 ┌──────┼──────┐
 ▼      ▼      ▼
Schemas Services Models
        │
        ▼
 PostgreSQL
```

The backend follows a layered architecture:

* **API Layer** – Handles HTTP requests and responses.
* **Service Layer** – Contains business logic.
* **Schema Layer** – Validates and serializes data.
* **Model Layer** – Defines database entities.
* **Core Layer** – Authentication, security, configuration, and dependencies.
* **Database Layer** – PostgreSQL with SQLAlchemy ORM.

---

# Technology Stack

## Backend

* FastAPI
* SQLAlchemy
* PostgreSQL
* Alembic
* Pydantic
* Passlib (bcrypt)
* Python-JOSE (JWT Authentication)
* Uvicorn

## Frontend

* Next.js
* React
* TypeScript
* Axios
* Tailwind CSS

---

# Project Structure

```text
QuizWhiz
│
├── backend
│   ├── app
│   │   ├── api
│   │   ├── core
│   │   ├── db
│   │   ├── models
│   │   ├── schemas
│   │   ├── services
│   │   └── scripts
│   │
│   ├── alembic
│   ├── requirements.txt
│   └── render.yaml
│
├── frontend
│   ├── src
│   │   ├── app
│   │   ├── components
│   │   ├── hooks
│   │   └── lib
│   │
│   └── package.json
│
└── README.md
```

---

# Backend Architecture

## API Layer

Responsible for handling incoming HTTP requests and returning responses.

### Routes

| Module         | Responsibility                  |
| -------------- | ------------------------------- |
| auth.py        | Authentication and registration |
| questions.py   | Quiz question retrieval         |
| submissions.py | Answer submission               |
| leaderboard.py | Ranking system                  |
| admin.py       | Question management             |
| users.py       | User dashboard                  |

---

## Service Layer

Contains business logic and application rules.

### Auth Service

* User registration
* Password hashing
* Credential validation

### Question Service

* Create questions
* Retrieve questions
* Update questions
* Delete questions
* Retrieve unattempted questions

### Submission Service

* Validate submissions
* Prevent duplicate attempts
* Calculate scores
* Update user scores

### Leaderboard Service

* Generate rankings
* Sort users by score

---

## Schema Layer

Defines request and response contracts.

### Examples

#### RegisterRequest

```json
{
  "username": "john",
  "email": "john@example.com",
  "password": "password123"
}
```

#### LoginRequest

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### SubmissionRequest

```json
{
  "question_id": "123",
  "selected_option": "B"
}
```

---

## Model Layer

### User

Stores:

* Username
* Email
* Password Hash
* Role
* Total Score

### Question

Stores:

* Question Text
* Options A–D
* Correct Option
* Difficulty Level
* Points

### Submission

Stores:

* User ID
* Question ID
* Selected Option
* Correctness
* Awarded Points

---

## Authentication Flow

```text
User Login
     │
     ▼
Credential Validation
     │
     ▼
JWT Token Creation
     │
     ▼
Token Returned
     │
     ▼
Protected Requests
     │
     ▼
Current User Resolution
```

### Security Features

* Bcrypt password hashing
* JWT access tokens
* Token expiration
* Protected endpoints
* Role-based authorization

---

# Database Design

## User → Submission

One user can create many submissions.

```text
User
  │
  └───< Submission
```

## Question → Submission

One question can have many submissions.

```text
Question
   │
   └───< Submission
```

## Relationships

```text
User
 │
 ├── id
 ├── username
 ├── email
 └── total_score

Question
 │
 ├── id
 ├── question_text
 ├── correct_option
 └── points

Submission
 │
 ├── user_id
 ├── question_id
 ├── selected_option
 ├── is_correct
 └── points_awarded
```

---

# API Endpoints

## Authentication

| Method | Endpoint           | Description   |
| ------ | ------------------ | ------------- |
| POST   | /api/auth/register | Register user |
| POST   | /api/auth/login    | Login user    |
| GET    | /api/auth/me       | Current user  |

---

## Questions

| Method | Endpoint                   | Description             |
| ------ | -------------------------- | ----------------------- |
| GET    | /api/questions             | Get all questions       |
| GET    | /api/questions/unattempted | Get remaining questions |

---

## Submissions

| Method | Endpoint         | Description   |
| ------ | ---------------- | ------------- |
| POST   | /api/submissions | Submit answer |

---

## Leaderboard

| Method | Endpoint         | Description   |
| ------ | ---------------- | ------------- |
| GET    | /api/leaderboard | View rankings |

---

## Admin

| Method | Endpoint                  | Description     |
| ------ | ------------------------- | --------------- |
| POST   | /api/admin/questions      | Create question |
| GET    | /api/admin/questions      | List questions  |
| PUT    | /api/admin/questions/{id} | Update question |
| DELETE | /api/admin/questions/{id} | Delete question |

---

# Getting Started

## Backend Setup

```bash
cd backend

python -m venv venv

source venv/bin/activate
# Windows
venv\Scripts\activate

pip install -r requirements.txt
```

Create a `.env` file:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/quizwhiz
JWT_SECRET=your_secret_key
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

Run migrations:

```bash
alembic upgrade head
```

Start the server:

```bash
uvicorn app.main:app --reload
```

Backend runs at:

```text
http://localhost:8000
```

---

## Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend runs at:

```text
http://localhost:3000
```

---

# Design Principles

* Separation of Concerns
* Layered Architecture
* Reusable Service Layer
* Dependency Injection
* Secure Authentication
* Scalable API Design
* Database Integrity
* Maintainable Code Structure

---

# Future Improvements

* Timed quizzes
* Categories and tags
* Question import/export
* Analytics dashboard
* User profiles
* Achievement system
* Email verification
* Password reset functionality
* Real-time leaderboard updates
* Quiz history and statistics

---

# License

This project is licensed under the MIT License.

---

# Author

Developed by Anish Balabattuni

GitHub: https://github.com/vsanishb
