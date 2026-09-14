import pytest
from fastapi.testclient import TestClient
from src.main import app

client = TestClient(app)

def test_get_teams():
    response = client.get("/api/teams")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    assert data[0]["id"] == "rma"

def test_login_and_access_protected_route():
    # Try to access protected route without token
    response = client.get("/api/subscriptions")
    assert response.status_code == 401

    # Login
    response = client.post(
        "/api/auth/token",
        data={"username": "testuser", "password": "password"}
    )
    assert response.status_code == 200
    token = response.json()["access_token"]
    
    headers = {"Authorization": f"Bearer {token}"}
    
    # Access subscriptions
    response = client.get("/api/subscriptions", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == "sub_testuser"
    assert "rma" in data["teamIds"]

    # Update subscription
    new_sub = {
        "teamIds": ["rma", "liv"],
        "reminderIntervals": ["2h"]
    }
    response = client.post("/api/subscriptions", headers=headers, json=new_sub)
    assert response.status_code == 200
    data = response.json()
    assert data["teamIds"] == ["rma", "liv"]
    
    # Access matches
    response = client.get("/api/matches/urgency", headers=headers)
    assert response.status_code == 200
    matches = response.json()
    assert len(matches) > 0
    assert matches[0]["betPlaced"] is False
    
    match_id = matches[0]["id"]
    
    # Place bet
    response = client.post(f"/api/matches/{match_id}/bet-placed", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["betPlaced"] is True
    
    # Verify matches list reflects the bet
    response = client.get("/api/matches/urgency", headers=headers)
    matches_after = response.json()
    assert matches_after[0]["betPlaced"] is True

    # Remove bet
    response = client.post(f"/api/matches/{match_id}/bet-placed", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["betPlaced"] is False
