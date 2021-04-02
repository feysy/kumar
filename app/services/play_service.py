
from random import randint
from typing import List, Tuple
from fastapi.exceptions import HTTPException
from starlette import status
from app.repository import MachineRepository, UserRepository
from app.models import EarnedRewardWithPath, MachineSpecs, MachineType, Path, PlayConfig, PlayResult


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
        reward_with_path, total_reward = self.__calculate_reward(machine.type, elements, play_config.bet)
        balance = self.__update_and_get_balance(username, total_reward, play_config.bet)

        return PlayResult(reward_with_path=reward_with_path, total_reward=total_reward, final_balance=balance, elements=elements)

    def __get_random_elements(self, machine_specs: MachineSpecs, all_elements: List[str]) -> List[List[str]]:
        result_elements: List[List[str]] = []
        for i in range(machine_specs.rows):
            result_elements.append([])
            for j in range(machine_specs.columns):
                rand_element = all_elements[randint(0, len(all_elements) - 1)]
                result_elements[i].append(rand_element)
        return result_elements
        

    def __calculate_reward(self, machine_type: MachineType, elements: List[List[str]], bet: int) -> Tuple[List[EarnedRewardWithPath], int]:
        paths = self.machine_repository.load_paths(machine_type)
        reward_with_path = []
        total_reward = 0
        for path in paths:
            element, occurence = self.__get_element_and_occurence(elements, path)
            reward = self.machine_repository.get_reward_for(element, occurence, machine_type)
            if not reward:
                continue
            earned_reward = reward.reward * bet
            total_reward += earned_reward
            reward_with_path.append(EarnedRewardWithPath(path=path, reward=reward, earned_reward=reward.reward * bet))
        
        return reward_with_path, total_reward

    def __get_element_and_occurence(self, elements: List[List[str]], path: Path) -> Tuple[str, int]:
        path_elements = [elements[path.path[i]][i] for i in range(len(path.path))]
        result_element = path_elements[0]
        occurence = 0
        for element in path_elements:
            if element != result_element:
                break
            occurence += 1
        
        return result_element, occurence

    def __update_and_get_balance(self, username: str, reward: int, bet: int) -> int:
        user = self.user_repository.get_user(username)
        new_balance = user.balance + reward - bet
        self.user_repository.update_balance(username, new_balance)
        
        return new_balance