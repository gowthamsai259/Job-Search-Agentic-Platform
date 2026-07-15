#!/bin/bash

ROOT=$(pwd)

cd "$ROOT/Backend/cosine_similarity_v1"
uvicorn app:app --reload --port 8000 &

cd "$ROOT/Backend/sentence_transformers_v2"
uvicorn app:app --reload --port 8001 &

cd "$ROOT/Backend/llm_resume_analysis_v3"
uvicorn app:app --reload --port 8002 &

cd "$ROOT/Backend/database"
uvicorn app:app --reload --port 8080 &

cd "$ROOT/Backend/agentic_service/designtime"
npm run start:dev &

cd "$ROOT/Backend/model-service"
npm run start:dev &

cd "$ROOT/Backend/agentic_service/runtime"
npm run start:dev &

cd "$ROOT/Frontend"
npm run dev &