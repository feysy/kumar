
from random import randint
from typing import List
from fastapi.exceptions import HTTPException
from starlette import status
from app.repository import MachineRepository, UserRepository
from app.models import MachineSpecs, MachineType, PlayConfig


class PlayService:
    def __init__(self, machine_repository: MachineRepository, user_repository: UserRepository):
        self.machine_repository = machine_repository
        self.user_repository = user_repository

    def play(self, machine_id: str, username: str, play_config: PlayConfig):
        machine = self.machine_repository.get_machine(machine_id)
        if not machine.assigned_user == username:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Machine not assigned to the user"
            )
        machine_specs = self.machine_repository.load_specs(machine.type)
        all_elements = self.machine_repository.get_element_tags_for_machine_type(machine.type)
        elements = self.__get_random_elements(machine_specs, all_elements)
        reward = self.__calculate_reward(machine.type, elements)
        balance = self.__update_and_get_balance(username, reward)
        pass

    def __get_random_elements(machine_specs: MachineSpecs, all_elements: List[str]) -> List[List[str]]:
        num_of_items = machine_specs.columns * machine_specs.rows
        result_elements: List[List[str]] = []
        for i in range(machine_specs.rows):
            result_elements[i] = []
            for j in range(machine_specs.columns):
                result_elements[i][j] = randint(0, num_of_items - 1)
        return result_elements
        

    def __calculate_reward(self, machine_type: MachineType, elements: List[List[str]]) -> int:
        paths = self.machine_repository.load_paths(machine_type)

        pass

    def __update_and_get_balance(self, username: str, reward: int) -> int:
        
        pass