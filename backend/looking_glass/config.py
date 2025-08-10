import os
from pathlib import Path

# Project information
PROJECT_NAME = "Grand Archive Looking Glass API"
VERSION = "1.0.0"
DESCRIPTION = "API for searching Grand Archive TCG cards"

# Environment detection
DEBUG = os.getenv("DEBUG", "false").lower() == "true"
ENVIRONMENT = os.getenv("ENVIRONMENT", "development")

# API Configuration
API_HOST = os.getenv("API_HOST", "0.0.0.0")
API_PORT = int(os.getenv("API_PORT", "8080"))

# CORS Configuration
ALLOWED_ORIGINS = [
    "http://localhost:3000",  # Next.js default port
    "http://localhost:8080",  # API port
    "https://grand-archive-looking-glass.vercel.app",  # Production frontend (example)
]

# Add production origins from environment
if production_origins := os.getenv("ALLOWED_ORIGINS"):
    ALLOWED_ORIGINS.extend(production_origins.split(","))

# Database Configuration
# Default to PostgreSQL for Railway deployment, fallback to SQLite for local dev
DATABASE_URL = os.getenv(
    "DATABASE_URL", "postgresql://postgres:Idontgive3ducks@localhost:5433/looking_glass"
)

# External API Configuration
GRAND_ARCHIVE_API_BASE_URL = os.getenv(
    "GRAND_ARCHIVE_API_BASE_URL", "https://api.gatcg.com"
)

# Logging Configuration
LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
LOG_FORMAT = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"

# Application paths
BASE_DIR = Path(__file__).parent.parent
LOGS_DIR = BASE_DIR / "logs"
LOGS_DIR.mkdir(exist_ok=True)
