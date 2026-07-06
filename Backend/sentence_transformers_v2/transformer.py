from sentence_transformers import SentenceTransformer  # pyright: ignore[reportMissingImports]
import fitz  # pyright: ignore[reportMissingImports]

_SUPPORTED_TYPES = {
    "application/pdf": "pdf",
    "application/msword": "doc",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
}


def model_init():
    return SentenceTransformer("all-MiniLM-L6-v2")


async def read_document(document) -> str | None:
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
