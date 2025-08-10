import logging
import sys
from typing import Optional

from looking_glass.config import LOG_FORMAT
from looking_glass.config import LOG_LEVEL
from looking_glass.config import LOGS_DIR


def setup_logger(
    name: Optional[str] = None,
    level: Optional[str] = None,
    log_file: Optional[str] = None,
) -> logging.Logger:
    """
    Set up a logger with console and optional file output.

    Args:
        name: Logger name (defaults to "grand_archive_api")
        level: Log level (defaults to config LOG_LEVEL)
        log_file: Optional log file name (will be created in LOGS_DIR)

    Returns:
        Configured logger instance
    """
    logger_name = name or "grand_archive_api"
    log_level = level or LOG_LEVEL

    # Create logger
    logger = logging.getLogger(logger_name)
    logger.setLevel(getattr(logging, log_level.upper()))

    # Prevent duplicate handlers if logger already exists
    if logger.handlers:
        return logger

    # Create formatter
    formatter = logging.Formatter(LOG_FORMAT)

    # Console handler
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(logging.DEBUG)
    console_handler.setFormatter(formatter)
    logger.addHandler(console_handler)

    # File handler (if specified)
    if log_file:
        file_path = LOGS_DIR / log_file
        file_handler = logging.FileHandler(file_path)
        file_handler.setLevel(logging.INFO)
        file_handler.setFormatter(formatter)
        logger.addHandler(file_handler)

    return logger


# Create default logger for the application
default_logger = setup_logger("grand_archive_api", log_file="api.log")
