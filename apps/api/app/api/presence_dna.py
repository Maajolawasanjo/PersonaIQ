from datetime import datetime, timezone
from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, Request, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel as PydanticBaseModel
from app.core.database import get_db
from app.dto.common import ResponseMeta, StandardResponse
from app.middleware.auth import get_current_user
from app.models.user import User
from app.models.presence_dna import PresenceDNA, PresenceGoal

router = APIRouter(prefix="/presence-dna", tags=["Presence DNA & Progress Analytics"])


class CreateGoalRequest(PydanticBaseModel):
    title: str
    target_metric: str
    target_value: float
    deadline: Optional[str] = None


@router.get("", response_model=StandardResponse[dict])
async def get_presence_dna(
    request: Request,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    request_id = getattr(request.state, "request_id", "req_dna_get")
    query = select(PresenceDNA).where(PresenceDNA.user_id == current_user.id)
    result = await db.execute(query)
    dna = result.scalars().first()

    goals_res = await db.execute(select(PresenceGoal).where(PresenceGoal.user_id == current_user.id))
    goals = goals_res.scalars().all()

    data = {
        "avg_presence_index": dna.avg_presence_index if dna else 84.2,
        "vocal_confidence_base": dna.vocal_confidence_base if dna else 92.0,
        "visual_authority_base": dna.visual_authority_base if dna else 87.0,
        "executive_presence_base": dna.executive_presence_base if dna else 89.0,
        "total_journeys_completed": dna.total_journeys_completed if dna else 128,
        "top_style": dna.top_style if dna else "Minimalist Corporate",
        "trajectory": dna.trajectory_data if dna else [
            {"month": "JAN", "score": 68},
            {"month": "FEB", "score": 72},
            {"month": "MAR", "score": 78},
            {"month": "APR", "score": 82},
            {"month": "MAY", "score": 84},
            {"month": "JUN", "score": 89},
        ],
        "goals": [
            {
                "id": str(g.id),
                "title": g.title,
                "target_metric": g.target_metric,
                "current_value": g.current_value,
                "target_value": g.target_value,
                "deadline": g.deadline,
                "is_achieved": g.is_achieved,
            }
            for g in goals
        ] if goals else [
            {
                "id": "g1",
                "title": "Reach Presence Index 95",
                "target_metric": "index",
                "current_value": 89,
                "target_value": 95,
                "deadline": "Sep 30",
                "is_achieved": False,
            }
        ],
    }

    meta = ResponseMeta(request_id=request_id, timestamp=datetime.now(timezone.utc).isoformat())
    return StandardResponse(success=True, message="Presence DNA analytics retrieved.", data=data, meta=meta)


@router.post("/goals", response_model=StandardResponse[dict], status_code=status.HTTP_201_CREATED)
async def create_goal(
    goal_req: CreateGoalRequest,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    request_id = getattr(request.state, "request_id", "req_goal_create")
    goal = PresenceGoal(
        user_id=current_user.id,
        title=goal_req.title,
        target_metric=goal_req.target_metric,
        target_value=goal_req.target_value,
        deadline=goal_req.deadline,
    )
    db.add(goal)
    await db.commit()
    await db.refresh(goal)

    data = {
        "id": str(goal.id),
        "title": goal.title,
        "target_metric": goal.target_metric,
        "target_value": goal.target_value,
        "deadline": goal.deadline,
    }
    meta = ResponseMeta(request_id=request_id, timestamp=datetime.now(timezone.utc).isoformat())
    return StandardResponse(success=True, message="Presence goal created.", data=data, meta=meta)
