# Features Overview

This document outlines the core features of the arketic.ai recruitment platform.

## 1. Job Management
- **Description**: Admins can create and manage job postings.
- **Details**:
    - **Creation**: Jobs include title, department, location, type, description, and specific requirements.
    - **Persistence**: Jobs are stored in `backend/db/jobs.json`.

## 2. CV Analysis & Scoring
- **Description**: Automatically evaluates and scores candidate CVs against job requirements using AI.
- **Details**:
    - **AI Integration**: Uses Gemini 1.5/2.5 series for deep semantic analysis.
    - **Holistic Scoring**: Considers "Software Engineer" identity, transferable skills, and seniority rather than just keyword matches.
    - **Synonym Recognition**: Understands variations like `Node.js` vs `Node`.
    - **Robust Fallback**: Includes a smart "Calculated Proximity" simulation if the AI API is unavailable.

## 3. Applicant Management
- **Description**: Centralized dashboard for managing candidate applications.
- **Details**:
    - **File Support**: Supports PDF, DOCX, and TXT file uploads.
    - **Real-time Updates**: Real-time status tracking from "pending" to "reviewed".
    - **Matching Insights**: Provides pros, cons, and keyword matches for each applicant.

## 4. User Authentication
- **Description**: Secure role-based access control.
- **Details**:
    - **JWT-based**: Uses JSON Web Tokens for secure session management.
    - **Admin Dashboard**: Restricted access to sensitive application data and job creation tools.
