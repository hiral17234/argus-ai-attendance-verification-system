import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from backend.app.config import settings

logger = logging.getLogger("argus.database")

Base = declarative_base()

def get_engine():
    """
    Attempts to connect to PostgreSQL.
    If PostgreSQL is unreachable, falls back to local SQLite with warning for development resilience.
    """
    db_url = settings.DATABASE_URL
    try:
        if db_url.startswith("postgresql"):
            # Test engine connection
            engine = create_engine(
                db_url,
                pool_pre_ping=True,
                pool_size=10,
                max_overflow=20,
                connect_args={"connect_timeout": 3}
            )
            with engine.connect():
                logger.info("Successfully connected to primary PostgreSQL database.")
                return engine
        else:
            return create_engine(
                db_url,
                connect_args={"check_same_thread": False} if "sqlite" in db_url else {}
            )
    except Exception as exc:
        logger.warning(
            f"Could not connect to PostgreSQL ({exc}). "
            f"Falling back to SQLite at {settings.SQLITE_FALLBACK_URL} for local development resilience."
        )
        return create_engine(
            settings.SQLITE_FALLBACK_URL,
            connect_args={"check_same_thread": False}
        )

engine = get_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    """
    Dependency that provides a database session and safely closes it upon request completion.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

