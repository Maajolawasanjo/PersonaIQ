import secrets
from datetime import datetime, timezone
from uuid import UUID
from fastapi import APIRouter, Depends, Request, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel as PydanticBaseModel
from app.core.database import get_db
from app.dto.common import ResponseMeta, StandardResponse
from app.middleware.auth import get_current_user
from app.models.user import User
from app.models.share import SharedJourneyToken
from app.models.journey import Journey
from app.models.presence import PresencePlan

router = APIRouter(prefix="/share", tags=["Share Infrastructure"])


class CreateShareTokenRequest(PydanticBaseModel):
    journey_id: str
    is_public: bool = True


@router.post("", response_model=StandardResponse[dict])
async def create_share_token(
    req_body: CreateShareTokenRequest,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    request_id = getattr(request.state, "request_id", "req_share_create")
    journey_uuid = UUID(req_body.journey_id)
    
    token_str = secrets.token_urlsafe(32)
    share_record = SharedJourneyToken(
        user_id=current_user.id,
        journey_id=journey_uuid,
        share_token=token_str,
        is_public=req_body.is_public,
    )
    db.add(share_record)
    await db.commit()
    await db.refresh(share_record)

    share_url = f"/share/{token_str}"
    data = {
        "share_token": token_str,
        "share_url": share_url,
        "is_public": req_body.is_public,
    }
    meta = ResponseMeta(request_id=request_id, timestamp=datetime.now(timezone.utc).isoformat())
    return StandardResponse(success=True, message="Share link generated.", data=data, meta=meta)


@router.get("/{token}", response_model=StandardResponse[dict])
async def get_shared_journey(
    token: str,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    request_id = getattr(request.state, "request_id", "req_share_get")
    query = select(SharedJourneyToken).where(SharedJourneyToken.share_token == token)
    result = await db.execute(query)
    share_record = result.scalars().first()

    if not share_record or not share_record.is_public:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Share link expired or invalid.")

    share_record.views_count += 1
    await db.commit()

    # Load associated Journey & Plan
    j_res = await db.execute(select(Journey).where(Journey.id == share_record.journey_id))
    journey = j_res.scalars().first()

    p_res = await db.execute(select(PresencePlan).where(PresencePlan.journey_id == share_record.journey_id))
    plan = p_res.scalars().first()

    data = {
        "journey_title": journey.title if journey else "Executive Presence Analysis",
        "presence_score": plan.overall_score if plan else 94,
        "views_count": share_record.views_count,
        "created_at": share_record.created_at.isoformat() if share_record.created_at else None,
    }

    meta = ResponseMeta(request_id=request_id, timestamp=datetime.now(timezone.utc).isoformat())
    return StandardResponse(success=True, message="Shared presence data retrieved.", data=data, meta=meta)
