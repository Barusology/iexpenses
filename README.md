# iEXPENSES

<div align="center">

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-0.110-009688?style=for-the-badge&logo=fastapi)
![Supabase](https://img.shields.io/badge/Supabase-Auth%20%2B%20DB-3ECF8E?style=for-the-badge&logo=supabase)
![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=for-the-badge&logo=python)
![Status](https://img.shields.io/badge/Status-Production-Ready-34A853?style=for-the-badge)

</div>

iEXPENSES is a modern personal expense tracker built for people who want better control over their spending. The platform combines a sleek React frontend with a Python FastAPI backend, secure Supabase authentication, rich analytics, and AI-powered receipt OCR to turn everyday receipts into structured expense entries.

## Overview

This project turns expense tracking into a fast, visual workflow: users log purchases, review spending trends, search historical transactions, and upload receipts that are automatically parsed into structured data. It is designed as a polished personal finance tool with a fintech-inspired UI and real-world data handling.

## Core Features

- Secure email/password authentication and OAuth-ready session handling
- Dashboard with budget and spending summaries
- Transaction tracking with add, edit, filter, and delete flows
- AI-powered receipt OCR to extract merchant, amount, date, currency, and category
- Category-based analytics with pie, bar, and trend views
- Search and date-range filtering across expense history
- Personal profile management with theme and currency preferences
- Dark/light mode experience with a modern fintech dashboard aesthetic

## Tech Stack

### Frontend

- React 19
- React Router 7
- Tailwind CSS
- Shadcn-style UI components
- Recharts
- Sonner notifications
- Lucide React icons

### Backend

- FastAPI
- Python
- Supabase
- Motor / async MongoDB support
- JWT and bcrypt-based auth workflows
- Emergent LLM integration for OCR

## Project Structure

```text
.
├── backend/
│   ├── tests/
│   ├── requirements.txt
│   ├── server.py
│   └── ...
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   ├── .gitignore
│   └── ...
├── memory/
│   └── PRD.md
├── test_reports/
├── .gitignore
├── README.md
├── design_guidelines.json
├── vercel.json
└── ...
```

## Architecture

The app follows a layered architecture:

- Frontend: React app for dashboards, transactions, analytics, and auth flows
- Backend API: FastAPI service for authentication, expense management, and OCR processing
- Data layer: Supabase-based persistence with API-driven session and profile handling
- AI layer: OCR integration that extracts expense data from receipt images

## Getting Started

### Prerequisites

Before running the app, make sure you have:

- Node.js 18+ and npm or Yarn
- Python 3.11+
- A Supabase project
- A valid Emergent LLM / OCR API key

### 1. Clone the repository

```bash
git clone https://github.com/Barusology/iexpenses.git
cd iexpenses
```

### 2. Set up the backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file in `backend/` with the following values:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
EMERGENT_LLM_KEY=your_emergent_llm_key
CORS_ORIGINS=http://localhost:3000
```

Then start the API server:

```bash
uvicorn server:app --reload --host 0.0.0.0 --port 8000
```

### 3. Set up the frontend

```bash
cd ../frontend
npm install
```

Then start the app:

```bash
npm start
```

The frontend will run on the default CRA/Vite-style dev server, typically on:

```text
http://localhost:3000
```

## Environment and Configuration Notes

This app depends on external services for authentication and OCR processing. In production, ensure that:

- Supabase keys are stored securely and not committed to source control
- LLM OCR credentials are environment-scoped
- Database permissions are restricted to the least privilege needed
- CORS is restricted to approved frontend origins

## Features in Detail

### Expense Management

- Add new expenses with amount, category, merchant, note, and date
- Update or remove existing transactions
- Apply search and filters by category and date range

### Analytics

- View spending by category using chart-based summaries
- Review recent transactions across time periods
- Track trends by day, week, month, or year

### AI Receipt OCR

- Upload a receipt image
- Extract a structured JSON payload with estimated amount, merchant, date, currency, and category
- Reduce manual data entry and improve transaction accuracy

## Testing

The repo includes both backend and frontend validation flows.

### Backend tests

```bash
cd backend
pytest
```

### Frontend checks

```bash
cd frontend
npm test
```

## Roadmap

Planned enhancements include:

- export to CSV/PDF
- recurring expenses and subscriptions
- category budgets and alerts
- live FX conversion
- shared ledger features
- object storage for receipt images

## Contributing

Contributions are welcome. Please fork the repository, create a feature branch, and submit a pull request with a clear summary of the work.

## License

This project is intended for personal finance and product development use. Review the repository’s licensing terms and service agreements before deploying to production or distributing commercially.

## Repository

- GitHub: https://github.com/Barusology/iexpenses
