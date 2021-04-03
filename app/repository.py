from typing import Optional, List

from bson import ObjectId
from passlib.hash import bcrypt
from pymongo.database import Database

from app.models import Element, MachineSpecs, Path, Reward, User, MachineType, Machine


class UserRepository:
    def __init__(self, db: Database):
        self.collection = db['users']

    def get_user(self, username: str) -> Optional[User]:
        user = self.collection.find_one({'username': username})
        if not user:
            return None

        return User(id=str(user['_id']), username=user['username'], password=user['password'], is_admin=user['admin'], balance=user['balance'])

    def create_user(self, username: str, password: str) -> None:
        my_dict = {"username": username,
                   "password": bcrypt.encrypt(password),
                   "balance": 1000,
                   "admin": False}
        self.collection.insert_one(my_dict)

    def verify_user(self, username: str, password: str) -> bool:
        existing_user = self.collection.find_one({'username': username})
        if existing_user is None:
            return False

        if not bcrypt.verify(password, existing_user["password"]):
            return False

        return True

    def update_password(self, username: str, password: str):
        update_query = {"username": username}
        new_value = {"$set": {"password": password}}

        self.collection.update_one(update_query, new_value)

    def update_balance(self, username: str, balance: int):
        update_query = {"username": username}
        new_value = {"$set": {"balance": balance}}

        self.collection.update_one(update_query, new_value)


class MachineRepository:
    def __init__(self, db: Database):
        self.paths = db['path']
        self.rewards = db['reward']
        self.machine_elements = db['machine_element']
        self.machine_types = db['machine_type']
        self.machines = db['machine']

    def get_machine_by_name(self, name: str) -> Optional[Machine]:
        machine = self.machines.find_one({'name': name})
        if not machine:
            return None

        return Machine(id=str(machine['_id']), name=machine['name'], type=MachineType(machine['type']))

    def get_machine(self, machine_id: str) -> Optional[Machine]:
        machine = self.machines.find_one({'_id': ObjectId(machine_id)})
        if not machine:
            return None

        return Machine(id=str(machine['_id']), name=machine['name'], type=MachineType(machine['type']), assigned_user=machine['assigned_user'])

    def create_machine(self, name: str, machine_type: MachineType) -> None:
        my_dict = {"name": name, "type": machine_type.value,
                   "assigned_user": None}
        self.machines.insert_one(my_dict)

    def verify_user(self, username: str, password: str) -> bool:
        existing_user = self.machines.find_one({'username': username})
        if existing_user is None:
            return False

        if not bcrypt.verify(password, existing_user["password"]):
            return False

        return True

    def update_password(self, username: str, password: str):
        update_query = {"username": username}
        new_value = {"$set": {"password": password}}

        self.machines.update_one(update_query, new_value)

    def get_all(self) -> List[Machine]:
        cursor = self.machines.find()
        result = []
        for machine in cursor:
            result.append(Machine(id=str(machine['_id']),
                                  name=machine['name'],
                                  type=MachineType(machine['type']),
                                  assigned_user=machine["assigned_user"]))
        return result

    def assign_machine(self, machine_id: str, username: str) -> int:
        update_query = {"_id": ObjectId(machine_id)}
        new_value = {"$set": {"assigned_user": username}}

        result = self.machines.update_one(update_query, new_value)
        return result.modified_count > 0

    def get_element_tags_for_machine_type(self, type: MachineType) -> List[str]:
        cursor = self.machine_elements.find({'type': str(type)})
        result = []
        for machine_element in cursor:
            result.append(machine_element['element'])
        return result

    def load_specs(self, type: MachineType) -> MachineSpecs:
        machine_type = self.machine_types.find_one({'name': str(type)})
        if not machine_type:
            return None
        return MachineSpecs(name=machine_type['name'], columns=machine_type['columns'], rows=machine_type['rows'])

    def load_paths(self, type: MachineType) -> List[Path]:
        cursor = self.paths.find({'type': str(type)})
        result = []
        for path in cursor:
            result.append(Path(name=path['name'],
                               path=[n for n in path['path']],
                               type=MachineType(path['type'])))
        return result

    def load_rewards(self, type: MachineType) -> List[Reward]:
        cursor = self.rewards.find({'type': str(type)})
        result = []
        for reward in cursor:
            result.append(Reward(reward=reward['award'],
                                 element_tag=reward['tag'],
                                 count=reward['count'],
                                 type=MachineType(reward['type'])))
        return result

    def get_reward_for(self, element: str, occurence: int, type: MachineType) -> Optional[Reward]:
        reward = self.rewards.find_one(
            {'type': str(type), 'tag': element, 'count': occurence})

        if not reward:
            return None

        return Reward(reward=reward['award'],
                      element_tag=reward['tag'],
                      count=reward['count'],
                      type=MachineType(reward['type']))
