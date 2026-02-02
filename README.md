# Competence Planning Tool

## Overview

A full-stack web application for managing operator competencies, standards, teams, and planning operator rotations in a manufacturing or industrial context. Built with a React frontend, Node.js/Express backend, and MongoDB (or in-memory for demo), orchestrated with Docker Compose.

---

## Features

- **Authentication**: Simple login for admin, manager, and operator roles.
- **Setup Management**: Centralized setup page for managing Standards, Teams, and Competencies. All dropdowns in the app are populated from this setup.
- **Operators Management**: Add, edit, and delete operators. Assign teams and competencies using setup-driven dropdowns.
- **Planning**: Weekly planning of operator assignments to standards, with dropdowns for standards and operators.
- **Rotation Management**: Manual and automatic (suggested) operator rotations for workload balancing. Auto-rotation suggests moves based on assignment load and skills.
- **Analytics**: Visualize operator utilization, standard usage, and other key metrics.
- **Modern UI**: Responsive, clean, and user-friendly interface with modern CSS.
- **Dockerized**: Easy deployment and local development with Docker Compose.
- **API-first**: RESTful backend with clear endpoints for all resources.

---

## Architecture & Design

- **Frontend**: React (Vite), modular pages/components, modern CSS, all selects are setup-driven.
- **Backend**: Node.js/Express, in-memory data (can be swapped for MongoDB), REST API for all entities.
- **Database**: MongoDB (or in-memory for demo/testing).
- **Deployment**: Docker Compose orchestrates frontend (nginx), backend (Node.js), and MongoDB.

### Key Processes

- **Setup-Driven UI**: All dropdowns for teams, standards, competencies are populated from the Setup page. Changes in setup are reflected app-wide.
- **Auto-Rotation**: Backend analyzes operator assignment counts and skills. If an operator is overloaded, it suggests rotations to balance workload, matching skills/standards.
- **Planning**: Assign operators to standards for each week. Data is persisted and visualized in analytics.
- **Rotation Approval**: Rotations can be created manually or accepted from auto-suggestions. Status can be updated (pending, approved, etc).

---

## API Endpoints (Sample)

- `/api/auth/login` — Login
- `/api/operators` — CRUD for operators
- `/api/standards` — CRUD for standards
- `/api/setup/teams` — CRUD for teams
- `/api/setup/competencies` — CRUD for competencies
- `/api/planning/weeks/:week/:year` — Weekly planning
- `/api/rotation` — Manual/auto rotations
- `/api/rotation/auto/generate` — Get auto-rotation suggestions
- `/api/analytics/*` — Analytics endpoints

---

## How to Test Auto-Rotation

1. Ensure you have at least one operator with a high assignment count (e.g., 20+).
2. Go to the Rotation page and click "Generate Auto-Suggestions".
3. Suggestions will appear if the backend detects workload imbalance and matching skills.
4. Accept a suggestion to pre-fill the rotation form, then submit.

---

## Setup & Run

1. Clone the repo.
2. Run `docker-compose up --build` in the project root.
3. Access the app at `http://localhost` (frontend), backend at `http://localhost:3000`.
4. Login with demo credentials (see backend `users` array).

---

## Presentation Tips

- Emphasize setup-driven design: all dropdowns are dynamic and managed from a single page.
- Show auto-rotation in action: overload an operator, generate suggestions, and approve a rotation.
- Highlight analytics and planning features.
- Mention Docker for easy deployment and local testing.

---

## Authors & Credits

- App by [Your Name/Team]
- Powered by React, Node.js, Docker, MongoDB
