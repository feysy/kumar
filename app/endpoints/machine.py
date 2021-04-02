from app.services.play_service import PlayService
import jwt
from fastapi import APIRouter, Depends, HTTPException
from fastapi import status
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordBearer

from app.constants import JWT_SECRET
from app.container import get_machine_repository, get_play_service, get_user_repository
from app.exceptions import ExistingMachineError
from app.models import MachineCreateModel, PlayConfig, TokenModel
from app.repository import MachineRepository, UserRepository

router = APIRouter(prefix='/machine')
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/token")


@router.post("/")
def create_machine(machine: MachineCreateModel,
                   machine_repository: MachineRepository = Depends(get_machine_repository)):
    existing_machine = machine_repository.get_machine_by_name(machine.name)
    if not existing_machine:
        machine_repository.create_machine(machine.name, machine.type)
        return JSONResponse({'Created machine': True})

    raise ExistingMachineError("Machine already exists")


@router.get("/")
def list_all_machines(machine_repository: MachineRepository = Depends(get_machine_repository)):
    machines = machine_repository.get_all()
    return JSONResponse([machine.dict() for machine in machines])


@router.get("/get_by_name/{name}")
def get_machine(name: str, machine_repository: MachineRepository = Depends(get_machine_repository)):
    machine = machine_repository.get_machine_by_name(name)
    if not machine:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Machine not found"
        )
    return {'Machine': machine.dict()}


@router.get("/get_by_id/{machine_id}")
def get_machine_by_id(machine_id: str, machine_repository: MachineRepository = Depends(get_machine_repository)):
    machine = machine_repository.get_machine(machine_id)
    if not machine:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Machine not found"
        )
    return {'Machine': machine.dict()}


@router.get("/{machine_id}/assign_machine")
def assign_machine(machine_id: str,
                   machine_repository: MachineRepository = Depends(
                       get_machine_repository),
                   token: str = Depends(oauth2_scheme)):
    credentials = TokenModel.parse_obj(jwt.decode(token, JWT_SECRET, algorithms=['HS256']))
    username = credentials.user
    if not machine_repository.assign_machine(machine_id, username):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Machine not found"
        )
    return {'Machine': machine_id}


@router.post("/{machine_id}/play")
def play(machine_id: str,
         play_config: PlayConfig,
         play_service: PlayService = Depends(get_play_service),
         token: str = Depends(oauth2_scheme)):
    credentials = TokenModel.parse_obj(jwt.decode(token, JWT_SECRET, algorithms=['HS256']))
    username = credentials.user
    play_result = play_service.play(machine_id, username, play_config)

    return play_result
