from fastapi import FastAPI
from src.db.db import engine, Base
from src.api.endpoints import router as api_router

app = FastAPI()


@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)


app.include_router(api_router)


@app.get("/")
def read_root():
    return {"Hello": "World"}
