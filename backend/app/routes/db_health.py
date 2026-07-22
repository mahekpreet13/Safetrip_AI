from fastapi import APIRouter

router = APIRouter()


@router.get("/db")
def db_status() -> dict[str, str]:
    return {"message": "Database configuration ready"}

