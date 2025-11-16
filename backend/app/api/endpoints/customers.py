# app/api/endpoints/customers.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import session
from app.schemas import schema
from app.crud import crud_customer

router = APIRouter()
def get_db():
    db = session.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=schema.Customer, tags=["Customers"])
def create_new_customer(
    customer: schema.CustomerCreate, 
    db: Session = Depends(get_db)
):
    return crud_customer.create_customer(db=db, customer=customer)

@router.get("/", response_model=List[schema.Customer], tags=["Customers"])
def read_all_customers(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud_customer.get_customers(db, skip=skip, limit=limit)