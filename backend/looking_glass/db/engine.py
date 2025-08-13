import logging
from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session
from sqlalchemy.orm import sessionmaker

from looking_glass.config import DATABASE_URL
from looking_glass.logger import default_logger as logger

# Disable SQLAlchemy logging to avoid verbose query logs
logging.getLogger("sqlalchemy.engine").setLevel(logging.WARNING)
logging.getLogger("sqlalchemy.dialects").setLevel(logging.WARNING)
logging.getLogger("sqlalchemy.pool").setLevel(logging.WARNING)
logging.getLogger("sqlalchemy.orm").setLevel(logging.WARNING)

try:
    engine = create_engine(
        DATABASE_URL,
        pool_pre_ping=True,  # Enable connection health checks
        pool_size=5,  # Maximum number of connections to keep in the pool
        max_overflow=10,  # Max connections beyond pool_size
        connect_args={"connect_timeout": 10},
        # Disable echo to prevent verbose SQL logging
        echo=False,
    )

    # Test connection with a specific query that prints the connection detail
    with engine.connect() as conn:
        result = conn.execute(text("SELECT 1"))
        row = result.fetchone()
        if row:
            logger.info("Database connection test successful")
        logger.info("Database connection successful")

except Exception as e:
    logger.error(f"Failed to connect to database: {str(e)}")
    logger.error(f"Database URL used: {DATABASE_URL}")

    # Create a dummy engine that will raise a more helpful error when used
    from sqlalchemy.pool import NullPool

    engine = create_engine(
        "sqlite:///./error.db",
        poolclass=NullPool,
        connect_args={"connect_timeout": 1},
    )

# Create a session factory
SessionLocal = sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False,
    expire_on_commit=False,
)


def get_db() -> Generator[Session, None, None]:
    """Provide a database session for FastAPI dependency injection.

    Ensures the session is properly closed after use and handles rollback
    on exceptions.
    """
    db = SessionLocal()
    try:
        yield db
    except SQLAlchemyError as e:
        db.rollback()
        logger.error(f"Database error: {str(e)}")
        raise
    finally:
        db.close()


def get_db_session() -> Session:
    """Get a new database session.

    Remember to close the session after use!

    Usage:
        db = get_db_session()
        try:
            db.query(Model).all()
            db.commit()
        except SQLAlchemyError as e:
            db.rollback()
            logger.error(f"Database error: {str(e)}")
            raise
        finally:
            db.close()
    """
    return SessionLocal()
