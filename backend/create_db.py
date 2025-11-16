# create_db.py

# First, import the Base and engine from the database setup
from app.database.session import Base, engine

# Now, import all of the models.
# This is a VERY IMPORTANT step. Even though 'models' isn't explicitly used
# in this file, importing it here makes sure that all the table classes
# (like User, Product) are registered with the SQLAlchemy 'Base' metadata.
# If you do not import your models file here, Base.metadata will be empty
# and no tables will be created.
from app.models import model

print("Connecting to the database and creating tables...")

# Now, we can call create_all. It will know about all the tables
# defined in app/models/model.py because we imported it above.
Base.metadata.create_all(bind=engine)

print("Database and tables created successfully!")
print("You should now see an 'inventory.db' file in your project directory.")