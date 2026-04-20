# 🧠 MindMate AI

**Your AI-Powered Mental Health Companion**

MindMate AI is a web-based mental health support application that leverages artificial intelligence to provide personalized emotional wellness tools. Built as a capstone project using the MERN stack.

---

## 🛠️ Tech Stack

| Layer      | Technology                        |
| ---------- | --------------------------------- |
| Frontend   | React 19 + Vite 8 + Tailwind v4  |
| Backend    | Node.js + Express 5              |
| Database   | MongoDB (Mongoose ODM)           |
| Auth       | JWT (jsonwebtoken) + bcryptjs    |
| HTTP Client| Axios                            |

---

## 📁 Project Structure

```
mindmate-ai/
├── frontend/                # Client-side application
│   ├── src/
│   │   ├── assets/          # Static assets (images, icons)
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page-level components
│   │   ├── services/        # API service modules (Axios)
│   │   ├── App.jsx          # Root component
│   │   ├── App.css          # App-level styles
│   │   ├── index.css        # Global styles (Tailwind)
│   │   └── main.jsx         # Entry point
│   ├── package.json
│   └── vite.config.js
│
├── backend/                 # Server-side application
│   ├── controllers/         # Request handlers
│   ├── models/              # Mongoose schemas
│   ├── routes/              # API route definitions
│   ├── server.js            # Express app entry point
│   ├── .env                 # Environment variables (not tracked)
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) (local or Atlas)
- [Git](https://git-scm.com/)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/<your-username>/mindmate-ai.git
   cd mindmate-ai
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in `/backend`:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string_here
   JWT_SECRET=your_jwt_secret_key_here
   ```

4. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

**Backend** (from `/backend`):
```bash
npm run dev
```

**Frontend** (from `/frontend`):
```bash
npm run dev
```

The frontend runs on `http://localhost:5173` and the backend API on `http://localhost:5000`.

---

## 📌 Current Status

🟢 **Initial Setup Complete** — Project scaffolding, dependencies, and development environment are configured.

---

## 📄 License

This project is part of the DBS Foundation Coding Camp capstone program.
