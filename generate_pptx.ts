import pptxgen from "pptxgenjs";

const pptxClass = (pptxgen as any).default || pptxgen;
const pres = new pptxClass();
pres.layout = "LAYOUT_16x9";
pres.author = "Pratik Panzade";
pres.company = "SmartEstate Systems";
pres.title = "SmartEstate™ AI - Enterprise Presentation";

// Color Palette
const COLORS = {
  NAVY_DARK: "0F172A",
  NAVY_LIGHT: "1E293B",
  EMERALD: "059669",
  TEAL: "0D9488",
  GOLD: "D97706",
  TEXT_DARK: "0F172A",
  TEXT_MUTED: "64748B",
  BG_LIGHT: "F8FAFC",
  WHITE: "FFFFFF",
  CARD_BG: "F1F5F9",
  BORDER: "E2E8F0"
};

// Helper: Add Standard Header
function addHeader(slide: any, title: string, subtitle?: string) {
  // Top Accent Bar
  slide.addShape(pres.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 13.33,
    h: 0.15,
    fill: { color: COLORS.EMERALD }
  });

  // Title
  slide.addText(title, {
    x: 0.8,
    y: 0.5,
    w: 11.5,
    h: 0.6,
    fontSize: 24,
    bold: true,
    color: COLORS.NAVY_DARK,
    fontFace: "Arial"
  });

  if (subtitle) {
    slide.addText(subtitle, {
      x: 0.8,
      y: 1.05,
      w: 11.5,
      h: 0.35,
      fontSize: 13,
      color: COLORS.TEXT_MUTED,
      fontFace: "Arial"
    });
  }

  // Bottom Footer
  slide.addText("SmartEstate™ AI • Production Presentation Deck • Pratik Panzade", {
    x: 0.8,
    y: 7.1,
    w: 10,
    h: 0.3,
    fontSize: 9,
    color: COLORS.TEXT_MUTED,
    fontFace: "Arial"
  });
}

// ==========================================
// SLIDE 1: Title Slide (Dark Theme Luxury)
// ==========================================
const s1 = pres.addSlide();
s1.background = { color: COLORS.NAVY_DARK };

s1.addShape(pres.ShapeType.rect, {
  x: 0,
  y: 0,
  w: 0.4,
  h: 7.5,
  fill: { color: COLORS.EMERALD }
});

s1.addText("SmartEstate™ AI", {
  x: 1.2,
  y: 1.8,
  w: 11,
  h: 0.9,
  fontSize: 40,
  bold: true,
  color: COLORS.WHITE,
  fontFace: "Arial"
});

s1.addText("Intelligent Real Estate Valuation, Spatial Micro-Market ML Analytics & Investment Forecasting Platform", {
  x: 1.2,
  y: 2.8,
  w: 10.5,
  h: 0.8,
  fontSize: 18,
  color: "94A3B8",
  fontFace: "Arial"
});

s1.addShape(pres.ShapeType.line, {
  x: 1.2,
  y: 3.8,
  w: 10,
  h: 0,
  line: { color: "334155", width: 1.5 }
});

s1.addText([
  { text: "Lead AI/ML Engineer: ", options: { bold: true, color: COLORS.WHITE } },
  { text: "Pratik Panzade\n", options: { color: "CBD5E1" } },
  { text: "Contact: ", options: { bold: true, color: COLORS.WHITE } },
  { text: "pratikpanzade000@gmail.com | aiml43465@gmail.com\n", options: { color: "CBD5E1" } },
  { text: "Live URL: ", options: { bold: true, color: COLORS.EMERALD } },
  { text: "https://smart-estate-ai-alpha.vercel.app\n", options: { color: COLORS.EMERALD } },
  { text: "GitHub: ", options: { bold: true, color: "38BDF8" } },
  { text: "https://github.com/Pratik000a1b2/SmartEstateAI", options: { color: "38BDF8" } }
], {
  x: 1.2,
  y: 4.2,
  w: 10.5,
  h: 2.2,
  fontSize: 14,
  fontFace: "Arial"
});

// ==========================================
// SLIDE 2: Industry Problem Statement
// ==========================================
const s2 = pres.addSlide();
s2.background = { color: COLORS.BG_LIGHT };
addHeader(s2, "Industry Background & Problem Statement", "Key challenges faced by home buyers, investors, and real estate markets");

const problems = [
  {
    title: "1. Information Asymmetry & Broker Manipulation",
    desc: "Real estate valuations are largely driven by broker speculation without open, verifiable mathematical backing."
  },
  {
    title: "2. Absence of Long-Term Forecasting",
    desc: "Buyers commit life savings with zero data-driven projections of 1-Year, 3-Year, or 5-Year capital growth."
  },
  {
    title: "3. Hidden Closing Taxes & Financing Costs",
    desc: "Buyers overlook 5-7% Stamp Duty, 1% Registration charges, and compounding loan interest over 20-30 years."
  },
  {
    title: "4. Black-Box Pricing & Feature Opacity",
    desc: "Traditional portals lack explainability on how much features like parking, furnishing, or location add to total price."
  }
];

