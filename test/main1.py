import numpy as np
import io
from keras.preprocessing import image
from keras.models import load_model 
from PIL import Image
from huggingface_hub import hf_hub_download

model_path = hf_hub_download(repo_id="calvinCandieC137/Plant_Disease", filename="plant_disease_model_finetuned.h5")
model = load_model(model_path, compile=False)

CLASS_NAMES = [
    "Apple__Apple_scab", "Apple_Black_rot", "Apple_Cedar_apple_rust", "Apple__healthy",
    "Blueberry__healthy", "Cherry(including_sour)Powdery_mildew", "Cherry(including_sour)_healthy",
    "Corn_(maize)Cercospora_leaf_spot Gray_leaf_spot", "Corn(maize)Common_rust",
    "Corn_(maize)Northern_Leaf_Blight", "Corn(maize)healthy", "Grape__Black_rot",
    "Grape__Esca(Black_Measles)", "Grape__Leaf_blight(Isariopsis_Leaf_Spot)", "Grape___healthy",
    "Orange__Haunglongbing(Citrus_greening)", "Peach__Bacterial_spot", "Peach__healthy",
    "Pepper_bell__Bacterial_spot", "Pepper_bell_healthy", "Potato__Early_blight",
    "Potato__Late_blight", "Potato_healthy", "Raspberry_healthy", "Soybean__healthy",
    "Squash__Powdery_mildew", "Strawberry_Leaf_scorch", "Strawberry__healthy",
    "Tomato__Bacterial_spot", "Tomato_Early_blight", "Tomato__Late_blight",
    "Tomato__Leaf_Mold", "Tomato_Septoria_leaf_spot", "Tomato__Spider_mites Two-spotted_spider_mite",
    "Tomato__Target_Spot", "Tomato_Tomato_Yellow_Leaf_Curl_Virus", "Tomato__Tomato_mosaic_virus",
    "Tomato___healthy"
]

TARGET_SIZE = (128, 128)

def preprocess_image(image_bytes: bytes, target_size: tuple) -> np.ndarray:

    img = Image.open(io.BytesIO(image_bytes))
    if img.mode != "RGB":
        img = img.convert("RGB")
    img = img.resize(target_size)
    img_array = image.img_to_array(img)
    img_array = img_array / 255.0  
    img_array = np.expand_dims(img_array, axis=0)  
    return img_array

def predict_disease(image_bytes: bytes) -> tuple:

    if model is None:
        raise RuntimeError("Model is not loaded. Cannot perform prediction.")
        
    img_array = preprocess_image(image_bytes, TARGET_SIZE)
    predictions = model.predict(img_array)
    
    predicted_class_index = np.argmax(predictions, axis=1)[0]
    confidence = float(np.max(predictions))
    
    predicted_class_name = CLASS_NAMES[predicted_class_index]
    
    return predicted_class_name, confidence
