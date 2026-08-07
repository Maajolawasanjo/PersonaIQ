from datetime import datetime, timezone
from typing import Optional, Any, Dict
from fastapi import Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

class PersonaIQException(Exception):
    """Base exception for all domain & application exceptions."""
    def __init__(
        self,
        code: str,
        title: str,
        message: str,
        status_code: int = status.HTTP_400_BAD_REQUEST,
        recoverable: bool = True,
        next_action: Optional[str] = None
    ):
        self.code = code
        self.title = title
        self.message = message
        self.status_code = status_code
        self.recoverable = recoverable
        self.next_action = next_action
        super().__init__(message)


def format_error_response(
    code: str,
    title: str,
    message: str,
    status_code: int,
    request: Request,
    recoverable: bool = True,
    next_action: Optional[str] = None
) -> JSONResponse:
    trace_id = getattr(request.state, "request_id", "req_unknown")
    timestamp = datetime.now(timezone.utc).isoformat()

    content: Dict[str, Any] = {
        "success": False,
        "error": {
            "code": code,
            "title": title,
            "message": message,
            "recoverable": recoverable,
            "nextAction": next_action or "Please check input and try again."
        },
        "traceId": trace_id,
        "timestamp": timestamp
    }
    return JSONResponse(status_code=status_code, content=content)


async def personaiq_exception_handler(request: Request, exc: PersonaIQException) -> JSONResponse:
    return format_error_response(
        code=exc.code,
        title=exc.title,
        message=exc.message,
        status_code=exc.status_code,
        request=request,
        recoverable=exc.recoverable,
        next_action=exc.next_action
    )


async def http_exception_handler(request: Request, exc: StarletteHTTPException) -> JSONResponse:
    return format_error_response(
        code=f"HTTP_{exc.status_code}",
        title="HTTP Error",
        message=str(exc.detail),
        status_code=exc.status_code,
        request=request,
        recoverable=exc.status_code < 500,
        next_action="Review request details."
    )


async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    errors = exc.errors()
    first_msg = errors[0]["msg"] if errors else "Validation failed"
    first_loc = " -> ".join([str(loc) for loc in errors[0].get("loc", [])]) if errors else ""
    full_message = f"{first_loc}: {first_msg}" if first_loc else first_msg

    return format_error_response(
        code="VALIDATION_ERROR",
        title="Invalid Request Data",
        message=full_message,
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        request=request,
        recoverable=True,
        next_action="Correct payload formatting."
    )