problems.forEach((p, idx) => {
  const x = 0.8 + (idx % 2) * 5.9;
  const y = 1.7 + Math.floor(idx / 2) * 2.5;

  s2.addShape(pres.ShapeType.roundRect, {
    x, y, w: 5.6, h: 2.2,
    fill: { color: COLORS.WHITE },
    line: { color: "CBD5E1", width: 1 }
  });

  s2.addText(p.title, {
    x: x + 0.3, y: y + 0.25, w: 5.0, h: 0.6,
    fontSize: 15, bold: true, color: "DC2626", fontFace: "Arial"
  });

  s2.addText(p.desc, {
    x: x + 0.3, y: y + 0.85, w: 5.0, h: 1.1,
    fontSize: 12, color: COLORS.TEXT_MUTED, fontFace: "Arial"
  });
});

// ==========================================
// SLIDE 3: Proposed Solution - SmartEstate™ AI
// ==========================================
const s3 = pres.addSlide();
s3.background = { color: COLORS.BG_LIGHT };
addHeader(s3, "Proposed Solution: SmartEstate™ AI Overview", "An institutional-grade valuation platform engineered for clarity and accuracy");

const solutions = [
  { title: "🎯 Algorithmic Valuation", desc: "Dual Ridge Regression + Spatial Matrix evaluating 12+ structural property attributes." },
  { title: "📍 GPS Micro-Market Pricing", desc: "Spatial rate adjustments calibrated across Tier-1, Tier-2, and Tier-3 urban growth corridors." },
  { title: "💡 Explainable AI (XAI)", desc: "Transparent SHAP-style percentage attribution breakdown showing exact feature contributions." },
  { title: "📈 5-Year Growth Projections", desc: "Dynamic mathematical models estimating 1Y, 3Y, and 5Y compounding capital appreciation." },
  { title: "🏦 Complete Financial Suite", desc: "Integrated loan EMI calculator, amortization schedule, Stamp Duty, and Rental Yield analysis." },
  { title: "🔐 Cloud Database Persistence", desc: "Google Firebase Authentication with Cloud Firestore real-time dual-layer persistence." }
];

solutions.forEach((sol, idx) => {
  const x = 0.8 + (idx % 3) * 3.9;
  const y = 1.7 + Math.floor(idx / 3) * 2.5;

  s3.addShape(pres.ShapeType.roundRect, {
    x, y, w: 3.7, h: 2.2,
    fill: { color: COLORS.WHITE },
    line: { color: COLORS.EMERALD, width: 1.5 }
  });

  s3.addText(sol.title, {
    x: x + 0.2, y: y + 0.2, w: 3.3, h: 0.5,
    fontSize: 14, bold: true, color: COLORS.NAVY_DARK, fontFace: "Arial"
  });

  s3.addText(sol.desc, {
    x: x + 0.2, y: y + 0.75, w: 3.3, h: 1.2,
    fontSize: 11, color: COLORS.TEXT_MUTED, fontFace: "Arial"
  });
});

// ==========================================
// SLIDE 4: System Architecture & Workflow
// ==========================================
const s4 = pres.addSlide();
s4.background = { color: COLORS.BG_LIGHT };
addHeader(s4, "System Architecture & Execution Pipeline", "End-to-end data flow from client inputs to ML inference and cloud synchronization");

const pipelineSteps = [
  { step: "01. CLIENT INPUT", title: "User & Locality", desc: "12 Architectural Inputs + GPS Urban Sector" },
  { step: "02. PREPROCESSOR", title: "Feature Normalization", desc: "Min-Max Scaling + One-Hot Encoding + Spatial Rate Matrix" },
  { step: "03. ML INFERENCE", title: "Ridge Regression", desc: "Alpha=1.0 L2 Shrinkage + 95% Confidence Interval Calculation" },
  { step: "04. EXPLAINABLE AI", title: "XAI & Financials", desc: "Percentage Attribution + 5Y Growth + EMI Amortization" },
  { step: "05. PERSISTENCE", title: "Cloud Firestore", desc: "Dual-Write Realtime Sync + Google OAuth Auth" }
];

pipelineSteps.forEach((step, idx) => {
  const x = 0.6 + idx * 2.45;
  const y = 2.2;

  s4.addShape(pres.ShapeType.roundRect, {
    x, y, w: 2.3, h: 4.0,
    fill: { color: COLORS.WHITE },
    line: { color: idx === 2 ? COLORS.EMERALD : "CBD5E1", width: idx === 2 ? 2 : 1 }
  });

  s4.addShape(pres.ShapeType.rect, {
    x, y, w: 2.3, h: 0.6,
    fill: { color: idx === 2 ? COLORS.EMERALD : COLORS.NAVY_DARK }
  });

  s4.addText(step.step, {
    x, y: y + 0.1, w: 2.3, h: 0.4,
    fontSize: 10, bold: true, color: COLORS.WHITE, align: "center", fontFace: "Arial"
  });

  s4.addText(step.title, {
    x: x + 0.15, y: y + 0.9, w: 2.0, h: 0.6,
    fontSize: 13, bold: true, color: COLORS.NAVY_DARK, align: "center", fontFace: "Arial"
  });

  s4.addText(step.desc, {
    x: x + 0.15, y: y + 1.6, w: 2.0, h: 2.0,
    fontSize: 11, color: COLORS.TEXT_MUTED, align: "center", fontFace: "Arial"
  });
});

