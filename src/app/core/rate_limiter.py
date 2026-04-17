import time

from fastapi import Request


class RateLimitExceeded(Exception):
    def __init__(self, retry_after: int):
        self.retry_after = retry_after


class RateLimiter:
    """Fixed-window in-memory rate limiter."""

    def __init__(self, max_requests: int, window_seconds: int):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self._store: dict[str, tuple[int, float]] = {}

    def check(self, key: str) -> int | None:
        """Check rate limit for key. Returns retry_after seconds if limited, else None."""
        now = time.time()
        count, window_start = self._store.get(key, (0, now))

        if now - window_start >= self.window_seconds:
            # Window expired, reset
            self._store[key] = (1, now)
            return None

        if count >= self.max_requests:
            retry_after = int(self.window_seconds - (now - window_start)) + 1
            return retry_after

        self._store[key] = (count + 1, window_start)
        return None


_session_limiter = RateLimiter(max_requests=10, window_seconds=3600)
_chat_limiter = RateLimiter(max_requests=30, window_seconds=3600)
_contact_limiter = RateLimiter(max_requests=5, window_seconds=3600)


def _raise_if_limited(limiter: RateLimiter, key: str):
    retry_after = limiter.check(key)
    if retry_after is not None:
        raise RateLimitExceeded(retry_after)


async def rate_limit_session(request: Request):
    """Dependency: limit session creation by client IP."""
    ip = request.client.host if request.client else "unknown"
    _raise_if_limited(_session_limiter, ip)


def check_chat_rate_limit(session_id: str):
    """Check chat rate limit by session ID."""
    _raise_if_limited(_chat_limiter, session_id)


async def rate_limit_contact(request: Request):
    """Dependency: limit contact submissions by client IP."""
    ip = request.client.host if request.client else "unknown"
    _raise_if_limited(_contact_limiter, ip)
