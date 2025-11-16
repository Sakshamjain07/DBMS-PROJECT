# app/crud/crud_dashboard.py

from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models import model
from datetime import date, timedelta

def get_dashboard_kpis(db: Session):
    """
    Calculates the four main KPIs for the dashboard.
    
    """
    today = date.today()

    # 1. Revenue Today
    # We join orders and order_details, filter for today, and sum the totals.
    # Note: We must hard-code a price here since your Product model doesn't have one.
    revenue_today_query = (
        db.query(func.sum(model.OrderDetail.quantity * model.OrderDetail.price_at_sale))
          .join(model.Order, model.OrderDetail.order_id == model.Order.id)
          .filter(func.DATE(model.Order.order_date) == today)
    )
    revenue_today = revenue_today_query.scalar() or 0.0

    # 2. Orders Today
    orders_today = (
        db.query(func.count(model.Order.id))
          .filter(func.DATE(model.Order.order_date) == today)
          .scalar() or 0
    )
    
    # 3. Pending Orders (Total)
    pending_orders = (
        db.query(func.count(model.Order.id))
          .filter(model.Order.status == "Pending")
          .scalar() or 0
    )
    
    # 4. Low Stock Items (Total)
    # Finds products where currentStock is at or below the reorderPoint
    low_stock_items = (
        db.query(func.count(model.Product.id))
          .filter(model.Product.currentStock <= model.Product.reorderPoint)
          .scalar() or 0
    )

    return {
        "revenue_today": revenue_today,
        "orders_today": orders_today,
        "pending_orders": pending_orders,
        "low_stock_items": low_stock_items,
    }

def get_low_stock_alerts(db: Session, limit: int = 5):
    """
    Gets a list of products that are at or below their reorder point.
    """
    low_stock_products = (
        db.query(model.Product)
          .filter(model.Product.currentStock <= model.Product.reorderPoint)
          .order_by(model.Product.currentStock.asc()) # Show the lowest stock first
          .limit(limit)
          .all()
    )
    return low_stock_products

def get_priority_tasks(db: Session, limit: int = 3):
    """
    Gets a combined list of high-priority tasks from different tables.
    """
    tasks = [] # This is our list of tasks to return

    # 1. TASK: Check for old pending orders
    # Find orders older than 1 day (24 hours) that are still 'Pending'
    one_day_ago = date.today() - timedelta(days=1)

    old_pending_orders_count = (
        db.query(func.count(model.Order.id))
          .filter(model.Order.status == "Pending")
          .filter(func.DATE(model.Order.order_date) <= one_day_ago)
          .scalar() or 0
    )

    if old_pending_orders_count > 0:
        tasks.append({
            "type": "Pending Orders",
            "description": f"{old_pending_orders_count} pending orders are over 24 hours old.",
            "link_to": "/orders"
        })

    # 2. TASK: Check for the *most* critical low stock item
    most_critical_item = (
        db.query(model.Product)
          .filter(model.Product.currentStock <= model.Product.reorderPoint)
          .order_by(model.Product.currentStock.asc()) # Get the one with the *least* stock
          .first()
    )

    if most_critical_item:
        tasks.append({
            "type": "Low Stock",
            "description": f"{most_critical_item.name} is below reorder point.",
            "link_to": f"/inventory" # We'd need to update the Product page to handle filtering
        })

    # 3. TASK: Check for late supplier shipments (Purchase Orders)
    # (Your 'PurchaseOrder' model has 'status', let's find 'Pending' ones)
    late_shipments_count = (
        db.query(func.count(model.PurchaseOrder.id))
          .filter(model.PurchaseOrder.status == "Pending") # Assuming 'Pending' means late
          .scalar() or 0
    )

    if late_shipments_count > 0:
        tasks.append({
            "type": "Late Shipment",
            "description": f"{late_shipments_count} supplier shipments are late.",
            "link_to": "/suppliers" # We don't have a PO page, so this is a guess
        })

    # Return the first 3 tasks, or however many we found
    return tasks[:limit]