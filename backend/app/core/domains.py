from typing import Tuple
from backend.app.config import settings
from backend.app.models.enums import UserRole

# Explicit institutional email domain map
INSTITUTIONAL_ROLE_DOMAINS = {
    UserRole.STUDENT: settings.STUDENT_EMAIL_DOMAIN.lower(),       # "mitsgwl.ac.in"
    UserRole.TEACHER: settings.TEACHER_EMAIL_DOMAIN.lower(),       # "mitsgwalior.ac.in"
    UserRole.ADMINISTRATOR: settings.ADMIN_EMAIL_DOMAIN.lower(),   # "mitsadmin.ac.in"
    UserRole.COORDINATOR: settings.TEACHER_EMAIL_DOMAIN.lower(),
    UserRole.SECURITY: settings.ADMIN_EMAIL_DOMAIN.lower(),
    UserRole.SUPERADMIN: settings.ADMIN_EMAIL_DOMAIN.lower(),
}

DISALLOWED_PUBLIC_DOMAINS = {
    "gmail.com",
    "yahoo.com",
    "outlook.com",
    "hotmail.com",
    "icloud.com",
    "protonmail.com",
    "zoho.com",
    "mail.com",
}

def extract_domain(email: str) -> str:
    """Extracts lowercase domain part of an email address."""
    parts = email.strip().split("@")
    if len(parts) == 2:
        return parts[1].lower()
    return ""

def validate_institutional_email(email: str, requested_role: UserRole) -> Tuple[bool, str]:
    """
    Validates that:
    1. Email is formatted properly.
    2. Email domain is not a public commercial provider.
    3. Email matches the exact institutional domain configured for the selected role.
    4. Rejects self-registration attempts for privileged roles without institutional invitation.
    """
    cleaned_email = email.strip().lower()
    if "@" not in cleaned_email or len(cleaned_email.split("@")) != 2:
        return False, "Invalid email address format."

    domain = extract_domain(cleaned_email)
    
    if domain in DISALLOWED_PUBLIC_DOMAINS:
        return (
            False,
            f"Registration rejected: Commercial personal email domain '@{domain}' is not permitted. "
            f"You must use your institutional email address."
        )

    expected_domain = INSTITUTIONAL_ROLE_DOMAINS.get(requested_role)
    if not expected_domain:
        return False, f"No institutional domain configuration found for role: {requested_role.value}"

    if domain != expected_domain:
        return (
            False,
            f"Domain mismatch: Registration for '{requested_role.value}' role requires an institutional "
            f"email ending in '@{expected_domain}'. Provided: '@{domain}'"
        )

    # Restrict uninvited self-registration for administrator roles
    if requested_role in [UserRole.ADMINISTRATOR, UserRole.SUPERADMIN, UserRole.SECURITY]:
        return (
            False,
            "Security restriction: Institutional administrator accounts cannot be self-registered. "
            "Please contact the Registrar / Chancellor Office for credential provisioning."
        )

    return True, f"Email domain '@{domain}' verified for {requested_role.value} account."

