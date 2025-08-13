import uuid

from sqlalchemy import ForeignKey
from sqlalchemy import LargeBinary
from sqlalchemy import String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import relationship


class Base(DeclarativeBase):
    """Base class for all SQLAlchemy models."""


class User(Base):
    """User model."""

    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    username: Mapped[str] = mapped_column(String, nullable=False, unique=True)
    email: Mapped[str] = mapped_column(
        String,
        nullable=False,
        unique=True,
    )

    # Relationship Mapping
    logins: Mapped[list["UserLogin"]] = relationship("UserLogin", back_populates="user")


class UserLogin(Base):
    """User login model."""

    __tablename__ = "UserLogin"

    username: Mapped[str] = mapped_column(String, nullable=False, unique=True)

    # Primary key
    email: Mapped[str] = mapped_column(String, primary_key=True, unique=True)

    # Foreign key
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=False
    )

    # Data
    password: Mapped[bytes] = mapped_column(LargeBinary, nullable=False)

    # Relationship Mapping
    user: Mapped["User"] = relationship("User", back_populates="logins")

    def __init__(self, user: User, password: bytes):
        self.user_id = user.id
        self.username = user.username
        self.email = user.email
        self.password = password
