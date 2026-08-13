from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


# ai-service/.env
BASE_DIR = Path(__file__).resolve().parents[2]
ENV_FILE = BASE_DIR / ".env"


class Settings(BaseSettings):
    APP_NAME: str = "AI Engineer Platform AI Service"
    APP_VERSION: str = "1.0.0"

    GEMINI_API_KEY: str

    QDRANT_URL: str
    QDRANT_API_KEY: str

    model_config = SettingsConfigDict(
        env_file=str(ENV_FILE),
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()