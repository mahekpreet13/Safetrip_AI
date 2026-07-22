from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.core.database import Base


class PoliceStation(Base):
    __tablename__ = "police_station"

    station_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    phone = Column(String(50), nullable=True)
    email = Column(String(255), nullable=True)
    location_id = Column(Integer, ForeignKey("location.location_id"), nullable=False, index=True)

    location = relationship("Location")
