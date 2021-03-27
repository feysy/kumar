import pymongo
import os
from fastapi import Depends
from pymongo.database import Database

from app.repository import UserRepository, MachineRepository


def get_database():
    env = os.getenv('ENV')
    db_address = "mongodb"
    if not env:
        db_address = "127.0.0.1"
    my_client = pymongo.MongoClient(f"mongodb://{db_address}:27017/")
    return my_client["kumar"]


def get_user_repository(db: Database = Depends(get_database)):
    return UserRepository(db)


def get_machine_repository(db: Database = Depends(get_database)):
    return MachineRepository(db)


