from fastapi import FastAPI

from app.routes.db_health import router as db_health_router
from app.routes.health import router as health_router

app = FastAPI(title="SafeTrip AI API", version="0.1.0")

app.include_router(health_router)
app.include_router(db_health_router)
