import re
from typing import Any, Dict

# MkDocs hook: copy the first H1 into page.meta['title'] when not already set.
# This lets us keep short nav aliases (e.g., "Overview", "Quiz") while
# using the real page header for footer pagination labels via a theme override.

def on_page_markdown(
    markdown: str, page: Any, **_kwargs: Dict[str, Any]
) -> str:
    """
    If front matter doesn't set a title, mirror the first H1 into
    page.meta['title'].

    This supports footer pagination labels that use meta.title instead of
    nav aliases.
    """
    # Ensure meta exists
    if getattr(page, "meta", None) is None:
        page.meta = {}
    # Respect explicit front matter title if present
    if page.meta.get("title"):
        return markdown

    try:
        # Find the first ATX-style H1
        match = re.search(r"(?m)^\s*#\s+(.+?)\s*(?:#*\s*)$", markdown)
        if match:
            page.meta["title"] = match.group(1).strip()
    except (AttributeError, re.error):
        # Don't fail the build for edge cases
        return markdown

    return markdown
