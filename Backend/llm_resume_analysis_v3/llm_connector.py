import json
from openai import OpenAI
import fitz

_SUPPORTED_TYPES = {
    "application/pdf": "pdf",
    "application/msword": "doc",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
}
async def document_reader(document):
    """
    Supports:
    - FastAPI UploadFile (async .read())
    - Local file path string (for testing)
    """
    # FastAPI UploadFile
    if hasattr(document, "read") and callable(document.read):
        filetype = _SUPPORTED_TYPES.get(getattr(document, "content_type", None), "pdf")
        try:
            data = await document.read()
            if not data:
                return None
            with fitz.open(stream=data, filetype=filetype) as reader:
                text = "".join(page.get_text() for page in reader)
            return text or None
        except Exception:
            return None

    # Local path
    try:
        with fitz.open(document) as reader:
            text = "".join(page.get_text() for page in reader)
        return text or None
    except Exception:
        return None


def recommendations_score(document: str, job_description: str):
    api_key = "YOUR_API_KEY"

    client = OpenAI(
        api_key=api_key
    )

    prompt = f"""
You are an ATS Resume Analyzer.


Compare the resume and the job description.



Resume:
{document}

Job Description:
{job_description}

Resume should have name of the candidate, email, phone number, and other contact information, education, work experience(not mandatory), skills, and other relevant information.
**Sometimes the user may enter the key words instead of the resume. So, make sure to check if the user's resume is a valid resume or not.
If the user's resume is not a valid resume, return the ats_score as 0 and recommended_jobs as an empty list.**
**ats_score should be based on comparing resume and job_description**
**recommended_jobs should be based on resume**

Return ONLY valid JSON.

Format:

{{
    "ats_score": <integer between 0 and 100>,
    "recommended_jobs": [
        "Job Title 1",
        "Job Title 2",
        "Job Title 3",
        "Job Title 4",
        "Job Title 5"
    ]
}}

Do not return markdown.
Do not explain anything.
Return JSON only.
"""

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": "You are an ATS recommendation engine."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.2
    )

    result = response.choices[0].message.content

    return json.loads(result)