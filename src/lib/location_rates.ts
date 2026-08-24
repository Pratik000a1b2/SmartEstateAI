/**
 * SmartEstate™ - Real-World Spatial Micro-Market Pricing & Geo-Analytics
 * 
 * Maps real GPS coordinates / localities across Indian & Global metros
 * to verified real-world market rates per sq.ft (₹/sq.ft).
 */

import { LocationData } from '../types';

export interface MicroMarket {
  city: string;
  locality: string;
  state: string;
  latitude: number;
  longitude: number;
  baseRatePerSqFt: number; // in INR
  tier: 'tier1_prime' | 'tier1_suburb' | 'tier2_hub' | 'tier3_emerging';
  rentalYieldPercent: number; // e.g. 3.8%
  annualAppreciation: number; // e.g. 8.5%
  distanceToMetroKm: number;
  distanceToTechParkKm: number;
  description: string;
}

export const REAL_WORLD_MICRO_MARKETS: MicroMarket[] = [
  // PUNE
  {
    city: 'Pune',
    locality: 'Kharadi (EON IT Corridor)',
    state: 'Maharashtra',
    latitude: 18.5515,
    longitude: 73.9348,
    baseRatePerSqFt: 8850,
    tier: 'tier1_prime',
    rentalYieldPercent: 4.2,
    annualAppreciation: 9.2,
    distanceToMetroKm: 1.2,
    distanceToTechParkKm: 0.5,
    description: 'Premier IT & Financial corridor with world-class SEZ infrastructure.',
  },
  {
    city: 'Pune',
    locality: 'Hinjawadi Phase 1-3',
    state: 'Maharashtra',
    latitude: 18.5913,
    longitude: 73.7389,
    baseRatePerSqFt: 7400,
    tier: 'tier1_suburb',
    rentalYieldPercent: 4.5,
    annualAppreciation: 8.4,
    distanceToMetroKm: 0.8,
    distanceToTechParkKm: 0.4,
    description: 'Asia-renowned Tech Hub with high tech-tenant rental velocity.',
  },
  {
    city: 'Pune',
    locality: 'Baner - Balewadi High Street',
    state: 'Maharashtra',
    latitude: 18.5642,
    longitude: 73.7769,
    baseRatePerSqFt: 9600,
    tier: 'tier1_prime',
    rentalYieldPercent: 3.8,
    annualAppreciation: 8.8,
    distanceToMetroKm: 1.5,
    distanceToTechParkKm: 3.2,
    description: 'Upscale residential neighborhood with lifestyle hubs & expressways.',
  },
  {
    city: 'Pune',
    locality: 'Viman Nagar (Airport Corridor)',
    state: 'Maharashtra',
    latitude: 18.5679,
    longitude: 73.9143,
    baseRatePerSqFt: 10800,
    tier: 'tier1_prime',
    rentalYieldPercent: 4.0,
    annualAppreciation: 8.2,
    distanceToMetroKm: 2.1,
    distanceToTechParkKm: 1.8,
    description: 'Prime central hub near Pune International Airport & luxury retail.',
  },
  {
    city: 'Pune',
    locality: 'Wakad / Pimple Saudagar',
    state: 'Maharashtra',
    latitude: 18.5987,
    longitude: 73.7661,
    baseRatePerSqFt: 7900,
    tier: 'tier1_suburb',
    rentalYieldPercent: 4.1,
    annualAppreciation: 7.9,
    distanceToMetroKm: 2.4,
    distanceToTechParkKm: 4.5,
    description: 'Established residential zone preferred by software engineers.',
  },
  {
    city: 'Pune',
    locality: 'Kothrud (Paud Road)',
    state: 'Maharashtra',
    latitude: 18.5074,
    longitude: 73.8077,
    baseRatePerSqFt: 12200,
    tier: 'tier1_prime',
    rentalYieldPercent: 3.2,
    annualAppreciation: 7.5,
    distanceToMetroKm: 0.6,
    distanceToTechParkKm: 7.2,
    description: 'Heritage premium city core with excellent educational institutes.',
  },

  // MUMBAI / MMR
  {
    city: 'Mumbai',
    locality: 'Bandra West (Pali Hill)',
    state: 'Maharashtra',
    latitude: 19.0596,
    longitude: 72.8295,
    baseRatePerSqFt: 48500,
    tier: 'tier1_prime',
    rentalYieldPercent: 2.6,
    annualAppreciation: 6.8,
    distanceToMetroKm: 0.5,
    distanceToTechParkKm: 5.8,
    description: 'Ultra-luxury coastal district with celebrity enclaves and high capital density.',
  },
  {
    city: 'Mumbai',
    locality: 'Andheri West (Lokhandwala)',
    state: 'Maharashtra',
    latitude: 19.1363,
    longitude: 72.8277,
    baseRatePerSqFt: 25800,
    tier: 'tier1_prime',
    rentalYieldPercent: 3.1,
    annualAppreciation: 7.4,
    distanceToMetroKm: 0.4,
    distanceToTechParkKm: 2.5,
    description: 'Prime Western suburb with dense metro connectivity and media hubs.',
  },
  {
    city: 'Mumbai',
    locality: 'Powai (Hiranandani Gardens)',
    state: 'Maharashtra',
    latitude: 19.1176,
    longitude: 72.9060,
    baseRatePerSqFt: 26500,
    tier: 'tier1_prime',
    rentalYieldPercent: 3.5,
    annualAppreciation: 8.1,
    distanceToMetroKm: 1.8,
    distanceToTechParkKm: 0.8,
    description: 'Self-sustained luxury township with IIT Bombay & corporate towers.',
  },
  {
    city: 'Mumbai',
    locality: 'Thane West (Ghodbunder Road)',
    state: 'Maharashtra',
    latitude: 19.2183,
    longitude: 72.9781,
    baseRatePerSqFt: 13500,
    tier: 'tier1_suburb',
    rentalYieldPercent: 3.8,
    annualAppreciation: 8.7,
    distanceToMetroKm: 1.2,
    distanceToTechParkKm: 3.0,
    description: 'Fastest growing residential hotspot with lake views and malls.',
  },
  {
    city: 'Navi Mumbai',
    locality: 'Vashi / Palm Beach Road',
    state: 'Maharashtra',
    latitude: 19.0771,
    longitude: 72.9986,
    baseRatePerSqFt: 15400,
    tier: 'tier1_prime',
    rentalYieldPercent: 3.6,
    annualAppreciation: 8.5,
    distanceToMetroKm: 0.9,
    distanceToTechParkKm: 2.1,
    description: 'Planned satellite city node with upcoming International Airport proximity.',
  },

  // BENGALURU (BANGALORE)
  {
    city: 'Bengaluru',
    locality: 'Indiranagar 100ft Road',
    state: 'Karnataka',
    latitude: 12.9784,
    longitude: 77.6408,
    baseRatePerSqFt: 16800,
    tier: 'tier1_prime',
    rentalYieldPercent: 3.6,
    annualAppreciation: 8.9,
    distanceToMetroKm: 0.3,
    distanceToTechParkKm: 4.1,
    description: 'Central lifestyle capital with tree-lined avenues and boutique retail.',
  },
  {
    city: 'Bengaluru',
    locality: 'Whitefield (ITPL & EPIP)',
    state: 'Karnataka',
    latitude: 12.9698,
    longitude: 77.7499,
    baseRatePerSqFt: 9800,
    tier: 'tier1_prime',
    rentalYieldPercent: 4.4,
    annualAppreciation: 9.8,
    distanceToMetroKm: 0.5,
    distanceToTechParkKm: 0.3,
    description: 'Eastern IT corridor with Purple Metro line and MNC tech campuses.',
  },
  {
    city: 'Bengaluru',
    locality: 'Koramangala (Start-up Hub)',
    state: 'Karnataka',
    latitude: 12.9352,
    longitude: 77.6245,
    baseRatePerSqFt: 15900,
    tier: 'tier1_prime',
    rentalYieldPercent: 3.9,
    annualAppreciation: 8.6,
    distanceToMetroKm: 1.4,
    distanceToTechParkKm: 2.8,
    description: 'Vibrant startup unicorn ecosystem with premium residential layouts.',
  },
  {
    city: 'Bengaluru',
    locality: 'Bellandur / Outer Ring Road',
    state: 'Karnataka',
    latitude: 12.9304,
    longitude: 77.6784,
    baseRatePerSqFt: 11400,
    tier: 'tier1_prime',
    rentalYieldPercent: 4.6,
    annualAppreciation: 9.4,
    distanceToMetroKm: 1.1,
    distanceToTechParkKm: 0.4,
    description: 'Billion-dollar IT corridor housing Fortune 500 tech headquarters.',
  },
  {
    city: 'Bengaluru',
    locality: 'Electronic City Phase 1',
    state: 'Karnataka',
    latitude: 12.8399,
    longitude: 77.6770,
    baseRatePerSqFt: 6800,
    tier: 'tier1_suburb',
    rentalYieldPercent: 4.8,
    annualAppreciation: 7.8,
    distanceToMetroKm: 0.6,
    distanceToTechParkKm: 0.2,
    description: 'Dedicated tech township with elevated expressway access.',
  },

  // DELHI NCR (GURGAON / NOIDA / DELHI)
  {
    city: 'Gurgaon',
    locality: 'Golf Course Road (DLF Phase 5)',
    state: 'Haryana',
    latitude: 28.4595,
    longitude: 77.0964,
    baseRatePerSqFt: 24500,
    tier: 'tier1_prime',
    rentalYieldPercent: 3.4,
    annualAppreciation: 9.1,
    distanceToMetroKm: 0.4,
    distanceToTechParkKm: 1.2,
    description: 'Super-luxury avenue with high-end condominiums and executive penthouses.',
  },
  {
    city: 'Gurgaon',
    locality: 'Cyber City & DLF Phase 2',
    state: 'Haryana',
    latitude: 28.4908,
    longitude: 77.0898,
    baseRatePerSqFt: 18200,
    tier: 'tier1_prime',
    rentalYieldPercent: 4.1,
    annualAppreciation: 8.8,
    distanceToMetroKm: 0.2,
    distanceToTechParkKm: 0.3,
    description: 'Epicenter of global banking and corporate headquarters in North India.',
  },
  {
    city: 'Noida',
    locality: 'Noida Expressway (Sector 137 / 142)',
    state: 'Uttar Pradesh',
    latitude: 28.5134,
    longitude: 77.4074,
    baseRatePerSqFt: 8400,
    tier: 'tier1_suburb',
    rentalYieldPercent: 4.3,
    annualAppreciation: 9.5,
    distanceToMetroKm: 0.5,
    distanceToTechParkKm: 1.0,
    description: 'Modern infrastructure with Aqua Line metro, green belts and IT parks.',
  },
  {
    city: 'Delhi',
    locality: 'Greater Kailash 1 & 2',
    state: 'Delhi NCR',
    latitude: 28.5482,
    longitude: 77.2346,
    baseRatePerSqFt: 31000,
    tier: 'tier1_prime',
    rentalYieldPercent: 2.8,
    annualAppreciation: 6.9,
    distanceToMetroKm: 0.7,
    distanceToTechParkKm: 6.0,
    description: 'Posh South Delhi enclave with high heritage and land scarcity value.',
  },

  // HYDERABAD
  {
    city: 'Hyderabad',
    locality: 'Hitec City / Madhapur',
    state: 'Telangana',
    latitude: 17.4474,
    longitude: 78.3762,
    baseRatePerSqFt: 11800,
    tier: 'tier1_prime',
    rentalYieldPercent: 4.4,
    annualAppreciation: 10.2,
    distanceToMetroKm: 0.4,
    distanceToTechParkKm: 0.3,
    description: 'Hyderabad tech nucleus with major cloud software global campuses.',
  },
  {
    city: 'Hyderabad',
    locality: 'Gachibowli / Financial District',
    state: 'Telangana',
    latitude: 17.4194,
    longitude: 78.3489,
    baseRatePerSqFt: 10600,
    tier: 'tier1_prime',
    rentalYieldPercent: 4.3,
    annualAppreciation: 9.8,
    distanceToMetroKm: 1.8,
    distanceToTechParkKm: 0.5,
    description: 'Skyscraper commercial and luxury high-rise gated community zone.',
  },
  {
    city: 'Hyderabad',
    locality: 'Jubilee Hills (Checkpost)',
    state: 'Telangana',
    latitude: 17.4319,
    longitude: 78.4073,
    baseRatePerSqFt: 22500,
    tier: 'tier1_prime',
    rentalYieldPercent: 3.0,
    annualAppreciation: 7.9,
    distanceToMetroKm: 0.8,
    distanceToTechParkKm: 3.5,
    description: 'Most prestigious address in Telangana with sprawling bungalows.',
  },

  // TIER-2 GROWTH ENGINES
  {
    city: 'Ahmedabad',
    locality: 'SG Highway / Bodakdev',
    state: 'Gujarat',
    latitude: 23.0338,
    longitude: 72.5135,
    baseRatePerSqFt: 7800,
    tier: 'tier2_hub',
    rentalYieldPercent: 3.9,
    annualAppreciation: 8.5,
    distanceToMetroKm: 1.5,
    distanceToTechParkKm: 2.0,
    description: 'Rapidly commercializing corridor connecting GIFT City and SG Highway.',
  },
  {
    city: 'Nagpur',
    locality: 'Wardha Road / MIHAN IT SEZ',
    state: 'Maharashtra',
    latitude: 21.0664,
    longitude: 79.0560,
    baseRatePerSqFt: 5100,
    tier: 'tier2_hub',
    rentalYieldPercent: 4.5,
    annualAppreciation: 9.0,
    distanceToMetroKm: 0.8,
    distanceToTechParkKm: 1.2,
    description: 'Central India logistics & IT hub with Metro link & cargo port.',
  },
  {
    city: 'Indore',
    locality: 'Vijay Nagar / Super Corridor',
    state: 'Madhya Pradesh',
    latitude: 22.7533,
    longitude: 75.8937,
    baseRatePerSqFt: 5600,
    tier: 'tier2_hub',
    rentalYieldPercent: 4.2,
    annualAppreciation: 8.9,
    distanceToMetroKm: 1.0,
    distanceToTechParkKm: 2.5,
    description: 'Commercial capital of Central India with TCS/Infosys tech parks.',
  },
  {
    city: 'Jaipur',
    locality: 'Malviya Nagar / Tonk Road',
    state: 'Rajasthan',
    latitude: 26.8529,
    longitude: 75.8118,
    baseRatePerSqFt: 6200,
    tier: 'tier2_hub',
    rentalYieldPercent: 3.8,
    annualAppreciation: 7.8,
    distanceToMetroKm: 2.0,
    distanceToTechParkKm: 3.2,
    description: 'Prime South Jaipur neighborhood near World Trade Park.',
  },
];

