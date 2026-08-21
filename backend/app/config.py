"""
Application settings, loaded from environment variables (and a local `.env`
file if present) via pydantic-settings. See `.env.example` for the full list.
"""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # SQLAlchemy connection string. Kept generic (no SQLite-specific code
    # outside this default) so switching to Postgres later is just an
    # environment variable change - see the note in the repo's backend prompt.
    database_url: str = "sqlite:///./connections.db"

    # Origins allowed to call this API from a browser, comma-separated.
    cors_origins: str = "http://localhost:5173"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    @property
    def cors_origins_list(self) -> list[str]:
        """Split the comma-separated CORS_ORIGINS setting into a list."""
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


# A single shared Settings instance, imported wherever config is needed.
settings = Settings()
