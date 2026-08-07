import time
from collections import defaultdict
from fastapi import Request
from app.core.errors import AppException, ErrorCode


class RateLimiter:
    """In-memory sliding window rate limiter dependency per IP address."""

    def __init__(self, max_requests: int = 10, window_seconds: int = 60):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.requests = defaultdict(list)

    async def __call__(self, request: Request):
        client_ip = request.client.host if request.client else "unknown"
        now = time.time()

        # Clean old timestamps outside the window
        timestamps = [ts for ts in self.requests[client_ip] if now - ts < self.window_seconds]
        self.requests[client_ip] = timestamps

        if len(timestamps) >= self.max_requests:
            raise AppException(
                code=ErrorCode.AUTH_002,
                message=f"Too many requests from IP '{client_ip}'. Rate limit exceeded. Try again in {self.window_seconds} seconds.",
                status_code=429,
            )

        self.requests[client_ip].append(now)
