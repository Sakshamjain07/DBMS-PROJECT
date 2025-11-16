# app/api/api.py

from fastapi import APIRouter, Depends
from app import security

# This file now ONLY defines the routers. It doesn't combine them.
public_router = APIRouter()
private_router = APIRouter()