from pydantic import BaseModel


class CrimeSummary(BaseModel):
    city: str
    location_id: int
    crime_count: int
    most_common_crime: str | None
    peak_hour: int | None
    risk_score: float
    risk_level: str
    data_source: str = "sample"


class CrimeTrends(BaseModel):
    city: str
    location_id: int
    by_month: dict[str, int]
    by_day_of_week: dict[str, int]
    by_hour: dict[str, int]
    by_category: dict[str, int]
    data_source: str = "sample"