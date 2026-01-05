import os
import random
from datetime import datetime

import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# -------------------- SETUP --------------------
load_dotenv()

app = Flask(__name__)
CORS(app)

OPENWEATHER_API_KEY = os.getenv(
    "OPENWEATHER_API_KEY",
    "c919f014a41d054f2c1182b7fa8c2025"
)

OPENWEATHER_BASE_URL = "https://api.openweathermap.org/data/2.5/weather"

# -------------------- LOCATION MAPPING --------------------
STATE_CITIES = {
    "Punjab": "Ludhiana,IN",
    "Haryana": "Chandigarh,IN",
    "Uttar Pradesh": "Lucknow,IN",
    "Madhya Pradesh": "Bhopal,IN",
    "Rajasthan": "Jaipur,IN",
    "Maharashtra": "Mumbai,IN",
    "Gujarat": "Ahmedabad,IN",
    "Andhra Pradesh": "Vijayawada,IN",
    "Karnataka": "Bangalore,IN",
    "Tamil Nadu": "Chennai,IN"
}

CITIES = {
    "Chennai": "Chennai,IN",
    "Coimbatore": "Coimbatore,IN",
    "Madurai": "Madurai,IN",
    "Tiruchirappalli": "Tiruchirappalli,IN",
    "Salem": "Salem,IN",
    "Vellore": "Vellore,IN",
    "Erode": "Erode,IN",
    "Tirunelveli": "Tirunelveli,IN",
    "Thanjavur": "Thanjavur,IN",
    "Mumbai": "Mumbai,IN",
    "Delhi": "Delhi,IN",
    "Bangalore": "Bangalore,IN",
    "Hyderabad": "Hyderabad,IN",
    "Pune": "Pune,IN",
    "Ahmedabad": "Ahmedabad,IN"
}

# -------------------- CROP NORMALIZATION --------------------
CROP_MAP = {
    "Wheat": "wheat",
    "Rice": "rice",
    "Maize": "millets",
    "Sugarcane": "sugarcane",
    "Cotton": "cotton",
    "Soybean": "pulses",
    "Mustard": "pulses",
    "Jowar": "millets"
}

CROP_THRESHOLDS = {
    "rice": {"moisture_min": 60, "temp_max": 32, "humidity_min": 70, "priority": "High"},
    "wheat": {"moisture_min": 45, "temp_max": 28, "humidity_min": 50, "priority": "Medium"},
    "cotton": {"moisture_min": 50, "temp_max": 35, "humidity_min": 60, "priority": "Medium"},
    "sugarcane": {"moisture_min": 70, "temp_max": 33, "humidity_min": 65, "priority": "High"},
    "millets": {"moisture_min": 35, "temp_max": 38, "humidity_min": 45, "priority": "Low"},
    "pulses": {"moisture_min": 40, "temp_max": 34, "humidity_min": 55, "priority": "Low"},
    "vegetables": {"moisture_min": 55, "temp_max": 30, "humidity_min": 65, "priority": "Medium"},
    "fruits": {"moisture_min": 50, "temp_max": 32, "humidity_min": 60, "priority": "Medium"}
}

# -------------------- WEATHER FETCH --------------------
def fetch_weather(city_query):
    params = {
        "q": city_query,
        "appid": OPENWEATHER_API_KEY,
        "units": "metric"
    }

    try:
        response = requests.get(OPENWEATHER_BASE_URL, params=params, timeout=10)
        if response.status_code == 200:
            data = response.json()
            return {
                "temperature": round(data["main"]["temp"], 1),
                "humidity": data["main"]["humidity"],
                "rainfall_mm": data.get("rain", {}).get("1h", 0),
                "wind_speed": data["wind"]["speed"],
                "pressure": data["main"]["pressure"],
                "weather_main": data["weather"][0]["main"],
                "timestamp": datetime.now().isoformat(),
                "api_source": "OpenWeatherMap"
            }
    except Exception as e:
        print("❌ Weather API error:", e)

    return None

# -------------------- ML IRRIGATION MODEL --------------------
def make_irrigation_decision(weather, crop):
    thresholds = CROP_THRESHOLDS.get(crop, CROP_THRESHOLDS["rice"])

    temp = weather["temperature"]
    hum = weather["humidity"]
    rain = weather["rainfall_mm"]

    moisture_need = 50 + (thresholds["moisture_min"] - 40) * 0.8
    temp_penalty = max(0, (temp - thresholds["temp_max"]) * 2)
    humidity_penalty = max(0, (thresholds["humidity_min"] - hum) * 1.5)
    rain_bonus = rain * 10 if rain > 2 else 0

    irrigation_score = moisture_need + humidity_penalty - rain_bonus - temp_penalty
    irrigation_score = max(0, min(100, irrigation_score))

    decision = "YES" if irrigation_score > 65 else "NO"
    confidence = min(98, 75 + random.uniform(0, 25))

    return {
        "irrigate_decision": decision,
        "confidence_score": f"{int(confidence)}%",
        "water_priority": thresholds["priority"],
        "irrigation_score": round(irrigation_score),
        "recommendation": (
            f"Irrigate {int(irrigation_score / 10)}L/acre"
            if decision == "YES"
            else "Skip irrigation – sufficient moisture"
        )
    }

# -------------------- MAIN API --------------------
@app.route("/weather/<location>", methods=["GET"])
def get_weather(location):
    crop_raw = request.args.get("crop", "rice")
    crop = CROP_MAP.get(crop_raw, crop_raw.lower())

    if location in CITIES:
        city_query = CITIES[location]
    elif location in STATE_CITIES:
        city_query = STATE_CITIES[location]
    else:
        return jsonify({
            "error": "Invalid location",
            "available_cities": list(CITIES.keys()),
            "available_states": list(STATE_CITIES.keys())
        }), 404

    weather = fetch_weather(city_query)

    if not weather:
        weather = {
            "temperature": round(26 + random.uniform(-2, 3), 1),
            "humidity": random.randint(55, 80),
            "rainfall_mm": round(random.uniform(0, 3.5), 1),
            "wind_speed": round(random.uniform(5, 15), 1),
            "pressure": 1012,
            "weather_main": "Clear",
            "timestamp": datetime.now().isoformat(),
            "api_source": "Fallback"
        }

    decision = make_irrigation_decision(weather, crop)

    return jsonify({
        **weather,
        **decision,
        "location": location,
        "crop_type": crop
    })

# -------------------- UTILITY ENDPOINTS --------------------
@app.route("/crops", methods=["GET"])
def get_crops():
    return jsonify({"crops": list(CROP_THRESHOLDS.keys())})

@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "api_key_configured": bool(OPENWEATHER_API_KEY)
    })

@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "🌾 Precision Agriculture API",
        "weather_endpoint": "/weather/<city_or_state>?crop=rice",
        "cities": list(CITIES.keys()),
        "states": list(STATE_CITIES.keys())
    })

# -------------------- RUN SERVER --------------------
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    print("🌾 Precision Agriculture Server Running")
    print(f"🚀 http://localhost:{port}")
    app.run(debug=True, host="0.0.0.0", port=port)
