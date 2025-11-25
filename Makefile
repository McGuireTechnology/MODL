# Makefile for documentation workflow using Poetry + MkDocs

.PHONY: help install dev docs-build docs-deploy format

help:
	@echo "Available targets:"
	@echo "  install     - Install Poetry dependencies"
	@echo "  dev         - Serve MkDocs site locally with live reload"
	@echo "  build       - Build static site into site/ directory"
	@echo "  deploy      - Build and push gh-pages (requires repo_url configured)"
	@echo "  format      - Run mdformat on docs and workbook"

install:
	poetry install

dev: install
	poetry run mkdocs serve

build: install
	poetry run mkdocs build

deploy: install
	git add -A
	git commit -m "Deploy updates" || echo "No changes to commit"
	git push origin main
	@echo "Pushed to main - GitHub Actions will handle deployment"

format: install
	poetry run mdformat README.md
	poetry run mdformat docs
	poetry run mdformat workbook || true
