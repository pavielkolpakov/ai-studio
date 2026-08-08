FROM python:3.14-slim AS builder

WORKDIR /code
COPY pyproject.toml .
RUN pip install uv && uv pip install --system .

FROM python:3.14-slim

RUN groupadd -g 1000 app && useradd -u 1000 -g app app
WORKDIR /code/src
COPY --from=builder /usr/local/lib/python3.14/site-packages /usr/local/lib/python3.14/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin
COPY src/ .
COPY docs/vault/ /code/docs/vault/

USER app
CMD sh -c "alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"
