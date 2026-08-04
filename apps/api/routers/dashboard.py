from fastapi import APIRouter, Depends, HTTPException

router = APIRouter(
    prefix="/api/v1/dashboard",
    tags=["dashboard"]
)

# TODO: Implement dashboard endpoints matching Document 06
