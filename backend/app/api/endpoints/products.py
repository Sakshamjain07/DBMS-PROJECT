# app/api/endpoints/products.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import session
from app.schemas import schema
from app.crud import crud_product

# THIS IS THE 'router' VARIABLE THAT main.py IS LOOKING FOR
router = APIRouter()

# Dependency to get the database session
def get_db():
    db = session.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=schema.Product)
def create_new_product(
    product: schema.ProductCreate,  # This uses your new matching schema
    db: Session = Depends(get_db)
):
    """
    Create a new product.
    """
    # Call the simple create_product function directly
    return crud_product.create_product(db=db, product=product)
@router.get("/", response_model=List[schema.Product])
def read_all_products(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db)
):
    """
    Retrieve all products.
    """
    # This calls the get_products function from your crud_product.py file
    products = crud_product.get_products(db, skip=skip, limit=limit)
    return products

@router.get("/{product_id}", response_model=schema.Product)
def read_one_product(
    product_id: int, 
    db: Session = Depends(get_db)
):
    """
    Retrieve a single product by its ID.
    """
    db_product = crud_product.get_product(db, product_id=product_id)
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return db_product

@router.delete("/{product_id}", response_model=schema.Product)
def remove_product(
    product_id: int, 
    db: Session = Depends(get_db)
):
    """
    Delete a product by its ID.
    """
    db_product = crud_product.delete_product(db, product_id=product_id)
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return db_product

@router.patch("/{product_id}", response_model=schema.Product, tags=["Products"])
def update_existing_product(
    product_id: int,
    product_update: schema.ProductUpdate,
    db: Session = Depends(get_db)
):
    """
    Update an existing product by its ID.
    """
    # This calls the update_product function you already have!
    db_product = crud_product.update_product(
        db=db, 
        product_id=product_id, 
        product_update=product_update
    )

    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")

    return db_product
# You can add @router.put("/{product_id}") and @router.delete("/{product_id}") here later