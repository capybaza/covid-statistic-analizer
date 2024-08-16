from fastapi import APIRouter
from src.api.handlers.covid.covid_endpoints import router as covid_router

router = APIRouter()
router.include_router(covid_router, prefix="/covid", tags=["covid"])
