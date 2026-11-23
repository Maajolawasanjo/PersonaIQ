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
    # Pydantic validator context can include raw Exception objects and sensitive
    # submitted values (such as passwords). Expose only safe serializable details.
    safe_errors = [
        {
            "field": ".".join(str(part) for part in issue.get("loc", [])),
            "message": str(issue.get("msg", "Invalid value.")),
            "type": str(issue.get("type", "validation_error")),
        }
        for issue in exc.errors()
    ]
    logger.warning("Validation Exception", errors=safe_errors)

    meta = ResponseMeta(request_id=request_id, timestamp=datetime.now(timezone.utc).isoformat())
    error_payload = ErrorResponse(
        success=False,
        error=ErrorDetail(
            code=ErrorCode.SYS_003.value,
            message="Request body validation failed.",
            details=safe_errors,
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
