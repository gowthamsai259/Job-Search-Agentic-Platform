"""Offline build step: fit the TF-IDF model once and persist small artifacts.

Run this whenever the underlying job data changes:

    python -m src.build_artifacts

The API never fits the model on a request path; it only loads the artifacts
produced here. This keeps startup fast and makes the service stateless and
horizontally scalable (every replica loads the same artifacts).
"""
from src.config import get_settings
from src.recommender import Recommender


def main() -> None:
    settings = get_settings()
    print(f"Building artifacts from: {settings.cleaned_csv}")

    recommender = Recommender.build_from_csv(settings)
    recommender.save(settings)

    print(f"Saved {len(recommender.titles)} jobs.")
    print(f"Vector shape: {recommender.job_vectors.shape}")
    print(f"Artifacts written to: {settings.artifacts_dir}")


if __name__ == "__main__":
    main()
