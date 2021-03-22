import pymongo
from fastapi import Depends
from pymongo.database import Database

from app.repository import UserRepository, MachineRepository


def get_database():
    my_client = pymongo.MongoClient("mongodb://127.0.0.1:27017/")
    return my_client["kumar"]


def get_user_repository(db: Database = Depends(get_database)):
    return UserRepository(db)


def get_machine_repository(db: Database = Depends(get_database)):
    return MachineRepository(db)
