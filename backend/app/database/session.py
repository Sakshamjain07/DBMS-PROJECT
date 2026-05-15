import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

load_dotenv() # This loads everything from your .env file

SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")
# Create the SQLAlchemy engine 
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# Create a SessionLocal class, which will be a factory for new session objects
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create a Base class. Our ORM models will inherit from this class.
Base = declarative_base()