from datetime import datetime
from enum import Enum
from typing import Optional, List

from pydantic import BaseModel


class MachineType(Enum):
    Bar = 'bar'
    Champagne = 'champagne'


class TokenModel(BaseModel):
    user: str


class Machine(BaseModel):
    id: str
    name: str
    type: MachineType
    assigned_user: Optional[str]

    class Config:
        use_enum_values = True


class User(BaseModel):
    id: str
    username: str
    password: str
    is_admin: bool
    balance: int


class PlayConfig(BaseModel):
    lines: List[str]
    bet: int


class UserCreateModel(BaseModel):
    username: str
    password: str


class MachineCreateModel(BaseModel):
    name: str
    type: MachineType


class UpdatePasswordModel(BaseModel):
    oldPassword: str
    newPassword: str

class Element(BaseModel):
    name: str
    tag: str

class MachineSpecs(BaseModel):
    name: str
    columns: int
    rows: int

class Path(BaseModel):
    name: str
    path: List[int]
    type: MachineType


class Reward(BaseModel):
    element_tag: str
    count: int
    type: MachineType
    reward: int

class EarnedRewardWithPath(BaseModel):
    path: Path
    reward: Reward
    earned_reward: int

class PlayResult(BaseModel):
    reward_with_path: List[EarnedRewardWithPath]
    total_reward: int
    final_balance: int
    elements: List[List[str]]