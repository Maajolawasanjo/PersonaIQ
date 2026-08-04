from fastapi import APIRouter, Depends, HTTPException

router = APIRouter(
    prefix="/api/v1/uploads",
    tags=["uploads"]
)

# TODO: Implement uploads endpoints matching Document 06
