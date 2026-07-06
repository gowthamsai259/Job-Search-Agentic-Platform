from fastapi import FastAPI
from data import fetch_jobs
app = FastAPI()

@app.get("/jobsdb")
def get_jobs():
    return fetch_jobs()
