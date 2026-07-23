from collections import Counter

SEVERITY_WEIGHTS = {"Low": 1, "Medium": 2, "High": 3}


def calculate_risk_score(crimes: list) -> dict:
    """Simple, transparent risk scoring: average severity weight + volume bump, capped at 100."""
    if not crimes:
        return {"risk_score": 0.0, "risk_level": "Low", "crime_count": 0}

    total_weight = sum(SEVERITY_WEIGHTS.get(c.severity, 1) for c in crimes)
    crime_count = len(crimes)
    avg_weight = total_weight / crime_count

    raw_score = (avg_weight / 3) * 100 + (crime_count * 2)
    score = round(min(raw_score, 100), 2)

    if score < 34:
        level = "Low"
    elif score < 67:
        level = "Medium"
    else:
        level = "High"

    return {"risk_score": score, "risk_level": level, "crime_count": crime_count}


def most_common_type(crimes: list) -> str | None:
    if not crimes:
        return None
    return Counter(c.crime_type for c in crimes).most_common(1)[0][0]


def peak_hour(crimes: list) -> int | None:
    if not crimes:
        return None
    return Counter(c.time.hour for c in crimes).most_common(1)[0][0]