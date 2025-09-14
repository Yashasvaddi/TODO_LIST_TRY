# TO RUN Region_wise_crop_recommendation_API

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Dict, List, Any, Optional
import uvicorn
import joblib
import numpy as np
import json
import requests
from datetime import datetime
import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="Crop Recommendation API",
    description="API for recommending crops based on location coordinates",
    version="1.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class LocationRequest(BaseModel):
    lat: float
    lon: float

class CropRecommendation(BaseModel):
    crop: str
    confidence: float

class RecommendationResponse(BaseModel):
    location: Dict[str, Any]
    soil_characteristics: Dict[str, Any]
    weather_data: Optional[Dict[str, Any]]
    crop_recommendations: List[CropRecommendation]
    process_log: List[str]

# Global variables for loaded models
soil_models = None
soil_encoders = None
soil_scaler = None
cat_model = None
scaler_cat = None
mlb = None
weather_api_key = os.getenv('WEATHER_API_KEY')

# Load all models at startup
@app.on_event("startup")
async def load_models():
    global soil_models, soil_encoders, soil_scaler, cat_model, scaler_cat, mlb
    
    try:
        # Set the models directory path
        models_dir = r"backend\models\Region_wise_crop"
        
        # Load soil prediction models
        soil_models = joblib.load(os.path.join(models_dir, 'soil_prediction_models.pkl'))
        soil_encoders = joblib.load(os.path.join(models_dir, 'soil_level_encoders.pkl'))
        soil_scaler = joblib.load(os.path.join(models_dir, 'soil_feature_scaler.pkl'))
        
        # Load crop recommendation models
        cat_model = joblib.load(os.path.join(models_dir, 'crop_recommender_model.pkl'))
        scaler_cat = joblib.load(os.path.join(models_dir, 'crop_feature_scaler.pkl'))
        mlb = joblib.load(os.path.join(models_dir, 'crop_multilabel_binarizer.pkl'))
        
        print("All models loaded successfully")
    except Exception as e:
        print(f"Error loading models: {str(e)}")
        raise e

# Predict soil characteristics based on location
def predict_soil_characteristics(latitude, longitude):
    """
    Predict soil characteristics (N, P, K, pH levels) based on location
    """
    # Prepare input data
    input_location = np.array([[latitude, longitude]])
    
    # Scale the input
    input_scaled = soil_scaler.transform(input_location)
    
    # Make predictions for each soil characteristic
    predictions = {}
    
    for level in soil_encoders.keys():
        # Predict encoded level
        level_encoded = soil_models[level].predict(input_scaled)[0]
        
        # Decode to get the actual level name
        level_name = soil_encoders[level].inverse_transform([level_encoded])[0]
        
        # Store in predictions dictionary
        predictions[level] = level_name
    
    return predictions

# Get weather data
async def get_weather_data(latitude, longitude):
    """
    Fetch weather data from a weather API for a specific location
    """
    if not weather_api_key:
        return None
        
    url = f"https://api.weatherapi.com/v1/current.json?key={weather_api_key}&q={latitude},{longitude}"
    try:
        response = requests.get(url, timeout=10)
        if response.status_code == 200:
            data = response.json()
            
            # Extract relevant weather information
            weather_data = {
                "lat": latitude,
                "lon": longitude,
                "temperature": data["current"]["temp_c"],
                "humidity": data["current"]["humidity"],
                "description": data["current"]["condition"]["text"],
                "wind_speed": data["current"]["wind_kph"] / 3.6,  # Convert to m/s
                "rainfall": data["current"]["precip_mm"],
                "timestamp": datetime.now().isoformat()
            }
            return weather_data
        else:
            return None
    except Exception as e:
        print(f"Error fetching weather data: {e}")
        return None

# Convert soil level to distribution
def convert_level_to_distribution(level, is_ph=False):
    """
    Convert categorical soil level to numeric distribution
    """
    if not is_ph:
        # For NPK levels
        if level == 'High':
            return (0.7, 0.2, 0.1)  # (high, medium, low)
        elif level == 'Medium':
            return (0.3, 0.6, 0.1)  # (high, medium, low)
        elif level == 'Low':
            return (0.1, 0.2, 0.7)  # (high, medium, low)
        else:
            return (0.33, 0.33, 0.34)  # balanced if unknown
    else:
        # For pH levels (acidic, neutral, alkaline)
        if level == 'Acidic':
            return (0.7, 0.2, 0.1)  # (acidic, neutral, alkaline)
        elif level == 'Neutral':
            return (0.1, 0.8, 0.1)  # (acidic, neutral, alkaline)
        elif level == 'Alkaline':
            return (0.1, 0.2, 0.7)  # (acidic, neutral, alkaline)
        else:
            return (0.33, 0.33, 0.34)  # balanced if unknown

