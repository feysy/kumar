from datetime import datetime
from enum import Enum
from typing import Optional, List

from pydantic import BaseModel


class MachineType(Enum):
    Bar = 1
    Champagne = 2


class TokenModel(BaseModel):
    user: str


class Machine(BaseModel):
    id: str
    name: str
    type: MachineType
    assigned_user_id: Optional[str]

    class Config:
        use_enum_values = True


class User(BaseModel):
    id: str
    username: str
    password: str
    is_admin: bool


class UserCreateModel(BaseModel):
    username: str
    password: str


class MachineCreateModel(BaseModel):
    name: str
    type: MachineType


class UpdatePasswordModel(BaseModel):
    oldPassword: str
    newPassword: str
