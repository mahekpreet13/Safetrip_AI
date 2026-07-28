from pydantic import BaseModel


class HeatmapPoint(BaseModel):
    lat: float
    lng: float
    weight: int