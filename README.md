# 🤖 Autonomous Digital Employee

> An AI-powered full-stack workstation that lets you delegate tasks to an autonomous digital agent. Built with Next.js, FastAPI, LangChain, and Supabase.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![Python](https://img.shields.io/badge/Python-3.12-blue?logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-0.139-teal?logo=fastapi)
![LangChain](https://img.shields.io/badge/LangChain-1.3-green?logo=chainlink)
![Supabase](https://img.shields.io/badge/Supabase-Postgres-green?logo=supabase)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Running Tests](#running-tests)
- [Deploying to Vercel](#deploying-to-vercel)
- [Supabase Setup](#supabase-setup)

---

## 🧠 Overview

**Autonomous Digital Employee** is a full-stack AI agent workstation. You type a task, and the backend AI agent (powered by LangChain + OpenAI GPT) processes it, logs it in Supabase, and returns a professional output such as a LinkedIn or Twitter post.

---

## ✨ Features

- 🤖 **AI Agent**: Powered by LangChain and OpenAI GPT-4o-mini
- 🗄️ **Database Logging**: Every task is tracked in Supabase with status updates
- ⚡ **Serverless Backend**: Python FastAPI deployed as a Vercel serverless function
- 🎨 **Modern UI**: Next.js 16 App Router with Tailwind CSS v4 dark-mode design
- 🧪 **Tested**: Backend unit tests using pytest and FastAPI TestClient
- 🔒 **Mock Fallback**: Works without an OpenAI key for local development and testing

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| 🖥️ Frontend | Next.js 16 (App Router), TypeScript, Tailwind CSS v4 |
| ⚙️ Backend | Python 3.12, FastAPI, LangChain, LangChain-OpenAI |
| 🗄️ Database | Supabase (PostgreSQL) |
| 🚀 Deployment | Vercel (serverless functions) |
| 🧪 Testing | pytest, FastAPI TestClient |

---

## 📁 Project Structure

```
autonomous-digital-employee/
├── 📂 api/                     # Python FastAPI backend (Vercel serverless)
│   ├── agent.py                # LangChain AI agent logic
│   ├── index.py                # FastAPI app and routes
│   ├── requirements.txt        # Python dependencies
│   └── test_agent.py           # Backend unit tests
├── 📂 src/
│   └── 📂 app/                 # Next.js App Router
│       ├── globals.css         # Tailwind CSS base styles
│       ├── layout.tsx          # Root layout component
│       └── page.tsx            # Main UI page
├── .env                        # Environment variables (do not commit)
├── .gitignore                  # Git ignore rules
├── next-env.d.ts               # Next.js type declarations
├── package.json                # Node.js dependencies and scripts
├── postcss.config.js           # PostCSS configuration (Tailwind v4)
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

Copy or create a `.env` file in the project root (see [Environment Variables](#environment-variables)).

### 5. Run the Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the app.

---

## 🔐 Environment Variables

Create a `.env` file in the project root with the following keys:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
```

> 🔒 Never commit your `.env` file to version control. It is already listed in `.gitignore`.

| Variable | Description |
|----------|-------------|
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_ANON_KEY` | Your Supabase publishable/anon key |
| `OPENAI_API_KEY` | Your OpenAI API key (set to `mock_key` for local testing without AI calls) |

---

## 🧪 Running Tests

Run the Python backend tests from the project root:

```bash
.venv\Scripts\python -m pytest
```

Expected output:

```
collected 2 items
api\test_agent.py .. [100%]
======================== 2 passed in 6.45s =========================
```

**Test coverage:**
- `test_agent_logic` - Verifies the mock agent response
- `test_api_endpoint` - Verifies the `/api/process` endpoint returns a 200 with `status: success`

---

## ☁️ Deploying to Vercel

1. Push your code to GitHub (already done).
2. Go to [https://vercel.com](https://vercel.com) and import your repository.
3. Add the following environment variables in the Vercel dashboard:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `OPENAI_API_KEY`
4. Deploy! Vercel will automatically detect Next.js and route `/api/*` to the Python serverless functions via `vercel.json`.

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

> Built with ❤️ using Next.js, FastAPI, LangChain, and Supabase.
