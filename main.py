from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
import joblib
import numpy as np
import pandas as pd
from fastapi.middleware.cors import CORSMiddleware
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="House Price Prediction API",
    description="Advanced ML-powered House Price Prediction API using Random Forest Regressor.",
    version="1.1.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Feature metadata and descriptions for the UI
FEATURE_METADATA = {
    "MedInc": {"label": "Median Income", "description": "Median income in block group (in tens of thousands $)", "min": 0.5, "max": 15.0},
    "HouseAge": {"label": "House Age", "description": "Median house age in block group", "min": 1, "max": 52},
    "AveRooms": {"label": "Average Rooms", "description": "Average number of rooms per household", "min": 1, "max": 10},
    "AveBedrms": {"label": "Average Bedrooms", "description": "Average number of bedrooms per household", "min": 0.5, "max": 5},
    "Population": {"label": "Population", "description": "Block group population", "min": 3, "max": 35000},
    "AveOccup": {"label": "Average Occupancy", "description": "Average number of household members", "min": 1, "max": 6},
    "Latitude": {"label": "Latitude", "description": "Block group latitude", "min": 8.0, "max": 38.0},
    "Longitude": {"label": "Longitude", "description": "Block group longitude", "min": 68.0, "max": 98.0}
}

# Global variables for model and features
model = None
feature_names = []

@app.on_event("startup")
def load_model():
    global model, feature_names
    try:
        model = joblib.load("house_price_model.joblib")
        with open("feature_names.txt", "r") as f:
            feature_names = [line.strip() for line in f.readlines()]
        logger.info("Successfully loaded model and feature names.")
    except Exception as e:
        logger.error(f"Critical error loading model: {e}")

class HousingFeatures(BaseModel):
    MedInc: float = Field(..., example=3.5, description="Median Income")
    HouseAge: float = Field(..., example=30.0, description="Median House Age")
    AveRooms: float = Field(..., example=5.0, description="Average Rooms")
    AveBedrms: float = Field(..., example=1.0, description="Average Bedrooms")
    Population: float = Field(..., example=1000.0, description="Population")
    AveOccup: float = Field(..., example=3.0, description="Average Occupancy")
    Latitude: float = Field(..., example=34.0, description="Latitude")
    Longitude: float = Field(..., example=-118.0, description="Longitude")

@app.get("/", tags=["General"])
def read_root():
    return {
        "status": "online",
        "message": "House Price Prediction API is active",
        "endpoints": ["/predict", "/metadata"]
    }

@app.get("/metadata", tags=["Data"])
def get_metadata():
    """Returns metadata about the features to help the frontend build sliders/inputs."""
    return FEATURE_METADATA

@app.post("/predict", tags=["ML"])
def predict(features: HousingFeatures):
    """Predicts house price based on input features."""
    if model is None:
        raise HTTPException(status_code=530, detail="Model currently unavailable.")
    
    try:
        # Prepare features in the correct order
        input_data = np.array([[
            features.MedInc,
            features.HouseAge,
            features.AveRooms,
            features.AveBedrms,
            features.Population,
            features.AveOccup,
            features.Latitude,
            features.Longitude
        ]])
        
        prediction = model.predict(input_data)[0]
        
        # In California Housing dataset, prices are in units of $100,000
        absolute_price = prediction * 100000
        
        return {
            "prediction_score": float(prediction),
            "predicted_price": round(absolute_price, 2),
            "currency": "INR",
            "formatted_price": f"₹{absolute_price:,.2f}"
        }
    except Exception as e:
        logger.error(f"Prediction error: {e}")
        raise HTTPException(status_code=500, detail="Internal prediction failure.")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
 
