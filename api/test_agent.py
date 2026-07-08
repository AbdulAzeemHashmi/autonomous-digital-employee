import os
os.environ["OPENAI_API_KEY"] = "mock_key"
os.environ["SUPABASE_URL"] = "mock"
os.environ["SUPABASE_ANON_KEY"] = "mock"

from api.agent import run_digital_employee
from api.index import app
from fastapi.testclient import TestClient

client = TestClient(app)

def test_agent_logic():
    response = run_digital_employee("Test Run")
    assert "Mock Agent Output" in response

def test_api_endpoint():
    response = client.post("/api/process", json={"user_input": "Hello Agent"})
    assert response.status_code == 200
    assert response.json()["status"] == "success"
