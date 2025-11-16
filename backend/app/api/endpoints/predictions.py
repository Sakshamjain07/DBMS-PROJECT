# app/api/endpoints/predictions.py

from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session

from app import security
from app.schemas import schema
from app.crud import crud_prediction
from app.api.api import private_router

@private_router.get("/predictions/demand/{product_id}", response_model=schema.DemandPrediction, tags=["Predictions"])
def get_demand_prediction(product_id: int, forecast_days: int = 30, db: Session = Depends(security.get_db)):
    """
    Predicts the future sales demand for a given product based on historical sales data.
    """
    prediction_result = crud_prediction.predict_future_demand(db, product_id=product_id, forecast_days=forecast_days)
    
    if "error" in prediction_result:
        raise HTTPException(status_code=400, detail=prediction_result["error"])
        
    return prediction_result