# app/api/endpoints/dashboard.py

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List 

from app.database import session
from app.schemas import schema
from app.crud import crud_dashboard

# This is the 'router' variable main.py will look for
router = APIRouter()

# Dependency to get the database session
def get_db():
    db = session.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/kpis", response_model=schema.DashboardKPIs, tags=["Dashboard"])
def get_dashboard_kpi_data(db: Session = Depends(get_db)):
    """
    Get all Key Performance Indicators for the main dashboard.
    """
    kpis = crud_dashboard.get_dashboard_kpis(db=db)
    return kpis

@router.get("/low-stock-alerts", response_model=List[schema.LowStockAlert], tags=["Dashboard"])
def get_low_stock_alerts_data(db: Session = Depends(get_db)):
    """
    Get a list of products that are low on stock.
    """
    alerts = crud_dashboard.get_low_stock_alerts(db=db)
    return alerts

@router.get("/priority-tasks", response_model=List[schema.PriorityTask], tags=["Dashboard"])
def get_priority_tasks_data(db: Session = Depends(get_db)):
    """
    Get a list of the most urgent tasks.
    """
    tasks = crud_dashboard.get_priority_tasks(db=db)
    return tasks