from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from environment import jobsdb
import requests
import pandas as pd
import os
import joblib
from threading import Lock

_CACHE_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "cache")
_DF_PATH = os.path.join(_CACHE_DIR, "jobs_df.joblib")
_EMB_PATH = os.path.join(_CACHE_DIR, "job_embeddings.npy")

_lock = Lock()
_model = SentenceTransformer("all-MiniLM-L6-v2")
_df = None
_job_embeddings = None


def _load_or_build():
    """
    Build embeddings only once, then reuse from disk.
    - First start: slow (downloads model + encodes 45k rows)
    - Next starts: fast (loads .joblib + .npy)
    """
    global _df, _job_embeddings
    os.makedirs(_CACHE_DIR, exist_ok=True)

    if os.path.exists(_DF_PATH) and os.path.exists(_EMB_PATH):
        _df = joblib.load(_DF_PATH)
        _job_embeddings = np.load(_EMB_PATH, allow_pickle=False)
        return

    response = requests.get(jobsdb, timeout=300)
    response.raise_for_status()
    jobs = response.json()
    if not jobs:
        raise RuntimeError(
            "Jobs API returned no rows. Start the database service and ensure "
            "Supabase table has data (check RLS policies)."
        )

    df = pd.DataFrame.from_records(jobs)
    if "description" not in df.columns or "title" not in df.columns:
        raise RuntimeError(
            f"Jobs API must return title/description. Got columns: {list(df.columns)}"
        )

    job_embeddings = _model.encode(
        df["description"].tolist(),
        convert_to_numpy=True,
        show_progress_bar=True,
    )

    joblib.dump(df, _DF_PATH)
    np.save(_EMB_PATH, job_embeddings, allow_pickle=False)
    _df = df
    _job_embeddings = job_embeddings


def _get_index():
    global _df, _job_embeddings
    if _df is not None and _job_embeddings is not None:
        return _df, _job_embeddings
    with _lock:
        if _df is None or _job_embeddings is None:
            _load_or_build()
    return _df, _job_embeddings


async def recommend_jobs(resume: str, top_k: int = 5):
    df, job_embeddings = _get_index()
    resume_embedding = _model.encode(resume, convert_to_numpy=True)

    similarities = cosine_similarity([resume_embedding], job_embeddings)[0]
    top_indices = np.argsort(similarities)[::-1][:top_k]

    return [{"title": df.iloc[idx]["title"]} for idx in top_indices]
