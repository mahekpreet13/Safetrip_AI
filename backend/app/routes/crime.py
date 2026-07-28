from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.crime import Crime
from app.models.location import Location
from app.schemas.crime import CrimeSummary, CrimeTrends
from app.services.location_matching import find_all_matching_locations
from app.services.risk_engine import calculate_risk_score, most_common_type, peak_hour
from app.services.ai_summary import generate_ai_summary
from app.schemas.heatmap import HeatmapPoint

router = APIRouter(tags=["crime"])


def _get_locations_and_crimes(db: Session, city: str) -> tuple[list[Location], list[Crime]]:
    locations = find_all_matching_locations(db, city)
    if not locations:
        raise HTTPException(status_code=404, detail=f"No location found for city: {city}")

    location_ids = [loc.location_id for loc in locations]
    crimes = db.query(Crime).filter(Crime.location_id.in_(location_ids)).all()
    return locations, crimes


@router.get("/crime-summary", response_model=CrimeSummary)
def crime_summary(city: str = Query(...), db: Session = Depends(get_db)):
    locations, crimes = _get_locations_and_crimes(db, city)
    risk = calculate_risk_score(crimes)

    return CrimeSummary(
        city=locations[0].city,
        location_id=locations[0].location_id,
        crime_count=risk["crime_count"],
        most_common_crime=most_common_type(crimes),
        peak_hour=peak_hour(crimes),
        risk_score=risk["risk_score"],
        risk_level=risk["risk_level"],
    )


@router.get("/crime-trends", response_model=CrimeTrends)
def crime_trends(city: str = Query(...), db: Session = Depends(get_db)):
    locations, crimes = _get_locations_and_crimes(db, city)

    by_month: dict[str, int] = {}
    by_day: dict[str, int] = {}
    by_hour: dict[str, int] = {}
    by_category: dict[str, int] = {}

    for c in crimes:
        by_month[c.date.strftime("%Y-%m")] = by_month.get(c.date.strftime("%Y-%m"), 0) + 1
        by_day[c.date.strftime("%A")] = by_day.get(c.date.strftime("%A"), 0) + 1
        by_hour[str(c.time.hour)] = by_hour.get(str(c.time.hour), 0) + 1
        by_category[c.crime_type] = by_category.get(c.crime_type, 0) + 1

    return CrimeTrends(
        city=locations[0].city,
        location_id=locations[0].location_id,
        by_month=by_month,
        by_day_of_week=by_day,
        by_hour=by_hour,
        by_category=by_category,
    )
@router.get("/ai-summary")
def ai_summary(city: str = Query(...), db: Session = Depends(get_db)):
    locations, crimes = _get_locations_and_crimes(db, city)

    risk = calculate_risk_score(crimes)

    stats = {
        "crime_count": risk["crime_count"],
        "most_common_crime": most_common_type(crimes),
        "peak_hour": peak_hour(crimes),
        "risk_level": risk["risk_level"],
    }

    summary = generate_ai_summary(stats)

    return {
        "city": locations[0].city,
        "statistics": stats,
        "summary": summary,
    }
@router.get("/heatmap", response_model=list[HeatmapPoint])
def heatmap(city: str = Query(...), db: Session = Depends(get_db)):
    locations, crimes = _get_locations_and_crimes(db, city)

    # Count crimes at each location
    crime_count = {}

    for crime in crimes:
        crime_count[crime.location_id] = crime_count.get(crime.location_id, 0) + 1

    points = []

    for location in locations:
        points.append(
            HeatmapPoint(
                lat=location.latitude,
                lng=location.longitude,
                weight=crime_count.get(location.location_id, 0),
            )
        )

    return points