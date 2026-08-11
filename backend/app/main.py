from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.v1.router import api_router
from app.config import get_settings
from app.database import init_models
from app.seed import seed


settings = get_settings()


# ============================================================
# APPLICATION LIFESPAN
# ============================================================

@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_models()

    try:
        await seed()
    except Exception as exc:
        print(f"Startup seed notice: {exc}")

    yield


# ============================================================
# FASTAPI APP
# ============================================================

app = FastAPI(
    title=settings.APP_NAME,
    lifespan=lifespan,
)


# ============================================================
# CORS
# ============================================================

# Allow the local Vite development servers explicitly.
# This is required for browser preflight OPTIONS requests.
#
# Your config already contains localhost:5173 and localhost:4173,
# but we also allow the common 5174/4174 ports and 127.0.0.1
# equivalents so the login API does not fail at the CORS layer.

ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:4173",
    "http://localhost:4174",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    "http://127.0.0.1:4173",
    "http://127.0.0.1:4174",
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_origin_regex=r"http://(localhost|127\.0\.0\.1)(:\d+)?",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# HTTP EXCEPTION HANDLER
# ============================================================

@app.exception_handler(HTTPException)
async def http_exception_handler(
    request: Request,
    exc: HTTPException,
) -> JSONResponse:
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": {
                "code": (
                    "HTTP_"
                    f"{exc.status_code}"
                ),
                "message": str(exc.detail),
                "details": {},
            },
        },
    )


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/health")
async def health() -> dict:
    return {
        "success": True,
        "data": {
            "status": "ok",
        },
    }


# ============================================================
# API ROUTES
# ============================================================

app.include_router(
    api_router,
    prefix=settings.API_V1_PREFIX,
)