/**
 * Calculate Great-Circle Distance (Haversine Formula) in Kilometers
 */
export function calculateHaversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in KM
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Find Nearest Micro-Market & Interpolate Rate for any GPS Coordinate
 */
export function matchNearestMicroMarket(lat: number, lon: number): {
  market: MicroMarket;
  distanceKm: number;
  estimatedRatePerSqFt: number;
} {
  let closest = REAL_WORLD_MICRO_MARKETS[0];
  let minDistance = calculateHaversineDistanceKm(lat, lon, closest.latitude, closest.longitude);

  for (const m of REAL_WORLD_MICRO_MARKETS) {
    const dist = calculateHaversineDistanceKm(lat, lon, m.latitude, m.longitude);
    if (dist < minDistance) {
      minDistance = dist;
      closest = m;
    }
  }

  // Distance decay / suburban interpolation (rates reduce gently as distance from core increases)
  let rate = closest.baseRatePerSqFt;
  if (minDistance > 5) {
    // 1.5% decrease per extra 5km up to 25% floor
    const decayFactor = Math.max(0.65, 1 - (minDistance / 5) * 0.015);
    rate = Math.round(rate * decayFactor);
  }

  return {
    market: closest,
    distanceKm: Math.round(minDistance * 10) / 10,
    estimatedRatePerSqFt: rate,
  };
}

