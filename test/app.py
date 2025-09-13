from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Dict
import base64
from main1 import predict_disease

class ImagePayload(BaseModel):
    image_base64: str

app = FastAPI(
    title="Plant Disease Detection API (Base64)",
    description="Send a Base64 encoded image of a plant leaf to predict its disease.",
    version="1.1.0"
)

@app.post("/sih/disease_base64", response_model=Dict[str, str])
async def detect_disease_from_base64(payload: ImagePayload):

    image_bytes = base64.b64decode(payload.image_base64)
    disease, confidence = predict_disease(image_bytes)
    return {
        "predicted_disease": disease,
        "confidence": f"{confidence:.2f}"
    }


@app.get("/")
def root():
    return {
        "message": "API is running. POST to /sih/disease_base64 with a JSON payload.",
        "docs_url": "/docs"
    }

