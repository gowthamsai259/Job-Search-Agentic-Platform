"""Supabase data access.

This is the FastAPI-friendly version of the Flask `create_client` example:
instead of creating the client at module level, we build it on demand from the
typed `Settings`, and we paginate because Supabase caps each request at ~1000
rows (the full jobs table is much larger).
"""
from __future__ import annotations

from typing import Dict, List

from supabase import Client, create_client

from src.config import Settings


def get_client(settings: Settings) -> Client:
    if not settings.supabase_url or not settings.supabase_key:
        raise RuntimeError(
            "SUPABASE_URL and SUPABASE_KEY must be set (see .env / .env.example)."
        )
    return create_client(settings.supabase_url, settings.supabase_key)


def fetch_jobs(settings: Settings) -> List[Dict[str, str]]:
    """Fetch all (title, description) rows from the Supabase jobs table.

    Pages through the table in chunks of `supabase_page_size` until exhausted.
    """
    client = get_client(settings)
    page_size = settings.supabase_page_size

    rows: List[Dict[str, str]] = []
    start = 0
    while True:
        end = start + page_size - 1
        response = (
            client.table(settings.supabase_table)
            .select("title,description")
            .range(start, end)
            .execute()
        )
        batch = response.data or []
        rows.extend(batch)

        if len(batch) < page_size:
            break
        start += page_size

    return rows
