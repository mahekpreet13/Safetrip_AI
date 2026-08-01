from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.police_station import PoliceStation
from app.schemas.police_station import PoliceStationResponse
from app.services.route_engine import calculate_station_distance

router = APIRouter(tags=["police stations"])


@router.get(
    "/police-stations",
    response_model=list[PoliceStationResponse],
)
def get_police_stations(
    latitude: float = Query(..., description="Current latitude"),
    longitude: float = Query(..., description="Current longitude"),
    db: Session = Depends(get_db),
):
    stations = db.query(PoliceStation).all()

    results = []

    for station in stations:
        if station.location is None:
            continue

        distance = calculate_station_distance(
            latitude,
            longitude,
            station.location.latitude,
            station.location.longitude,
        )

        results.append(
            PoliceStationResponse(
                name=station.name,
                distance_km=distance,
                latitude=station.location.latitude,
                longitude=station.location.longitude,
            )
        )

    results.sort(key=lambda station: station.distance_km)

    return results