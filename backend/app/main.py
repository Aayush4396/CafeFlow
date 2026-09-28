from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.models.menu import MenuItem, StationType
from app.models.order import Order, CreateOrderRequest, OrderStatus
from app.models.simulation import SimulationParams, SimulationResponse
from app.services.recommender import compute_load_aware_recommendations
from app.services.simulation_engine import run_simpy_discrete_event_simulation
import time

app = FastAPI(
    title="CafeFlow API",
    description="Load-Aware Cafe Flow & BPMN SimPy Engine",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory demo state
active_orders = []

@app.get("/api/v1/health")
def health_check():
    return {"status": "healthy", "service": "CafeFlow"}

@app.post("/api/v1/simulate", response_model=SimulationResponse)
def simulate_flow(params: SimulationParams):
    return run_simpy_discrete_event_simulation(params)
