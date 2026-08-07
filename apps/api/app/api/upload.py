from datetime import datetime, timezone
from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, File, Form, Request, UploadFile, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.errors import AppException, ErrorCode
from app.dto.common import ResponseMeta, StandardResponse
from app.dto.upload import OutfitUploadDTO, OutfitUploadListDTO, SelfieUploadDTO
from app.middleware.auth import get_current_user
from app.models.user import User
from app.repositories.journey_repository import JourneyRepository
from app.repositories.upload_repository import UploadRepository
from app.services.storage_service import StorageService

router = APIRouter(prefix="/uploads", tags=["Media Uploads"])


@router.post(
    "/selfie",
    response_model=StandardResponse[SelfieUploadDTO],
    status_code=status.HTTP_201_CREATED,
    summary="Upload User Selfie for Skin AI Normalization",
)
async def upload_selfie(
    request: Request,
    journey_id: UUID = Form(...),
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    request_id = getattr(request.state, "request_id", "req_upload_selfie")
    correlation_id = getattr(request.state, "correlation_id", None)

    # 1. Verify Journey Ownership
    journey_repo = JourneyRepository(db)
    journey = await journey_repo.get_by_id(journey_id, current_user.id)
    if not journey:
        raise AppException(
            code=ErrorCode.JOURNEY_001,
            message="Journey not found or access denied.",
            status_code=404,
        )

    # 2. Storage Service Validation & Persistence
    storage_service = StorageService()
    storage_url, file_size, mime_type = await storage_service.validate_and_save(
        file=file,
        folder="selfies",
        user_id=str(current_user.id),
        journey_id=str(journey_id),
    )

    # 3. Create Upload Record & Log Event
    upload_repo = UploadRepository(db)
    selfie_record = await upload_repo.create_selfie_upload(
        journey=journey,
        storage_url=storage_url,
        file_name=file.filename,
        file_size_bytes=file_size,
        mime_type=mime_type,
        correlation_id=correlation_id,
    )

    meta = ResponseMeta(
        request_id=request_id, timestamp=datetime.now(timezone.utc).isoformat()
    )
    return StandardResponse(
        success=True,
        message="Selfie uploaded successfully.",
        data=SelfieUploadDTO.model_validate(selfie_record),
        meta=meta,
    )


@router.post(
    "/outfits",
    response_model=StandardResponse[OutfitUploadListDTO],
    status_code=status.HTTP_201_CREATED,
    summary="Upload Outfit Options for Virtual Try-On",
)
async def upload_outfits(
    request: Request,
    journey_id: UUID = Form(...),
    files: List[UploadFile] = File(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    request_id = getattr(request.state, "request_id", "req_upload_outfits")
    correlation_id = getattr(request.state, "correlation_id", None)

    if not files or len(files) == 0:
        raise AppException(
            code=ErrorCode.UPLOAD_001,
            message="At least one outfit image file must be uploaded.",
            status_code=400,
        )

    if len(files) > 5:
        raise AppException(
            code=ErrorCode.UPLOAD_002,
            message="Maximum of 5 outfit images allowed per journey.",
            status_code=400,
        )

    # 1. Verify Journey Ownership
    journey_repo = JourneyRepository(db)
    journey = await journey_repo.get_by_id(journey_id, current_user.id)
    if not journey:
        raise AppException(
            code=ErrorCode.JOURNEY_001,
            message="Journey not found or access denied.",
            status_code=404,
        )

    storage_service = StorageService()
    upload_repo = UploadRepository(db)
    outfit_records: List[OutfitUploadDTO] = []

    # 2. Process Each Outfit Image
    for idx, file in enumerate(files):
        storage_url, file_size, mime_type = await storage_service.validate_and_save(
            file=file,
            folder="outfits",
            user_id=str(current_user.id),
            journey_id=str(journey_id),
        )

        outfit = await upload_repo.create_outfit_upload(
            journey=journey,
            storage_url=storage_url,
            name=file.filename or f"Outfit #{idx + 1}",
            category=None,
            display_order=idx + 1,
            file_size_bytes=file_size,
            mime_type=mime_type,
            correlation_id=correlation_id,
        )
        outfit_records.append(OutfitUploadDTO.model_validate(outfit))

    meta = ResponseMeta(
        request_id=request_id, timestamp=datetime.now(timezone.utc).isoformat()
    )
    return StandardResponse(
        success=True,
        message=f"{len(outfit_records)} outfit image(s) uploaded successfully.",
        data=OutfitUploadListDTO(outfits=outfit_records),
        meta=meta,
    )
