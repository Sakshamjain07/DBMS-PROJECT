# app/api/endpoints/reorders.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel # Import BaseModel for our request

from app.database import session
from app.schemas import schema
from app.crud import crud_reorder # Use the crud_reorder file

# THIS IS THE 'router' VARIABLE THAT main.py IS LOOKING FOR
router = APIRouter()

# Dependency to get the database session
def get_db():
    db = session.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 1. Define the "rulebook" for our request.
# The frontend must send a JSON object with these two keys.
class ReorderRequest(BaseModel):
    product_id: int
    quantity: int

@router.post("/reorder", tags=["Reorders"])
def create_reorder(
    request: ReorderRequest, 
    db: Session = Depends(get_db)
):
    """
    Create a new purchase order for a single product.
    This is called by the "Reorder" button.
    """
    try:
        # 2. Call the "translator" function from crud_reorder.py
        po = crud_reorder.create_purchase_order_for_product(
            db=db, 
            product_id=request.product_id, 
            quantity=request.quantity
        )
        return {"status": "success", "purchase_order_id": po.id, "supplier_id": po.supplier_id}
    except HTTPException as e:
        # Re-raise HTTPExceptions (like 404 Not Found)
        raise e
    except Exception as e:
        # Catch any other unexpected errors
        raise HTTPException(status_code=500, detail=str(e))