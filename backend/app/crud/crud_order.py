# app/crud/crud_order.py

from sqlalchemy.orm import Session
from app.models import model
from app.schemas import schema
from fastapi import HTTPException
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func

# In app/crud/crud_order.py

def create_sale(db: Session, sale: schema.SaleCreate):
    # 1. Create the main Order record
    new_order = model.Order(customer_id=sale.customer_id)
    db.add(new_order)
    db.flush() # Use flush to get the new_order.id before committing

    # 2. Process each item in the sale
    for item in sale.items_sold:
        product = db.query(model.Product).filter(model.Product.id == item.product_id).first()

        # Check if product exists and if there is enough stock
        if not product:
            db.rollback() # Abort the transaction
            raise HTTPException(status_code=404, detail=f"Product with id {item.product_id} not found.")
        
        if product.currentStock < item.quantity:
            db.rollback() # Abort the transaction
            raise HTTPException(status_code=400, detail=f"Not enough stock for {product.name}. Available: {product.currentStock}, Requested: {item.quantity}")

        # 3. Reduce the stock quantity (This is the real-time sync)
        product.currentStock -= item.quantity

        # 4. Create the OrderDetail record
        order_detail = model.OrderDetail(
            order_id=new_order.id,
            product_id=item.product_id,
            quantity=item.quantity,
            price_at_sale=99.99  
        )
        db.add(order_detail)

    # 5. Commit the entire transaction
    db.commit()
    db.refresh(new_order)
    return new_order

def get_most_recent_order_by_user(db: Session, user_id: int):
    # Orders the results by date in descending order and picks the first one
    return db.query(model.Order).filter(model.Order.user_id == user_id).order_by(model.Order.order_date.desc()).first()

def get_all_orders(db: Session, skip: int = 0, limit: int = 100):
    """
    Gets a list of all orders with calculated totals and customer names.
    This is a complex query that joins multiple tables.
            """

    # 1. Subquery to calculate the total for each order
    total_subquery = (
        db.query(
            model.OrderDetail.order_id,
            func.sum(model.OrderDetail.quantity * model.OrderDetail.price_at_sale).label("total")
        )
        .group_by(model.OrderDetail.order_id)
        .subquery()
    )

    # 2. Main query to get all order details
    query = (
        db.query(
            model.Order.id,
            # Use coalesce to return "N/A" if customer is null
            func.coalesce(model.Customer.name, "N/A").label("customer_name"),
            model.Order.order_date,
            model.Order.status,
            # Use coalesce to return 0.0 if total is null (for orders with no items)
            func.coalesce(total_subquery.c.total, 0.0).label("total")
        )
        # Use outerjoin to include orders even if customer_id is null
        .outerjoin(model.Customer, model.Order.customer_id == model.Customer.id)
        .outerjoin(total_subquery, model.Order.id == total_subquery.c.order_id)
        .order_by(model.Order.order_date.desc()) # Show newest orders first
        .offset(skip)
        .limit(limit)
    )

    # 3. We must return a list of dictionaries that matches our new 'Order' schema
    results = query.all()

    orders_list = [
        {
            "id": r.id,
            "customer_name": r.customer_name,
            "order_date": r.order_date,
            "status": r.status,
            "total": r.total
        }
        for r in results
    ]

    return orders_list

def get_order_details(db: Session, order_id: int):
    """
    Gets the full details for a single order,
    including customer info and all line items.
    """
    order = (
        db.query(model.Order)
        .filter(model.Order.id == order_id)
        # Use joinedload to load related data in one query
        .options(
            joinedload(model.Order.customer), # Get the customer details
            joinedload(model.Order.items).joinedload(model.OrderDetail.product) # Get items and their products
        )
        .first()
    )
    
    if not order:
        return None
    
    # Manually create the response to match the OrderDetails schema
    # This handles cases where customer might be null
    if order.customer:
        customer_name = order.customer.name
        customer_email = order.customer.contact_info # Assuming email is in contact_info
        customer_phone = "N/A" # Your Customer model doesn't have a phone field
        customer_address = "N/A" # Your Customer model doesn't have an address field
    else:
        customer_name = "N/A"
        customer_email = "N/A"
        customer_phone = "N/A"
        customer_address = "N/A"

    # Calculate total
    total = sum(item.quantity * item.price_at_sale for item in order.items)

    # Build the final object
    order_details = {
        "id": order.id,
        "customer_name": customer_name,
        "order_date": order.order_date,
        "status": order.status,
        "total": total,
        "customer_email": customer_email,
        "customer_phone": customer_phone,
        "customer_address": customer_address,
        "items": order.items # This will be automatically shaped by Pydantic
    }
    
    return order_details

def update_order_status(db: Session, order_id: int, new_status: str):
    """
    Updates the status of a specific order.
    """
    db_order = db.query(model.Order).filter(model.Order.id == order_id).first()

    if db_order:
        db_order.status = new_status
        db.commit()
        db.refresh(db_order)

    return db_order # Returns the updated order or None if not found