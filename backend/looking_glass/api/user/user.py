from fastapi import APIRouter
from fastapi import Body
from fastapi import Depends
from fastapi import HTTPException
from fastapi import status

from looking_glass.api.middleware.authenticator import create_access_token
from looking_glass.api.middleware.authenticator import get_current_user
from looking_glass.api.user.models import JwtToken
from looking_glass.api.user.models import UserRegistration
from looking_glass.api.user.models import UserResponse
from looking_glass.db.user import authenticate_user
from looking_glass.db.user import create_user_login


users_router = APIRouter()


@users_router.get("/user")
def get_user_with_jwt(current_user=Depends(get_current_user)) -> UserResponse:
    if current_user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return UserResponse(
        id=current_user.id,
        username=current_user.username,
        email=current_user.email,
    )


@users_router.post("/login")
def login_user(login_data: dict[str, str] = Body(...)) -> JwtToken:

    login = login_data["login"]
    password = login_data["password"]

    user_login = authenticate_user(login, password)

    token, expires_at = create_access_token(user_login)

    return JwtToken(token=token, expires=expires_at)


@users_router.post("/register")
def register_user(register_data: UserRegistration) -> dict[str, str]:
    create_user_login(
        register_data.username,
        register_data.email,
        register_data.password,
    )

    return {"status": "success", "message": "User registered successfully"}
