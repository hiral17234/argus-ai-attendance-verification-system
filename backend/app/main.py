import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from backend.app.config import settings
from backend.app.database import engine, Base
from backend.app.api.router import api_router
# Import all models to ensure metadata registration
import backend.app.models  # noqa: F401

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - [%(levelname)s] - %(name)s - %(message)s"
)
logger = logging.getLogger("argus.server")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Ensure all relational database tables exist
    logger.info("Initializing ARGUS Institutional Platform database schema...")
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("Database schema initialized successfully.")
    except Exception as exc:
        logger.error(f"Error initializing database schema: {exc}")
    yield
    # Shutdown
    logger.info("Shutting down ARGUS API services.")

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description=(
        "Institutional Identity Verification and Risk-Adaptive Attendance API. "
        "Enforces institutional email domains, Argon2id cryptography, and multi-signal biometric verification."
    ),
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# CORS Middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Exception Handler
@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception on {request.method} {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "error": "Internal Institutional Server Error",
            "detail": str(exc) if settings.DEBUG else "An unexpected error occurred.",
        },
    )

# Mount API v1 router
app.include_router(api_router, prefix=settings.API_V1_PREFIX)

@app.get("/")
def root():
    return {
        "platform": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "api_docs": "/docs",
        "health": f"{settings.API_V1_PREFIX}/health",
    }

