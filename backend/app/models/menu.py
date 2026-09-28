from pydantic import BaseModel, Field
from typing import List, Optional, Dict
from enum import Enum

class StationType(str, Enum):
    ESPRESSO = "ESPRESSO"
    BATCH_BREW = "BATCH_BREW"
    BAKERY = "BAKERY"

class MenuItem(BaseModel):
    id: str
    name: str
    category: str
    station_type: StationType
    base_prep_time_seconds: int = Field(gt=0, description="Preparation duration in seconds")
    price: float = Field(ge=0.0)
    margin_weight: float = Field(ge=0.0, le=1.0)
    base_popularity: float = Field(ge=0.0, le=100.0)
    description: str
    image_url: str
    tags: List[str] = []
    options: Optional[Dict[str, List[str]]] = None
