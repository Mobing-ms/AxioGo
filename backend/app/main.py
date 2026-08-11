from fastapi import FastAPI, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.v1.router import api_router
from app.config import get_settings

settings = get_settings()

app = FastAPI(title=settings.APP_NAME)

# security.md #29: only approved frontend origins, never "*" for an
# authenticated API.
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException) -> JSONResponse:
    # api.md section 5: consistent {success, error} envelope; security.md
    # #31: never leak stack traces / internal details to the client.
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": {
                "code": exc.__class__.__name__.upper(),
                "message": exc.detail,
                "details": {},
            },
        },
    )


@app.get("/health")
async def health() -> dict:
    return {"success": True, "data": {"status": "ok"}}


app.include_router(api_router, prefix=settings.API_V1_PREFIX)
