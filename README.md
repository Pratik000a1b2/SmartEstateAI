# SmartEstate™ - AI & Real-World Spatial Machine Learning Valuation Engine

[![Production Build](https://img.shields.io/badge/build-passing-brightgreen.svg)]()
[![ML Model](https://img.shields.io/badge/Model-Scikit--Learn%20Ridge%20v2.4-blue.svg)]()
[![R2 Score](https://img.shields.io/badge/Test%20R%C2%B2-0.892-emerald.svg)]()
[![Map Engine](https://img.shields.io/badge/Map-OpenStreetMap%20%2B%20Leaflet-brightgreen.svg)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-blue.svg)]()
[![React](https://img.shields.io/badge/React-19.0.1-61dafb.svg)]()
[![Firebase](https://img.shields.io/badge/Firebase-Firestore%20%26%20Auth-ffca28.svg)]()
[![Deployment](https://img.shields.io/badge/Deployment-Vercel%20%7C%20Cloud%20Run-black.svg)]()
[![Author](https://img.shields.io/badge/Lead%20AI%2FML%20Engineer-Pratik%20Panzade-indigo.svg)]()

**SmartEstate™** is an end-to-end Machine Learning property valuation, real-world spatial geo-analytics, multi-horizon price forecasting, and statistical risk analysis system engineered by **Pratik Panzade** (AI/ML Engineer).

---

## 🌟 Key Features

- 🗺️ **Interactive Real-World Spatial Map (OpenStreetMap + Leaflet)**:
  - Dynamic Pin & Click interface with GPS auto-detection.
  - Indian Tier-1 & Tier-2 benchmark micro-markets (Pune, Mumbai, Bengaluru, Delhi NCR, Hyderabad).
  - Haversine distance-weighted spatial base rate calibration (₹/sq.ft).
- 💰 **Real-World Indian Market Pricing Engine**:
  - Calibrated outputs in standard Indian denomination (**₹ Lakhs** and **₹ Crores**).
  - Full financial breakdown: **Estimated Monthly Rent**, **Govt Stamp Duty & Registration (~6%)**, and **20-Year Home Loan EMI**.
- 🔬 **Rigorous Statistical Machine Learning ($R^2 = 0.892$)**:
  - Scikit-Learn Ridge Regression with Standardized Feature Scalers.
  - 95% Statistical Confidence Interval bounds ($\hat{y} \pm 1.96 \cdot \text{SE}$).
  - SHAP-style marginal feature impact attribution ($\Delta y$).
  - 5-Year compound capital appreciation curves (@ 8.2% CAGR).
- 📄 **Single-Click PDF Valuation Appraisal Reports**:
  - Download verified, publication-grade appraisal dossiers with full feature matrices.
- ⚡ **Cloud Database & Offline Fallback**:
  - Google Cloud Firestore persistent sync for predictions, user accounts, and saved valuations.

---

## 🔬 Machine Learning & Spatial Architecture

```
[ GPS Coordinates / Locality Pin ] ───► [ Haversine Spatial Base Rate Matrix (₹/sq.ft) ]
                                                            │
[ Housing Feature Vector X (12 specs) ]                     ▼
                    │                     [ Calibrated Base Land & Structure Value ]
                    ▼ (StandardScaler z = (x - μ) / σ)      │
[ Normalized Feature Tensor ]                               │
                    │                                       │
                    ▼ (Ridge Regression Engine)             │
[ Point Estimate Valuation ŷ (₹ Lakhs / Crores) ] ◄─────────┘
                    │
                    ├──► [ 95% Confidence Range: ŷ ± 1.96·SE ]
                    ├──► [ Local SHAP Feature Impact Decomposition (Marginal Δy) ]
                    ├──► [ 5-Year Compounding Appreciation Curve (CAGR @ 8.2%) ]
                    └──► [ Financials: Rent, Stamp Duty (~6%), 20Y Loan EMI ]
```

### Statistical Pipeline Specifications:
- **Model Architecture**: Regularized Scikit-Learn Ridge Regression ($\alpha = 1.0$) + Spatial Micro-Market Weighting
- **Empirical Accuracy ($R^2$)**: $0.8921$ (Test), $0.8974$ (Train), $0.8895$ (5-Fold Cross-Validation)
- **Error Diagnostics**: $\text{RMSE} = \text{₹1,24,500}$, $\text{MAE} = \text{₹98,200}$, $\text{Explained Variance} = 89.8\%$
- **Local Feature Attribution**: Mathematical decomposition analyzing marginal pricing impact for area footprint, preferred zones, HVAC, fixtures, and structural attributes.
- **Appreciation Forecast**: Geometric compound growth model with historical volatility bands for 1-year, 3-year, and 5-year projections.

---

## 📁 Repository Structure

```
├── ml_pipeline/                  # Machine Learning Training & Evaluation Pipeline
│   ├── train_regression.py      # End-to-end Scikit-Learn training script
│   ├── metrics.json             # Serialized R², RMSE, MAE & cross-validation metrics
│   ├── model_weights.json       # Mathematical coefficients, intercepts & scaler parameters
│   ├── housing_dataset.csv      # Supervised training dataset (N=545 vectors)
│   └── requirements.txt         # Data science dependencies (numpy, pandas, scikit-learn)
│
├── src/
│   ├── lib/
│   │   ├── location_rates.ts    # Indian real-estate micro-markets & spatial rates
│   │   ├── ml_engine.ts         # Edge ML inference engine with standard scaling & SHAP math
│   │   ├── api.ts               # Core API orchestration & Firestore integration
│   │   └── firebase.ts          # Cloud Firestore configuration
│   ├── components/
│   │   ├── MapLocationPicker.tsx# Interactive Leaflet / OpenStreetMap selector
│   │   ├── PredictionScreen.tsx # Real-world valuation interface & PDF export
│   │   ├── AnalyticsScreen.tsx  # ML model diagnostics, feature weights & distribution
│   │   ├── DashboardScreen.tsx  # Executive overview & portfolio summary
│   │   ├── EmiCalculatorScreen.tsx # Financial & Mortgage loan calculator
│   │   ├── HistoryScreen.tsx    # Saved valuation history & appraisal records
│   │   └── ...                  # Profile, Admin, Auth screens
│   └── types.ts                 # TypeScript types including Spatial & ML interfaces
│
├── server.ts                    # Full-stack Express API gateway & Gemini ML explanations
├── package.json                 # Web runtime dependencies
└── metadata.json                # Project configuration
```

---

## 🚀 Quick Start & Local Development

### 1. Web Application & Edge Inference
```bash
# Clone the repository
git clone https://github.com/your-username/smartestate-ml-engine.git
cd smartestate-ml-engine

# Install dependencies
npm install

# Start local Vite development server (Port 3000)
npm run dev

# Build for production
npm run build
```

### 2. Machine Learning Pipeline (Python / Scikit-Learn)
```bash
cd ml_pipeline
pip install -r requirements.txt
python train_regression.py
```

---

## 🌐 Deployment Guide (Vercel)

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Update spatial map and real Indian pricing engine"
   git push origin main
   ```
2. **Deploy on Vercel**:
   - Import your GitHub repository in [Vercel Dashboard](https://vercel.com).
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
3. Click **Deploy**. Vercel will automatically build and publish your application.

---

## 👨‍💻 Author & Engineering Credits

- **Lead AI/ML Engineer**: **Pratik Panzade** (`pratikpanzade000@gmail.com`)
- **Domain**: Artificial Intelligence, Spatial Geo-Analytics & Applied Machine Learning
- **License**: MIT
