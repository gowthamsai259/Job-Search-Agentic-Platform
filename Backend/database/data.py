"""Supabase data access.

This is the FastAPI-friendly version of the Flask `create_client` example:
instead of creating the client at module level, we build it on demand from the
typed `Settings`, and we paginate because Supabase caps each request at ~1000
rows (the full jobs table is much larger).
"""
from __future__ import annotations

from typing import Dict, List
from supabase import Client, create_client
import os
from dotenv import load_dotenv
load_dotenv()

supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")
supabase_table = os.getenv("SUPABASE_TABLE")
supabase_page_size = int(os.getenv("SUPABASE_PAGE_SIZE", "1000"))

def get_client() -> Client:
    if not supabase_url or not supabase_key:
        raise RuntimeError(
            "SUPABASE_URL and SUPABASE_KEY must be set (see .env / .env.example)."
        )
    return create_client(supabase_url, supabase_key)


def fetch_jobs() -> List[Dict[str, str]]:
    """Fetch all (title, description) rows from the Supabase jobs table.

    Pages through the table in chunks of `supabase_page_size` until exhausted.
    """
    client = get_client()
    page_size = supabase_page_size

    rows: List[Dict[str, str]] = []
    start = 0
    while True:
        end = start + page_size - 1
        response = (
            client.table(supabase_table)
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
