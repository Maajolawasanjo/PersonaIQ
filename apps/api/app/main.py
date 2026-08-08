from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, compare, dashboard, export, health, journey, plans, presence_dna, share, upload, user, wardrobe
from app.core.config import settings
from app.core.errors import AppException
from app.core.logging import logger, setup_logging
from app.middleware.error_handler import (
    app_exception_handler,
    unhandled_exception_handler,
    validation_exception_handler,
)
from app.middleware.request_id import RequestIDMiddleware


@asynccontextmanager
async def lifespan(app: FastAPI):
    setup_logging(debug=settings.DEBUG)
    logger.info(
        "Booting PersonaIQ Backend Application",
        environment=settings.ENVIRONMENT,
        version="1.0.0",
        api_prefix=settings.API_V1_STR,
    )
    yield
    logger.info("Shutting down PersonaIQ Backend Application")


app = FastAPI(
    title=settings.APP_NAME,
    description="PersonaIQ Production AI Backend API Service",
    version="1.0.0",
    docs_url=f"{settings.API_V1_STR}/docs",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    redoc_url=f"{settings.API_V1_STR}/redoc",
    lifespan=lifespan,
)

# Middleware Stack
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_origin_regex=r"https?://.*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
import time
from starlette.middleware.base import BaseHTTPMiddleware

class ServerTimingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        start_time = time.perf_counter()
        response = await call_next(request)
        process_time_ms = (time.perf_counter() - start_time) * 1000
        response.headers["X-Response-Time-ms"] = f"{process_time_ms:.2f}"
        response.headers["Server-Timing"] = f"total;dur={process_time_ms:.2f}"
        return response

app.add_middleware(ServerTimingMiddleware)
app.add_middleware(RequestIDMiddleware)

# Custom Exception Handlers
app.add_exception_handler(AppException, app_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(Exception, unhandled_exception_handler)

# Mount Routers
app.include_router(health.router, prefix=settings.API_V1_STR)
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(user.router, prefix=settings.API_V1_STR)
app.include_router(journey.router, prefix=settings.API_V1_STR)
app.include_router(upload.router, prefix=settings.API_V1_STR)
app.include_router(dashboard.router, prefix=settings.API_V1_STR)
app.include_router(wardrobe.router, prefix=settings.API_V1_STR)
app.include_router(plans.router, prefix=settings.API_V1_STR)
app.include_router(export.router, prefix=settings.API_V1_STR)
app.include_router(share.router, prefix=settings.API_V1_STR)
app.include_router(presence_dna.router, prefix=settings.API_V1_STR)
app.include_router(compare.router, prefix=settings.API_V1_STR)


@app.get("/", include_in_schema=False)
async def root_redirect():
    return {
        "status": "online",
        "service": settings.APP_NAME,
        "docs": f"{settings.API_V1_STR}/docs",
    }
