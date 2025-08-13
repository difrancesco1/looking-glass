from datetime import datetime
from uuid import UUID

from pydantic import BaseModel
from pydantic import Field


class UserResponse(BaseModel):
    """User response model."""

    id: UUID
    username: str
    email: str


class UserRegistration(BaseModel):
    """User registration request model."""

    username: str = Field(..., description="Username for the account")
    email: str = Field(..., description="Email for the account")
    password: str = Field(..., description="Password for the account")


class UserLogin(BaseModel):

    username: str


class JwtToken(BaseModel):
    """JWT token response model."""

    token: str = Field(..., description="JWT access token")
    type: str = Field(default="bearer", description="Type of token")
    expires: datetime = Field(..., description="Timestamp when token expires")
