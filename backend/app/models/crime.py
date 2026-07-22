from sqlalchemy import Column, Date, ForeignKey, Integer, String, Time
from sqlalchemy.orm import relationship

from app.core.database import Base


class Crime(Base):
    __tablename__ = "crime"

    crime_id = Column(Integer, primary_key=True, index=True)
    crime_type = Column(String(120), nullable=False)
    date = Column(Date, nullable=False)
    time = Column(Time, nullable=False)
    severity = Column(String(30), nullable=False)
    description = Column(String(500), nullable=True)
    location_id = Column(Integer, ForeignKey("location.location_id"), nullable=False, index=True)

    location = relationship("Location")
