from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware  
import uvicorn
from llm_connector import document_reader, recommendations_score

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyze-resume")
async def resume_analysis(
    resume: UploadFile = File(...),
    jobDescription: str = Form(...),
):
    doc = await document_reader(resume)
    return recommendations_score(doc, jobDescription)

if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8002)
