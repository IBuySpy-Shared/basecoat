"""BaseCoat Artifact Schemas using Pydantic v2."""

from enum import Enum
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List


class Agent(BaseModel):
    """Agent artifact schema."""
    name: str = Field(..., min_length=1, max_length=64, pattern="^[a-z0-9\\-]+$")
    description: str = Field(..., min_length=1, max_length=1024)
