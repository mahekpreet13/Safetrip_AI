from math import radians, sin, cos, sqrt, atan2


def calculate_distance_km(
    lat1: float,
    lon1: float,
    lat2: float,
    lon2: float,
) -> float:
    """Calculate straight-line distance between two coordinates."""

    earth_radius_km = 6371.0

    lat1_rad = radians(lat1)
    lat2_rad = radians(lat2)

    delta_lat = radians(lat2 - lat1)
    delta_lon = radians(lon2 - lon1)

    a = (
        sin(delta_lat / 2) ** 2
        + cos(lat1_rad)
        * cos(lat2_rad)
        * sin(delta_lon / 2) ** 2
    )

    c = 2 * atan2(sqrt(a), sqrt(1 - a))

    return round(earth_radius_km * c, 2)

def build_direct_route(
    start_lat: float,
    start_lon: float,
    destination_lat: float,
    destination_lon: float,
) -> dict:
    """Build a basic direct route between two coordinates."""

    distance = calculate_distance_km(
        start_lat,
        start_lon,
        destination_lat,
        destination_lon,
    )

    return {
        "distance_km": distance,
        "points": [
            {
                "latitude": start_lat,
                "longitude": start_lon,
            },
            {
                "latitude": destination_lat,
                "longitude": destination_lon,
            },
        ],
    }

def distance_to_route(
    point_lat: float,
    point_lon: float,
    route_points: list[dict],
) -> float:
    """
    Find the minimum distance from a point to any point
    on the route.

    For our first implementation, the route consists of
    the start and destination points.
    """

    distances = []

    for route_point in route_points:
        distance = calculate_distance_km(
            point_lat,
            point_lon,
            route_point["latitude"],
            route_point["longitude"],
        )
        distances.append(distance)

    return min(distances)


def find_nearby_crimes(
    crimes: list,
    route_points: list[dict],
    radius_km: float = 50.0,
) -> list:
    """
    Return crimes located within radius_km of the route.
    """

    nearby_crimes = []

    for crime in crimes:
        if crime.location is None:
            continue

        distance = distance_to_route(
            crime.location.latitude,
            crime.location.longitude,
            route_points,
        )

        if distance <= radius_km:
            nearby_crimes.append(crime)

    return nearby_crimes

from app.services.risk_engine import calculate_risk_score


def calculate_route_risk(crimes: list) -> dict:
    """Calculate risk for a route using the existing risk engine."""

    return calculate_risk_score(crimes)

def build_waypoint_route(
    start_lat: float,
    start_lon: float,
    waypoint_lat: float,
    waypoint_lon: float,
    destination_lat: float,
    destination_lon: float,
) -> dict:
    """Build a route through an intermediate waypoint."""

    first_leg = calculate_distance_km(
        start_lat,
        start_lon,
        waypoint_lat,
        waypoint_lon,
    )

    second_leg = calculate_distance_km(
        waypoint_lat,
        waypoint_lon,
        destination_lat,
        destination_lon,
    )

    return {
        "distance_km": round(first_leg + second_leg, 2),
        "points": [
            {
                "latitude": start_lat,
                "longitude": start_lon,
            },
            {
                "latitude": waypoint_lat,
                "longitude": waypoint_lon,
            },
            {
                "latitude": destination_lat,
                "longitude": destination_lon,
            },
        ],
    }

def choose_safer_route(
    fast_route: dict,
    fast_risk: dict,
    candidate_routes: list[dict],
) -> dict:
    """
    Compare the fast route with candidate routes and return
    the route with the lowest risk score.
    """

    best_route = fast_route
    best_risk = fast_risk

    for candidate in candidate_routes:
        if candidate["risk"]["risk_score"] < best_risk["risk_score"]:
            best_route = candidate["route"]
            best_risk = candidate["risk"]

    risk_difference = round(
        fast_risk["risk_score"] - best_risk["risk_score"],
        2,
    )

    return {
        "safe_route": best_route,
        "safe_risk": best_risk,
        "risk_difference": risk_difference,
    }

def calculate_station_distance(
    user_lat: float,
    user_lon: float,
    station_lat: float,
    station_lon: float,
) -> float:
    """Calculate distance from a user location to a police station."""

    return calculate_distance_km(
        user_lat,
        user_lon,
        station_lat,
        station_lon,
    )