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
- **Backend**: FastAPI (Python), OAuth2 with JWT, Uvicorn.
- **AI Engine**: Google Gemini (generativeai) for structured CV breakdown.
- **Database**: Lightweight JSON-based persistence (Scalable architecture).

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
