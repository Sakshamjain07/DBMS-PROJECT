import bcrypt
from app.database.session import SessionLocal
from app.models import model

def seed_database():
    db = SessionLocal()
    try:
        # 1. Prevent accidental double-seeding
        if db.query(model.User).first():
            print("⚠️ Database is already seeded! If you want to re-seed, drop the tables first.")
            return

        print("🌱 Seeding Users...")
        admin_user = model.User(
            email="admin@stockflow.com",
            # Use raw bcrypt to hash the password directly
            hashed_password=bcrypt.hashpw(b"password123", bcrypt.gensalt()).decode("utf-8")
        )
        db.add(admin_user)

        print("🌱 Seeding Suppliers...")
        sup1 = model.Supplier(name="Global Tech Supplies", contact_person="John Doe", email="john@globaltech.com", contact_number="555-0198", category="Hardware")
        sup2 = model.Supplier(name="Apex Accessories", contact_person="Jane Smith", email="jane@apex.com", contact_number="555-0245", category="Peripherals")
        db.add_all([sup1, sup2])
        db.commit() 
        db.refresh(sup1) # Refresh to get their generated IDs
        db.refresh(sup2)

        print("🌱 Seeding Products...")
        prod1 = model.Product(name="Logitech MX Master 3", sku="MOU-001", category="Peripherals", currentStock=45, reorderPoint=15, supplier=sup2.name)
        prod2 = model.Product(name="Dell 27-inch 4K Monitor", sku="MON-003", category="Hardware", currentStock=5, reorderPoint=10, supplier=sup1.name) # Low stock!
        prod3 = model.Product(name="Keychron K2 Keyboard", sku="KEY-002", category="Peripherals", currentStock=120, reorderPoint=20, supplier=sup2.name)
        db.add_all([prod1, prod2, prod3])
        db.commit()
        db.refresh(prod1)
        db.refresh(prod2)

        print("🌱 Seeding Customers...")
        cust1 = model.Customer(name="Alice Johnson", email="alice@test.com", phone="555-0101", address="123 Main St, Tech City")
        cust2 = model.Customer(name="Bob Williams", email="bob@test.com", phone="555-0202", address="456 Innovation Drive")
        db.add_all([cust1, cust2])
        db.commit()
        db.refresh(cust1)
        db.refresh(cust2)

        print("🌱 Seeding Orders & Order Details...")
        # Order 1
        order1 = model.Order(customer_id=cust1.id, status="Delivered")
        db.add(order1)
        db.commit()
        db.refresh(order1)
        od1 = model.OrderDetail(order_id=order1.id, product_id=prod1.id, quantity=2, price_at_sale=99.99)
        
        # Order 2 (Pending)
        order2 = model.Order(customer_id=cust2.id, status="Pending")
        db.add(order2)
        db.commit()
        db.refresh(order2)
        od2 = model.OrderDetail(order_id=order2.id, product_id=prod2.id, quantity=1, price_at_sale=349.50)
        
        db.add_all([od1, od2])
        db.commit()

        print("✅ Success! Dummy data has been injected into your live database.")
        print("🔑 You can now log in with -> Email: admin@stockflow.com | Password: password123")

    except Exception as e:
        print(f"❌ Error during seeding: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()