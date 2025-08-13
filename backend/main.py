import os

from fastapi import FastAPI
from fastapi import HTTPException
from fastapi import Request
from fastapi import status
from fastapi.exception_handlers import http_exception_handler
from fastapi.exceptions import HTTPException as FastAPIHTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.routing import APIRoute
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError
from starlette.responses import Response

from looking_glass.api.card_search.card_search import card_search_router
from looking_glass.api.user.user import users_router
from looking_glass.config import DEBUG
from looking_glass.config import ENVIRONMENT
from looking_glass.config import PROJECT_NAME
from looking_glass.config import VERSION
from looking_glass.db.engine import engine
from looking_glass.db.engine import get_db_session
from looking_glass.logger import setup_logger


logger = setup_logger()

app = FastAPI(
    title=PROJECT_NAME,
)

# -----------------------------------------------------------------------------
# These 2 global exception handlers ensure stack traces are printed to the console
# -----------------------------------------------------------------------------


@app.exception_handler(FastAPIHTTPException)
async def custom_http_exception_handler(
    request: Request, exc: FastAPIHTTPException
) -> Response:
    """Log the full stack trace for HTTPException before delegating to default handler."""
    logger.error(f"HTTPException raised: {exc.detail}", exc_info=True)
    return await http_exception_handler(request, exc)


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception) -> Response:
    """Catch-all handler that logs any uncaught exceptions with stack trace."""
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    raise exc  # Re-raise so default 500 handler still kicks in


# Define allowed origins for CORS
ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:8080",
]

# Add CORS middleware with explicit settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],  # Allow all headers
    expose_headers=["Content-Type", "Authorization", "Accept"],
    max_age=3600,
)


# Add request logging middleware
@app.middleware("http")
async def log_requests(request, call_next):
    response = await call_next(request)
    # Only log errors or CORS issues if needed
    if request.method == "OPTIONS":
        origin = request.headers.get("origin")
        if origin in ALLOWED_ORIGINS:
            response.headers["Access-Control-Allow-Origin"] = origin
            response.headers["Access-Control-Allow-Methods"] = (
                "GET, POST, PUT, DELETE, OPTIONS, PATCH"
            )
            response.headers["Access-Control-Allow-Headers"] = "*"
            response.headers["Access-Control-Allow-Credentials"] = "true"
            response.headers["Access-Control-Max-Age"] = "3600"
    return response


@app.get("/")
def read_root():
    return ("Hello", "World")


@app.get("/health")
def health_check():
    """Health check endpoint to verify the API is running."""
    result = {
        "status": "healthy",
        "api": "running",
        "database": "unknown",
        "environment": ("Railway" if "RAILWAY_SERVICE_NAME" in os.environ else "Local"),
        "debug_mode": DEBUG,
    }

    try:
        # Check database connection
        with engine.connect() as conn:
            db_info = conn.execute(text("SELECT 1"))
            row = db_info.fetchone()
            if row:
                result["database"] = "connected"
                result["database_test"] = "passed"

        return result
    except SQLAlchemyError as e:
        logger.error(f"Health check failed - database error: {str(e)}")
        error_result = {
            "status": "unhealthy",
            "api": "running",
            "database": "disconnected",
            "error": str(e),
            "environment": result["environment"],
            "debug_mode": DEBUG,
        }
        return error_result
    except Exception as e:
        logger.error(f"Health check failed - unexpected error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Health check failed: {str(e)}",
        )


@app.get("/routes")
def list_routes():
    routes = []
    for route in app.routes:
        if isinstance(route, APIRoute):
            routes.append(
                {
                    "path": route.path,
                    "name": route.name,
                    "methods": route.methods,
                }
            )
    return {"routes": routes}


# Determine if running in Railway environment
railway_env = "RAILWAY_SERVICE_NAME" in os.environ

app.include_router(users_router, prefix="/api/users")
app.include_router(card_search_router, prefix="/api/card-search")

# Initialize database session
get_db_session()

# Server startup
if __name__ == "__main__":
    import uvicorn

    logger.info(f"Starting {PROJECT_NAME} v{VERSION}")
    logger.info(f"Debug mode: {DEBUG}")
    logger.info(f"Environment: {ENVIRONMENT}")

    # Import configuration values
    from looking_glass.config import API_HOST, API_PORT

    # Start the server
    uvicorn.run(
        "main:app",
        host=API_HOST,
        port=API_PORT,
        reload=DEBUG,  # Enable auto-reload in debug mode
        log_level="info" if not DEBUG else "debug",
    )
