# app/crud/crud_login.py

from sqlalchemy.orm import Session
from app.models import model
from app.schemas import schema

# This file no longer imports 'security'

def get_user_by_email(db: Session, email: str):
    return db.query(model.User).filter(model.User.email == email).first()

# The function now accepts a hashed_password directly
def create_user(db: Session, user: schema.UserCreate, hashed_password: str):
    db_user = model.User(email=user.email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user