// ==========================================
// SLIDE 5: Machine Learning Methodology
// ==========================================
const s5 = pres.addSlide();
s5.background = { color: COLORS.BG_LIGHT };
addHeader(s5, "Machine Learning Methodology & Validation Metrics", "Mathematical foundation of the L2-Regularized Ridge Regression Valuation Engine");

s5.addShape(pres.ShapeType.roundRect, {
  x: 0.8, y: 1.8, w: 5.6, h: 4.8,
  fill: { color: COLORS.WHITE },
  line: { color: "CBD5E1", width: 1 }
});

s5.addText("Ridge Regression Formulation", {
  x: 1.1, y: 2.0, w: 5.0, h: 0.5,
  fontSize: 16, bold: true, color: COLORS.NAVY_DARK, fontFace: "Arial"
});

s5.addText([
  { text: "Loss Function with L2 Penalty:\n\n", options: { bold: true, color: COLORS.EMERALD } },
  { text: "Loss = Σ(y_i - ŷ_i)² + α Σ(β_j)²\n\n", options: { bold: true, color: COLORS.NAVY_DARK, fontSize: 13 } },
  { text: "• Mitigates Multicollinearity: ", options: { bold: true, color: COLORS.TEXT_DARK } },
  { text: "Real estate variables (Area, Bedrooms, Bathrooms) exhibit strong inter-correlation. Ridge keeps coefficients bounded.\n\n", options: { color: COLORS.TEXT_MUTED } },
  { text: "• Prevents Overfitting: ", options: { bold: true, color: COLORS.TEXT_DARK } },
  { text: "L2 weight decay penalizes extreme outlier coefficients on large luxury properties.\n\n", options: { color: COLORS.TEXT_MUTED } },
  { text: "• Alpha Hyperparameter: ", options: { bold: true, color: COLORS.TEXT_DARK } },
  { text: "Tuned to α = 1.0 via cross-validation for optimal bias-variance balance.", options: { color: COLORS.TEXT_MUTED } }
], {
  x: 1.1, y: 2.6, w: 5.0, h: 3.8,
  fontSize: 12, fontFace: "Arial"
});

// Metrics Box on Right
const metrics = [
  { label: "R² Accuracy Score", val: "0.892", sub: "89.2% Variance Explained" },
  { label: "Confidence Interval", val: "95%", sub: "1.96 × SE Residual Bounds" },
  { label: "Inference Latency", val: "< 15 ms", sub: "Zero-lag Client Execution" },
  { label: "Spatial Correction", val: "Dynamic", sub: "Micro-Market Rate Matrix" }
];

metrics.forEach((m, idx) => {
  const y = 1.8 + idx * 1.25;
  s5.addShape(pres.ShapeType.roundRect, {
    x: 6.8, y, w: 5.7, h: 1.1,
    fill: { color: COLORS.WHITE },
    line: { color: COLORS.EMERALD, width: 1 }
  });

  s5.addText(m.val, {
    x: 7.0, y: y + 0.15, w: 2.2, h: 0.5,
    fontSize: 22, bold: true, color: COLORS.EMERALD, fontFace: "Arial"
  });

  s5.addText(`${m.label}\n${m.sub}`, {
    x: 9.2, y: y + 0.15, w: 3.1, h: 0.8,
    fontSize: 11, color: COLORS.NAVY_DARK, fontFace: "Arial"
  });
});

// ==========================================
// SLIDE 6: Feature Vectors
// ==========================================
const s6 = pres.addSlide();
s6.background = { color: COLORS.BG_LIGHT };
addHeader(s6, "Feature Engineering: 12 Core Housing Attributes", "Structured data inputs covering structural, spatial, utility, and location parameters");

const featureCategories = [
  {
    cat: "Structural & Spatial",
    items: ["• Total Area (Sq.Ft Footprint)", "• Bedroom Count (BHK Configuration)", "• Bathroom Count (Sanitary Fixtures)", "• Building Stories (Vertical Levels)", "• Dedicated Parking Spaces"]
  },
  {
    cat: "Location & Accessibility",
    items: ["• Main Road Proximity (Yes/No)", "• Preferred Growth Corridor (Yes/No)", "• GPS Micro-Market Locality Multiplier", "• Urban Density Calibration Tier"]
  },
  {
    cat: "Interior & Comfort",
    items: ["• Furnishing Status (Furnished / Semi / Unfurnished)", "• Dedicated Guest Room (Yes/No)", "• Finished Basement Utility (Yes/No)"]
  },
  {
    cat: "Climate & Utilities",
    items: ["• Central Air Conditioning (Yes/No)", "• Hot Water Heating System (Yes/No)", "• Municipal Grid Electricity Access"]
  }
];

