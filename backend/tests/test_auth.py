import pytest
from backend.app.core.security import (
    hash_password,
    verify_password,
    validate_password_strength,
    create_access_token,
    decode_token,
    generate_secure_otp,
    hash_token,
)
from backend.app.core.domains import validate_institutional_email
from backend.app.models.enums import UserRole

def test_argon2_password_hashing():
    plain = "Institutional@2026!"
    hashed = hash_password(plain)
    assert hashed != plain
    assert hashed.startswith("$argon2id$")
    assert verify_password(plain, hashed) is True
    assert verify_password("WrongPassword123!", hashed) is False

def test_password_complexity():
    # Valid
    is_valid, _ = validate_password_strength("ValidPass123!@#")
    assert is_valid is True

    # Missing uppercase
    is_valid, msg = validate_password_strength("validpass123!@#")
    assert is_valid is False
    assert "uppercase" in msg.lower()

    # Missing special character
    is_valid, msg = validate_password_strength("ValidPass12345")
    assert is_valid is False
    assert "special" in msg.lower()

    # Too short
    is_valid, msg = validate_password_strength("V1!a")
    assert is_valid is False
    assert "at least 8" in msg.lower()

def test_institutional_domain_enforcement():
    # Valid student domain
    valid, _ = validate_institutional_email("student@mitsgwl.ac.in", UserRole.STUDENT)
    assert valid is True

    # Valid teacher domain
    valid, _ = validate_institutional_email("teacher@mitsgwalior.ac.in", UserRole.TEACHER)
    assert valid is True

    # Rejected commercial email domain
    valid, msg = validate_institutional_email("student@gmail.com", UserRole.STUDENT)
    assert valid is False
    assert "commercial" in msg.lower()

    # Cross-role domain spoofing: Student trying to use teacher domain
    valid, msg = validate_institutional_email("student@mitsgwalior.ac.in", UserRole.STUDENT)
    assert valid is False
    assert "domain mismatch" in msg.lower()

    # Uninvited administrator self-registration blocked
    valid, msg = validate_institutional_email("attacker@mitsadmin.ac.in", UserRole.ADMINISTRATOR)
    assert valid is False
    assert "security restriction" in msg.lower()

def test_jwt_generation_and_validation():
    payload = {"sub": "usr-12345", "role": "student", "email": "student@mitsgwl.ac.in"}
    token = create_access_token(payload)
    assert isinstance(token, str)

    decoded = decode_token(token)
    assert decoded is not None
    assert decoded["sub"] == "usr-12345"
    assert decoded["role"] == "student"
    assert "exp" in decoded

def test_secure_otp():
    otp = generate_secure_otp()
    assert len(otp) == 6
    assert otp.isdigit()

    hashed = hash_token(otp)
    assert len(hashed) == 64  # SHA-256 hex string
    assert hash_token(otp) == hashed

