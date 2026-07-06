"""TF-IDF based job recommender.

Design notes (why this is shaped this way):

- NOTHING heavy runs at import time. The previous version fit a TF-IDF model on a
  ~500 MB CSV as a side effect of `import`, so every worker/replica paid that cost
  on startup and held the full DataFrame in memory. Here the model lives inside a
  `Recommender` object that is built once (offline) and loaded from small joblib
  artifacts at runtime.
- The object holds only what inference needs: the fitted vectorizer, the sparse
  job-vectors matrix, and the list of job titles. The raw CSV is never needed at
  runtime, which slashes per-process memory.
- The object is read-only after construction, so it is safe to share across
  threads/requests within a worker.
"""
from __future__ import annotations

import os
from typing import List

import joblib
import pandas as pd
from scipy.sparse import csr_matrix
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from src.config import Settings


class Recommender:
    def __init__(
        self,
        vectorizer: TfidfVectorizer,
        job_vectors: csr_matrix,
        titles: List[str],
    ) -> None:
        self.vectorizer = vectorizer
        self.job_vectors = job_vectors
        self.titles = titles

    # ------------------------------------------------------------------
    # Construction
    # ------------------------------------------------------------------
    @classmethod
    def build_from_dataframe(cls, df: pd.DataFrame, settings: Settings) -> "Recommender":
        """Fit the model from a DataFrame with `title` and `description` columns.

        Source-agnostic: works whether the rows came from Supabase or a CSV.
        """
        if df.empty or not {"title", "description"}.issubset(df.columns):
            raise ValueError("Data must contain non-empty 'title' and 'description' columns.")

        df = df.dropna(subset=["title", "description"])

        text = df["title"].astype(str) + " " + df["description"].astype(str)

        vectorizer = TfidfVectorizer(stop_words="english", max_features=settings.max_features)
        job_vectors = vectorizer.fit_transform(text)
        titles = df["title"].astype(str).tolist()

        return cls(vectorizer, job_vectors, titles)

    @classmethod
    def build_from_supabase(cls, settings: Settings) -> "Recommender":
        """Fetch job rows from Supabase and fit the model."""
        # Imported here to avoid importing the supabase client unless we build.
        from src.data_source import fetch_jobs

        records = fetch_jobs(settings)
        if not records:
            raise RuntimeError(
                f"Supabase returned 0 rows from table '{settings.supabase_table}'. "
                "Either the table is empty, or Row Level Security is blocking your key. "
                "Fix: add a SELECT policy for the anon role, or use the service_role key "
                "for the build."
            )
        df = pd.DataFrame.from_records(records)
        return cls.build_from_dataframe(df, settings)

    @classmethod
    def load(cls, settings: Settings) -> "Recommender":
        """Load pre-built artifacts from disk (fast, low memory)."""
        vectorizer = joblib.load(settings.vectorizer_path)
        job_vectors = joblib.load(settings.job_vectors_path)
        titles = joblib.load(settings.titles_path)
        return cls(vectorizer, job_vectors, titles)

    def save(self, settings: Settings) -> None:
        os.makedirs(settings.artifacts_dir, exist_ok=True)
        joblib.dump(self.vectorizer, settings.vectorizer_path)
        joblib.dump(self.job_vectors, settings.job_vectors_path)
        joblib.dump(self.titles, settings.titles_path)

    # ------------------------------------------------------------------
    # Inference (pure, CPU-bound, no shared mutable state)
    # ------------------------------------------------------------------
    def recommend(self, query: str, top_n: int = 5) -> List[dict]:
        if not query or not query.strip():
            return []

        query_vec = self.vectorizer.transform([query])
        similarities = cosine_similarity(query_vec, self.job_vectors)[0]

        top_n = max(1, min(top_n, len(self.titles)))
        top_indices = similarities.argsort()[-top_n:][::-1]

        return [
            {"title": self.titles[i], "similarity_score": float(similarities[i])}
            for i in top_indices
        ]

    def ats_score(self, resume_text: str, job_description_text: str) -> int:
        """Cosine similarity between resume and job description, as a 0-100 score."""
        if not resume_text or not job_description_text:
            return 0

        resume_vec = self.vectorizer.transform([resume_text])
        job_desc_vec = self.vectorizer.transform([job_description_text])
        similarity = cosine_similarity(resume_vec, job_desc_vec)[0][0]
        return int(similarity * 100)