featureCategories.forEach((fc, idx) => {
  const x = 0.8 + (idx % 2) * 5.9;
  const y = 1.7 + Math.floor(idx / 2) * 2.5;

  s6.addShape(pres.ShapeType.roundRect, {
    x, y, w: 5.6, h: 2.3,
    fill: { color: COLORS.WHITE },
    line: { color: "CBD5E1", width: 1 }
  });

  s6.addText(fc.cat, {
    x: x + 0.3, y: y + 0.2, w: 5.0, h: 0.4,
    fontSize: 15, bold: true, color: COLORS.NAVY_DARK, fontFace: "Arial"
  });

  s6.addText(fc.items.join("\n"), {
    x: x + 0.3, y: y + 0.65, w: 5.0, h: 1.5,
    fontSize: 11.5, color: COLORS.TEXT_MUTED, fontFace: "Arial"
  });
});

// ==========================================
// SLIDE 7: Live Prediction & Valuation Result
// ==========================================
const s7 = pres.addSlide();
s7.background = { color: COLORS.BG_LIGHT };
addHeader(s7, "Valuation Result Engine & Real-Time Output", "Sub-second valuation with statistical range and investment assessment");

s7.addShape(pres.ShapeType.roundRect, {
  x: 0.8, y: 1.8, w: 6.0, h: 4.8,
  fill: { color: COLORS.NAVY_DARK }
});

s7.addText("LIVE VALUATION RESULT", {
  x: 1.2, y: 2.1, w: 5.0, h: 0.3,
  fontSize: 11, bold: true, color: COLORS.EMERALD, fontFace: "Arial"
});

s7.addText("₹ 82,50,000", {
  x: 1.2, y: 2.5, w: 5.0, h: 0.8,
  fontSize: 32, bold: true, color: COLORS.WHITE, fontFace: "Arial"
});

s7.addText("Fair Market Valuation (₹ 82.50 Lakhs)", {
  x: 1.2, y: 3.3, w: 5.0, h: 0.4,
  fontSize: 13, color: "94A3B8", fontFace: "Arial"
});

s7.addShape(pres.ShapeType.line, {
  x: 1.2, y: 3.8, w: 5.0, h: 0,
  line: { color: "334155", width: 1 }
});

s7.addText([
  { text: "95% Confidence Interval: ", options: { bold: true, color: COLORS.WHITE } },
  { text: "₹ 79.20L – ₹ 85.80L\n", options: { color: "38BDF8" } },
  { text: "Investment Quality Score: ", options: { bold: true, color: COLORS.WHITE } },
  { text: "92 / 100 (Strong Buy)\n", options: { color: COLORS.EMERALD, bold: true } },
  { text: "Market Liquidity Status: ", options: { bold: true, color: COLORS.WHITE } },
  { text: "High Demand Corridor\n", options: { color: "CBD5E1" } },
  { text: "Estimated Monthly Rent: ", options: { bold: true, color: COLORS.WHITE } },
  { text: "₹ 24,500 / month", options: { color: "FCD34D" } }
], {
  x: 1.2, y: 4.0, w: 5.0, h: 2.3,
  fontSize: 12.5, fontFace: "Arial"
});

// Output Summary on Right
s7.addShape(pres.ShapeType.roundRect, {
  x: 7.1, y: 1.8, w: 5.4, h: 4.8,
  fill: { color: COLORS.WHITE },
  line: { color: "CBD5E1", width: 1 }
});

s7.addText("Input Property Parameters", {
  x: 7.4, y: 2.1, w: 4.8, h: 0.4,
  fontSize: 15, bold: true, color: COLORS.NAVY_DARK, fontFace: "Arial"
});

const propInputs = [
  "• Built-up Area: 2,400 sq.ft",
  "• Bedrooms: 3 BHK",
  "• Bathrooms: 2 Fully Fitted",
  "• Furnishing: Fully Furnished",
  "• Road Access: Main Road Frontage",
  "• Climate Control: Air Conditioning Installed",
  "• Parking: 2 Dedicated Covered Spaces",
  "• Growth Corridor: Preferred High-Demand Tag"
];

s7.addText(propInputs.join("\n"), {
  x: 7.4, y: 2.7, w: 4.8, h: 3.5,
  fontSize: 12, color: COLORS.TEXT_MUTED, fontFace: "Arial"
});

// ==========================================
// SLIDE 8: Explainable AI
// ==========================================
const s8 = pres.addSlide();
s8.background = { color: COLORS.BG_LIGHT };
addHeader(s8, "Explainable AI (XAI): Feature Attribution Breakdown", "SHAP-style transparent percentage decomposition showing exact price drivers");

const xaiFeatures = [
  { name: "Square Footage (Area Footprint)", pct: "38%", color: "059669", desc: "Primary structural driver of baseline valuation" },
  { name: "Location & Preferred Growth Sector", pct: "22%", color: "0D9488", desc: "GPS spatial multiplier and connectivity premium" },
  { name: "Furnishing & Interior Finish", pct: "14%", color: "0284C7", desc: "Move-in ready status and modern fixtures" },
  { name: "Climate Control (Air Conditioning)", pct: "10%", color: "6366F1", desc: "Integrated HVAC and electrical infrastructure" },
  { name: "Bedrooms, Stories & Bathrooms", pct: "10%", color: "D97706", desc: "Functional layout and accommodation capacity" },
  { name: "Dedicated Parking & Storage", pct: "6%", color: "64748B", desc: "Covered parking and finished basement utility" }
];

