import os

# Set mock environment BEFORE any module imports so Supabase/OpenAI init code
# inside index.py sees mock values and skips real client construction.
os.environ["OPENAI_API_KEY"] = "mock_key"
os.environ["SUPABASE_URL"] = "mock"
os.environ["SUPABASE_ANON_KEY"] = "mock"

from fastapi.testclient import TestClient  # noqa: E402
from api.agent import run_digital_employee  # noqa: E402
from api.index import app  # noqa: E402

client = TestClient(app)


# ---------------------------------------------------------------------------
# Agent unit tests
# ---------------------------------------------------------------------------

def test_agent_mock_output():
    """Agent returns mock string when OPENAI_API_KEY is 'mock_key'."""
    result = run_digital_employee("Test Run")
    assert "Mock Agent Output" in result
    assert "Test Run" in result


def test_agent_returns_string():
    """Agent always returns a non-empty string."""
    result = run_digital_employee("Write a post about AI")
    assert isinstance(result, str)
    assert len(result) > 0


# ---------------------------------------------------------------------------
# API endpoint tests
# ---------------------------------------------------------------------------

def test_process_endpoint_success():
    """POST /api/process returns 200 with status=success."""
    response = client.post("/api/process", json={"user_input": "Hello Agent"})
    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "success"
    assert "output" in body
    assert len(body["output"]) > 0


def test_process_endpoint_empty_input():
    """POST /api/process with empty string still returns 200 (agent handles it)."""
    response = client.post("/api/process", json={"user_input": ""})
    assert response.status_code == 200


def test_process_endpoint_missing_field():
    """POST /api/process without user_input returns 422 validation error."""
    response = client.post("/api/process", json={})
    assert response.status_code == 422


def test_health_endpoint():
    """GET /api/health returns 200 and ok status."""
    response = client.get("/api/health")
    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "ok"
    # With mock env, supabase_connected should be False
    assert body["supabase_connected"] is False  # Force linter refresh
