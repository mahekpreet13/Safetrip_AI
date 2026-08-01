from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.crime import Crime
from app.models.location import Location
from app.schemas.route import RouteRequest
from app.services.geocoding import geocode_location
from app.services.route_engine import (
    build_direct_route,
    build_waypoint_route,
    find_nearby_crimes,
    calculate_route_risk,
    choose_safer_route,
)

router = APIRouter(tags=["routes"])


@router.post("/route")
async def calculate_route(
    request: RouteRequest,
    db: Session = Depends(get_db),
):
    start = await geocode_location(request.start)
    destination = await geocode_location(request.destination)

    if start is None:
        raise HTTPException(
            status_code=404,
            detail=f"Could not geocode start location: {request.start}",
        )

    if destination is None:
        raise HTTPException(
            status_code=404,
            detail=f"Could not geocode destination: {request.destination}",
        )

    # ---------------------------------------------------------
    # 1. FAST ROUTE
    # ---------------------------------------------------------

    fast_route = build_direct_route(
        start["latitude"],
        start["longitude"],
        destination["latitude"],
        destination["longitude"],
    )

    crimes = db.query(Crime).all()

    fast_crimes = find_nearby_crimes(
        crimes,
        fast_route["points"],
    )

    fast_risk = calculate_route_risk(fast_crimes)

    # ---------------------------------------------------------
    # 2. CANDIDATE SAFE ROUTES
    # ---------------------------------------------------------

    locations = db.query(Location).all()

    candidate_routes = []

    for waypoint in locations:

        # Don't use start/destination themselves as waypoints.
        if (
            abs(waypoint.latitude - start["latitude"]) < 0.01
            and abs(waypoint.longitude - start["longitude"]) < 0.01
        ):
            continue

        if (
            abs(waypoint.latitude - destination["latitude"]) < 0.01
            and abs(waypoint.longitude - destination["longitude"]) < 0.01
        ):
            continue

        candidate_route = build_waypoint_route(
            start["latitude"],
            start["longitude"],
            waypoint.latitude,
            waypoint.longitude,
            destination["latitude"],
            destination["longitude"],
        )

        candidate_crimes = find_nearby_crimes(
            crimes,
            candidate_route["points"],
        )

        candidate_risk = calculate_route_risk(candidate_crimes)

        candidate_routes.append(
            {
                "route": candidate_route,
                "risk": candidate_risk,
            }
        )

    # ---------------------------------------------------------
    # 3. CHOOSE SAFEST ROUTE
    # ---------------------------------------------------------

    result = choose_safer_route(
        fast_route,
        fast_risk,
        candidate_routes,
    )

    safe_route = result["safe_route"]
    safe_risk = result["safe_risk"]

    return {
        "fast_route": {
            "distance_km": fast_route["distance_km"],
            "risk_score": fast_risk["risk_score"],
            "risk_level": fast_risk["risk_level"],
            "crime_count": fast_risk["crime_count"],
            "points": fast_route["points"],
        },
        "safe_route": {
            "distance_km": safe_route["distance_km"],
            "risk_score": safe_risk["risk_score"],
            "risk_level": safe_risk["risk_level"],
            "crime_count": safe_risk["crime_count"],
            "points": safe_route["points"],
        },
        "risk_difference": result["risk_difference"],
    }