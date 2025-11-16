# app/api/endpoints/suppliers.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import session
from app.schemas import schema
from app.crud import crud_supplier

# THIS IS THE 'router' VARIABLE THAT main.py WILL LOOK FOR
router = APIRouter()

# Dependency to get the database session
def get_db():
    db = session.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=schema.Supplier, tags=["Suppliers"])
def create_new_supplier(
    supplier: schema.SupplierCreate, 
    db: Session = Depends(get_db)
):
    return crud_supplier.create_supplier(db=db, supplier=supplier)

@router.get("/", response_model=List[schema.Supplier], tags=["Suppliers"])
def read_all_suppliers(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db)
):
    suppliers = crud_supplier.get_suppliers(db, skip=skip, limit=limit)
    return suppliers

@router.patch("/{supplier_id}", response_model=schema.Supplier, tags=["Suppliers"])
def update_existing_supplier(
    supplier_id: int,
    supplier_update: schema.SupplierUpdate,
    db: Session = Depends(get_db)
):
    db_supplier = crud_supplier.update_supplier(
        db=db, 
        supplier_id=supplier_id, 
        supplier_update=supplier_update
    )
    if db_supplier is None:
        raise HTTPException(status_code=404, detail="Supplier not found")
    return db_supplier

@router.delete("/{supplier_id}", response_model=schema.Supplier, tags=["Suppliers"])
def remove_supplier(
    supplier_id: int, 
    db: Session = Depends(get_db)
):
    db_supplier = crud_supplier.delete_supplier(db, supplier_id=supplier_id)
    if db_supplier is None:
        raise HTTPException(status_code=404, detail="Supplier not found")
    return db_supplier