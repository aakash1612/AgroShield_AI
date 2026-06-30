
# AgroShield AI: Real-Time Crop Health & Smart Soil Monitoring System

AgroShield AI is an end-to-end, full-stack Intelligent Agriculture platform designed to optimize crop yields and prevent losses in wheat cultivation. The system combines **Computer Vision (Deep Learning)** for automated wheat leaf disease diagnosis with **IoT Hardware Telemetry** (via Arduino/Microcontroller integration) for real-time soil chemistry analytics and localized weather insights.

---

## 📺 Project Demo & How It Works

Watch the complete walkthrough of how the hardware integration, mobile/cloud app interface, and web dashboard synchronize in real-time:

👉 **[Watch the AgroShield AI Full Project Video on YouTube](https://youtu.be/qkiMok3EBoU)**

> 💡 *Inside the video: See the live physical sensor calibration, data broadcasting from the microcontroller app interface, and the step-by-step leaf disease analysis engine.*

---

## 🚀 Key Features

- **Deep Learning Disease Diagnosis:** Uploads wheat leaf imagery to a custom machine learning model via a Node.js-to-Python pipeline to predict infections and determine precise pesticide requirements.
- **IoT Hardware Telemetry:** Real-time ingestion of soil metrics (pH, Moisture, Nitrogen, Phosphorus, Potassium) from physical sensors connected to an Arduino-compatible system.
- **Smart Threshold Analytics:** Automatically categorizes soil states into **Low, High, or Normal** ranges to provide actionable advice to farmers.
- **Weather API Analytics:** Integrates external weather APIs to provide localized environmental data for proactive crop management.
- **Secure Authentication:** State-of-the-art security implementing JSON Web Tokens (JWT) for secure user sessions and route protection.

---

## 🔌 Hardware & IoT Workflow

1. **Sensor Ingestion:** Physical soil moisture and NPK sensors collect live telemetry data from the soil.
2. **Microcontroller Bridge:** The Arduino firmware processes the analog/digital signals and transmits them over Wi-Fi/cellular networks using an IoT application wrapper.
3. **API Consumer Integration:** The Express backend listens via the `/api/soil` endpoint to dynamically ingest, analyze, and store the real-time soil health data.

---

## 🛠️ Tech Stack

### Frontend & App Interface
- **Web Dashboard:** React.js
- **Hardware Controller Application:** Arduino-compatible IoT Application Interface

### Backend & Infrastructure
- **Runtime Environment:** Node.js, Express.js
- **Database & Storage:** MongoDB (user credentials, telemetry data history), Multer (image disk storage configuration)
- **Security:** JWT (JSON Web Tokens), Bcrypt
- **Execution Layer:** Python (`child_process` execution for ML scripting)

### AI & IoT Hardware
- **Machine Learning:** Python-based Image Classification Model (wheat leaf disease detection)
- **Hardware:** Arduino/ESP32 Microcontroller, NPK Sensors, Soil Moisture Sensors

---

## 📁 Project Architecture

```text
SIH-2025/
├── backend/
│   ├── config/             # Database & global configurations
│   ├── middleware/         # Auth verification (JWT)
│   ├── ml_model_api/       # Python ML inference scripts (app.py)
│   ├── routes/
│   │   ├── auth.js         # User registration & login endpoints
│   │   ├── analysis.js     # Image upload & ML model runner logic
│   │   ├── soil.js         # Sensor thresholding & telemetry intake
│   │   └── weather.js      # Third-party weather API integration
│   ├── uploads/            # Temporary disk storage for analyzed leaf images
│   └── server.js           # Main Express server entry point
└── front-end/              # React dashboard application
```

---

## 🔌 API Endpoints Documentation

### 1. Authentication (`/api/auth`)
- `POST /register` — Registers a new user/farmer.
- `POST /login` — Validates credentials and issues a secure JWT token.

### 2. Crop Health Analysis (`/api/analysis`)
- `POST /analyze` — **Protected (JWT).** Accepts a `multipart/form-data` leaf image. Spawns an internal Python instance to execute deep learning models and returns disease classification, pesticide needs, and localized treatment status.

### 3. Soil Telemetry Engine (`/api/soil`)
- `POST /update` — Ingests physical IoT data streams.

**Threshold Metrics Evaluated:**
- **Soil Moisture:** Triggered Low (`<30%`), High (`>70%`)
- **pH Level:** Optimal growth tracking (`6.0 - 7.5`)
- **NPK (Nitrogen, Phosphorus, Potassium):** Live macronutrient balancing

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v16.x or higher)
- Python (3.8+ with relevant deep learning libraries installed)
- MongoDB instance (local or Atlas)

### Backend Setup

1. Clone the repository and navigate to the backend directory:
```bash
   cd backend
```
2. Install the required Node.js dependencies:
```bash
   npm install
```
3. Configure your environment variables (`.env`):
```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secure_jwt_secret
   WEATHER_API_KEY=your_external_weather_api_key
```
4. Start the development server:
```bash
   npm start
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
   cd ../front-end
```
2. Install dependencies and boot the UI client:
```bash
   npm install
   npm start
```
