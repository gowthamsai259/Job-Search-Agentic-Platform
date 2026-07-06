cd Backend/cosine_similarity_v1

uvicorn app:app --reload --port 8000 &

cd ../sentence_transformers_v2
uvicorn app:app --reload --port 8001 &

cd ../llm_resume_analysis_v3
uvicorn app:app --reload --port 8002 &

cd ../database
uvicorn app:app --reload --port 8080 &

cd ../../Frontend
npm run dev &