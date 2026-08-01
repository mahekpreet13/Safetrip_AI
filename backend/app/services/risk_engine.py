from collections import Counter


SEVERITY_WEIGHTS = {"Low": 1, "Medium": 2, "High": 3}


def calculate_risk_score(crimes: list) -> dict:
    """Risk scoring based on both severity and volume, calibrated so that
    a handful of crimes doesn't automatically read as 'High' risk the same
    way a large real dataset would."""
    if not crimes:
        return {"risk_score": 0.0, "risk_level": "Low", "crime_count": 0}

    total_weight = sum(SEVERITY_WEIGHTS.get(c.severity, 1) for c in crimes)
    crime_count = len(crimes)
    avg_weight = total_weight / crime_count

    # Severity contributes up to 60 points, volume contributes the rest —
    # volume is scaled with a soft cap so very large datasets (e.g. Chicago's
    # 500 records) don't all pin at 100, and very small datasets (e.g. 2-5
    # sample records) don't spike to "High" purely from having any
    # medium/high-severity crime at all.
    severity_component = (avg_weight / 3) * 60
    volume_component = min(crime_count, 50) / 50 * 40

    score = round(severity_component + volume_component, 2)
    score = min(score, 100.0)

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

