"""
Import a batch of REAL crime data from the City of Chicago's public open data portal
(Socrata API, no key required) into the SafeTrip AI database.

Source: https://data.cityofchicago.org/Public-Safety/Crimes-2001-to-Present/ijzp-q8t2
This is real, government-published crime data extracted from the Chicago Police
Department's CLEAR system. Addresses are shown at block level only (not exact),
to protect victim privacy — that's the source's own privacy safeguard, not
something we added.

Usage (from the backend/ folder, with venv active):
    python scripts/import_chicago_crime.py
"""

import sys
from datetime import datetime
from pathlib import Path

import httpx

sys.path.append(str(Path(__file__).resolve().parent.parent / "backend"))

from app.core.database import SessionLocal
from app.models.crime import Crime
from app.models.location import Location

SOCRATA_URL = "https://data.cityofchicago.org/resource/ijzp-q8t2.json"
ROW_LIMIT = 500  # small, fast import for now; raise later if needed

HIGH_SEVERITY_TYPES = {
    "HOMICIDE", "ROBBERY", "CRIM SEXUAL ASSAULT", "ASSAULT", "BATTERY",
    "KIDNAPPING", "ARSON",
}
MEDIUM_SEVERITY_TYPES = {
    "BURGLARY", "THEFT", "MOTOR VEHICLE THEFT", "WEAPONS VIOLATION",
    "CRIMINAL SEXUAL ABUSE", "STALKING",
}


def infer_severity(crime_type: str) -> str:
    """Chicago's dataset has no severity field, so we derive one using a
    transparent, documented rule based on crime category."""
    crime_type = (crime_type or "").upper()
    if crime_type in HIGH_SEVERITY_TYPES:
        return "High"
    if crime_type in MEDIUM_SEVERITY_TYPES:
        return "Medium"
    return "Low"


def fetch_chicago_crimes(limit: int) -> list[dict]:
    params = {
        "$limit": limit,
        "$where": "latitude IS NOT NULL AND longitude IS NOT NULL",
        "$order": "date DESC",
    }
    with httpx.Client(timeout=30.0) as client:
        resp = client.get(SOCRATA_URL, params=params)
        resp.raise_for_status()
        return resp.json()


def import_crimes():
    print(f"Fetching up to {ROW_LIMIT} real crime records from Chicago's open data portal...")
    try:
        rows = fetch_chicago_crimes(ROW_LIMIT)
    except httpx.HTTPError as e:
        print(f"Failed to fetch data — check your internet connection. Error: {e}")
        return

    print(f"Fetched {len(rows)} records. Importing into database...")

    db = SessionLocal()
    imported = 0
    skipped = 0

    try:
        for row in rows:
            try:
                lat = float(row["latitude"])
                lon = float(row["longitude"])
                date_str = row.get("date")
                crime_type = row.get("primary_type", "Unknown")
                description = row.get("description", "")
                block = row.get("block", "Chicago, IL")

                if not date_str:
                    skipped += 1
                    continue

                dt = datetime.strptime(date_str, "%Y-%m-%dT%H:%M:%S.%f")

                location = Location(
                    latitude=lat,
                    longitude=lon,
                    address=block,
                    city="Chicago",
                    state="Illinois",
                    country="USA",
                )
                db.add(location)
                db.flush()  # assigns location.location_id without committing yet

                crime = Crime(
                    crime_type=crime_type.title(),
                    date=dt.date(),
                    time=dt.time(),
                    severity=infer_severity(crime_type),
                    description=(description[:500] if description else None),
                    location_id=location.location_id,
                )
                db.add(crime)
                imported += 1

            except (KeyError, ValueError, TypeError):
                skipped += 1
                continue

        db.commit()
        print(f"Done. Imported {imported} real crime records, skipped {skipped} incomplete rows.")

    except Exception as e:
        db.rollback()
        print(f"Import failed — all changes rolled back safely, nothing left half-done. Error: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    import_crimes()