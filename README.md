# 🤖 Autonomous Digital Employee

> An AI-powered full-stack workstation that lets you delegate tasks to an autonomous digital agent. Built with Next.js, FastAPI, LangChain, Google Gemini, and Supabase.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![Python](https://img.shields.io/badge/Python-3.12-blue?logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-0.139-teal?logo=fastapi)
![LangChain](https://img.shields.io/badge/LangChain-1.3-green?logo=chainlink)
![Gemini](https://img.shields.io/badge/Gemini-1.5--flash-orange?logo=google)
![Supabase](https://img.shields.io/badge/Supabase-Postgres-green?logo=supabase)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)
![Tests](https://img.shields.io/badge/tests-6%20passed-brightgreen?logo=pytest)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Local Development](#local-development)
- [Running Tests](#running-tests)
- [Deploying to Vercel](#deploying-to-vercel)
- [Supabase Setup](#supabase-setup)

---

## 🧠 Overview

**Autonomous Digital Employee** is a full-stack AI agent workstation. You type a task, and the backend AI agent (powered by LangChain + Google Gemini) processes it, logs it in Supabase, and returns a professional output such as a LinkedIn or Twitter post.

The agent uses a smart fallback resolution chain:

```
Gemini API Key found  -->  Use Google Gemini (gemini-2.5-flash)
OpenAI API Key found  -->  Use OpenAI GPT-4o-mini
Neither key found     -->  Return mock response (safe local dev mode)
```

---

## ✨ Features

- 🤖 **AI Agent**: Powered by LangChain with primary Google Gemini support and OpenAI fallback
- 🗄️ **Database Logging**: Every task is tracked in Supabase with real-time status updates (`processing` / `completed` / `error`)
- ⚡ **Serverless Backend**: Python FastAPI deployed as a Vercel serverless function with CORS support
- 🩺 **Health Endpoint**: `GET /api/health` to verify deployment and Supabase connectivity
- 🎨 **Modern UI**: Next.js 16 App Router with Tailwind CSS v4 dark-mode design
- 🧪 **Tested**: 6 backend unit tests using pytest and FastAPI TestClient
- 🔒 **Safe Mock Fallback**: Works without any AI key for local development and testing
- 🔁 **Dev Proxy**: `next.config.js` automatically proxies `/api/*` to local uvicorn in development

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| 🖥️ Frontend | Next.js 16 (App Router), TypeScript, Tailwind CSS v4 |
| ⚙️ Backend | Python 3.12, FastAPI, LangChain, LangChain-Google-GenAI |
| 🤖 AI Models | Google Gemini 1.5 Flash (primary), OpenAI GPT-4o-mini (fallback) |
| 🗄️ Database | Supabase (PostgreSQL) |
| 🚀 Deployment | Vercel (serverless functions) |
| 🧪 Testing | pytest 9.1, FastAPI TestClient |

---

## 📁 Project Structure

```
autonomous-digital-employee/
├── 📂 api/                     # Python FastAPI backend (Vercel serverless)
│   ├── __init__.py             # Package marker for Python module resolution
│   ├── agent.py                # LangChain AI agent with Gemini/OpenAI/Mock logic
│   ├── index.py                # FastAPI app, CORS, routes, health endpoint
│   ├── requirements.txt        # Python dependencies
│   └── test_agent.py           # 6 backend unit tests
├── 📂 src/
│   └── 📂 app/                 # Next.js App Router
│       ├── globals.css         # Tailwind CSS base styles
│       ├── layout.tsx          # Root layout component
│       └── page.tsx            # Main UI page (task delegation)
├── 📂 .vscode/
│   └── settings.json           # VS Code Python interpreter settings
├── .env                        # Environment variables (never commit)
├── .gitignore                  # Git ignore rules
├── next.config.js              # Next.js config with dev API proxy
├── next-env.d.ts               # Next.js type declarations
├── package.json                # Node.js dependencies and scripts
├── postcss.config.js           # PostCSS configuration (Tailwind v4)
├── pyproject.toml              # Pyrefly/pytest tool configuration
├── pyrefly.toml                # Pyrefly interpreter and search path config
├── pyrightconfig.json          # Pyright type checker configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript compiler options
└── vercel.json                 # Vercel routing rewrites
```

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/AbdulAzeemHashmi/autonomous-digital-employee.git
cd autonomous-digital-employee
```

### 2. Install Frontend Dependencies

```bash
npm install
```

### 3. Set Up Python Virtual Environment

```bash
python -m venv .venv
```

Activate on Windows:
```bash
.venv\Scripts\activate
```

Activate on macOS/Linux:
```bash
source .venv/bin/activate
```

Install Python packages:
```bash
pip install -r api/requirements.txt
```

### 4. Configure Environment Variables

Create a `.env` file in the project root (see [Environment Variables](#environment-variables)).

---

## 🔐 Environment Variables

Create a `.env` file in the project root with the following keys:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
GEMINI_API_KEY=your_google_gemini_api_key
OPENAI_API_KEY=your_openai_api_key
```

> 🔒 Never commit your `.env` file. It is already listed in `.gitignore`.

| Variable | Required | Description |
|----------|----------|-------------|
| `SUPABASE_URL` | Yes | Your Supabase project URL |
| `SUPABASE_ANON_KEY` | Yes | Your Supabase publishable/anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Optional | Service role key for admin operations |
| `GEMINI_API_KEY` | Recommended | Google Gemini API key (primary AI model) |
| `OPENAI_API_KEY` | Optional | OpenAI API key (fallback if Gemini not set). Use `mock_key` to disable |

> 💡 If neither `GEMINI_API_KEY` nor `OPENAI_API_KEY` is set (or both are `mock_key`), the agent returns a safe mock response for local testing.

---

## 💻 Local Development

To run both the frontend and backend simultaneously:

**Terminal 1 - Python backend:**
```bash
.venv\Scripts\activate
uvicorn api.index:app --reload --port 8000
```

**Terminal 2 - Next.js frontend:**
```bash
npm run dev
```

The `next.config.js` automatically proxies all `/api/*` requests to `http://localhost:8000` in development mode, so no manual CORS setup is needed.

Visit [http://localhost:3000](http://localhost:3000) to see the app.

You can also verify the backend is healthy at:
```
GET http://localhost:8000/api/health
```

---

## 🧪 Running Tests

Run the Python backend tests from the project root:

```bash
.venv\Scripts\python -m pytest -v
```

Expected output:

```
collected 6 items

api/test_agent.py::test_agent_mock_output          PASSED   [ 16%]
api/test_agent.py::test_agent_returns_string       PASSED   [ 33%]
api/test_agent.py::test_process_endpoint_success   PASSED   [ 50%]
api/test_agent.py::test_process_endpoint_empty_input PASSED [ 66%]
api/test_agent.py::test_process_endpoint_missing_field PASSED [ 83%]
api/test_agent.py::test_health_endpoint            PASSED   [100%]

======================== 6 passed in 0.78s ========================
```

**Test coverage:**
| Test | Description |
|------|-------------|
| `test_agent_mock_output` | Verifies mock string is returned when no real API key is set |
| `test_agent_returns_string` | Verifies agent always returns a non-empty string |
| `test_process_endpoint_success` | Verifies `POST /api/process` returns `200` with `status: success` |
| `test_process_endpoint_empty_input` | Verifies empty string input is handled gracefully |
| `test_process_endpoint_missing_field` | Verifies missing `user_input` returns `422` validation error |
| `test_health_endpoint` | Verifies `GET /api/health` returns `200` and correct status |

---

## ☁️ Deploying to Vercel

1. Push your code to GitHub.
2. Go to [https://vercel.com](https://vercel.com) and import your repository.
3. Add the following environment variables in the Vercel dashboard:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `GEMINI_API_KEY` (or `OPENAI_API_KEY`)
4. Deploy! Vercel automatically detects Next.js and routes `/api/*` to the Python serverless functions via `vercel.json`.

---

## 🗄️ Supabase Setup

Run the following SQL in your Supabase SQL Editor to create the `agent_tasks` table:

```sql
create table agent_tasks (
  id bigint generated by default as identity primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_input text not null,
  status text not null,
  generated_output text
);

alter table agent_tasks enable row level security;

create policy "Allow all operations" on agent_tasks
  for all using (true) with check (true);
```

---

## 📝 License

MIT License. See [LICENSE](LICENSE) for details.

---

## 🙌 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

> Built with ❤️ using Next.js, FastAPI, LangChain, Google Gemini, and Supabase.
