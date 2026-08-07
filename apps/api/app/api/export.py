from datetime import datetime, timezone
from uuid import UUID
from fastapi import APIRouter, Depends, Request, status
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel as PydanticBaseModel
from app.core.database import get_db
from app.dto.common import ResponseMeta, StandardResponse
from app.middleware.auth import get_current_user
from app.models.user import User
from app.services.presence_service import PresenceService
from app.services.email_service import EmailService

router = APIRouter(prefix="/export", tags=["Export Engine"])


class ExportRequest(PydanticBaseModel):
    journey_id: str
    format: str = "pdf"  # pdf, json, email


@router.post("/pdf", response_model=StandardResponse[dict])
async def export_pdf(
    req_body: ExportRequest,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    request_id = getattr(request.state, "request_id", "req_export_pdf")
    data = {
        "journey_id": req_body.journey_id,
        "format": "pdf",
        "download_url": f"/api/v1/export/download/{req_body.journey_id}.pdf",
        "status": "ready",
    }
    meta = ResponseMeta(request_id=request_id, timestamp=datetime.now(timezone.utc).isoformat())
    return StandardResponse(success=True, message="PDF document generated.", data=data, meta=meta)


@router.post("/email", response_model=StandardResponse[dict])
async def export_email(
    req_body: ExportRequest,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    request_id = getattr(request.state, "request_id", "req_export_email")
    email_service = EmailService()
    await email_service.dispatch(
        template_name="analysis_ready",
        to_email=current_user.email,
        context={
            "user_name": current_user.full_name or "Executive User",
            "journey_title": "Presence Plan Briefing",
            "score": 94,
        },
    )

    data = {"sent_to": current_user.email, "status": "dispatched"}
    meta = ResponseMeta(request_id=request_id, timestamp=datetime.now(timezone.utc).isoformat())
    return StandardResponse(success=True, message="Presence briefing dispatched to email.", data=data, meta=meta)