xaiFeatures.forEach((feat, idx) => {
  const y = 1.7 + idx * 0.85;

  s8.addShape(pres.ShapeType.roundRect, {
    x: 0.8, y, w: 11.7, h: 0.72,
    fill: { color: COLORS.WHITE },
    line: { color: "CBD5E1", width: 1 }
  });

  s8.addText(feat.name, {
    x: 1.0, y: y + 0.1, w: 4.5, h: 0.3,
    fontSize: 12.5, bold: true, color: COLORS.NAVY_DARK, fontFace: "Arial"
  });

  s8.addText(feat.desc, {
    x: 1.0, y: y + 0.38, w: 5.5, h: 0.3,
    fontSize: 10, color: COLORS.TEXT_MUTED, fontFace: "Arial"
  });

  s8.addShape(pres.ShapeType.roundRect, {
    x: 7.0, y: y + 0.18, w: 3.8, h: 0.35,
    fill: { color: "E2E8F0" }
  });

  const barW = (parseFloat(feat.pct) / 40) * 3.8;
  s8.addShape(pres.ShapeType.roundRect, {
    x: 7.0, y: y + 0.18, w: barW, h: 0.35,
    fill: { color: feat.color }
  });

  s8.addText(feat.pct, {
    x: 11.0, y: y + 0.12, w: 1.3, h: 0.45,
    fontSize: 14, bold: true, color: feat.color, fontFace: "Arial"
  });
});

// ==========================================
// SLIDE 9: 5-Year Growth Projections
// ==========================================
const s9 = pres.addSlide();
s9.background = { color: COLORS.BG_LIGHT };
addHeader(s9, "Long-Term Capital Forecasting (5-Year Growth Model)", "Compound annual growth rate (CAGR) projections based on localized micro-market trend lines");

const projections = [
  { yr: "Current Valuation", val: "₹ 82.50 Lakhs", roi: "Baseline Value", note: "Fair market valuation at present day." },
  { yr: "1-Year Projection", val: "₹ 88.60 Lakhs", roi: "+ 7.4% Expected Gain", note: "Factoring near-term infrastructure & inflation." },
  { yr: "3-Year Projection", val: "₹ 1.02 Crores", roi: "+ 23.6% Compound ROI", note: "Reflecting corridor commercialization." },
  { yr: "5-Year Projection", val: "₹ 1.18 Crores", roi: "+ 43.0% Overall Capital Gain", note: "Long-term maturity and regional expansion." }
];

projections.forEach((p, idx) => {
  const x = 0.8 + idx * 2.95;
  const y = 1.8;

  s9.addShape(pres.ShapeType.roundRect, {
    x, y, w: 2.8, h: 4.8,
    fill: { color: idx === 3 ? COLORS.NAVY_DARK : COLORS.WHITE },
    line: { color: idx === 3 ? COLORS.EMERALD : "CBD5E1", width: idx === 3 ? 2 : 1 }
  });

  s9.addText(p.yr, {
    x: x + 0.15, y: y + 0.3, w: 2.5, h: 0.4,
    fontSize: 12, bold: true, color: idx === 3 ? "94A3B8" : COLORS.TEXT_MUTED, align: "center", fontFace: "Arial"
  });

  s9.addText(p.val, {
    x: x + 0.1, y: y + 0.9, w: 2.6, h: 0.7,
    fontSize: 18, bold: true, color: idx === 3 ? COLORS.WHITE : COLORS.NAVY_DARK, align: "center", fontFace: "Arial"
  });

  s9.addShape(pres.ShapeType.roundRect, {
    x: x + 0.2, y: y + 1.8, w: 2.4, h: 0.5,
    fill: { color: idx === 3 ? COLORS.EMERALD : "E6F4EA" }
  });

  s9.addText(p.roi, {
    x: x + 0.2, y: y + 1.9, w: 2.4, h: 0.3,
    fontSize: 11, bold: true, color: idx === 3 ? COLORS.WHITE : "137333", align: "center", fontFace: "Arial"
  });

  s9.addText(p.note, {
    x: x + 0.2, y: y + 2.6, w: 2.4, h: 1.8,
    fontSize: 11, color: idx === 3 ? "CBD5E1" : COLORS.TEXT_MUTED, align: "center", fontFace: "Arial"
  });
});

// ==========================================
// SLIDE 10: Financial Suite & EMI Calculator
// ==========================================
const s10 = pres.addSlide();
s10.background = { color: COLORS.BG_LIGHT };
addHeader(s10, "Comprehensive Financial Suite & Loan EMI Calculator", "Complete financial breakdown including loan amortization, taxes, and rental yields");

