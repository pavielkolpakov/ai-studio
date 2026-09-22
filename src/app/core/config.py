from pathlib import Path

from dotenv import load_dotenv
from pydantic import computed_field
from pydantic_settings import BaseSettings, SettingsConfigDict

ENV_FILE = Path(__file__).resolve().parents[2] / ".env"
# LangSmith reads process environment variables, not Pydantic settings.
load_dotenv(ENV_FILE, override=False)


class AppSettings(BaseSettings):
    APP_NAME: str = "Neuronetis"
    APP_DESCRIPTION: str = "AI-powered business assistant backend"
    APP_VERSION: str = "0.1.0"
    ENVIRONMENT: str = "local"  # local | staging | production


class PostgresSettings(BaseSettings):
    DATABASE_URL: str = ""
    POSTGRES_USER: str = "neuronetis"
    POSTGRES_PASSWORD: str = "neuronetis"
    POSTGRES_HOST: str = "localhost"
    POSTGRES_PORT: int = 5432
    POSTGRES_DB: str = "neuronetis"

    @computed_field  # type: ignore[prop-decorator]
    @property
    def postgres_async_url(self) -> str:
        if self.DATABASE_URL:
            url = self.DATABASE_URL
            if url.startswith("postgresql://"):
                url = url.replace("postgresql://", "postgresql+asyncpg://", 1)
            return url
        return (
            f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}"
            f"@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
        )


class OpenAISettings(BaseSettings):
    OPENAI_API_KEY: str = ""
    OPENAI_CHAT_MODEL: str = "gpt-4o"


class TypeSafeSettings(BaseSettings):
    TYPESAFE_API_KEY: str = ""
    TYPESAFE_MODEL: str = "jev-latest"


class ResendSettings(BaseSettings):
    RESEND_API_KEY: str = ""
    CONTACT_TO_EMAIL: str = "paviel@neuronetis.com"


class CORSSettings(BaseSettings):
    CORS_ORIGINS: list[str] = ["http://localhost:3000"]


class Settings(
    AppSettings,
    PostgresSettings,
    OpenAISettings,
    TypeSafeSettings,
    ResendSettings,
    CORSSettings,
):
    model_config = SettingsConfigDict(
        env_file=ENV_FILE,
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )


settings = Settings()
