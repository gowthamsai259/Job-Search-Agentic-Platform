# ATS ML Service

FastAPI service that:
- extracts text from an uploaded resume (PDF / DOC / DOCX),
- computes an **ATS score** (cosine similarity vs. the job description),
- returns **recommended jobs** via TF-IDF + cosine similarity over a job-postings dataset.

Job data is stored in **Supabase** (a table with `title`, `description`). The offline
build step pulls it and fits the model into small artifacts.

## Project layout

```
ml-service-v1/
├── app.py                  # FastAPI app (model loaded once via lifespan)
├── requirements.txt
├── Dockerfile
├── docker-compose.yml
├── .dockerignore
├── .env.example            # copy to .env and add Supabase creds
├── data/
│   └── artifacts/          # generated model artifacts (joblib) - regenerable
└── src/
    ├── config.py           # env-driven settings (incl. Supabase)
    ├── data_source.py      # Supabase client + paginated job fetch
    ├── document_analyser.py# resume text extraction
    ├── recommender.py      # Recommender class (build / load / infer)
    └── build_artifacts.py  # offline: fetch from Supabase -> fit -> save artifacts
```

## Why it scales

- **No work at import time.** The TF-IDF model is built **once, offline** and saved as
  small `joblib` artifacts. The API only *loads* those artifacts at startup.
- **Loaded once per process** into `app.state` (no module-level globals).
- **Stateless service.** Scale to many users by running more workers/replicas behind a
  load balancer. Each replica loads the same read-only artifacts.
- **CPU work runs in a threadpool**, so the async event loop stays responsive.

## Local development

Run all commands from this folder (`Backend/ml-service-v1`).

```bash
pip install -r requirements.txt

# 0) Configure Supabase
cp .env.example .env   # then edit SUPABASE_URL / SUPABASE_KEY / SUPABASE_TABLE

# 1) Build model artifacts once (re-run when the data changes)
python -m src.build_artifacts

# 2) Run the API
uvicorn app:app --reload --port 8000
```

Health check: `GET http://localhost:8000/`  •  Readiness: `GET /ready`

## Docker

```bash
# Build artifacts on the host first (keeps them out of the image):
python -m src.build_artifacts

# Build + run (mounts ./data so artifacts are visible inside the container)
docker compose up --build

# Scale horizontally on one host:
docker compose up --scale ml-service=3
```

## Scaling to ~100k users (checklist)

1. **Pre-build artifacts** (done by `build_artifacts`) so startup is fast.
2. **Multiple workers per container** (Gunicorn `--workers`, see Dockerfile) +
   **multiple replicas** behind nginx / a cloud load balancer.
3. **Memory:** each worker holds one copy of the model. Keep `TFIDF_MAX_FEATURES`
   reasonable; set container memory limits accordingly.
4. **For very large catalogs / lower latency**, move from in-process cosine similarity
   to a dedicated **vector database / ANN index** (FAISS, Qdrant, Milvus). The
   `Recommender` is the only place that would change.
5. Add a CDN/load balancer, request limits, and monitoring (Prometheus / OpenTelemetry).

## Configuration

All via environment variables (see `.env.example`): `SUPABASE_URL`, `SUPABASE_KEY`,
`SUPABASE_TABLE`, `SUPABASE_PAGE_SIZE`, `DATA_DIR`, `ARTIFACTS_DIR`,
`TFIDF_MAX_FEATURES`, `RECOMMEND_TOP_N`, `BUILD_ON_STARTUP`, `CORS_ORIGINS`.
