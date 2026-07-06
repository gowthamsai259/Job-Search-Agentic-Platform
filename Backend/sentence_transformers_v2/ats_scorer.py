from transformer import model_init
from sentence_transformers import util  # pyright: ignore[reportMissingImports]

_model = model_init()


async def ats_score(resume_text: str, job_description: str) -> float:
    if not resume_text or not job_description:
        return 0.0

    document_embedding = _model.encode(resume_text)
    job_description_embedding = _model.encode(job_description)
    similarity = util.cos_sim(document_embedding, job_description_embedding)
    return round(float(similarity[0][0]) * 100, 2)
