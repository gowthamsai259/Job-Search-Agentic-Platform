from ats_scorer import ats_score
from fastapi import FastAPI, UploadFile, File, Form, HTTPException  # pyright: ignore[reportMissingImports]
from fastapi.middleware.cors import CORSMiddleware  # pyright: ignore[reportMissingImports]
import uvicorn
from recommender import recommend_jobs
from transformer import read_document

app = FastAPI()

# Required for browser requests from the React app (curl works without this).
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/analyze-resume")
async def analyze_resume(resume: UploadFile = File(...), jobDescription: str = Form(...)):
    resume_text = await read_document(resume)
    if not resume_text:
        raise HTTPException(
            status_code=400,
            detail="Could not read resume. Upload a valid PDF, DOC, or DOCX.",
        )

    ats = await ats_score(resume_text, jobDescription)
    recommendations = await recommend_jobs(resume_text)
    return {
        "ats_score": ats,
        "recommended_jobs": [r["title"] for r in recommendations],
    }


if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8001)
