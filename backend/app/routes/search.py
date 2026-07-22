from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.crime import Crime
from app.schemas.search import NearbyCrime, SearchResult
from app.services.geocoding import geocode_location
from app.services.location_matching import find_all_matching_locations, find_matching_location
from app.services.risk_engine import calculate_risk_score

router = APIRouter(tags=["search"])


@router.get("/search", response_model=SearchResult)
async def search_location(query: str = Query(..., min_length=2, description="e.g. Delhi"), db: Session = Depends(get_db)):
    geo = await geocode_location(query)
    if geo is None:
        raise HTTPException(status_code=404, detail=f"Could not geocode location: {query}")

    location = find_matching_location(db, query, geo["city"])
    crimes = []
    if location:
        crimes = db.query(Crime).filter(Crime.location_id == location.location_id).all()

    risk = calculate_risk_score(crimes)

    return SearchResult(
        query=query,
        latitude=geo["latitude"],
        longitude=geo["longitude"],
        matched_city=location.city if location else geo["city"],
        matched_in_db=location is not None,
        risk_score=risk["risk_score"],
        risk_level=risk["risk_level"],
        crime_count=risk["crime_count"],
        nearby_crimes=[
            NearbyCrime(
                crime_id=c.crime_id,
                crime_type=c.crime_type,
                severity=c.severity,
                date=str(c.date),
                time=str(c.time),
                description=c.description,
            )
            for c in crimes
        ],
    )


@router.get("/location", response_model=SearchResult)
def get_stored_location(city: str = Query(..., min_length=2), db: Session = Depends(get_db)):
    """Look up ALL locations already stored in our DB for this city — no external
    API call, so this never fails due to network/geocoding issues. Aggregates
    across every matching location row, which matters for cities like Chicago
    where each real crime has its own unique location row."""
    locations = find_all_matching_locations(db, city)
    if not locations:
        raise HTTPException(status_code=404, detail=f"'{city}' is not in our database yet")

    location_ids = [loc.location_id for loc in locations]
    crimes = db.query(Crime).filter(Crime.location_id.in_(location_ids)).all()
    risk = calculate_risk_score(crimes)

    return SearchResult(
        query=city,
        latitude=locations[0].latitude,
        longitude=locations[0].longitude,
        matched_city=locations[0].city,
        matched_in_db=True,
        risk_score=risk["risk_score"],
        risk_level=risk["risk_level"],
        crime_count=risk["crime_count"],
        nearby_crimes=[
            NearbyCrime(
                crime_id=c.crime_id,
                crime_type=c.crime_type,
                severity=c.severity,
                date=str(c.date),
                time=str(c.time),
                description=c.description,
            )
            for c in crimes
        ],
    )