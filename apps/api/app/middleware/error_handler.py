from datetime import datetime, timezone
import structlog
from fastapi import Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from app.core.errors import AppException, ErrorCode
from app.dto.common import ErrorDetail, ErrorResponse, ResponseMeta

logger = structlog.get_logger()


async def app_exception_handler(request: Request, exc: AppException) -> JSONResponse:
    request_id = getattr(request.state, "request_id", "req_unknown")
    logger.warning("Application Exception", code=exc.code.value, message=exc.message, status_code=exc.status_code)

    meta = ResponseMeta(request_id=request_id, timestamp=datetime.now(timezone.utc).isoformat())
    error_payload = ErrorResponse(
        success=False,
        error=ErrorDetail(code=exc.code.value, message=exc.message, details=exc.details),
        meta=meta,
    )
    return JSONResponse(status_code=exc.status_code, content=error_payload.model_dump())


async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    request_id = getattr(request.state, "request_id", "req_unknown")
    logger.warning("Validation Exception", errors=exc.errors())

    meta = ResponseMeta(request_id=request_id, timestamp=datetime.now(timezone.utc).isoformat())
    error_payload = ErrorResponse(
        success=False,
        error=ErrorDetail(
            code=ErrorCode.SYS_003.value,
            message="Request body validation failed.",
            details=exc.errors(),
        ),
        meta=meta,
    )
    return JSONResponse(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, content=error_payload.model_dump())


async def unhandled_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    request_id = getattr(request.state, "request_id", "req_unknown")
    logger.error("Unhandled Internal System Exception", error=str(exc), exc_info=True)

    meta = ResponseMeta(request_id=request_id, timestamp=datetime.now(timezone.utc).isoformat())
    error_payload = ErrorResponse(
        success=False,
        error=ErrorDetail(
            code=ErrorCode.SYS_001.value,
            message="An unexpected internal server error occurred.",
            details=None,
        ),
        meta=meta,
    )
    return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content=error_payload.model_dump())
