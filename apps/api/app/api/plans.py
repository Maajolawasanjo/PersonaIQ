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
from app.models.journey import Journey
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
    query = select(PresencePlan).join(Journey).where(Journey.user_id == current_user.id)
    result = await db.execute(query)
    plans = result.scalars().all()

    data = [
        {
            "id": str(p.id),
            "journey_id": str(p.journey_id),
            "overall_presence_index": p.overall_presence_index,
            "executive_vibe_score": p.executive_vibe_score,
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
    try:
        plan = await service.get_presence_plan(journey_id, current_user.id)
    except Exception:
        plan = None

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
    # Historical fixed percentages and voice / authority claims were
    # illustrative, not generated from a user's verified assessment.
    from app.core.errors import AppException, ErrorCode
    raise AppException(
        code=ErrorCode.AI_002,
        message="Verified preparation boosts are not available yet.",
        status_code=503,
    )


@router.get("/{journey_id}/explanation", response_model=StandardResponse[dict])
async def get_explanation(
    journey_id: UUID,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = PresenceService(db)
    plan = await service.get_presence_plan(journey_id, current_user.id)
    if not plan or not plan.summary_narrative:
        raise HTTPException(status_code=404, detail="No verified explanation was saved for this journey.")

    meta = ResponseMeta(
        request_id=getattr(request.state, "request_id", "req_explanation"),
        timestamp=datetime.now(timezone.utc).isoformat(),
    )
    return StandardResponse(
        success=True,
        message="Saved explanation retrieved.",
        data={
            "journey_id": str(journey_id),
            "explanation": plan.summary_narrative,
            "confidence_score": plan.confidence_score,
        },
        meta=meta,
    )
