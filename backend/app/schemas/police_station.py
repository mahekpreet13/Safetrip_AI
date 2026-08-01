from pydantic import BaseModel


class PoliceStationResponse(BaseModel):
    name: str
    distance_km: float
    latitude: float
    longitude: float