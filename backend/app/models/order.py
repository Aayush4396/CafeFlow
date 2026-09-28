from pydantic import BaseModel, Field
from typing import List, Optional, Dict
from enum import Enum
from .menu import StationType

class OrderStatus(str, Enum):
    QUEUED = "QUEUED"
    IN_PREP = "IN_PREP"
    READY = "READY"
    FULFILLED = "FULFILLED"

class OrderChannel(str, Enum):
    MOBILE = "MOBILE"
    WALK_IN = "WALK_IN"

class OrderItem(BaseModel):
    menu_item_id: str
    name: str
    station_type: StationType
    prep_time_seconds: int
    price: float
    quantity: int = Field(default=1, ge=1)
    selected_options: Optional[Dict[str, str]] = None

class Order(BaseModel):
    id: str
    customer_name: str
    channel: OrderChannel
    items: List[OrderItem]
    status: OrderStatus = OrderStatus.QUEUED
    created_at: int
    prep_started_at: Optional[int] = None
    ready_at: Optional[int] = None
    total_price: float
    total_estimated_prep_time: int
    target_station: StationType

class CreateOrderRequest(BaseModel):
    customer_name: str = "Guest Customer"
    channel: OrderChannel = OrderChannel.MOBILE
    items: List[OrderItem]
