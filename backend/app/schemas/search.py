from pydantic import BaseModel


class NearbyCrime(BaseModel):
    crime_id: int
    crime_type: str
    severity: str
    date: str
    time: str
    description: str | None = None


class SearchResult(BaseModel):
    query: str
    latitude: float
    longitude: float
    matched_city: str | None = None
    matched_in_db: bool
    risk_score: float
    risk_level: str
    crime_count: int
    nearby_crimes: list[NearbyCrime]
    data_source: str = "sample"  # flips to "official" once real crime data is imported