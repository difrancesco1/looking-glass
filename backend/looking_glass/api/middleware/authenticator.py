from datetime import datetime
from datetime import timedelta
from datetime import timezone

import jwt
from fastapi import Depends
from fastapi import HTTPException

from looking_glass.config import ALGORITHM
from looking_glass.config import OAUTH2_SCHEME
from looking_glass.config import SECRET_KEY
from looking_glass.db.engine import get_db_session
from looking_glass.db.models import User
from looking_glass.db.models import UserLogin


def create_access_token(user_login: UserLogin) -> tuple[str, datetime]:
    expires_at = datetime.now(timezone.utc) + timedelta(days=1)

    token_data = {
        "username": user_login.username,
        "exp": expires_at,
    }
    encoded_token = jwt.encode(token_data, SECRET_KEY, ALGORITHM)

    # jwt.encode returns str in PyJWT 2.x, but may return bytes in older versions
    if isinstance(encoded_token, bytes):
        token = encoded_token.decode("utf-8")
    else:
        token = encoded_token

    return token, expires_at


def get_current_user(token: str = Depends(OAUTH2_SCHEME)) -> User:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=403, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=403, detail="Invalid token")
    except Exception as e:
        raise HTTPException(
            status_code=403, detail=f"Error getting current user: {str(e)}"
        )

    username = payload.get("username")
    if not isinstance(username, str) or username is None:
        raise HTTPException(status_code=403, detail="Can't get username from payload")

    with get_db_session() as db:
        try:
            pass

            user_login = (
                db.query(User)
                .join(User.logins)
                .filter(User.username == username)
                .first()
            )
            if user_login is None:
                raise HTTPException(status_code=403, detail="Can't get user")
            return user_login
        except Exception:
            raise HTTPException(status_code=403, detail="Database error")


async def get_current_user_sse(token: str = Depends(OAUTH2_SCHEME)) -> User:
    """Async version of get_current_user for SSE endpoints"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=403, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=403, detail="Invalid token")
    except Exception as e:
        raise HTTPException(
            status_code=403, detail=f"Error getting current user: {str(e)}"
        )

    username = payload.get("username")
    if not isinstance(username, str) or username is None:
        raise HTTPException(status_code=403, detail="Can't get username from payload")

    with get_db_session() as db:
        try:
            user_login = (
                db.query(User)
                .join(User.logins)
                .filter(User.username == username)
                .first()
            )
            if user_login is None:
                raise HTTPException(status_code=403, detail="Can't get user")
            return user_login
        except Exception:
            raise HTTPException(status_code=403, detail="Database error")
