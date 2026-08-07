from datetime import datetime, timezone
from fastapi import APIRouter, Depends, Request, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.dto.common import ResponseMeta, StandardResponse
from app.dto.dashboard import DashboardOverviewDTO
from app.middleware.auth import get_current_user
from app.models.user import User
from app.services.dashboard_service import DashboardService

router = APIRouter(prefix="/dashboard", tags=["Dashboard & Analytics"])


@router.get(
    "",
    response_model=StandardResponse[DashboardOverviewDTO],
    status_code=status.HTTP_200_OK,
    summary="Get User Dashboard Overview & Analytics",
)
async def get_dashboard(
    request: Request,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    request_id = getattr(request.state, "request_id", "req_dashboard")
    service = DashboardService(db)
    overview = await service.get_dashboard_overview(current_user.id)

    meta = ResponseMeta(
        request_id=request_id, timestamp=datetime.now(timezone.utc).isoformat()
    )
    return StandardResponse(
        success=True,
        message="Dashboard overview retrieved.",
        data=overview,
        meta=meta,
    )
