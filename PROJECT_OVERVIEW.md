# SHETKARI Smart Irrigation Project Overview

### 1. Project Overview
**SHETKARI** is a high-tech smart irrigation and crop monitoring system. It uses a combination of **real-time hardware simulation** and **Machine Learning** to help farmers optimize water usage and nutrient management.

**Major Features:**
*   **Live Sensor Simulation**: Simulates Soil Moisture, Temperature, Humidity, and Rainfall physics.
*   **Nutrient Management (NPK)**: Tracks Nitrogen, Phosphorus, and Potassium levels with realistic decay models.
*   **AI Fertilizer Recommendation**: Suggests specific fertilizers based on soil nutrient levels.
*   **ML-Driven Irrigation**: Predicts soil moisture using Random Forest and LSTM models to automate irrigation.
*   **Crop Growth Recognition**: Analyzes crop photos (or simulates detection) to identify growth stages (e.g., Young Bud, Full Bloom).
*   **Synthetic Data Factory**: Generates bulk CSV datasets for ML training based on simulation parameters.

---

### 2. Tech Stack Identification
*   **Frontend**: React (Vite) + TypeScript, Tailwind CSS (Styling), Framer Motion (Animations), Radix UI (Components), TanStack Query (Data fetching).
*   **Backend (API Server)**: Node.js (Express), Zod (Schema validation/Type safety), Axios (Communication with ML service).
*   **ML Service**: Python (FastAPI), TensorFlow/Keras (Growth & LSTM models), Scikit-Learn/Joblib (Tree models).
*   **Database**: Currently uses an **In-memory Shared State** for simulation, with the ability to export data to CSV.

---

### 3. Folder & File Structure
| Path | Purpose |
| :--- | :--- |
| `artifacts/smart-farm/` | **Frontend Application** (The web dashboard) |
| `artifacts/api-server/` | **Central Backend** (Coordinates simulation and ML requests) |
| `ml-service/` | **Python ML Service** (Hosts and executes all AI models) |
| `lib/` | Shared libraries (DB schemas, API definitions) |

#### Important Files:
*   **Simulator logic**: `artifacts/api-server/src/lib/shared-state.ts` (Backend) & `artifacts/smart-farm/src/pages/Simulator.tsx` (Frontend).
*   **ML Implementation**: `ml-service/main.py`.
*   **Global Types**: `lib/api-zod/` (Shared schemas between frontend and backend).

---

### 4. Simulator Analysis
The simulator works by looping through a physical model every 200ms in the backend.

*   **Physics Engine**: Located in `calculateStep()` in `shared-state.ts`. It calculates how temperature evaporates water and how rain increases it.
*   **Nutrient Values (NPK)**: Handled as three distinct variables (`nitrogen`, `phosphorus`, `potassium`). They have a **Base Decay** (N: 0.12, P: 0.04, K: 0.02) and are further affected by rain (leaching) and heat stress.
*   **User Inputs**: When a user moves a slider on the UI, a request is sent to `/simulator/config`, which immediately updates the backend state.

---

### 5. ML Model Analysis
The project utilizes five distinct ML models located in the `ml-service/` directory:

| Model | File | Input | Output |
| :--- | :--- | :--- | :--- |
| **Fertilizer Rec** | `fertilizer_model.pkl` | N, P, K, Temp, Humidity, Moisture | Recommended Fertilizer Label |
| **Soil Moisture** | `random_forest_model.pkl` | Temp, Humidity, Rain, Prev Moisture | Predicted % Moisture |
| **Growth Stage** | `growth_stage_model.keras` | Image File (RGB) | Stage (e.g., "Early Bloom") + Confidence |
| **Forecasting** | `time_series_model.pkl` | Recent Moisture Lags | Future Moisture Trends |

---

### 6. Data Flow
1.  **Frontend**: User adjusts environment controls (e.g., sets Nitrogen to 40mg/kg).
2.  **API Server**: Receives config update. It triggers a `calculateStep()` to update physical values.
3.  **ML Trigger**: If the NPK values change by more than a threshold (5.0), the API server calls the **Python ML Service** via a POST request.
4.  **ML Service**: Processes the data using `joblib` or `tensorflow` and returns a prediction.
5.  **Synchronization**: The API server updates the `currentSimulatedData` object.
6.  **Real-time Update**: The Frontend (polling every 400ms) fetches the latest state and updates the dashboard charts and tables.

---

### 7. API Endpoints
#### ML Service (Port 8000)
*   `POST /predict/fertilizer`: Takes NPK + Env data -> Returns recommended fertilizer.
*   `POST /predict/growth-stage`: Takes image -> Returns stage analysis.
*   `POST /predict/soil-moisture`: Predicts next moisture level.

#### API Server (Port 5007)
*   `GET /simulator/config`: Gets current slider positions.
*   `POST /simulator/config`: Updates slider positions/ML model toggles.
*   `GET /simulator/latest`: Gets the latest real-time data point.
*   `POST /simulator/bulk`: Generates and downloads CSV history.

---

### 8. UI Components
*   **Dashboard (`Dashboard.tsx`)**: Displays summary cards for Moisture, Temp, and NPK.
*   **Simulator Page (`Simulator.tsx`)**:
    *   **Env Controls**: Left panel containing Sliders for N, P, K, pH, etc.
    *   **ML Toggles**: Switches to enable/disable specific models.
    *   **Live Stream**: Table showing the incoming data from the backend.
*   **Crop Analysis (`CropAnalysis.tsx`)**: Camera interface and photo upload for growth stage AI.

---

### 9. Integration Points for Future Changes
*   **Splitting NPK**: The backend already handles N, P, and K individually in `simulatorConfig.controls`. The frontend also has individual sliders for them.
*   **Connecting Fertilizer Recommendation**: To change how recommendations are triggered, modify `runMLInference()` in `shared-state.ts` (Backend). For UI changes, modify the "AI Fertilizer Forecast" card in `Simulator.tsx`.

---

### 10. Summary
*   **Frontend Changes**: Focus on `artifacts/smart-farm/src/pages/Simulator.tsx` for UI controls and charts.
*   **Backend Changes**: Focus on `artifacts/api-server/src/lib/shared-state.ts` for simulation logic and ML service connection.
*   **ML Connection**: The bridge exists in the API server's `runMLInference` function, which uses `axios` to talk to the Python service.
