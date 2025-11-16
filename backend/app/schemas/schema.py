# app/schemas/schema.py

from datetime import datetime
from pydantic import BaseModel, Field
from typing import Optional, List 

# --- Token Schemas ---

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# --- User Schemas ---

class UserBase(BaseModel):
    email: str

class UserCreate(UserBase):
    password: str = Field(..., min_length=5, max_length=72)

class UserInDB(UserBase):
    id: int
    class Config:
        from_attributes = True

# --- Supplier Schemas ---

# This is our new "Base" model, matching your form
class SupplierBase(BaseModel):
    name: str
    contact_person: str
    email: str
    contact_number: str
    category: str

# The create_supplier schema
class SupplierCreate(SupplierBase):
    pass

# The update_supplier schema
class SupplierUpdate(BaseModel):
    name: Optional[str] = None
    contact_person: Optional[str] = None
    email: Optional[str] = None
    contact_number: Optional[str] = None
    category: Optional[str] = None

# This is what the API will return (includes the ID)
class Supplier(SupplierBase):
    id: int
    class Config:
        from_attributes = True

# --- END OF SUPPLIER SCHEMAS ---

# --- Customer Schemas ---

class CustomerBase(BaseModel):
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None

class CustomerCreate(CustomerBase):
    pass

class Customer(CustomerBase):
    id: int
    class Config:
        from_attributes = True
        
# --- END OF CUSTOMER SCHEMAS ---

# --- Product Schemas ---

class ProductBase(BaseModel):
    name: str
    sku: str
    category: str
    supplier: str 
    currentStock: int
    reorderPoint: int

# The create_product schema is identical to the base
class ProductCreate(ProductBase):
    pass

# The update schema
class ProductUpdate(BaseModel):
    name: Optional[str] = None
    sku: Optional[str] = None
    category: Optional[str] = None
    supplier: Optional[str] = None
    currentStock: Optional[int] = None
    reorderPoint: Optional[int] = None

# This is what the API will return (includes the ID)
class Product(ProductBase):
    id: int
    class Config:
        from_attributes = True

# --- Sales Schemas ---

class ItemSold(BaseModel):
    product_id: int
    quantity: int

class SaleCreate(BaseModel):
    customer_id: Optional[int] = None
    items_sold: List[ItemSold] 

class SaleResponse(BaseModel):
    sale_id: int
    status: str
    detail: str

# --- Dashboard Schemas ---

class DashboardKPIs(BaseModel):
    revenue_today: float
    orders_today: int
    pending_orders: int
    low_stock_items: int

class LowStockProduct(BaseModel):
    # A simplified product schema just for this alert
    id: int
    name: str
    quantity: int
    reorder_point: int

    class Config:
        from_attributes = True

class LowStockAlert(BaseModel):
    id: int
    name: str
    currentStock: int
    reorderPoint: int

    currentStock: int
    reorderPoint: int

    class Config:
        from_attributes = True # This tells Pydantic to read from our DB model


# --- Reorder & Purchase Order Schemas ---

class ReorderSuggestion(BaseModel):
    product_id: int
    product_name: str
    current_quantity: int
    reorder_point: int
    recommended_order_quantity: int = 100 # Default placeholder for now

    class Config:
        from_attributes = True

class PurchaseOrderItemCreate(BaseModel):
    product_id: int
    quantity: int

class PurchaseOrderCreate(BaseModel):
    supplier_id: int
    items_to_order: List[PurchaseOrderItemCreate]

class PurchaseOrderResponse(BaseModel):
    purchase_order_id: int
    status: str
    detail: str

class PriorityTask(BaseModel):
    type: str  # e.g., "Pending Orders", "Low Stock", "Late Shipment"
    description: str
    link_to: str # e.g., "/orders", "/inventory/1"

# --- Prediction Schemas ---

class DemandPrediction(BaseModel):
    product_id: int
    forecast_period_days: int
    predicted_demand: int

class Order(BaseModel):
    id: int
    customer_name: str
    order_date: datetime
    total: float
    status: str

    class Config:
        from_attributes = True
class OrderDetailProduct(BaseModel):
    """ A schema for the product details inside an order """
    name: str

    class Config:
        from_attributes = True

class OrderDetailItem(BaseModel):
    """ A schema for the line items in an order """
    quantity: int
    price_at_sale: float
    product: OrderDetailProduct # Nested product details
    class Config:
        from_attributes = True

class OrderDetails(Order):
    """ The full order details, inherits from the basic Order """
    customer_email: str
    customer_phone: str
    customer_address: str
    items: List[OrderDetailItem] # A list of the items

    class Config:
        from_attributes = True

class OrderUpdateStatus(BaseModel):
    status: str # e.g., "Pending", "Shipped", "Delivered"