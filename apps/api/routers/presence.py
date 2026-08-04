from fastapi import APIRouter, Depends, HTTPException

router = APIRouter(
    prefix="/api/v1/presence",
    tags=["presence"]
)

# TODO: Implement presence endpoints matching Document 06
