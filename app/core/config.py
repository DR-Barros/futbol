# app/core/config.py
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "My Football API"
    API_V1_STR: str = "/api/v1"

settings = Settings()
