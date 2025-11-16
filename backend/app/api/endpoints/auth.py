# app/api/endpoints/auth.py

from datetime import timedelta
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app import security
from app.schemas import schema
from app.crud import crud_login
from app.api.api import public_router

@public_router.post("/register", response_model=schema.UserInDB, tags=["Authentication"])
def register_user(user: schema.UserCreate, db: Session = Depends(security.get_db)):
    db_user = crud_login.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # --- THIS IS THE NEW LOGIC ---
    # 1. Hash the password here in the endpoint
    hashed_password = security.get_password_hash(user.password)
    # 2. Pass the hashed password to the CRUD function
    return crud_login.create_user(db=db, user=user, hashed_password=hashed_password)


@public_router.post("/login", response_model=schema.Token, tags=["Authentication"])
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(security.get_db)
):
    user = crud_login.get_user_by_email(db, email=form_data.username)
    if not user or not security.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=security.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}