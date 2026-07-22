from sqlalchemy import Column, Float, Integer, String

from app.core.database import Base


class Location(Base):
    __tablename__ = "location"

    location_id = Column(Integer, primary_key=True, index=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    address = Column(String(255), nullable=True)
    city = Column(String(120), nullable=True)
    state = Column(String(120), nullable=True)
    country = Column(String(120), nullable=True)
