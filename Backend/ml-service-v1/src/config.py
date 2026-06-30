"""Centralised, environment-driven configuration.

Everything that might differ between local / Docker / production is read from
environment variables here, so the rest of the code never hardcodes paths,
ports, or tunables.
"""
import os
from functools import lru_cache

from dotenv import load_dotenv

# Load variables from a local .env file (no-op if the file is absent).
load_dotenv()


class Settings:
    def __init__(self) -> None:
        # ml-service-v1/ (the directory that contains this `src` package)
        self.base_dir: str = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

        # Paths (overridable so Docker can mount data/artifacts on a volume).
        self.data_dir: str = os.getenv("DATA_DIR", os.path.join(self.base_dir, "data"))
        self.artifacts_dir: str = os.getenv(
            "ARTIFACTS_DIR", os.path.join(self.data_dir, "artifacts")
        )
        # Kept for optional offline/CSV fallback; primary source is Supabase.
        self.cleaned_csv: str = os.getenv(
            "CLEANED_CSV", os.path.join(self.data_dir, "postings_cleaned.csv")
        )

        # Supabase: source of truth for job data (table with title, description).
        self.supabase_url: str = os.getenv("SUPABASE_URL", "")
        self.supabase_key: str = os.getenv("SUPABASE_KEY", "")
        self.supabase_table: str = os.getenv("SUPABASE_TABLE", "postings_cleaned")
        self.supabase_page_size: int = int(os.getenv("SUPABASE_PAGE_SIZE", "1000"))

        # Model tunables.
        self.max_features: int = int(os.getenv("TFIDF_MAX_FEATURES", "5000"))
        self.default_top_n: int = int(os.getenv("RECOMMEND_TOP_N", "5"))

        # If True, the API will build artifacts from the CSV on startup when they
        # are missing. In production you usually pre-build them, so default False.
        self.build_on_startup: bool = os.getenv("BUILD_ON_STARTUP", "false").lower() == "true"

        # CORS: comma-separated list of allowed origins.
        raw_origins = os.getenv("CORS_ORIGINS", "*")
        self.cors_origins: list[str] = [o.strip() for o in raw_origins.split(",") if o.strip()]

    # Convenience accessors for individual artifact files.
    @property
    def vectorizer_path(self) -> str:
        return os.path.join(self.artifacts_dir, "vectorizer.joblib")

    @property
    def job_vectors_path(self) -> str:
        return os.path.join(self.artifacts_dir, "job_vectors.joblib")

    @property
    def titles_path(self) -> str:
        return os.path.join(self.artifacts_dir, "titles.joblib")

    def artifacts_exist(self) -> bool:
        return all(
            os.path.exists(p)
            for p in (self.vectorizer_path, self.job_vectors_path, self.titles_path)
        )


@lru_cache
def get_settings() -> Settings:
    """Cached singleton so settings are parsed once per process."""
    return Settings()
