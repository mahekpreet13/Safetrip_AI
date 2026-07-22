from sqlalchemy.orm import Session

from app.models.location import Location


def find_matching_location(db: Session, query: str, geo_city: str | None) -> Location | None:
    """Find a single representative location for a city (used when we just need
    one set of coordinates, e.g. a quick lookup). Tries the geocoded city first,
    then falls back to the raw query text, matching against both city and
    address columns to survive naming mismatches like Nominatim's 'Delhi' vs
    our seed data's 'New Delhi'."""
    candidates = [c for c in (geo_city, query) if c]

    for candidate in candidates:
        location = (
            db.query(Location)
            .filter(
                (Location.city.ilike(f"%{candidate}%"))
                | (Location.address.ilike(f"%{candidate}%"))
            )
            .first()
        )
        if location:
            return location
    return None


def find_all_matching_locations(db: Session, city: str) -> list[Location]:
    """Find ALL location rows matching a city name. Needed for cities like
    Chicago where each real imported crime has its own unique location row
    (real lat/lng per incident), rather than one shared location per city
    like our original sample data (Delhi, Mumbai, Bengaluru)."""
    return (
        db.query(Location)
        .filter(
            (Location.city.ilike(f"%{city}%"))
            | (Location.address.ilike(f"%{city}%"))
        )
        .all()
    )