"""Extract text from uploaded resume documents (PDF / DOC / DOCX)."""
import logging

import fitz  # PyMuPDF

logger = logging.getLogger("ats-ml-service")

# Map upload content types to the filetype PyMuPDF expects.
_SUPPORTED_TYPES = {
    "application/pdf": "pdf",
    "application/msword": "doc",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
}


async def read_document(doc) -> str | None:
    """Return extracted text, or None if the file type is unsupported/unreadable."""
    filetype = _SUPPORTED_TYPES.get(doc.content_type)
    if filetype is None:
        logger.warning("Unsupported content type: %s", doc.content_type)
        return None

    try:
        file_bytes = await doc.read()
        with fitz.open(stream=file_bytes, filetype=filetype) as reader:
            text = "".join(page.get_text() for page in reader)
        return text or None
    except Exception:
        logger.exception("Failed to read document (%s)", doc.content_type)
        return None
