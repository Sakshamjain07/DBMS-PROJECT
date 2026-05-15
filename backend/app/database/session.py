import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

load_dotenv()

raw_url = os.getenv("DATABASE_URL")

# Production Fail-safe: Ensure the URL starts with 'postgresql+psycopg2://'
# Render/Heroku style environments sometimes pass raw 'postgres://' or 'postgresql://' strings 
# which cause driver parsing crashes in SQLAlchemy 2.0+
if raw_url and raw_url.startswith("postgresql://"):
    SQLALCHEMY_DATABASE_URL = raw_url.replace("postgresql://", "postgresql+pg8000://", 1)
else:
    SQLALCHEMY_DATABASE_URL = raw_url

# Add a connect_timeout flag so it doesn't hang forever if the cloud network is busy
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    pool_pre_ping=True,  # Automatically check if connection is alive before using it
    pool_recycle=300     # Refresh connections every 5 minutes
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()