FROM python:3.12-slim AS builder

WORKDIR /code
COPY pyproject.toml .
RUN pip install --no-cache-dir .

FROM python:3.12-slim

RUN groupadd -g 1000 app && useradd -u 1000 -g app app
WORKDIR /code
COPY --from=builder /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin
COPY src/ ./src/

USER app
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
