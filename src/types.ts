export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  photoURL?: string;
  provider?: 'google' | 'password' | 'phone';
  role?: 'admin' | 'user';
  createdAt?: string;
  lastLoginAt?: string;
}

export interface FeatureImpactItem {
  featureKey: string;
  label: string;
  inputValue: string | number;
  impactINR: number;
  percentage: number;
  direction: 'positive' | 'neutral' | 'negative';
}

export interface MLModelMetricsData {
  architecture: string;
  version: string;
  r2Score: number;
  trainR2: number;
  rmse: number;
  mae: number;
  explainedVariance: number;
  trainingSamples: number;
  alpha: number;
}

export interface LocationData {
  city: string;
  locality: string;
  address: string;
  latitude: number;
  longitude: number;
  baseRatePerSqFt: number;
  tier: 'tier1_prime' | 'tier1_suburb' | 'tier2_hub' | 'tier3_emerging';
  distanceToMetroKm?: number;
  distanceToTechParkKm?: number;
}

export interface PredictionRecord {
  id: string;
  userId: string;
  area: number;
  bedrooms: number;
  bathrooms: number;
  stories: number;
  parking: number;
  mainroad: string;
  guestroom: string;
  basement: string;
  hotwaterheating: string;
  airconditioning: string;
  prefarea: string;
  furnishingstatus: string;
  predictedPrice: number;
  pricePerSqFt?: number;
  priceFormatted?: string;
  estimatedMonthlyRent?: number;
  stampDutyEstimate?: number;
  location?: LocationData;
  investmentAdvice: string;
  confidence: string;
  marketStatus: string;
  investmentScore: number;
  futurePrice1Y: number;
  futurePrice3Y: number;
  futurePrice5Y: number;
  aiExplanation: string;
  createdAt: string;
  confidenceInterval?: {
    lowerBound: number;
    upperBound: number;
  };
  featureAttributions?: FeatureImpactItem[];
}

export interface PredictionInput {
  area: number;
  bedrooms: number;
  bathrooms: number;
  stories: number;
  parking: number;
  mainroad: 'yes' | 'no';
  guestroom: 'yes' | 'no';
  basement: 'yes' | 'no';
  hotwaterheating: 'yes' | 'no';
  airconditioning: 'yes' | 'no';
  prefarea: 'yes' | 'no';
  furnishingstatus: 'furnished' | 'semi-furnished' | 'unfurnished';
  location?: LocationData;
}

export type ScreenType =
  | 'splash'
  | 'login'
  | 'register'
  | 'dashboard'
  | 'prediction'
  | 'history'
  | 'analytics'
  | 'emi'
  | 'profile'
  | 'settings'
  | 'admin';

export type ThemeAccent = 'indigo' | 'emerald' | 'violet' | 'cyan' | 'amber' | 'rose';

export interface ThemeConfig {
  id: ThemeAccent;
  name: string;
  primaryClass: string;
  bgLightClass: string;
  borderClass: string;
  textClass: string;
  hex: string;
}

