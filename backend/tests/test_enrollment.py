import base64
import io
import numpy as np
from PIL import Image
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def make_test_image_base64(textured=True) -> str:
    """Helper to generate a base64 JPEG test image."""
    if textured:
        arr = np.random.randint(100, 220, (320, 320, 3), dtype=np.uint8)
        arr[:, :, 0] += 30  # Skin-like red-dominant hue
    else:
        arr = np.zeros((320, 320, 3), dtype=np.uint8) + 128
    
    img = Image.fromarray(arr)
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    return f"data:image/jpeg;base64,{base64.b64encode(buf.getvalue()).decode('utf-8')}"

def test_validate_live_photo_single_face():
    b64 = make_test_image_base64(textured=True)
    res = client.post("/api/v1/enrollment/validate-live-photo", json={"image_base64": b64})
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert data["face_count"] == 1
    assert "bounding_box" in data

def test_validate_live_photo_flat_image_rejected():
    b64 = make_test_image_base64(textured=False)
    res = client.post("/api/v1/enrollment/validate-live-photo", json={"image_base64": b64})
    assert res.status_code == 422
    assert "quality check failed" in res.json()["detail"].lower()

def test_validate_id_card():
    # Standard credit card aspect ratio: 480 x 300 (~1.6)
    arr = np.random.randint(120, 240, (300, 480, 3), dtype=np.uint8)
    img = Image.fromarray(arr)
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    b64 = f"data:image/jpeg;base64,{base64.b64encode(buf.getvalue()).decode('utf-8')}"

    res = client.post(
        "/api/v1/enrollment/validate-id-card",
        json={
            "image_base64": b64,
            "expected_name": "Test Student",
            "expected_enrollment": "0901CS221045",
        },
    )
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert data["analysis"]["detected_institution"] == "Madhav Institute of Technology & Science (MITS Gwalior)"

def test_full_student_enrollment_and_admin_approval():
    # 1. Register student
    email = "phase2_student@mitsgwl.ac.in"
    password = "StudentPass@2026!"
    reg_res = client.post(
        "/api/v1/auth/register",
        json={
            "full_name": "Phase 2 Student",
            "email": email,
            "password": password,
            "role": "student",
            "enrollment_number": "0901CS228888",
        },
    )
    assert reg_res.status_code == 201
    dev_otp = reg_res.json()["dev_otp"]

    # 2. Verify Email
    client.post("/api/v1/auth/verify-email", json={"email": email, "otp": dev_otp})

    # 3. Login as student
    login_res = client.post("/api/v1/auth/login", json={"email": email, "password": password})
    student_token = login_res.json()["access_token"]

    # 4. Submit Identity Enrollment
    live_b64 = make_test_image_base64(textured=True)
    arr_id = np.random.randint(120, 240, (300, 480, 3), dtype=np.uint8)
    img_id = Image.fromarray(arr_id)
    buf = io.BytesIO()
    img_id.save(buf, format="JPEG")
    id_b64 = f"data:image/jpeg;base64,{base64.b64encode(buf.getvalue()).decode('utf-8')}"

    enroll_res = client.post(
        "/api/v1/enrollment/submit",
        headers={"Authorization": f"Bearer {student_token}"},
        json={
            "live_photo_base64": live_b64,
            "id_card_base64": id_b64,
            "biometric_consent": True,
        },
    )
    assert enroll_res.status_code == 200
    enroll_data = enroll_res.json()
    assert enroll_data["success"] is True
    assert enroll_data["status"] == "pending_admin_approval"

    # 5. Login as Seed Admin
    admin_login = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@mitsadmin.ac.in", "password": "Admin@Argus2026!"},
    )
    assert admin_login.status_code == 200
    admin_token = admin_login.json()["access_token"]

    # 6. Admin checks pending approvals
    pending_res = client.get(
        "/api/v1/admin/pending-approvals",
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert pending_res.status_code == 200
    pending_list = pending_res.json()["students"]
    matching_student = next((s for s in pending_list if s["email"] == email), None)
    assert matching_student is not None
    student_id = matching_student["student_id"]

    # 7. Admin approves student
    approve_res = client.post(
        f"/api/v1/admin/students/{student_id}/approve",
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert approve_res.status_code == 200
    assert approve_res.json()["status"] == "approved"

