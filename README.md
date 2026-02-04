# Auth + Dashboard App

A modern full-stack web application built for a **Frontend Developer Intern shortlisting assignment**.
The project focuses on **clean UI, strong frontend structure, secure authentication**, and **smooth frontend–backend integration**.

---

## 🚀 Features

### Authentication

- Signup & Login
- Client-side form validation
- Secure password hashing
- JWT-based authentication
- HTTP-only cookies
- Logout functionality

### Dashboard

- Protected route (accessible only after login)
- Displays authenticated user info
- Task management (CRUD)
  - Create task
  - View task list
  - Edit task inline
  - Delete task
- Error states & loading handling
- Clean, minimal UI with subtle transitions

---

## 🧱 Tech Stack

### Frontend

- Next.js (App Router)
- React
- Tailwind CSS v4
- Component-driven UI architecture
- Global styling via `globals.css`

### Backend

- Next.js Route Handlers
- MongoDB + Mongoose
- JWT authentication
- Zod for request validation

---

## 📁 Project Structure

app/
├── (auth)/login
├── (auth)/signup
├── dashboard
├── api/v1
│ ├── auth
│ ├── me
│ └── tasks
components/
├── Button.tsx
├── Card.tsx
├── Container.tsx
├── Input.tsx
└── PageHeader.tsx
lib/
├── auth.ts
├── db.ts
└── validators.ts
models/
├── User.ts
└── Task.ts

---


## ⚙️ Setup Instructions

### 1. Clone the repository

```
git clone <repository-url>
cd <repository-name>
```

### 2. Install dependencies

```
npm install
```

### 3. Environment variables

Create a `.env.local` file in the root:

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### 4. Run the application

```
npm run dev

```

Open:

[http://localhost:3000](http://localhost:3000)

---

## Demo Usage

* Create a new account using the signup page
* Login to access the dashboard
* Manage tasks from the dashboard UI

---

## How Would You Scale This for Production?

* Use a managed secret store for environment variables
* Add refresh tokens and token rotation
* Implement role-based access control
* Add database indexes for frequently queried fields
* Introduce pagination for large task lists
* Add rate limiting on auth routes
* Add centralized logging and monitoring
* Configure strict CORS and security headers
* Deploy using Vercel with managed MongoDB

---

## Notes

* The project is intentionally kept **simple and focused**
* No unnecessary abstractions or overengineering
* Emphasis on **frontend quality, structure, and UX**

---

## 👤 Author

##### Naman singh rathaur - Frontend Developer Intern Candidate

###### email - namansingh99694@gmail.com
