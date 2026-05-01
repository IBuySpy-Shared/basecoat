---
title: Data Science / ML / Notebook Instruction
type: instruction
description: "Conventions for data science, ML, and notebook-driven projects."
applyTo:
  - data-science
  - ml
  - notebook
---

# Data Science / ML / Notebook Instruction

This instruction file defines conventions for data science, ML, and notebook-driven projects.

## Notebook Idempotency
- Ensure notebooks can be run top-to-bottom without errors.
- Avoid hidden state and side effects between cells.

## Cell Output Hygiene
- Clear all cell outputs before committing.
- Avoid committing large binary outputs or datasets.

## Train/Test Split
- Always use a fixed random seed for reproducibility.
- Use stratified splits for classification tasks.

## Reproducibility
- Document all random seeds, environment versions, and data sources.
- Use `requirements.txt` or `environment.yml` for dependencies.

## Feature Engineering
- Modularize feature engineering code in scripts or functions.
- Document feature selection and transformation logic.

## Data Validation
- Use `pandas` assertions or `pandera` for schema validation.
- Validate input data before processing.

## Medallion Architecture
- Follow bronze/silver/gold layering for data pipelines.
- Document data quality checks at each stage.

## Testing Notebooks
- Use `pytest` with `nbval` or `papermill` for notebook tests.

## Platform Guidance
- For Microsoft Fabric Spark, follow platform-specific best practices for data access and compute.
