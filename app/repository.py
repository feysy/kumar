from typing import Optional, List

from bson import ObjectId
from passlib.hash import bcrypt
from pymongo.database import Database

from app.models import User, MachineType, Machine


class UserRepository:
    def __init__(self, db: Database):
        self.collection = db['users']

    def get_user(self, username: str) -> Optional[User]:
        user = self.collection.find_one({'username': username})
        if not user:
            return None

        return User(id=str(user['_id']), username=user['username'], password=user['password'], is_admin=user['admin'])

    def create_user(self, username: str, password: str) -> None:
        my_dict = {"username": username, "password": bcrypt.encrypt(password)}
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


class MachineRepository:
    def __init__(self, db: Database):
        self.collection = db['machines']

    def get_machine_by_name(self, name: str) -> Optional[Machine]:
        machine = self.collection.find_one({'name': name})
        if not machine:
            return None

        return Machine(id=str(machine['_id']), name=machine['name'], type=MachineType(machine['type']))

    def get_machine(self, machine_id: str) -> Optional[Machine]:
        machine = self.collection.find_one({'_id': ObjectId(machine_id)})
        if not machine:
            return None

        return Machine(id=str(machine['_id']), name=machine['name'], type=MachineType(machine['type']))

    def create_machine(self, name: str, machine_type: MachineType) -> None:
        my_dict = {"name": name, "type": machine_type.value, "assigned_user": None}
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

    def get_all(self) -> List[Machine]:
        cursor = self.collection.find()
        result = []
        for machine in cursor:
            result.append(Machine(id=str(machine['_id']),
                                  name=machine['name'],
                                  type=MachineType(machine['type']),
                                  assigned_user_id=machine["assigned_user"]))
        return result

    def assign_machine(self, machine_id: str, username: str) -> int:
        update_query = {"_id": machine_id}
        new_value = {"$set": {"assigned_user": username}}

        result = self.collection.update_one(update_query, new_value)
        return result.modified_count > 0