s10.addShape(pres.ShapeType.roundRect, {
  x: 0.8, y: 1.8, w: 5.6, h: 4.8,
  fill: { color: COLORS.WHITE },
  line: { color: "CBD5E1", width: 1 }
});

s10.addText("Home Loan EMI Engine", {
  x: 1.1, y: 2.0, w: 5.0, h: 0.4,
  fontSize: 15, bold: true, color: COLORS.NAVY_DARK, fontFace: "Arial"
});

s10.addText([
  { text: "Equated Monthly Installment Formula:\n\n", options: { bold: true, color: COLORS.EMERALD } },
  { text: "E = P · r · (1+r)ⁿ / ((1+r)ⁿ - 1)\n\n", options: { bold: true, color: COLORS.NAVY_DARK, fontSize: 13 } },
  { text: "• Dynamic Sliders: ", options: { bold: true, color: COLORS.TEXT_DARK } },
  { text: "Adjust Principal (P), Rate of Interest (r: 7.5%–12%), and Tenure (n: up to 30 Years).\n\n", options: { color: COLORS.TEXT_MUTED } },
  { text: "• Amortization Schedule: ", options: { bold: true, color: COLORS.TEXT_DARK } },
  { text: "Visual charts splitting Principal Amount Repaid vs. Total Interest Paid over lifetime.\n\n", options: { color: COLORS.TEXT_MUTED } },
  { text: "• Cash Flow Analysis: ", options: { bold: true, color: COLORS.TEXT_DARK } },
  { text: "Compares monthly EMI burden directly against expected rental income yield.", options: { color: COLORS.TEXT_MUTED } }
], {
  x: 1.1, y: 2.5, w: 5.0, h: 3.9,
  fontSize: 11.5, fontFace: "Arial"
});

// Tax & Yield Box on Right
s10.addShape(pres.ShapeType.roundRect, {
  x: 6.8, y: 1.8, w: 5.7, h: 4.8,
  fill: { color: COLORS.WHITE },
  line: { color: "CBD5E1", width: 1 }
});

s10.addText("Govt. Taxes & Rental Yield Breakdown", {
  x: 7.1, y: 2.0, w: 5.0, h: 0.4,
  fontSize: 15, bold: true, color: COLORS.NAVY_DARK, fontFace: "Arial"
});

const taxes = [
  { label: "Stamp Duty (5% – 7%)", val: "₹ 4,95,000", desc: "Statutory state government registration tax" },
  { label: "Registration Charges (1%)", val: "₹ 82,500", desc: "Standard land registry documentation fee" },
  { label: "Estimated Monthly Rent", val: "₹ 24,500 / mo", desc: "Derived from prevailing locality rental yield" },
  { label: "Gross Annual Rental Yield", val: "3.56% p.a.", desc: "Annualized passive rental return on asset" }
];

taxes.forEach((t, idx) => {
  const y = 2.6 + idx * 0.95;
  s10.addText(t.label, {
    x: 7.1, y: y, w: 3.2, h: 0.3,
    fontSize: 12, bold: true, color: COLORS.NAVY_DARK, fontFace: "Arial"
  });
  s10.addText(t.val, {
    x: 10.3, y: y, w: 2.0, h: 0.3,
    fontSize: 13, bold: true, color: COLORS.EMERALD, align: "right", fontFace: "Arial"
  });
  s10.addText(t.desc, {
    x: 7.1, y: y + 0.28, w: 5.0, h: 0.4,
    fontSize: 10, color: COLORS.TEXT_MUTED, fontFace: "Arial"
  });
});

// ==========================================
// SLIDE 11: Real-Time Cloud Persistence
// ==========================================
const s11 = pres.addSlide();
s11.background = { color: COLORS.BG_LIGHT };
addHeader(s11, "Cloud Database Architecture & Google Firebase Sync", "Dual-write real-time cloud synchronization for zero-downtime reliability");

const cloudFeatures = [
  { title: "Google OAuth 2.0 Auth", desc: "1-Click popup Google Sign-In with persistent session management & token refresh." },
  { title: "Cloud Firestore Realtime Sync", desc: "Instant bidirectional document writes for user accounts and valuation logs." },
  { title: "Dual-Layer Persistence", desc: "Local cache fallback guarantees 100% functionality offline with background sync." },
  { title: "Security Hardening", desc: "Sanitized data payload schema preventing XSS and strict Firestore security rules." }
];

cloudFeatures.forEach((cf, idx) => {
  const x = 0.8 + (idx % 2) * 5.9;
  const y = 1.8 + Math.floor(idx / 2) * 2.5;

  s11.addShape(pres.ShapeType.roundRect, {
    x, y, w: 5.6, h: 2.2,
    fill: { color: COLORS.WHITE },
    line: { color: COLORS.EMERALD, width: 1.5 }
  });

  s11.addText(cf.title, {
    x: x + 0.3, y: y + 0.25, w: 5.0, h: 0.4,
    fontSize: 15, bold: true, color: COLORS.NAVY_DARK, fontFace: "Arial"
  });

  s11.addText(cf.desc, {
    x: x + 0.3, y: y + 0.75, w: 5.0, h: 1.2,
    fontSize: 12, color: COLORS.TEXT_MUTED, fontFace: "Arial"
  });
});

