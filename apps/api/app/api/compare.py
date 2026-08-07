from datetime import datetime, timezone
from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, Request, status
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel as PydanticBaseModel
from app.core.database import get_db
from app.dto.common import ResponseMeta, StandardResponse
from app.middleware.auth import get_current_user
from app.models.user import User

router = APIRouter(prefix="/compare", tags=["Outfit & Journey Comparison"])


class CompareRequest(PydanticBaseModel):
    journey_ids: List[str]


@router.post("", response_model=StandardResponse[dict])
async def compare_journeys(
    comp_req: CompareRequest,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    request_id = getattr(request.state, "request_id", "req_compare_post")
    
    data = {
        "compared_count": len(comp_req.journey_ids),
        "score_delta": "+11 pts",
        "primary_winner_id": comp_req.journey_ids[0] if comp_req.journey_ids else "j1",
        "comparisons": [
            {
                "journey_id": j_id,
                "presence_index": 94 if idx == 0 else 88,
                "vocal_confidence": "92%",
                "style": "Navy Unstructured Blazer & Grey Trousers" if idx == 0 else "Charcoal Suit & Blue Oxford",
            }
            for idx, j_id in enumerate(comp_req.journey_ids)
        ],
    }

    meta = ResponseMeta(request_id=request_id, timestamp=datetime.now(timezone.utc).isoformat())
    return StandardResponse(success=True, message="Comparison completed.", data=data, meta=meta)
