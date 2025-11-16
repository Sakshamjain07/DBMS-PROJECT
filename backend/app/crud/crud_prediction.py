# app/crud/crud_prediction.py

import pandas as pd
from sqlalchemy.orm import Session
from sklearn.linear_model import LinearRegression
import numpy as np

from app.models import model

def predict_future_demand(db: Session, product_id: int, forecast_days: int = 30):
    # 1. Fetch historical sales data for the specific product
    sales_records = db.query(model.OrderDetail, model.Order.order_date).\
        join(model.Order).\
        filter(model.OrderDetail.product_id == product_id).\
        order_by(model.Order.order_date.asc()).all()

    if not sales_records or len(sales_records) < 2:
        # Not enough data to make a prediction
        return {"error": "Not enough historical sales data to generate a forecast."}

    # 2. Prepare the data using pandas
    # We will group sales by day
    data = [{"date": record.order_date.date(), "quantity": record.OrderDetail.quantity} for record in sales_records]
    df = pd.DataFrame(data)
    daily_sales = df.groupby('date')['quantity'].sum().reset_index()
    
    if len(daily_sales) < 2:
        return {"error": "Sales data exists, but on a single day. At least two different days are needed for a trend."}

    # 3. Create features for the model (days since the first sale)
    daily_sales['day_number'] = (daily_sales['date'] - daily_sales['date'].min()).dt.days
    
    X = daily_sales[['day_number']] # Features (input)
    y = daily_sales['quantity']     # Target (output)

    # 4. Train a Simple Linear Regression model
    model_lr = LinearRegression()
    model_lr.fit(X, y)

    # 5. Predict the demand for the next 'forecast_days'
    last_day = daily_sales['day_number'].max()
    future_days = np.arange(last_day + 1, last_day + 1 + forecast_days).reshape(-1, 1)
    
    predicted_sales = model_lr.predict(future_days)
    
    # Ensure predictions are non-negative
    predicted_sales[predicted_sales < 0] = 0
    
    total_predicted_demand = int(round(sum(predicted_sales)))

    return {
        "product_id": product_id,
        "forecast_period_days": forecast_days,
        "predicted_demand": total_predicted_demand
    }