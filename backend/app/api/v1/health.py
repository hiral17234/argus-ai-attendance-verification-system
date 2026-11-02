from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from backend.app.database import get_db, engine
from backend.app.config import settings

router = APIRouter(tags=["System Health"])

@router.get("/health")
def health_check(db: Session = Depends(get_db)):
    """
    System diagnostic and database connectivity health probe.
    """
    db_status = "healthy"
    db_engine = engine.dialect.name
    try:
        db.execute(text("SELECT 1"))
    except Exception as exc:
        db_status = f"unhealthy: {str(exc)}"

    return {
        "status": "operational" if db_status == "healthy" else "degraded",
        "app_name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "environment": settings.ENVIRONMENT,
        "database": {
            "status": db_status,
            "dialect": db_engine,
        },
        "institutional_domains": {
            "student": settings.STUDENT_EMAIL_DOMAIN,
            "teacher": settings.TEACHER_EMAIL_DOMAIN,
            "administrator": settings.ADMIN_EMAIL_DOMAIN,
        },
    }

