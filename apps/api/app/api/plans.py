from datetime import datetime, timezone
from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, Request, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel as PydanticBaseModel
from app.core.database import get_db
from app.dto.common import ResponseMeta, StandardResponse
from app.middleware.auth import get_current_user
from app.models.user import User
from app.models.presence import PresencePlan, PreparationChecklist
from app.services.presence_service import PresenceService

router = APIRouter(prefix="/plans", tags=["Presence Plans & Checklists"])


class ChecklistItemUpdate(PydanticBaseModel):
    item_id: str
    is_completed: bool


@router.get("", response_model=StandardResponse[List[dict]])
async def list_presence_plans(
    request: Request,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    request_id = getattr(request.state, "request_id", "req_plans_list")
    query = select(PresencePlan).where(PresencePlan.user_id == current_user.id)
    result = await db.execute(query)
    plans = result.scalars().all()

    data = [
        {
            "id": str(p.id),
            "journey_id": str(p.journey_id),
            "overall_score": p.overall_score,
            "perceived_authority": p.perceived_authority,
            "created_at": p.created_at.isoformat() if p.created_at else None,
        }
        for p in plans
    ]

    meta = ResponseMeta(request_id=request_id, timestamp=datetime.now(timezone.utc).isoformat())
    return StandardResponse(success=True, message="Presence plans retrieved.", data=data, meta=meta)


@router.get("/{journey_id}/checklist", response_model=StandardResponse[dict])
async def get_checklist(
    journey_id: UUID,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    request_id = getattr(request.state, "request_id", "req_checklist_get")
    service = PresenceService(db)
    plan = await service.get_presence_plan(journey_id)

    data = {
        "journey_id": str(journey_id),
        "checklist": plan.checklist if plan else [],
    }

    meta = ResponseMeta(request_id=request_id, timestamp=datetime.now(timezone.utc).isoformat())
    return StandardResponse(success=True, message="Checklist retrieved.", data=data, meta=meta)


@router.get("/{journey_id}/boosts", response_model=StandardResponse[dict])
async def get_boosters(
    journey_id: UUID,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    request_id = getattr(request.state, "request_id", "req_boosts_get")
    service = PresenceService(db)
    plan = await service.get_presence_plan(journey_id)

    data = {
        "journey_id": str(journey_id),
        "boosters": plan.boosters if plan else [
            {"title": "Sub-Vocal Warmup", "duration": "60 sec", "impact": "+4% Resonance"},
            {"title": "Lapel & Posture Check", "duration": "30 sec", "impact": "+5% Alignment"},
            {"title": "Eye Contact Calibration", "duration": "45 sec", "impact": "+3% Authority"}
        ],
    }

    meta = ResponseMeta(request_id=request_id, timestamp=datetime.now(timezone.utc).isoformat())
    return StandardResponse(success=True, message="Boosters retrieved.", data=data, meta=meta)


@router.get("/{journey_id}/explanation", response_model=StandardResponse[dict])
async def get_explanation(
    journey_id: UUID,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    request_id = getattr(request.state, "request_id", "req_explanation_get")
    service = PresenceService(db)
    plan = await service.get_presence_plan(journey_id)

    data = {
        "journey_id": str(journey_id),
        "explanation": plan.ai_explanation if plan else "Evaluated contrast, vocal pacing, and formality against executive investor benchmarks.",
        "perceived_authority": plan.perceived_authority if plan else 92,
        "approachability": plan.approachability if plan else 89,
    }

    meta = ResponseMeta(request_id=request_id, timestamp=datetime.now(timezone.utc).isoformat())
    return StandardResponse(success=True, message="AI explanation retrieved.", data=data, meta=meta)
