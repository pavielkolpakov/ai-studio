from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager

from fastapi import APIRouter, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import Settings
from app.core.rate_limiter import RateLimitExceeded
from app.middleware.logger_middleware import LoggerMiddleware


def lifespan_factory(
    settings: Settings,
):
    @asynccontextmanager
    async def lifespan(app: FastAPI) -> AsyncGenerator[None]:
        # Startup
        yield
        # Shutdown
        from app.core.db.database import async_engine

        await async_engine.dispose()

    return lifespan


def create_application(
    router: APIRouter,
    settings: Settings,
    **kwargs,
) -> FastAPI:
    kwargs.setdefault("title", settings.APP_NAME)
    kwargs.setdefault("description", settings.APP_DESCRIPTION)
    kwargs.setdefault("version", settings.APP_VERSION)

    if settings.ENVIRONMENT == "production":
        kwargs.update(docs_url=None, redoc_url=None, openapi_url=None)

    app = FastAPI(lifespan=lifespan_factory(settings), **kwargs)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    app.add_middleware(LoggerMiddleware)

    app.include_router(router)

    @app.exception_handler(RateLimitExceeded)
    async def rate_limit_handler(request, exc: RateLimitExceeded):
        return JSONResponse(
            status_code=429,
            content={"detail": "Rate limit exceeded", "retry_after": exc.retry_after},
            headers={"Retry-After": str(exc.retry_after)},
        )

    return app
