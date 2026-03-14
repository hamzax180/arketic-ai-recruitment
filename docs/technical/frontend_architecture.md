# Frontend Architecture & Logic

The arketic.ai web application is a modern **React-based Single Page Application (SPA)** built with **Vite**.

## 1. Core Technologies
- **Framework**: React 18
- **Routing**: `react-router-dom` (v6)
- **Styling**: Vanilla CSS with a global design system in `src/index.css`.
- **Icons**: `lucide-react` for a premium, consistent look.
- **State Management**: Built-in React Context API (`AuthContext` and `DataContext`).

## 2. Directory Structure
- `src/pages/`: Contains the main page components (Dashboard, Login, Application, etc.).
- `src/components/`: Reusable UI elements like `Navbar`, `Footer`, and `Layout`.
- `src/context/`: Centralized state management for authentication and global data.
- `src/data/`: Mock data or static configuration used for initial states.

## 3. Global State Management
The application uses two primary contexts to manage data flow without "prop drilling":

### AuthContext
- **Purpose**: Manages user session, JWT storage, and role-based access.
- **Key States**: `user` object and `token`.
- **Persistence**: Token is stored in `localStorage` (`arketic_token`).

### DataContext
- **Purpose**: Synchronizes jobs and applications across the entire app.
- **Key Functions**:
  - `addJob`: Communicates with backend to create postings.
  - `addApplication`: Handles form submission and links it to a job ID.
  - `uploadCV`: Manages the multipart/form-data upload to the server.

## 4. Routing & Protection
The application implements **Role-Based Access Control (RBAC)** at the routing level in `App.jsx`:

- **Public Routes**: `/`, `/job/:id`, `/login`, `/signup`.
- **Protected (Candidate)**: `/apply/:id` (Requires login).
- **Protected (Admin)**: `/hr` and `/hr/job/:id/applications` (Requires `role === 'admin'`).

## 5. CV Analysis Integration (Frontend Logic)
When an admin clicks **"AI REVIEW"** in the `HRDashboard`:

1.  **Selection**: The frontend identifies the specific application and its corresponding job requirements.
2.  **Request**: It sends a POST request to `/analyze-cv` with the candidate's skills, raw CV text (if available), and job requirements.
3.  **Security**: The request is authenticated using the `Bearer` token from `localStorage`.
4.  **UI Feedback**: A `Loader2` spinner provides real-time feedback while the backend processes the AI analysis or simulation.
5.  **View**: Once complete, the score is updated in the list, and clicking the result opens a detailed breakdown.

## 6. Design Philosophy
The system follows a **"Glassmorphism"** aesthetic:
- Transparent dark backgrounds with subtle blurs (`backdrop-filter`).
- Premium gradients (`text-gradient` and `primary-glow`).
- High-contrast typography using professional fonts (Inter/Outfit).
- Responsive grid layouts using CSS standard `grid` and `flex`.
