# ResumeMatch AI

An AI-powered resume analyzer that evaluates how well a resume matches a job description, using Google's Gemini LLM to generate a structured, evidence-based intelligence report.

**Live demo:** _add link if deployed_

![ResumeMatch AI UI](./docs/screenshot-top.png)
![ResumeMatch AI Report](./docs/screenshot-bottom.png)

## Features

- Upload a resume as a PDF or paste it as plain text
- Paste any job description for comparison
- AI-generated report covering:
  - Job Match score and Resume Quality score
  - Breakdown across skills, experience, projects, and formatting
  - Matched vs. missing skills and keywords
  - Strengths, weaknesses, and actionable improvement suggestions
- Strict, evidence-based AI evaluation — the prompt explicitly instructs the model not to assume or fabricate skills the resume doesn't demonstrate

## Tech Stack

**Frontend:** React (Vite)
**Backend:** Flask, Flask-CORS
**AI:** Google Gemini API (`google-genai`)
**PDF Parsing:** PyPDF2

## How It Works

1. User uploads a resume (PDF) or pastes resume text, plus a job description, into the React frontend.
2. If a PDF was uploaded, it's sent to `/api/extract-pdf`, which extracts raw text using PyPDF2.
3. The combined resume text and job description are sent to `/api/analyze`.
4. The backend sends a carefully engineered prompt to Gemini that:
   - Forces evidence-based evaluation (no assumed skills)
   - Marks unclear requirements as "not found in the resume" rather than guessing
   - Returns a strict, validated JSON schema
5. The backend parses and returns the JSON; the frontend renders it as an interactive report — score rings, progress bars, and tagged skill/keyword lists.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Health check |
| POST | `/api/extract-pdf` | Extract text from an uploaded PDF resume |
| POST | `/api/analyze` | Analyze resume text against a job description |

## Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- A Google Gemini API key ([get one here](https://aistudio.google.com/apikey))

### Backend Setup
```bash
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env          # then add your GEMINI_API_KEY
python app.py
```

### Frontend Setup
```bash
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` by default and expects the backend at `http://localhost:5000`.

## Project Structure
ResumeMatch AI/
├── app.py # Flask app, Gemini prompt & API routes
├── requirements.txt
├── src/
│ ├── pages/
│ │ └── Home.jsx # Main page — inputs + report
│ ├── components/
│ │ ├── ResumeUpload.jsx # PDF upload (drag/browse, 5MB limit)
│ │ ├── ResumeInput.jsx # Paste resume text
│ │ ├── JobDescriptionInput.jsx
│ │ ├── AnalyzeButton.jsx
│ │ ├── AnalysisResult.jsx # Score rings, breakdown, insights
│ │ └── Navbar.jsx
│ └── services/
│ └── api.js # API client
└── package.json


## Author
**Faiz Abdul Rahim** — [GitHub](https://github.com/Faizrepos) · [LinkedIn](https://www.linkedin.com/in/faizabdulrahim)