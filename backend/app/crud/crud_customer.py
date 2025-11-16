# app/crud/crud_customer.py
from sqlalchemy.orm import Session
from app.models import model
from app.schemas import schema

def get_customer(db: Session, customer_id: int):
    return db.query(model.Customer).filter(model.Customer.id == customer_id).first()

def get_customers(db: Session, skip: int = 0, limit: int = 100):
    return db.query(model.Customer).offset(skip).limit(limit).all()

def create_customer(db: Session, customer: schema.CustomerCreate):
    db_customer = model.Customer(
        name=customer.name,
        contact_info=customer.contact_info
    )
    db.add(db_customer)
    db.commit()
    db.refresh(db_customer)
    return db_customer