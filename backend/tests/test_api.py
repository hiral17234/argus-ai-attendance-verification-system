from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.database import Base, engine

client = TestClient(app)

def setup_module():
    Base.metadata.create_all(bind=engine)

def test_health_endpoint():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] in ["operational", "degraded"]
    assert "institutional_domains" in data
    assert data["institutional_domains"]["student"] == "mitsgwl.ac.in"
    assert data["institutional_domains"]["teacher"] == "mitsgwalior.ac.in"

def test_unauthorized_access_to_me():
    response = client.get("/api/v1/auth/me")
    assert response.status_code == 401
    assert "not validate" in response.json()["detail"].lower()

def test_registration_flow_and_login():
    test_email = "newstudent_phase1@mitsgwl.ac.in"
    test_password = "SecurePassword@2026!"

    # 1. Register
    reg_response = client.post(
        "/api/v1/auth/register",
        json={
            "full_name": "Phase1 Student",
            "email": test_email,
            "password": test_password,
            "role": "student",
            "enrollment_number": "0901CS229999",
        },
    )
    assert reg_response.status_code == 201
    reg_data = reg_response.json()
    assert reg_data["success"] is True
    assert "dev_otp" in reg_data
    dev_otp = reg_data["dev_otp"]

    # 2. Verify Email OTP
    otp_response = client.post(
        "/api/v1/auth/verify-email",
        json={
            "email": test_email,
            "otp": dev_otp,
        },
    )
    assert otp_response.status_code == 200
    assert otp_response.json()["success"] is True

    # 3. Login with Argon2 verification
    login_response = client.post(
        "/api/v1/auth/login",
        json={
            "email": test_email,
            "password": test_password,
            "device_fingerprint": "dev-fp-phase1-test",
        },
    )
    assert login_response.status_code == 200
    login_data = login_response.json()
    assert "access_token" in login_data
    assert login_data["token_type"] == "bearer"
    access_token = login_data["access_token"]

    # 4. Access protected /me endpoint with Bearer token
    me_response = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {access_token}"},
    )
    assert me_response.status_code == 200
    me_data = me_response.json()
    assert me_data["email"] == test_email
    assert me_data["role"] == "student"
    assert me_data["is_verified"] is True
    assert me_data["enrollment_number"] == "0901CS229999"

def test_invalid_login_rejected():
    response = client.post(
        "/api/v1/auth/login",
        json={
            "email": "nonexistent@mitsgwl.ac.in",
            "password": "WrongPassword123!",
        },
    )
    assert response.status_code == 401
    assert "invalid" in response.json()["detail"].lower()