# Recommend crops based on soil characteristics and location
def recommend_crops(latitude, longitude, 
                   nitrogen_levels, phosphorous_levels, potassium_levels, ph_levels,
                   top_n=5):
    """
    Recommend crops based on location and soil characteristics
    """
    # Prepare input features
    # Convert location to scaled format
    loc_input = np.array([[latitude, longitude]])
    scaled_loc = scaler_cat.transform(loc_input)
    
    # Create feature vector with soil characteristics distributions
    features = []
    
    # Add scaled location
    features.extend(scaled_loc[0])
    
    # Add one-hot encoded distributions for N levels (High, Medium, Low)
    features.extend([
        nitrogen_levels[0],     # N_High
        nitrogen_levels[1],     # N_Medium  
        nitrogen_levels[2]      # N_Low
    ])
    
    # Add one-hot encoded distributions for P levels
    features.extend([
        phosphorous_levels[0],  # P_High
        phosphorous_levels[1],  # P_Medium
        phosphorous_levels[2]   # P_Low
    ])
    
    # Add one-hot encoded distributions for K levels
    features.extend([
        potassium_levels[0],    # K_High
        potassium_levels[1],    # K_Medium
        potassium_levels[2]     # K_Low
    ])
    
    # Add one-hot encoded distributions for pH levels
    features.extend([
        ph_levels[0],           # pH_Acidic
        ph_levels[1],           # pH_Neutral
        ph_levels[2]            # pH_Alkaline
    ])
    
    # Convert to numpy array and reshape for prediction
    X_pred = np.array(features).reshape(1, -1)
    
    # Predict probability for each crop using the categorical model
    crop_probabilities = cat_model.predict_proba(X_pred)
    
    # Get the classes (crops) from the MultiLabelBinarizer
    crop_names = mlb.classes_
    
    # Create list of (crop, probability) pairs
    crop_prob_pairs = []
    
    # For each classifier in the MultiOutputClassifier
    for i, proba_list in enumerate(crop_probabilities):
        # If the crop has a probability > 0 for class 1 (presence of crop)
        if len(proba_list[0]) > 1:  # Make sure we have probabilities for both classes
            # Get probability for class 1 (presence of crop)
            prob = proba_list[0][1]
            crop_name = crop_names[i]
            crop_prob_pairs.append((crop_name, prob))
    
    # Sort by probability in descending order
    crop_prob_pairs.sort(key=lambda x: x[1], reverse=True)
    
    # Return top N recommendations
    return crop_prob_pairs[:top_n]

@app.post("/recommend", response_model=RecommendationResponse)
async def get_crop_recommendations(request: LocationRequest):
    """
    Get crop recommendations based on location coordinates
    
    This endpoint takes latitude and longitude and provides:
    - Soil characteristics based on the location
    - Weather data for the location
    - Crop recommendations based on the soil and location
    """
    results = {
        "location": {
            "latitude": request.lat,
            "longitude": request.lon
        },
        "soil_characteristics": {},
        "weather_data": {},
        "crop_recommendations": [],
        "process_log": []
    }
    
    # Step 1: Predict soil characteristics from location
    try:
        soil_predictions = predict_soil_characteristics(request.lat, request.lon)
        results["soil_characteristics"] = soil_predictions
        results["process_log"].append("Soil characteristics predicted from location model")
    except Exception as e:
        error_msg = f"Error predicting soil characteristics: {str(e)}"
        results["process_log"].append(error_msg)
        raise HTTPException(status_code=500, detail=error_msg)
    
    # Step 2: Get weather data
    try:
        weather_data = await get_weather_data(request.lat, request.lon)
        if weather_data:
            results["weather_data"] = weather_data
            results["process_log"].append("Weather data retrieved successfully")
        else:
            results["process_log"].append("Weather data not available")
    except Exception as e:
        results["process_log"].append(f"Weather data retrieval failed: {str(e)}")
    
    # Step 3: Convert soil levels to distributions for crop recommender
    try:
        n_level_dist = convert_level_to_distribution(soil_predictions.get('N_level', 'Medium'))
        p_level_dist = convert_level_to_distribution(soil_predictions.get('P_level', 'Medium'))
        k_level_dist = convert_level_to_distribution(soil_predictions.get('K_level', 'Low'))
        ph_level_dist = convert_level_to_distribution(soil_predictions.get('pH_level', 'Neutral'), is_ph=True)
        
        # Step 4: Get crop recommendations
        recommendations = recommend_crops(
            request.lat, request.lon,
            nitrogen_levels=n_level_dist,
            phosphorous_levels=p_level_dist,
            potassium_levels=k_level_dist,
            ph_levels=ph_level_dist,
            top_n=5
        )
        
        results["crop_recommendations"] = [
            {"crop": crop, "confidence": float(conf)} 
            for crop, conf in recommendations
        ]
        results["process_log"].append("Crop recommendations generated successfully")
        
    except Exception as e:
        error_msg = f"Error generating crop recommendations: {str(e)}"
        results["process_log"].append(error_msg)
        raise HTTPException(status_code=500, detail=error_msg)
    
    return results

@app.get("/health")
async def health_check():
    """API health check endpoint"""
    model_status = all([soil_models, soil_encoders, soil_scaler, cat_model, scaler_cat, mlb])
    return {
        "status": "healthy", 
        "models_loaded": model_status,
        "weather_api_available": weather_api_key is not None
    }

@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "Crop Recommendation API",
        "endpoints": {
            "POST /recommend": "Get crop recommendations for coordinates",
            "GET /health": "Check API health status"
        }
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)