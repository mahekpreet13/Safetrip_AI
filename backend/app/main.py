from fastapi import FastAPI

from app.routes.crime import router as crime_router
from app.routes.db_health import router as db_health_router
from app.routes.health import router as health_router
from app.routes.search import router as search_router
from app.core.database import Base, engine

# Import models so SQLAlchemy knows about them
from app.models.location import Location
from app.models.crime import Crime

app = FastAPI(title="SafeTrip AI API", version="0.1.0")

Base.metadata.create_all(bind=engine)

app.include_router(health_router)
app.include_router(db_health_router)
app.include_router(search_router)
app.include_router(crime_router)