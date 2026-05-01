---
title: Python Coding Standards
type: instruction
description: "Conventions for Python-centric projects, including data science and ML pipelines."
applyTo:
  - python
  - data-science
  - ml
---

# Python Coding Standards

This instruction file defines conventions for Python-centric projects, including data science and ML pipelines.

## Type Hints
- Use type hints for all function signatures and variables where possible.
- Prefer `Optional`, `Union`, and `Literal` from `typing` for clarity.

## Path Handling
- Use `pathlib.Path` for all file and directory operations.

## Virtual Environments
- Always use `venv` or `conda` for project isolation.
- Never install dependencies globally.

## Dependency Management
- Pin all dependencies in `requirements.txt` or `pyproject.toml`.
- Use `pip-tools` or `poetry` for reproducible environments.

## Linting and Formatting
- Use `ruff` or `flake8` for linting.
- Use `mypy` for type checking.
- Use `black` for code formatting.

## Packaging
- Prefer `pyproject.toml` for new projects.
- Use `setuptools` or `poetry` for packaging.

## Testing
- Use `pytest` for unit and integration tests.
- Place tests in a `tests/` directory.

## Notebooks
- See `data-science.instructions.md` for notebook-specific guidance.
