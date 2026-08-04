from fastapi import APIRouter, Depends, HTTPException

router = APIRouter(
    prefix="/api/v1/vto",
    tags=["vto"]
)

# TODO: Implement vto endpoints matching Document 06