/**
 * Format Real-World Price in Indian Currency (Lakhs & Crores with symbol ₹)
 * Examples:
 *   ₹85.40 Lakhs
 *   ₹1.25 Cr
 *   ₹4.80 Cr
 */
export function formatRealIndianPrice(inrAmount: number): {
  formattedShort: string;
  formattedFull: string;
  numeric: number;
  inLakhs: number;
  inCrores: number;
} {
  const numeric = Math.round(inrAmount);
  const inLakhs = numeric / 100000;
  const inCrores = numeric / 10000000;

  let formattedShort = '';
  if (numeric >= 10000000) {
    formattedShort = `₹${inCrores.toFixed(2)} Cr`;
  } else if (numeric >= 100000) {
    formattedShort = `₹${inLakhs.toFixed(2)} L`;
  } else {
    formattedShort = `₹${numeric.toLocaleString('en-IN')}`;
  }

  const formattedFull = `₹${numeric.toLocaleString('en-IN')}`;

  return {
    formattedShort,
    formattedFull,
    numeric,
    inLakhs: Math.round(inLakhs * 100) / 100,
    inCrores: Math.round(inCrores * 100) / 100,
  };
}

/**
 * Calculate Real-World Housing Financials (Stamp Duty, Registration, Monthly EMI, Rent)
 */
export function calculateRealWorldFinancials(totalPriceINR: number, rentalYieldPct: number = 4.0) {
  // Stamp duty approx 6% + 1% registration in major Indian states
  const stampDuty = Math.round(totalPriceINR * 0.06);
  const registration = Math.min(35000, Math.round(totalPriceINR * 0.01));
  const governmentTaxes = stampDuty + registration;

  // Monthly Rental Yield Estimate (Annual Rent = Price * Yield%)
  const annualRent = totalPriceINR * (rentalYieldPct / 100);
  const monthlyRent = Math.round(annualRent / 12);

  // 20-Year Home Loan EMI at standard 8.5% interest rate (80% LTV)
  const loanPrincipal = totalPriceINR * 0.8;
  const monthlyRate = 0.085 / 12;
  const tenureMonths = 240;
  const emi = Math.round(
    (loanPrincipal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
      (Math.pow(1 + monthlyRate, tenureMonths) - 1)
  );

  return {
    stampDuty,
    registration,
    governmentTaxes,
    monthlyRent,
    annualRent: Math.round(annualRent),
    estimatedEmi20Y: emi,
    downPayment20Pct: Math.round(totalPriceINR * 0.2),
  };
}
