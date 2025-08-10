# Grand Archive Looking Glass API

A robust FastAPI backend service for searching Grand Archive TCG cards with comprehensive error handling, logging, and database support.

## Database

```
docker run -d \
  --name looking_glass \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=Idontgive3ducks \
  -e POSTGRES_DB=looking_glass \
  -p 5433:5432 \
  -v ai_tutor_postgres_data:/var/lib/postgresql/data \
  ankane/pgvector
```

## Requirements

- Python 3.11
- FastAPI
- Uvicorn
- SQLAlchemy (for database features)

## Installation

1. Create a virtual environment:
```bash
python3.11 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Configure environment (optional):
```bash
# Copy and modify the example environment file
cp .env.example .env
# Edit .env with your specific configuration
```

### Development Mode
```bash
python main.py
```

### Production Mode
```bash
uvicorn main:app --host 0.0.0.0 --port 8080
```

The API will be available at:
- Main API: http://localhost:8080
- API Documentation: http://localhost:8080/docs
- Alternative Docs: http://localhost:8080/redoc

## API Endpoints

### System Endpoints
- `GET /` - Root endpoint with welcome message
- `GET /health` - Comprehensive health check with database connectivity
- `GET /routes` - List all available routes (useful for debugging)


## CORS Configuration

CORS is configured to support:
- Development: `http://localhost:3000`
- Production: Configure via `ALLOWED_ORIGINS` environment variable
- All standard HTTP methods
- Credential support for authenticated requests