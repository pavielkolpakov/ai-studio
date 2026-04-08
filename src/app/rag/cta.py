CTA_TOPICS = {"services", "process", "use-cases"}

CTA_MAP = {
    "services": {"label": "Explore our services", "url": "/services"},
    "process": {"label": "See how we work", "url": "/process"},
    "use-cases": {"label": "View use cases", "url": "/use-cases"},
}

# Default CTA when multiple topics match
_DEFAULT_CTA = {"label": "Get in touch", "url": "/contact"}


def maybe_cta(topics: list[str]) -> dict | None:
    """Return a CTA dict if any topic warrants one, else None."""
    matched = CTA_TOPICS & set(topics)
    if not matched:
        return None
    # Pick the first matching topic in priority order
    for topic in ("services", "process", "use-cases"):
        if topic in matched:
            return CTA_MAP[topic]
    return _DEFAULT_CTA
