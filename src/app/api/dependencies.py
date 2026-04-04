from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db.database import local_session


async def async_get_db() -> AsyncGenerator[AsyncSession]:
    async with local_session() as session:
        yield session
