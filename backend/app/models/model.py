# app/models/model.py

from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.session import Base # Absolute import

class Product(Base):
    __tablename__ = "products"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    
    sku = Column(String, unique=True, index=True)
    category = Column(String, index=True)
    currentStock = Column(Integer)
    reorderPoint = Column(Integer)
    supplier = Column(String)

class Supplier(Base):
    __tablename__ = "suppliers"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)

    contact_person = Column(String)
    email = Column(String)
    contact_number = Column(String)
    category = Column(String, index=True)

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)

class Customer(Base):
    __tablename__ = "customers"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    address = Column(String, nullable=True)

class Order(Base):
    __tablename__ = "orders"
    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=True)
    order_date = Column(DateTime(timezone=True), server_default=func.now())
    
    status = Column(String, default="Pending") # e.g., Pending, Shipped, Delivered

    items = relationship("OrderDetail", back_populates="order")
    customer = relationship("Customer")
    
class OrderDetail(Base):
    __tablename__ = "order_details"
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    product_id = Column(Integer, ForeignKey("products.id"))
    quantity = Column(Integer)
    price_at_sale = Column(Float)

    order = relationship("Order", back_populates="items")
    product = relationship("Product")

class PurchaseOrder(Base):
    __tablename__ = "purchase_orders"
    id = Column(Integer, primary_key=True, index=True)
    supplier_id = Column(Integer, ForeignKey("suppliers.id"))
    order_date = Column(DateTime(timezone=True), server_default=func.now())
    status = Column(String, default="Pending") # e.g., Pending, Approved, Received

    items = relationship("PurchaseOrderDetail", back_populates="purchase_order")
    supplier = relationship("Supplier")

class PurchaseOrderDetail(Base):
    __tablename__ = "purchase_order_details"
    id = Column(Integer, primary_key=True, index=True)
    purchase_order_id = Column(Integer, ForeignKey("purchase_orders.id"))
    product_id = Column(Integer, ForeignKey("products.id"))
    quantity = Column(Integer)

    purchase_order = relationship("PurchaseOrder", back_populates="items")
    product = relationship("Product")