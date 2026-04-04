from pathlib import Path

from pydantic import computed_field
from pydantic_settings import BaseSettings, SettingsConfigDict


class AppSettings(BaseSettings):
    APP_NAME: str = "Aithena"
    APP_DESCRIPTION: str = "AI-powered business assistant backend"
    APP_VERSION: str = "0.1.0"
    ENVIRONMENT: str = "local"  # local | staging | production


class PostgresSettings(BaseSettings):
    POSTGRES_USER: str = "aithena"
    POSTGRES_PASSWORD: str = "aithena"
    POSTGRES_HOST: str = "localhost"
    POSTGRES_PORT: int = 5432
    POSTGRES_DB: str = "aithena"

    @computed_field  # type: ignore[prop-decorator]
    @property
    def postgres_async_url(self) -> str:
        return (
            f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}"
            f"@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
        )


class QdrantSettings(BaseSettings):
    QDRANT_HOST: str = "localhost"
    QDRANT_PORT: int = 6333
    QDRANT_COLLECTION: str = "aithena"


class OpenAISettings(BaseSettings):
    OPENAI_API_KEY: str = ""
    OPENAI_EMBEDDING_MODEL: str = "text-embedding-3-small"
    OPENAI_CHAT_MODEL: str = "gpt-4o"


class CORSSettings(BaseSettings):
    CORS_ORIGINS: list[str] = ["http://localhost:3000"]


class Settings(
    AppSettings,
    PostgresSettings,
    QdrantSettings,
    OpenAISettings,
    CORSSettings,
):
    model_config = SettingsConfigDict(
        env_file=Path(__file__).resolve().parents[2] / ".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )


settings = Settings()
