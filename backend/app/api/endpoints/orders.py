# app/api/endpoints/orders.py

from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List # <-- Add this import

from app import security
from app.schemas import schema
from app.crud import crud_order
# from app.api.api import private_router # <-- We don't need this anymore
from fastapi import APIRouter # <-- We import APIRouter instead
from app.database import session # <-- Add this import

# --- THIS IS THE 'router' VARIABLE THAT main.py IS LOOKING FOR ---
router = APIRouter()

# Dependency to get the database session
def get_db():
    db = session.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- THIS IS YOUR NEW GET_ALL_ORDERS ENDPOINT ---
@router.get("/", response_model=List[schema.Order], tags=["Orders"])
def read_all_orders(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db)
):
    """
    Retrieve all orders with calculated totals and customer info.
    """
    # Note: We must re-add security later
    orders = crud_order.get_all_orders(db, skip=skip, limit=limit)
    return orders

@router.get("/{order_id}", response_model=schema.OrderDetails, tags=["Orders"])
def read_order_details(
    order_id: int,
    db: Session = Depends(get_db)
):
    """
    Retrieve the full details for a single order.
    """
    db_order = crud_order.get_order_details(db, order_id=order_id)
    if db_order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    return db_order

@router.patch("/{order_id}", response_model=schema.Order, tags=["Orders"])
def change_order_status(
    order_id: int,
    status_update: schema.OrderUpdateStatus,
    db: Session = Depends(get_db)
):
    """
    Update the status of an order (e.g., "Pending", "Shipped").
    """

    # We need a new CRUD function for this. Let's get the full order
    # to return a full Order object, or we can adapt.
    # Let's call the new crud function:
    updated_order = crud_order.update_order_status(
        db=db, 
        order_id=order_id, 
        new_status=status_update.status
    )

    if updated_order is None:
        raise HTTPException(status_code=404, detail="Order not found")

    # The response_model=schema.Order needs the *full* order details,
    # but our update_order_status just returns a simple Order.
    # We must return the *full* details.

    full_details = crud_order.get_order_details(db, order_id=order_id)

    return full_details


# --- THIS IS YOUR ORIGINAL POST_SALE ENDPOINT (using the new 'router') ---
@router.post("/sales", response_model=schema.SaleResponse, tags=["Sales"])
def record_new_sale(
    sale: schema.SaleCreate, 
    db: Session = Depends(get_db)
):
    # Note: We must re-add security later
    new_order = crud_order.create_sale(db=db, sale=sale)
    return {
        "sale_id": new_order.id,
        "status": "success",
        "detail": "Inventory levels updated successfully."
    }