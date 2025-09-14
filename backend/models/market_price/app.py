# running script for price prediction using FastAPI

from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd
import numpy as np
import joblib

# -------------------------------
# Load Model & Encoders
# -------------------------------
model = joblib.load(r"C:\Users\Nitesh\OneDrive\Desktop\SIH25\TODO_LIST_TRY\backend\models\market_price\xgboost_price_model.pkl")
encoders = joblib.load(r"C:\Users\Nitesh\OneDrive\Desktop\SIH25\TODO_LIST_TRY\backend\models\market_price\encoders.pkl")

# -------------------------------
# Load Historical Data
# -------------------------------
df = pd.read_csv(r"C:\Users\Nitesh\OneDrive\Desktop\SIH25\TODO_LIST_TRY\backend\database\market_price_6_days.csv")

# Clean arrival_date (handle "-" and "/")
df["arrival_date"] = df["arrival_date"].astype(str).str.replace("-", "/", regex=False)
df["arrival_date"] = pd.to_datetime(df["arrival_date"], format="%d/%m/%Y", errors="coerce")

# Drop duplicates and unnecessary columns
df = df.drop(columns=["variety", "grade"], errors="ignore").drop_duplicates()
df = df.sort_values(by=["state", "district", "commodity", "arrival_date"])

# -------------------------------
# FastAPI Setup
# -------------------------------
app = FastAPI(title="Commodity Price Prediction")

class PriceRequest(BaseModel):
    state: str
    district: str
    commodity: str
    top_n_markets: int = 3  # default top 3 markets

@app.post("/predict")
def predict_price(req: PriceRequest):
    # Filter dataset for given inputs
    subset = df[
        (df["state"].str.lower() == req.state.lower()) &
        (df["district"].str.lower() == req.district.lower()) &
        (df["commodity"].str.lower() == req.commodity.lower())
    ]

    if subset.empty:
        return {"error": "No data found for given input."}

    # Latest available date
    latest_date = subset["arrival_date"].max()

    # Markets reporting on latest date
    latest_subset = subset[subset["arrival_date"] == latest_date]
    markets = latest_subset["market"].unique()[:req.top_n_markets]

    results = []

    for market in markets:
        market_data = subset[subset["market"] == market].tail(3)  # last 3 records
        if len(market_data) < 2:
            continue  # skip markets with insufficient history

        latest = market_data.iloc[-1]

        # Encode categorical features
        try:
            state_enc = encoders["state"].transform([req.state])[0]
            district_enc = encoders["district"].transform([req.district])[0]
            commodity_enc = encoders["commodity"].transform([req.commodity])[0]
            market_enc = encoders["market"].transform([market])[0]
        except ValueError:
            continue  # skip unseen categories

        # Lag and rolling features
        lag_1 = market_data.iloc[-1]["modal_price"]
        lag_2 = market_data.iloc[-2]["modal_price"]
        rolling_mean_3 = market_data["modal_price"].mean()

        # Prepare input for model
        X_input = np.array([[state_enc, district_enc, market_enc, commodity_enc,
                             latest["min_price"], latest["max_price"], lag_1, lag_2, rolling_mean_3]])

        # Predict
        predicted_price = model.predict(X_input)[0]

        results.append({
            "market": market,
            "predicted_next_day_price": round(float(predicted_price), 2),
            "latest_min_price": round(float(latest["min_price"]), 2),
            "latest_max_price": round(float(latest["max_price"]), 2),
            "last_known_date": str(latest["arrival_date"].date())
        })

    return {
        "state": req.state,
        "district": req.district,
        "commodity": req.commodity,
        "prediction_date": str((latest_date + pd.Timedelta(days=1)).date()),
        "markets": results
    }
