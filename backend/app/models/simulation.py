from pydantic import BaseModel, Field
from typing import List, Dict

class SimulationParams(BaseModel):
    arrival_rate_per_hour: int = Field(default=120, ge=10, le=300)
    cashier_count: int = Field(default=2, ge=1, le=6)
    barista_count_espresso: int = Field(default=2, ge=1, le=6)
    barista_count_brew: int = Field(default=1, ge=1, le=4)
    barista_count_bakery: int = Field(default=1, ge=1, le=4)
    digital_adoption_rate: float = Field(default=0.45, ge=0.0, le=1.0)
    smart_routing_enabled: bool = True
    duration_minutes: int = Field(default=60, ge=10, le=180)

class StationUtilization(BaseModel):
    espresso: int
    batch_brew: int
    bakery: int

class MetricComparison(BaseModel):
    policy: str
    total_customers_served: int
    avg_wait_time_minutes: float
    p95_wait_time_minutes: float
    throughput_per_hour: int
    station_utilization: StationUtilization
    congestion_incidents: int
    customer_satisfaction_score: float

class TimelineSamplePoint(BaseModel):
    minute: int
    fifo_queue_length: int
    smart_queue_length: int

class SimulationResponse(BaseModel):
    fifo_result: MetricComparison
    smart_result: MetricComparison
    wait_reduction_percent: float
    throughput_delta_percent: float
    timeline_sample: List[TimelineSamplePoint]
