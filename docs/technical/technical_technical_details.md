# Technical Documentation

This document provides a technical deep-dive into the arketic.ai recruitment system.

## 1. Backend Architecture
The backend is built using **FastAPI** for high performance and modern Python standards.

- **Persistence**: Uses JSON file-based storage (`backend/db/`) for fast, local-first data management.
- **Dependencies**:
    - `PyPDF2` and `python-docx` for parsing resume files.
    - `passlib` and `jose` for secure security and session management.
    - `google-generativeai` for AI integration.

## 2. CV Matching Algorithm
The core of the system is the `analyze_cv` endpoint in `backend/main.py`.

### Identity-Based Scoring
The system doesn't just count keywords. It uses a **Role Proximity** model:
1.  **Normalization**: Keywords are normalized using a `keyword_map` (e.g., `Node` -> `Node.js`).
2.  **Identity Bonus**: If a candidate's CV and the job both mention "Software Engineer" or "Developer", they receive a **+15% identity bonus** on their base score.
3.  **Proximity Logic**:
    ```python
    base_score = 45 # Baseline for professional engineering profiles
    keyword_score = (match_count / total_reqs) * 40
    final_score = base_score + keyword_score + random_jitter
    ```

### AI Integration
The prompt is engineered for **holistic evaluation**:
- It specifically asks the AI to weight "Seniority" and "Experience" heavily.
- It instructs the AI to look past exact library versions and value general domain expertise.

## 3. File Processing Pipeline
1.  **Upload**: Files are stored in `backend/uploads/` with unique timestamps to prevent collisions.
2.  **Extraction**: `get_file_text` handles cross-format extraction.
3.  **Combination**: Candidate skills from the form are concatenated with the extracted CV text for a complete profile view.

## 4. Error Resilience
The system implements a **Smart Simulation Fallback**:
- If the Gemini API reaches its limit or is suspended, the backend seamlessly switches to the internal Proximity Model.
- This results in a summary prefixed with "(Using smart simulation/Calculated estimate)" to inform the HR user.
