import os
from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import TYPE_CHECKING, Optional

try:
    from dotenv import load_dotenv
    _root = Path(__file__).resolve().parent.parent
    load_dotenv(_root / ".env", override=True)
except ImportError:
    pass

if TYPE_CHECKING:
    from supabase import Client
from pydantic import BaseModel

# Support both relative import (package mode / pytest) and direct import (Vercel serverless)
try:
    from .agent import run_digital_employee
except ImportError:
    from agent import run_digital_employee  # type: ignore[no-redef]

try:
    from supabase import create_client
    _supabase_available = True
except ImportError:
    create_client = None  # type: ignore[assignment]
    _supabase_available = False

app = FastAPI(title="Autonomous Digital Employee API")

# CORS - allow all origins (tighten in production if needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_ANON_KEY")

supabase: Optional["Client"] = None
if _supabase_available and create_client and supabase_url and supabase_key and supabase_url != "mock":
    supabase = create_client(supabase_url, supabase_key)


class TaskRequest(BaseModel):
    user_input: str


@app.get("/api/health")
def health_check():
    """Simple health check endpoint."""
    return {"status": "ok", "supabase_connected": supabase is not None}


@app.post("/api/process")
def process_task(data: TaskRequest):
    task_id = None
    try:
        if supabase:
            db_res = supabase.table("agent_tasks").insert(
                {"user_input": data.user_input, "status": "processing"}
            ).execute()
            first_row = db_res.data[0] if db_res.data else {}
            task_id = first_row["id"] if isinstance(first_row, dict) else None

        ai_output = run_digital_employee(data.user_input)

        if supabase and task_id:
            supabase.table("agent_tasks").update(
                {"generated_output": ai_output, "status": "completed"}
            ).eq("id", task_id).execute()

        return {"status": "success", "output": ai_output}

    except Exception as e:
        # If DB write succeeded but agent failed, mark task as error
        if supabase and task_id:
            try:
                supabase.table("agent_tasks").update(
                    {"status": "error", "generated_output": str(e)}
                ).eq("id", task_id).execute()
            except Exception:
                pass
        raise HTTPException(status_code=500, detail=str(e))