// ==========================================
// SLIDE 12: Admin Database Console
// ==========================================
const s12 = pres.addSlide();
s12.background = { color: COLORS.BG_LIGHT };
addHeader(s12, "Enterprise Admin & Owner Database Console", "Centralized administrative governance, audit logs, and one-click cloud migration");

const adminPillars = [
  { title: "Role-Based Access Control (RBAC)", desc: "Strict verification restricting database console to verified owner emails (pratikpanzade000@gmail.com / aiml43465@gmail.com)." },
  { title: "Live User & Activity Inspector", desc: "Real-time visibility into registered users, login timestamps, and individual historical property valuations." },
  { title: "1-Click 'Push All To Firebase'", desc: "Instant administrative tool that bulk-synchronizes all locally cached records into Google Cloud Firestore." },
  { title: "Multi-Format Data Portability", desc: "1-Click CSV and JSON export engine for external financial audit, compliance, and offline analytical reporting." }
];

adminPillars.forEach((p, idx) => {
  const x = 0.8 + (idx % 2) * 5.9;
  const y = 1.8 + Math.floor(idx / 2) * 2.5;

  s12.addShape(pres.ShapeType.roundRect, {
    x, y, w: 5.6, h: 2.2,
    fill: { color: COLORS.WHITE },
    line: { color: "CBD5E1", width: 1 }
  });

  s12.addText(p.title, {
    x: x + 0.3, y: y + 0.25, w: 5.0, h: 0.5,
    fontSize: 14.5, bold: true, color: COLORS.NAVY_DARK, fontFace: "Arial"
  });

  s12.addText(p.desc, {
    x: x + 0.3, y: y + 0.8, w: 5.0, h: 1.2,
    fontSize: 11.5, color: COLORS.TEXT_MUTED, fontFace: "Arial"
  });
});

// ==========================================
// SLIDE 13: Full-Stack Technology Matrix
// ==========================================
const s13 = pres.addSlide();
s13.background = { color: COLORS.BG_LIGHT };
addHeader(s13, "Full-Stack Technology Stack & Architecture Matrix", "Modern, scalable and modular web technologies powering the platform");

const techStack = [
  { layer: "Frontend Framework", tech: "React 18, TypeScript, Tailwind CSS", role: "Componentized reactive UI with high-contrast accessibility" },
  { layer: "Data Visualizations", tech: "Recharts & D3.js", role: "Interactive capital growth curves & confidence intervals" },
  { layer: "ML Inference Engine", tech: "Scikit-Learn (Python) + TypeScript Core", role: "Ridge regression model execution in sub-15ms" },
  { layer: "Backend Server", tech: "Node.js, Express, Vite", role: "High-performance API proxy with lazy initialization" },
  { layer: "Cloud Database & Auth", tech: "Google Firebase Auth & Cloud Firestore", role: "OAuth 2.0 security with real-time NoSQL synchronization" },
  { layer: "Hosting & CI/CD", tech: "Vercel Edge Platform & GitHub Actions", role: "Zero-configuration continuous deployment from GitHub" }
];

techStack.forEach((t, idx) => {
  const y = 1.7 + idx * 0.85;

  s13.addShape(pres.ShapeType.roundRect, {
    x: 0.8, y, w: 11.7, h: 0.72,
    fill: { color: COLORS.WHITE },
    line: { color: "CBD5E1", width: 1 }
  });

  s13.addText(t.layer, {
    x: 1.0, y: y + 0.15, w: 3.0, h: 0.4,
    fontSize: 12.5, bold: true, color: COLORS.NAVY_DARK, fontFace: "Arial"
  });

  s13.addText(t.tech, {
    x: 4.2, y: y + 0.15, w: 4.2, h: 0.4,
    fontSize: 12, bold: true, color: COLORS.EMERALD, fontFace: "Arial"
  });

  s13.addText(t.role, {
    x: 8.5, y: y + 0.15, w: 3.8, h: 0.4,
    fontSize: 11, color: COLORS.TEXT_MUTED, fontFace: "Arial"
  });
});

// ==========================================
// SLIDE 14: Case Study & Demonstration
// ==========================================
const s14 = pres.addSlide();
s14.background = { color: COLORS.BG_LIGHT };
addHeader(s14, "Real-World Demonstration & Live Case Study", "Comparison of real estate property inputs against ML output valuation");

s14.addShape(pres.ShapeType.roundRect, {
  x: 0.8, y: 1.8, w: 5.6, h: 4.8,
  fill: { color: COLORS.WHITE },
  line: { color: "CBD5E1", width: 1 }
});

s14.addText("Input Property Profile", {
  x: 1.1, y: 2.0, w: 5.0, h: 0.4,
  fontSize: 15, bold: true, color: COLORS.NAVY_DARK, fontFace: "Arial"
});

