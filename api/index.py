import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from supabase import create_client, Client
from .agent import run_digital_employee

app = FastAPI()
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_ANON_KEY")

if not supabase_url or not supabase_key or supabase_url == "mock":
    supabase = None
else:
    supabase: Client = create_client(supabase_url, supabase_key)

class TaskRequest(BaseModel):
    user_input: str

@app.post("/api/process")
def process_task(data: TaskRequest):
    try:
        if supabase:
            db_res = supabase.table("agent_tasks").insert({"user_input": data.user_input, "status": "processing"}).execute()
            task_id = db_res.data[0]['id']
        else:
            task_id = None

        ai_output = run_digital_employee(data.user_input)
        
        if supabase and task_id:
            supabase.table("agent_tasks").update({"generated_output": ai_output, "status": "completed"}).eq("id", task_id).execute()
            
        return {"status": "success", "output": ai_output}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
