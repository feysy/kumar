import jwt
from fastapi import FastAPI, status, Depends, HTTPException
from starlette.requests import Request
from starlette.responses import JSONResponse, RedirectResponse, FileResponse
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from starlette.staticfiles import StaticFiles

from .constants import JWT_SECRET
from .container import get_database, get_user_repository
from .endpoints import user, machine
from .repository import UserRepository
from .exceptions import ExistingUserError, ExistingMachineError
from .models import TokenModel

app = FastAPI()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/token")
app.mount("/static", StaticFiles(directory="static/output"), name="static")
app.include_router(user.router, prefix="/api")
app.include_router(machine.router, prefix="/api")


@app.exception_handler(ExistingMachineError)
async def unicorn_machine_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=status.HTTP_409_CONFLICT,
        content={"errorMessage": f"Machine already exists"},
    )


@app.exception_handler(ExistingUserError)
async def unicorn_user_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=status.HTTP_409_CONFLICT,
        content={"errorMessage": f"User already exists"},
    )


@app.get("/")
async def static_index():
    return FileResponse('static/output/index.html')


@app.get("/{something}")
async def static_index_subfolders():
    return FileResponse('static/output/index.html')


@app.get("/api/all")
def read_root(db=Depends(get_database)):
    my_col = db["users"]
    cursor = my_col.find({})
    lst = []
    for document in cursor:
        lst.append(
            {'username': document['username'], 'password': document['password']})

    return {"Helloo": "World", 'Inserted': lst}


@app.post("/api/token")
def login(form_data: OAuth2PasswordRequestForm = Depends(),
          user_repository: UserRepository = Depends(get_user_repository)):
    result = user_repository.verify_user(
        form_data.username, form_data.password)
    if not result:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Incorrect username or password")
    token = jwt.encode(TokenModel(user=form_data.username).dict(), JWT_SECRET)

    return {"access_token": token, "token_type": "bearer"}
