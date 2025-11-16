# app/crud/crud_supplier.py

from sqlalchemy.orm import Session
from app.models import model
from app.schemas import schema

def get_supplier(db: Session, supplier_id: int):
    return db.query(model.Supplier).filter(model.Supplier.id == supplier_id).first()

def get_suppliers(db: Session, skip: int = 0, limit: int = 100):
    return db.query(model.Supplier).offset(skip).limit(limit).all()

def create_supplier(db: Session, supplier: schema.SupplierCreate):
    """
    Creates a new supplier.
    No translation needed! The form data (supplier) matches the model.
    """
    db_supplier = model.Supplier(**supplier.dict())
    db.add(db_supplier)
    db.commit()
    db.refresh(db_supplier)
    return db_supplier

# --- ADD NEW 'update' and 'delete' FUNCTIONS ---

def update_supplier(db: Session, supplier_id: int, supplier_update: schema.SupplierUpdate):
    db_supplier = get_supplier(db, supplier_id=supplier_id)
    if not db_supplier:
        return None

    update_data = supplier_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_supplier, key, value)

    db.add(db_supplier)
    db.commit()
    db.refresh(db_supplier)
    return db_supplier

def delete_supplier(db: Session, supplier_id: int):
    db_supplier = get_supplier(db, supplier_id=supplier_id)
    if db_supplier:
        db.delete(db_supplier)
        db.commit()
        return db_supplier
    return None

def get_supplier_by_name(db: Session, name: str):
    """
    Finds a supplier by their exact name.
    """
    return db.query(model.Supplier).filter(model.Supplier.name == name).first()