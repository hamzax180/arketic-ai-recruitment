# 🚀 arketic.ai | Next-Gen Recruitment Platform

![arketic.ai Banner](https://img.shields.io/badge/AI-Powered-blueviolet?style=for-the-badge)
![React](https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi)
![Gemini](https://img.shields.io/badge/AI-Gemini%20Flash-blue?style=for-the-badge&logo=google-gemini)

**arketic.ai** is a state-of-the-art recruitment platform designed to revolutionize how HR professionals evaluate talent. By leveraging Google's Gemini AI, the platform provides deep, human-like insights into candidate suitability, technical depth, and cultural fit.

---

## ✨ Key Features

### 🧠 Intelligent CV Analysis
- **"Why this rating?"**: Narrative, conversational AI summaries that explain a candidate's score like a senior recruiter.
- **Holistic Matching**: Beyond keyword matching—analyzes role identity, industry relevance, and growth potential.
- **Re-analyze on Demand**: Instantly refresh analysis for any candidate with the latest AI logic.

### 🎨 Premium Design System
- **Glassmorphism UI**: A sleek, modern interface with real-time blur and transparency effects.
- **Live Video Background**: Immersive "Shape the Future" visual experience.
- **Corner-to-Corner Layout**: Modern, full-width navigation for maximum focus on content.

### 🛡️ Robust Security & Testing
- **Full Testing Suite**: Organized `tests/` directory covering Unit, Integration, and Security.
- **API Performance**: Real-time benchmarking for sub-second responses.
- **JWT Protection**: Secure, role-based access control for all sensitive endpoints.

---

## 🛠️ Tech Stack

- **Frontend**: React (Vite), TailwindCSS, Lucide Icons, Glassmorphism CSS.
- **Backend**: FastAPI (Python), OAuth2 with JWT, Mangum (Vercel Support).
- **AI Engine**: Google Gemini (generativeai) with Smart Simulation Fallback.
- **Database**: JSON-based Persistence with Vercel `/tmp` synchronization.

---

## 🏗️ System Architecture

### Frontend Design
The frontend is a **React Single Page Application (SPA)** optimized for a premium, high-performance experience.
- **Design Philosophy**: Core "Glassmorphism" aesthetic with `backdrop-filter` blurs and premium gradients.
- **State Management**: Zero-dependency state management using React Context API for Auth and Data synchronization.
- **Role-Based Routing**: Hardened navigation that blocks non-admin users from accessing recruitment dashboards.

### Backend & AI Infrastructure
The backend is a **FastAPI** microservice wrapped with **Mangum** for seamless serverless deployment.
- **CV Matching Algorithm**: Uses a **Role Proximity Model** that weights candidate "Identity" (e.g., Software Engineer title) and industry-specific keywords.
- **AI Scoring Logic**: 
    - **Conversational Summaries**: Generates human-like "Why this rating?" narratives instead of dry bullet points.
    - **Smart Fallback**: If AI services are unavailable, the system automatically switches to an internal proximity-based scoring engine to ensure zero downtime.
- **Persistence Strategy**: Implements a robust JSON-to-Cloud synchronization logic, specifically designed to handle Vercel's read-only filesystem by leveraging `/tmp` for runtime operations.

---

## 🛡️ Admin Security & Access
For maximum security, admin account creation has been decoupled from the public signup flow:
- **Terminal Only**: Admin accounts can **only** be created via the secure terminal script: `python backend/scripts/create_admin.py`.
- **RBAC**: Every sensitive endpoint is protected by JWT-based Role-Based Access Control.

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- Python 3.9+
- Gemini API Key

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/hamzax180/arketic-ai-recruitment.git
cd arketic-ai-recruitment

# Setup Backend
cd backend
python -m venv venv
source venv/bin/activate # or venv\Scripts\activate on Windows
pip install -r requirements.txt

# Setup Frontend
cd ..
npm install
```

### 3. Environment Setup
Create a `.env` file in the `backend/` directory:
```env
GEMINI_API_KEY=your_key_here
SECRET_KEY=your_secret_password
```

### 4. Running the App
```bash
# Terminal 1: Backend
python backend/main.py

# Terminal 2: Frontend
npm run dev
```

---

## 🧪 Testing
Run the comprehensive verification suite to ensure everything is perfect:
```bash
# Run all tests
python tests/unit_tests.py
python tests/security_tests.py
python tests/integration_tests.py
```
*Detailed test documentation is available in [tests/README.md](./tests/README.md).*

---

## 📄 License
Custom Proprietary - All rights reserved by **arketic.ai**.
