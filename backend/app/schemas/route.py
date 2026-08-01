from pydantic import BaseModel
from typing import List


class RouteRequest(BaseModel):
    start: str
    destination: str


class RoutePoint(BaseModel):
    latitude: float
    longitude: float


class RouteInfo(BaseModel):
    distance_km: float
    risk_score: float
    risk_level: str
    crime_count: int
    points: List[RoutePoint]


class RouteResponse(BaseModel):
    fast_route: RouteInfo
    safe_route: RouteInfo
    risk_difference: float