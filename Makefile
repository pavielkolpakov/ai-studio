# Neuronetis — common dev tasks.
# Backend commands run tools from the local venv; alembic/uvicorn run from src/,
# ruff/pytest from the repo root. Frontend commands run from client/.

VENV := .venv
BIN := $(CURDIR)/$(VENV)/bin

.DEFAULT_GOAL := help

.PHONY: help
help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) \
		| sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-16s\033[0m %s\n", $$1, $$2}'

# --- Setup ---------------------------------------------------------------

.PHONY: install
install: install-backend install-frontend ## Install backend + frontend deps

.PHONY: install-backend
install-backend: ## Install backend deps into .venv (uv)
	uv pip install --python $(BIN)/python -e ".[dev]"

.PHONY: install-frontend
install-frontend: ## Install frontend deps
	cd client && npm install

# --- Database ------------------------------------------------------------

.PHONY: db-up
db-up: ## Start Postgres (docker compose)
	docker compose up -d postgres

.PHONY: db-down
db-down: ## Stop Postgres
	docker compose down

.PHONY: migrate
migrate: ## Apply Alembic migrations
	cd src && $(BIN)/alembic upgrade head

.PHONY: up
up: db-up migrate ## Start Postgres and apply migrations

# --- Run -----------------------------------------------------------------

.PHONY: backend
backend: ## Run the API with autoreload (localhost:8000)
	cd src && $(BIN)/uvicorn app.main:app --reload

.PHONY: frontend
frontend: ## Run the Vite dev server (localhost:3000)
	cd client && npm run dev

# --- Quality -------------------------------------------------------------

.PHONY: test
test: ## Run the backend test suite
	$(BIN)/pytest

.PHONY: lint
lint: ## Lint backend (ruff) + frontend (eslint)
	$(BIN)/ruff check src tests
	cd client && npm run lint

.PHONY: format
format: ## Auto-fix + format backend with ruff
	$(BIN)/ruff check --fix src tests
	$(BIN)/ruff format src tests

.PHONY: check
check: lint test ## Lint and test

.PHONY: build-frontend
build-frontend: ## Type-check and build the frontend
	cd client && npm run build

# --- Housekeeping --------------------------------------------------------

.PHONY: clean
clean: ## Remove Python caches
	find src tests -type d -name __pycache__ -prune -exec rm -rf {} +
	rm -rf .pytest_cache .ruff_cache
