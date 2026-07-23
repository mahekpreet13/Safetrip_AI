import httpx

NOMINATIM_URL = "https://nominatim.openstreetmap.org/search"

# Nominatim's usage policy requires a descriptive User-Agent identifying the app,
# and recommends max 1 request/sec. Update the contact email below to a real one.
HEADERS = {
    "User-Agent": "SafeTripAI/1.0 (student project; contact: prrojectt1234@gmail.com)",
    "Accept-Language": "en",
    "Referer": "https://safetrip-ai.local",
}


async def geocode_location(query: str) -> dict | None:
    """Resolve a place name to real coordinates using OpenStreetMap Nominatim."""
    params = {"q": query, "format": "json", "limit": 1, "addressdetails": 1}

    async with httpx.AsyncClient(timeout=10.0, headers=HEADERS) as client:
        resp = await client.get(NOMINATIM_URL, params=params)
        resp.raise_for_status()
        results = resp.json()

    if not results:
        return None

    result = results[0]
    address = result.get("address", {})

    return {
        "latitude": float(result["lat"]),
        "longitude": float(result["lon"]),
        "display_name": result.get("display_name"),
        "city": address.get("city") or address.get("town") or address.get("village"),
        "state": address.get("state"),
        "country": address.get("country"),
    }