import jwt
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from passlib.hash import bcrypt
from fastapi import status
from fastapi.responses import JSONResponse

from app.constants import JWT_SECRET
from app.container import get_user_repository
from app.exceptions import ExistingUserError
from app.models import UserCreateModel, UpdatePasswordModel, TokenModel
from app.repository import UserRepository

router = APIRouter(prefix='/user')
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/token")


@router.post("/")
def create_user(user: UserCreateModel, user_repository: UserRepository = Depends(get_user_repository)):
    user = user_repository.get_user(user.username)
    if not user:
        user_repository.create_user(user.username, user.password)
        return JSONResponse({'Created user': True})

    raise ExistingUserError("User already exists")


@router.get("/{username}")
def get_user(username: str, user_repository: UserRepository = Depends(get_user_repository)):
    existing_user = user_repository.get_user(username)
    if not existing_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return {'User': existing_user.username}


@router.post("/{username}/password")
async def change_password(username: str, password: UpdatePasswordModel,
                          token: str = Depends(oauth2_scheme),
                          user_repository: UserRepository = Depends(get_user_repository)):
    token_data = TokenModel.parse_obj(jwt.decode(token, JWT_SECRET, algorithms=['HS256']))
    current_user = user_repository.get_user(token_data.user)
    if (not current_user.is_admin) and (current_user.username != username):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="You don't have authorization to change another users credentials.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    target_user = user_repository.get_user(username)
    if not target_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not bcrypt.verify(password.oldPassword, target_user.password) and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Old password is incorrect.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_repository.update_password(username, bcrypt.hash(password.newPassword))

    return JSONResponse({'Update user': True})
