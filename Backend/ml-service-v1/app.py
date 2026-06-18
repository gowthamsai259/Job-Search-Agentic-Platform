"""ATS ML Service - FastAPI application.

Key production choices:
- The model is loaded ONCE per process in the lifespan handler and stored on
  `app.state` (no module-level globals, no work at import time).
- CPU-bound inference runs in a threadpool so it never blocks the async event
  loop -> the server stays responsive under high concurrency.
- The service is stateless: scale to many users by running multiple workers /
  replicas behind a load balancer (see README).
"""
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Request
from fastapi.concurrency import run_in_threadpool
from fastapi.middleware.cors import CORSMiddleware

from src.config import get_settings
from src.document_analyser import read_document
from src.recommender import Recommender

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("ats-ml-service")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load the model once at startup; release it at shutdown."""
    settings = get_settings()

    if settings.artifacts_exist():
        logger.info("Loading recommender artifacts from %s", settings.artifacts_dir)
        recommender = Recommender.load(settings)
    elif settings.build_on_startup:
        logger.warning("Artifacts not found - building from CSV (this is slow).")
        recommender = Recommender.build_from_csv(settings)
        recommender.save(settings)
    else:
        raise RuntimeError(
            "Model artifacts not found. Run `python -m src.build_artifacts` first, "
            "or set BUILD_ON_STARTUP=true."
        )

    app.state.recommender = recommender
    logger.info("Recommender ready (%d jobs).", len(recommender.titles))
    yield
    app.state.recommender = None


settings = get_settings()
app = FastAPI(title="ATS ML Service", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_recommender(request: Request) -> Recommender:
    recommender = getattr(request.app.state, "recommender", None)
    if recommender is None:
        raise HTTPException(status_code=503, detail="Model not loaded yet")
    return recommender


@app.get("/")
def health():
    return {"status": "running", "service": "ATS ML Service"}


@app.get("/ready")
def ready(request: Request):
    """Readiness probe for Docker/Kubernetes load balancers."""
    recommender = getattr(request.app.state, "recommender", None)
    return {"ready": recommender is not None}


@app.post("/analyze-resume")
async def analyze_resume(
    request: Request,
    resume: UploadFile = File(...),
    jobDescription: str = Form(...),
):
    recommender = get_recommender(request)

    document = await read_document(resume)
    if not document:
        raise HTTPException(
            status_code=400,
            detail="Unsupported or unreadable file. Upload a PDF, DOC, or DOCX.",
        )

    # CPU-bound work -> run off the event loop.
    recommendations = await run_in_threadpool(
        recommender.recommend, document, settings.default_top_n
    )
    ats_score = await run_in_threadpool(
        recommender.ats_score, document, jobDescription
    )

    return {
        "ats_score": ats_score,
        "recommended_jobs": [r["title"] for r in recommendations],
    }