const caseInputs = [
  "• Property Type: Independent Residential Villa",
  "• Footprint Area: 2,450 sq.ft",
  "• Configuration: 4 BHK / 3 Bathrooms",
  "• Furnishing: Fully Furnished Luxury",
  "• Road Accessibility: Main Arterial Road",
  "• Climate Control: Dual Split Air Conditioning",
  "• Parking Capacity: 2 Dedicated Covered Spots",
  "• Location Sector: Prime Tier-1 Growth Hub"
];

s14.addText(caseInputs.join("\n"), {
  x: 1.1, y: 2.5, w: 5.0, h: 3.8,
  fontSize: 12, color: COLORS.TEXT_MUTED, fontFace: "Arial"
});

// Valuation Result on Right
s14.addShape(pres.ShapeType.roundRect, {
  x: 6.8, y: 1.8, w: 5.7, h: 4.8,
  fill: { color: COLORS.NAVY_DARK }
});

s14.addText("ML INFERENCE SUMMARY", {
  x: 7.1, y: 2.1, w: 5.0, h: 0.3,
  fontSize: 11, bold: true, color: COLORS.EMERALD, fontFace: "Arial"
});

s14.addText("₹ 58,50,000", {
  x: 7.1, y: 2.5, w: 5.0, h: 0.7,
  fontSize: 30, bold: true, color: COLORS.WHITE, fontFace: "Arial"
});

s14.addText("Fair Market Valuation (₹ 58.50 Lakhs)", {
  x: 7.1, y: 3.2, w: 5.0, h: 0.4,
  fontSize: 12.5, color: "94A3B8", fontFace: "Arial"
});

s14.addShape(pres.ShapeType.line, {
  x: 7.1, y: 3.7, w: 5.0, h: 0,
  line: { color: "334155", width: 1 }
});

s14.addText([
  { text: "95% Confidence Bracket: ", options: { bold: true, color: COLORS.WHITE } },
  { text: "₹ 56.05L – ₹ 60.94L\n", options: { color: "38BDF8" } },
  { text: "Investment Recommendation: ", options: { bold: true, color: COLORS.WHITE } },
  { text: "Strong Buy (Score: 92/100)\n", options: { color: COLORS.EMERALD, bold: true } },
  { text: "5-Year Projected Value: ", options: { bold: true, color: COLORS.WHITE } },
  { text: "₹ 82.04 Lakhs (~7.2% CAGR)\n", options: { color: "FCD34D" } },
  { text: "Estimated Monthly Rent: ", options: { bold: true, color: COLORS.WHITE } },
  { text: "₹ 24,500 / month", options: { color: "CBD5E1" } }
], {
  x: 7.1, y: 3.9, w: 5.0, h: 2.4,
  fontSize: 12.5, fontFace: "Arial"
});

// ==========================================
// SLIDE 15: Conclusion & Q&A
// ==========================================
const s15 = pres.addSlide();
s15.background = { color: COLORS.NAVY_DARK };

s15.addShape(pres.ShapeType.rect, {
  x: 0, y: 0, w: 0.4, h: 7.5,
  fill: { color: COLORS.EMERALD }
});

s15.addText("SmartEstate™ AI", {
  x: 1.2, y: 1.5, w: 10, h: 0.7,
  fontSize: 32, bold: true, color: COLORS.WHITE, fontFace: "Arial"
});

s15.addText("Summary & Future Roadmap", {
  x: 1.2, y: 2.2, w: 10, h: 0.5,
  fontSize: 18, color: COLORS.EMERALD, fontFace: "Arial"
});

s15.addText([
  { text: "• High Accuracy: ", options: { bold: true, color: COLORS.WHITE } },
  { text: "Ridge Regression with R² = 0.892 delivering mathematical fairness.\n", options: { color: "CBD5E1" } },
  { text: "• Complete Financial Suite: ", options: { bold: true, color: COLORS.WHITE } },
  { text: "Integrated loan EMI scheduling, statutory taxes, and rental yields.\n", options: { color: "CBD5E1" } },
  { text: "• Future Scope: ", options: { bold: true, color: COLORS.WHITE } },
  { text: "Gemini Vision AI for photo condition rating, RERA legal verification, and 1-click PDF valuation dossiers.\n\n", options: { color: "CBD5E1" } },
  { text: "Live Application: ", options: { bold: true, color: COLORS.WHITE } },
  { text: "https://smart-estate-ai-alpha.vercel.app\n", options: { color: COLORS.EMERALD } },
  { text: "GitHub Repository: ", options: { bold: true, color: COLORS.WHITE } },
  { text: "https://github.com/Pratik000a1b2/SmartEstateAI\n\n", options: { color: "38BDF8" } },
  { text: "Thank You! Open for Questions (Q&A)", options: { bold: true, color: COLORS.WHITE, fontSize: 16 } }
], {
  x: 1.2, y: 2.8, w: 10.5, h: 4.2,
  fontSize: 13, fontFace: "Arial"
});

// Save to disk and public folder for download
async function generateDeck() {
  await pres.writeFile({ fileName: "SmartEstate_AI_Presentation_Deck.pptx" });
  await pres.writeFile({ fileName: "public/SmartEstate_AI_Presentation_Deck.pptx" });
  console.log("PPTX presentation generated successfully!");
}

generateDeck();
