import re

import bcrypt
from fastapi import HTTPException
from fastapi import status

from looking_glass.db.engine import get_db_session
from looking_glass.db.models import User
from looking_glass.db.models import UserLogin


# -----------------------------
# Register Logic
# -----------------------------
def _hash_password(password: str) -> bytes:
    password_bytes = password.encode("utf-8")
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password_bytes, salt)
    return hashed_password


def username_password_requirment_check(
    username: str, email: str, password: str
) -> bool:
    if not username or len(username.strip()) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="username is empty",
        )
    if not email or len(email.strip()) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="email is empty",
        )

    # Validate email format
    email_pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
    if not re.match(email_pattern, email.strip()):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="invalid email format",
        )

    if not password or len(password.strip()) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password is too short, must be at least 8 characters",
        )
    return True


def create_user_login(username: str, email: str, password: str) -> UserLogin | None:
    with get_db_session() as session:

        # Check if username already exists
        existing_username = (
            session.query(UserLogin).filter((UserLogin.username == username)).first()
        )
        existing_email = (
            session.query(UserLogin).filter((UserLogin.email == email)).first()
        )

        if existing_username:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="username already exists",
            )
        if existing_email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="email already exists",
            )

        # Validate username and password requirements
        username_password_requirment_check(username, email, password)

        # Create user login
        user = User(username=username, email=email)
        session.add(user)
        session.flush()
        user_login = UserLogin(user, _hash_password(password))
        session.add(user_login)
        session.commit()

        return user_login


# -----------------------------
# Login Logic
# -----------------------------


def authenticate_user(email: str, password: str) -> UserLogin:
    with get_db_session() as session:
        user_login = session.query(UserLogin).filter(UserLogin.email == email).first()
        if not user_login:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="email not found",
                headers={"WWW-Authenticate": "Bearer"},
            )

        if not bcrypt.checkpw(password.encode("utf-8"), user_login.password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid password",
                headers={"WWW-Authenticate": "Bearer"},
            )

        return user_login
