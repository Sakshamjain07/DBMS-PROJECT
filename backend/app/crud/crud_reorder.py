# app/crud/crud_reorder.py

from sqlalchemy.orm import Session
from app.models import model
from app.schemas import schema
from app.crud import crud_supplier, crud_product # Import our other crud files
from fastapi import HTTPException

def create_purchase_order_for_product(db: Session, product_id: int, quantity: int):
    """
    Creates a new Purchase Order for a single product.
    This function "translates" a product's supplier name into a supplier_id.
    """

    # 1. Get the product to reorder
    product = crud_product.get_product(db, product_id=product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product to reorder not found.")

    # 2. Find the supplier ID from the product's supplier name (the "magic" translation)
    supplier = crud_supplier.get_supplier_by_name(db, name=product.supplier)
    if not supplier:
        # If supplier doesn't exist, we can't create a PO
        raise HTTPException(status_code=404, detail=f"Supplier '{product.supplier}' not found in database.")

    # 3. Create the main PurchaseOrder
    new_po = model.PurchaseOrder(
        supplier_id=supplier.id,
        status="Pending" # Default to Pending
    )
    db.add(new_po)
    db.flush() # Get the new_po.id

    # 4. Create the PurchaseOrderDetail item
    po_item = model.PurchaseOrderDetail(
        purchase_order_id=new_po.id,
        product_id=product.id,
        quantity=quantity
    )
    db.add(po_item)

    # 5. Commit the transaction
    db.commit()
    db.refresh(new_po)
    return new_po