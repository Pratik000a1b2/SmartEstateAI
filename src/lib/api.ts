/**
 * SmartEstate™ Core Client API & Regression Mathematics Engine
 * 
 * Copyright (c) SmartEstate Systems. All Rights Reserved.
 * Lead Developer: Pratik Panzade <pratikpanzade000@gmail.com>
 * 
 * @module SmartEstateClientAPI
 * @version 2.4.0
 */

import { PredictionInput, PredictionRecord, User } from '../types';
import { db } from './firebase';
import { collection, doc, setDoc, getDocs, deleteDoc } from 'firebase/firestore';
import { runMLInference, MODEL_METRICS } from './ml_engine';

const INITIAL_PREDICTIONS: PredictionRecord[] = [
  {
    id: 'pred_101',
    userId: 'user_default',
    area: 2450,
    bedrooms: 4,
    bathrooms: 3,
    stories: 2,
    parking: 2,
    mainroad: 'yes',
    guestroom: 'yes',
    basement: 'yes',
    hotwaterheating: 'no',
    airconditioning: 'yes',
    prefarea: 'yes',
    furnishingstatus: 'furnished',
    predictedPrice: 585000,
    investmentAdvice: 'Strong Buy - High Alpha & Capital Growth Potential',
    confidence: '96.4% Statistical Confidence',
    marketStatus: 'Tier-1 High-Demand Appreciation Zone',
    investmentScore: 92,
    futurePrice1Y: 625950,
    futurePrice3Y: 716640,
    futurePrice5Y: 820475,
    aiExplanation: 'Trained Ridge Regression model evaluated property vector against calibrated housing features (R² = 0.892). Primary valuation drivers: Area Footprint (+34%) and Prime Location Tag (+18%). 5-year capital appreciation projection models a baseline 7.2% annualized growth with 95% statistical confidence limits.',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    confidenceInterval: {
      lowerBound: 560596,
      upperBound: 609404,
    },
    featureAttributions: [
      { featureKey: 'area', label: 'Area Footprint', inputValue: '2450 sq.ft', impactINR: 167825, percentage: 34, direction: 'positive' },
      { featureKey: 'prefarea', label: 'Prime Location Tag', inputValue: 'Yes (Prime)', impactINR: 48000, percentage: 18, direction: 'positive' },
      { featureKey: 'airconditioning', label: 'HVAC Air Conditioning', inputValue: 'Equipped', impactINR: 36000, percentage: 14, direction: 'positive' },
      { featureKey: 'bathrooms', label: 'Bathroom Fixtures', inputValue: '3 Baths', impactINR: 84000, percentage: 13, direction: 'positive' },
    ],
  },
  {
    id: 'pred_102',
    userId: 'user_default',
    area: 1650,
    bedrooms: 3,
    bathrooms: 2,
    stories: 1,
    parking: 1,
    mainroad: 'yes',
    guestroom: 'no',
    basement: 'no',
    hotwaterheating: 'no',
    airconditioning: 'yes',
    prefarea: 'no',
    furnishingstatus: 'semi-furnished',
    predictedPrice: 342000,
    investmentAdvice: 'Buy - Steady Appreciation & Defensive Asset Profile',
    confidence: '93.5% Statistical Confidence',
    marketStatus: 'Prime Suburban Liquidity Corridor',
    investmentScore: 78,
    futurePrice1Y: 365940,
    futurePrice3Y: 418960,
    futurePrice5Y: 479650,
    aiExplanation: 'Standard regularized regression estimate indicates solid baseline liquidity and steady compounding trajectory. HVAC and arterial road access provide defensive asset support.',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    confidenceInterval: {
      lowerBound: 317596,
      upperBound: 366404,
    },
  },
];

export function calculateLocalPrediction(data: PredictionInput) {
  const inference = runMLInference(data);

  const bedrooms = Number(data.bedrooms) || 3;
  const bathrooms = Number(data.bathrooms) || 2;
  const area = Number(data.area) || 1200;
  const parking = Number(data.parking) || 1;
  const prefarea = String(data.prefarea || 'yes').toLowerCase() === 'yes';
  const stories = Number(data.stories) || 2;
  const locName = data.location?.locality || (prefarea ? 'Prime Urban Zone' : 'Urban Growth Corridor');

  const similarProperties = [
    {
      title: `Modern ${bedrooms}BHK Residence in ${locName}`,
      area: Math.round(area * 0.95),
      price: Math.round(inference.predictedPrice * 0.96),
      bedrooms,
      bathrooms,
      location: `${locName} Block A`,
    },
    {
      title: `Luxury ${bedrooms}BHK Villa with ${parking} Car Parking`,
      area: Math.round(area * 1.08),
      price: Math.round(inference.predictedPrice * 1.06),
      bedrooms,
      bathrooms: bathrooms + 1,
      location: `${locName} Sector 2`,
    },
    {
      title: `Contemporary ${stories}-Story Estate`,
      area: Math.round(area * 1.02),
      price: Math.round(inference.predictedPrice * 1.01),
      bedrooms,
      bathrooms,
      location: `${locName} Metro Belt`,
    },
  ];

  return {
    predicted_price: inference.predictedPrice,
    price_per_sq_ft: inference.pricePerSqFt,
    formatted_price_short: inference.formattedPriceShort,
    formatted_price_full: inference.formattedPriceFull,
    financials: inference.financials,
    location_used: inference.locationUsed,
    investment_advice: inference.investmentAdvice,
    confidence: inference.confidenceScore,
    market_status: inference.marketStatus,
    investment_score: inference.investmentScore,
    future_price: {
      '1_year': inference.futureProjections.year1.expected,
      '3_year': inference.futureProjections.year3.expected,
      '5_year': inference.futureProjections.year5.expected,
    },
    confidence_interval: inference.confidenceInterval95,
    feature_attributions: inference.featureAttributions,
    model_metrics: inference.modelMetrics,
    similar_properties: similarProperties,
    ai_explanation: inference.mlExplanation,
  };
}

export function formatINR(val: number | string): string {
  const num = typeof val === 'number' ? val : Number(val) || 0;
  return '₹' + Math.round(num).toLocaleString('en-IN');
}

export function formatDate(dateInput: string | Date | number): string {
  if (!dateInput) return '';
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return String(dateInput);
  const day = d.getDate();
  const month = d.getMonth() + 1;
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

export function deduplicatePredictionRecords(items: PredictionRecord[]): PredictionRecord[] {
  if (!Array.isArray(items)) return [];
  const result: PredictionRecord[] = [];

  for (const item of items) {
    if (!item) continue;
    const isDuplicate = result.some((existing) => {
      if (existing.id === item.id) return true;
      const sameUser = (existing.userId || '').toLowerCase().trim() === (item.userId || '').toLowerCase().trim();
      const samePrice = Math.abs((existing.predictedPrice || 0) - (item.predictedPrice || 0)) < 2;
      const sameArea = Math.abs((existing.area || 0) - (item.area || 0)) < 2;
      const sameBeds = existing.bedrooms === item.bedrooms;
      const timeDiff = Math.abs(
        new Date(existing.createdAt || 0).getTime() - new Date(item.createdAt || 0).getTime()
      );
      return sameUser && samePrice && sameArea && sameBeds && timeDiff < 180000;
    });

    if (!isDuplicate) {
      result.push(item);
    }
  }

  return result.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
}

export function getLocalPredictions(userId?: string, userEmail?: string): PredictionRecord[] {
  try {
    const raw = localStorage.getItem('smartestate_predictions');
    if (!raw) {
      return [];
    }
    const parsed: PredictionRecord[] = JSON.parse(raw);
    const cleaned = deduplicatePredictionRecords(parsed);
    if (cleaned.length !== parsed.length) {
      localStorage.setItem('smartestate_predictions', JSON.stringify(cleaned));
    }

    if (!userId && !userEmail) {
      return [];
    }

    const uId = (userId || '').toLowerCase().trim();
    const uEmail = (userEmail || '').toLowerCase().trim();

    return cleaned.filter((p) => {
      const pUserId = (p.userId || '').toLowerCase().trim();
      return (uId && pUserId === uId) || (uEmail && pUserId === uEmail);
    });
  } catch (e) {
    return [];
  }
}

export function saveLocalPrediction(record: Omit<PredictionRecord, 'id' | 'createdAt'> & { id?: string; createdAt?: string }): PredictionRecord {
  const current = getLocalPredictions();

  // Deduplication check: If an identical prediction for the same user exists within 3 minutes
  const nowTime = record.createdAt ? new Date(record.createdAt).getTime() : Date.now();
  const recentDuplicate = current.find((existing) => {
    const isSameUser = (existing.userId || '').toLowerCase().trim() === (record.userId || '').toLowerCase().trim();
    const isSamePrice = Math.abs((existing.predictedPrice || 0) - (record.predictedPrice || 0)) < 2;
    const isSameArea = Math.abs((existing.area || 0) - (record.area || 0)) < 2;
    const existingTime = new Date(existing.createdAt).getTime();
    const isRecent = Math.abs(nowTime - existingTime) < 180000;
    return isSameUser && isSamePrice && isSameArea && isRecent;
  });

  if (recentDuplicate) {
    return recentDuplicate;
  }

  const newRecord: PredictionRecord = {
    ...record,
    id: record.id || `pred_${Date.now()}`,
    createdAt: record.createdAt || new Date().toISOString(),
  };
  const filtered = current.filter((item) => item.id !== newRecord.id);
  const updated = deduplicatePredictionRecords([newRecord, ...filtered]);
  try {
    localStorage.setItem('smartestate_predictions', JSON.stringify(updated));
  } catch (e) {
    console.error(e);
  }

  // Sync to Firestore
  try {
    const firestorePayload = JSON.parse(JSON.stringify(newRecord));
    setDoc(doc(db, 'predictions', newRecord.id), firestorePayload)
      .then(() => {
        console.log('✅ Prediction successfully synced to Firestore:', newRecord.id);
      })
      .catch((err) => {
        console.warn('⚠️ Firestore write prediction warning:', err);
      });
  } catch (e) {
    console.warn('Firestore prediction payload prep error:', e);
  }

  return newRecord;
}

export async function apiPredict(formData: PredictionInput, userId: string = 'user_default') {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    const res = await fetch('/api/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formData, userId }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      // Sync to local storage with recordId
      let savedRecord: PredictionRecord;
      try {
        savedRecord = saveLocalPrediction({
          id: data.recordId,
          userId,
          area: formData.area,
          bedrooms: formData.bedrooms,
          bathrooms: formData.bathrooms,
          stories: formData.stories,
          parking: formData.parking,
          mainroad: formData.mainroad,
          guestroom: formData.guestroom,
          basement: formData.basement,
          hotwaterheating: formData.hotwaterheating,
          airconditioning: formData.airconditioning,
          prefarea: formData.prefarea,
          furnishingstatus: formData.furnishingstatus,
          predictedPrice: data.predicted_price,
          pricePerSqFt: data.price_per_sq_ft,
          priceFormatted: data.formatted_price_short,
          estimatedMonthlyRent: data.financials?.monthlyRent,
          stampDutyEstimate: data.financials?.stampDuty,
          location: formData.location || data.location_used,
          investmentAdvice: data.investment_advice,
          confidence: data.confidence,
          marketStatus: data.market_status,
          investmentScore: data.investment_score,
          futurePrice1Y: data.future_price['1_year'],
          futurePrice3Y: data.future_price['3_year'],
          futurePrice5Y: data.future_price['5_year'],
          aiExplanation: data.ai_explanation,
        });
      } catch (e) {
        savedRecord = { id: data.recordId } as any;
      }
      return {
        ...data,
        recordId: savedRecord.id || data.recordId,
      };
    }
  } catch (err) {
    console.warn('Backend server unreachable, executing client-side ML calculation for mobile/local mode:', err);
  }

  // Fallback to local ML calculation
  const localResult = calculateLocalPrediction(formData);
  const localRecord = saveLocalPrediction({
    userId,
    area: formData.area,
    bedrooms: formData.bedrooms,
    bathrooms: formData.bathrooms,
    stories: formData.stories,
    parking: formData.parking,
    mainroad: formData.mainroad,
    guestroom: formData.guestroom,
    basement: formData.basement,
    hotwaterheating: formData.hotwaterheating,
    airconditioning: formData.airconditioning,
    prefarea: formData.prefarea,
    furnishingstatus: formData.furnishingstatus,
    predictedPrice: localResult.predicted_price,
    pricePerSqFt: localResult.price_per_sq_ft,
    priceFormatted: localResult.formatted_price_short,
    estimatedMonthlyRent: localResult.financials?.monthlyRent,
    stampDutyEstimate: localResult.financials?.stampDuty,
    location: formData.location || localResult.location_used,
    investmentAdvice: localResult.investment_advice,
    confidence: localResult.confidence,
    marketStatus: localResult.market_status,
    investmentScore: localResult.investment_score,
    futurePrice1Y: localResult.future_price['1_year'],
    futurePrice3Y: localResult.future_price['3_year'],
    futurePrice5Y: localResult.future_price['5_year'],
    aiExplanation: localResult.ai_explanation,
  });

  return {
    ...localResult,
    recordId: localRecord.id,
  };
}

export async function apiGetPredictions(userId?: string, userEmail?: string): Promise<PredictionRecord[]> {
  if (!userId && !userEmail) {
    return [];
  }
  const uId = (userId || '').toLowerCase().trim();
  const uEmail = (userEmail || '').toLowerCase().trim();

  let serverItems: PredictionRecord[] = [];
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const res = await fetch(`/api/predictions?userId=${encodeURIComponent(userId || '')}&email=${encodeURIComponent(userEmail || '')}`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      serverItems = await res.json();
    }
  } catch (err) {
    console.warn('Backend server unreachable, using local storage predictions history:', err);
  }

  const localItems = getLocalPredictions(userId, userEmail);

  // Combine server items & local items into a single map keyed by item.id
  const map = new Map<string, PredictionRecord>();
  localItems.forEach((item) => {
    if (item && item.id) {
      map.set(item.id, item);
    }
  });
  serverItems.forEach((item) => {
    if (item && item.id) {
      map.set(item.id, item);
    }
  });

  const combined = Array.from(map.values());
  const deduplicated = deduplicatePredictionRecords(combined);

  // Strictly filter for current user
  return deduplicated.filter((p) => {
    const pUserId = (p.userId || '').toLowerCase().trim();
    return (uId && pUserId === uId) || (uEmail && pUserId === uEmail);
  });
}

export async function apiDeletePrediction(id: string): Promise<boolean> {
  try {
    await fetch(`/api/predictions/${id}`, { method: 'DELETE' });
  } catch (err) {}

  const current = getLocalPredictions();
  const updated = current.filter((p) => p.id !== id);
  try {
    localStorage.setItem('smartestate_predictions', JSON.stringify(updated));
  } catch (e) {}
  return true;
}

export async function apiDeleteAllPredictions(): Promise<boolean> {
  try {
    await fetch('/api/predictions', { method: 'DELETE' });
  } catch (err) {}

  try {
    localStorage.setItem('smartestate_has_initialized', 'true');
    localStorage.setItem('smartestate_predictions', JSON.stringify([]));
  } catch (e) {}
  return true;
}

export function isValidEmail(email: string): boolean {
  if (!email) return false;
  const clean = email.trim();
  // Standard RFC-compliant email validation regex
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(clean);
}

export function isGmailAddress(email: string): boolean {
  if (!email) return false;
  const clean = email.trim().toLowerCase();
  return clean.endsWith('@gmail.com') || clean.endsWith('@googlemail.com');
}

export function isValidGmailFormat(email: string): { valid: boolean; reason?: string } {
  if (!email || !email.trim()) {
    return { valid: false, reason: 'Email address cannot be empty' };
  }
  const clean = email.trim().toLowerCase();
  if (!clean.includes('@')) {
    return { valid: false, reason: 'Missing "@" symbol in email address' };
  }
  if (!isValidEmail(clean)) {
    return { valid: false, reason: 'Please enter a complete and valid email address (e.g. yourname@gmail.com)' };
  }
  if (clean.endsWith('@gmail.com') || clean.endsWith('@googlemail.com')) {
    const username = clean.split('@')[0];
    if (username.length < 6) {
      return { valid: false, reason: 'Gmail username must be at least 6 characters long' };
    }
    if (username.length > 30) {
      return { valid: false, reason: 'Gmail username cannot exceed 30 characters' };
    }
    if (/^[._]|[. _]$|\.\./.test(username)) {
      return { valid: false, reason: 'Gmail username cannot start, end with a dot, or contain consecutive dots' };
    }
    if (!/^[a-z0-9.]+$/.test(username)) {
      return { valid: false, reason: 'Gmail username can only contain letters (a-z), numbers (0-9), and periods (.)' };
    }
  }
  return { valid: true };
}

export interface StoredUserRecord extends User {
  passwordHash?: string;
  loginCount?: number;
}

export function findRegisteredUserByEmailOrPhone(identifier: string): StoredUserRecord | undefined {
  if (!identifier) return undefined;
  const clean = identifier.toLowerCase().trim();
  const cleanDigits = identifier.replace(/\D/g, '');
  const users = getLocalUsers();

  return users.find((u) => {
    const emailMatch = u.email && u.email.toLowerCase().trim() === clean;
    const phoneMatch = u.phone && u.phone.replace(/\D/g, '') !== '' && cleanDigits !== '' && u.phone.replace(/\D/g, '') === cleanDigits;
    const idMatch = u.id && u.id.toLowerCase().trim() === clean;
    return emailMatch || phoneMatch || idMatch;
  });
}

const INITIAL_USERS: StoredUserRecord[] = [
  {
    id: 'user_owner_01',
    name: 'Pratik Panzade (Software Owner)',
    email: 'pratikpanzade000@gmail.com',
    role: 'admin',
    passwordHash: '#922008@Owner',
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    lastLoginAt: new Date().toISOString(),
    loginCount: 50,
  },
  {
    id: 'user_admin_01',
    name: 'Software Admin User',
    email: 'admin@smartestate.ai',
    role: 'user',
    passwordHash: 'admin123',
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    lastLoginAt: new Date().toISOString(),
    loginCount: 42,
  },
  {
    id: 'user_demo_01',
    name: 'Alex Johnson',
    email: 'alex.johnson@gmail.com',
    role: 'user',
    passwordHash: 'alex@123',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    lastLoginAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    loginCount: 7,
  },
  {
    id: 'user_demo_02',
    name: 'Ram',
    email: 'ram@gmail.com',
    role: 'user',
    passwordHash: 'ram123',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    lastLoginAt: new Date().toISOString(),
    loginCount: 1,
  },
  {
    id: 'user_demo_03',
    name: 'OM',
    email: 'om@gmail.com',
    role: 'user',
    passwordHash: '123456',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    lastLoginAt: new Date().toISOString(),
    loginCount: 1,
  },
];

export function getDeletedUserIdentifiers(): Set<string> {
  try {
    const raw = localStorage.getItem('smartestate_deleted_users');
    if (!raw) return new Set();
    return new Set(JSON.parse(raw));
  } catch (e) {
    return new Set();
  }
}

export function getLocalUsers(): StoredUserRecord[] {
  try {
    const deletedSet = getDeletedUserIdentifiers();
    const raw = localStorage.getItem('smartestate_users_db');
    let usersList: StoredUserRecord[];
    if (!raw) {
      usersList = INITIAL_USERS;
    } else {
      usersList = JSON.parse(raw);
    }

    // Filter out deleted users
    usersList = usersList.filter(
      (u) => u && !deletedSet.has(u.id) && !deletedSet.has(u.email?.toLowerCase().trim())
    );

    // Enforce single Admin rule: ONLY pratikpanzade000@gmail.com is admin
    let hasChanges = false;
    usersList = usersList.map((u) => {
      const isOwner = u.email.toLowerCase().trim() === 'pratikpanzade000@gmail.com';
      const targetRole: 'admin' | 'user' = isOwner ? 'admin' : 'user';
      if (u.role !== targetRole) {
        hasChanges = true;
        return { ...u, role: targetRole };
      }
      return u;
    });

    if (hasChanges || !raw) {
      localStorage.setItem('smartestate_users_db', JSON.stringify(usersList));
    }
    return usersList;
  } catch (e) {
    return INITIAL_USERS;
  }
}

export function saveUserToDatabase(userData: {
  name: string;
  email: string;
  phone?: string;
  photoURL?: string;
  provider?: 'google' | 'password' | 'phone';
  password?: string;
  role?: 'admin' | 'user';
}): User {
  const cleanEmail = userData.email.toLowerCase().trim();
  const cleanPhone = userData.phone ? userData.phone.trim() : '';

  // If user is registering/logging in anew, remove them from deleted set if present
  try {
    const deletedSet = getDeletedUserIdentifiers();
    if (deletedSet.has(cleanEmail)) {
      deletedSet.delete(cleanEmail);
      localStorage.setItem('smartestate_deleted_users', JSON.stringify(Array.from(deletedSet)));
    }
  } catch (e) {}

  const currentUsers = getLocalUsers();
  const existingIdx = currentUsers.findIndex((u) => {
    const emailMatch = u.email && u.email.toLowerCase().trim() === cleanEmail;
    const phoneMatch = cleanPhone && u.phone && u.phone.replace(/\D/g, '') === cleanPhone.replace(/\D/g, '');
    return emailMatch || phoneMatch;
  });

  const now = new Date().toISOString();
  const isOwnerEmail = cleanEmail === 'pratikpanzade000@gmail.com' || cleanEmail === 'aiml43465@gmail.com';

  let targetUserRecord: StoredUserRecord;

  if (existingIdx >= 0) {
    const existing = currentUsers[existingIdx];
    targetUserRecord = {
      ...existing,
      name: userData.name || existing.name,
      email: userData.email || existing.email,
      phone: userData.phone || existing.phone,
      photoURL: userData.photoURL || existing.photoURL,
      provider: userData.provider || existing.provider || 'password',
      role: isOwnerEmail ? 'admin' : (userData.role || existing.role || 'user'),
      lastLoginAt: now,
      loginCount: (existing.loginCount || 1) + 1,
      passwordHash: userData.password || existing.passwordHash,
    };
    currentUsers[existingIdx] = targetUserRecord;
    try {
      localStorage.setItem('smartestate_users_db', JSON.stringify(currentUsers));
    } catch (e) {}
  } else {
    targetUserRecord = {
      id: 'usr_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      photoURL: userData.photoURL,
      provider: userData.provider || 'password',
      role: isOwnerEmail ? 'admin' : (userData.role || 'user'),
      createdAt: now,
      lastLoginAt: now,
      loginCount: 1,
      passwordHash: userData.password || 'N/A',
    };

    const updatedList = [targetUserRecord, ...currentUsers];
    try {
      localStorage.setItem('smartestate_users_db', JSON.stringify(updatedList));
    } catch (e) {}
  }

  // Asynchronously write to Firebase Firestore
  try {
    const firestoreUserPayload = JSON.parse(JSON.stringify(targetUserRecord));
    setDoc(doc(db, 'users', targetUserRecord.id), firestoreUserPayload)
      .then(() => {
        console.log('✅ User successfully synced to Firestore:', targetUserRecord.email);
      })
      .catch((err) => {
        console.warn('⚠️ Firestore write user error:', err);
      });
  } catch (e) {
    console.warn('Firestore user payload prep error:', e);
  }

  return {
    id: targetUserRecord.id,
    name: targetUserRecord.name,
    email: targetUserRecord.email,
    phone: targetUserRecord.phone,
    photoURL: targetUserRecord.photoURL,
    provider: targetUserRecord.provider,
    role: targetUserRecord.role,
    createdAt: targetUserRecord.createdAt,
    lastLoginAt: targetUserRecord.lastLoginAt,
  };
}

export async function deleteUserFromDatabase(userId: string, userEmail?: string): Promise<boolean> {
  const cleanEmail = userEmail ? userEmail.toLowerCase().trim() : '';
  const cleanId = userId ? userId.toLowerCase().trim() : '';

  // 1. Record deletion permanently in localStorage deleted set
  try {
    const deletedSet = getDeletedUserIdentifiers();
    if (userId) deletedSet.add(userId);
    if (cleanId) deletedSet.add(cleanId);
    if (cleanEmail) deletedSet.add(cleanEmail);
    localStorage.setItem('smartestate_deleted_users', JSON.stringify(Array.from(deletedSet)));
  } catch (e) {}

  // 2. Delete from local users database
  const current = getLocalUsers();
  const updated = current.filter(
    (u) => u.id !== userId && u.id.toLowerCase().trim() !== cleanId && (!cleanEmail || u.email.toLowerCase().trim() !== cleanEmail)
  );
  try {
    localStorage.setItem('smartestate_users_db', JSON.stringify(updated));
  } catch (e) {}

  // 3. Delete user's predictions from local storage
  try {
    const allPreds = getLocalPredictions();
    const cleanPreds = allPreds.filter((p) => {
      const pUserId = (p.userId || '').toLowerCase().trim();
      const matchId = cleanId && pUserId === cleanId;
      const matchEmail = cleanEmail && pUserId === cleanEmail;
      return !matchId && !matchEmail;
    });
    localStorage.setItem('smartestate_predictions', JSON.stringify(cleanPreds));
  } catch (e) {}

  // 4. Revoke active logged-in session immediately if it matches deleted user
  try {
    const savedUserRaw = localStorage.getItem('smartestate_user');
    if (savedUserRaw) {
      const savedUser = JSON.parse(savedUserRaw);
      const savedEmail = (savedUser?.email || '').toLowerCase().trim();
      const savedId = (savedUser?.id || '').toLowerCase().trim();
      if ((cleanId && savedId === cleanId) || (cleanEmail && savedEmail === cleanEmail)) {
        localStorage.removeItem('smartestate_user');
      }
    }
  } catch (e) {}

  // 5. Notify backend server endpoint
  try {
    await fetch(`/api/users/${encodeURIComponent(userId)}?email=${encodeURIComponent(cleanEmail)}`, {
      method: 'DELETE',
    }).catch(() => {});
  } catch (e) {}

  // 6. Delete from Firestore users & predictions collections, and add to deleted_users collection for real-time listener auto-logout
  try {
    if (userId) {
      await setDoc(doc(db, 'deleted_users', userId), { deletedAt: new Date().toISOString(), cleanEmail }).catch(() => {});
      await deleteDoc(doc(db, 'users', userId)).catch(() => {});
    }
    if (cleanEmail) {
      await setDoc(doc(db, 'deleted_users', cleanEmail), { deletedAt: new Date().toISOString(), userId }).catch(() => {});
      await deleteDoc(doc(db, 'users', cleanEmail)).catch(() => {});
    }
    const predSnap = await getDocs(collection(db, 'predictions')).catch(() => null);
    if (predSnap) {
      predSnap.forEach((docSnap) => {
        const data = docSnap.data();
        const pUserId = (data.userId || '').toLowerCase().trim();
        if (
          (cleanId && pUserId === cleanId) ||
          (cleanEmail && pUserId === cleanEmail)
        ) {
          deleteDoc(doc(db, 'predictions', docSnap.id)).catch(() => {});
        }
      });
    }
  } catch (e) {}

  // 7. Dispatch custom events so active browser tabs respond and logout immediately
  try {
    window.dispatchEvent(new CustomEvent('smartestate_user_deleted', { detail: { userId, userEmail: cleanEmail } }));
    window.dispatchEvent(new Event('storage'));
  } catch (e) {}

  return true;
}

export async function deleteSinglePrediction(id: string): Promise<boolean> {
  // Local storage deletion
  const current = getLocalPredictions();
  const updated = current.filter((p) => p.id !== id);
  try {
    localStorage.setItem('smartestate_predictions', JSON.stringify(updated));
  } catch (e) {}

  // Firestore deletion
  try {
    await deleteDoc(doc(db, 'predictions', id)).catch(() => {});
  } catch (e) {}

  // API deletion fallback
  try {
    await fetch(`/api/predictions/${id}`, { method: 'DELETE' }).catch(() => {});
  } catch (e) {}

  return true;
}

export async function clearUserPredictions(userId: string, userEmail?: string): Promise<boolean> {
  const current = getLocalPredictions();
  const uId = (userId || '').toLowerCase().trim();
  const uEmail = (userEmail || '').toLowerCase().trim();

  const toKeep = current.filter((p) => {
    const pUserId = (p.userId || '').toLowerCase().trim();
    const isMatch = (uId && pUserId === uId) || (uEmail && pUserId === uEmail);
    return !isMatch;
  });

  try {
    localStorage.setItem('smartestate_predictions', JSON.stringify(toKeep));
  } catch (e) {}

  // Delete from Firestore
  try {
    const predSnap = await getDocs(collection(db, 'predictions')).catch(() => null);
    if (predSnap) {
      predSnap.forEach((docSnap) => {
        const data = docSnap.data();
        const pUserId = (data.userId || '').toLowerCase().trim();
        if ((uId && pUserId === uId) || (uEmail && pUserId === uEmail)) {
          deleteDoc(doc(db, 'predictions', docSnap.id)).catch(() => {});
        }
      });
    }
  } catch (e) {}

  return true;
}

export async function fetchFirestoreUsers(): Promise<StoredUserRecord[]> {
  const deletedSet = getDeletedUserIdentifiers();
  try {
    const querySnapshot = await getDocs(collection(db, 'users'));
    const firestoreUsers: StoredUserRecord[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data() as StoredUserRecord;
      if (data && !deletedSet.has(data.id) && !deletedSet.has(data.email?.toLowerCase().trim())) {
        firestoreUsers.push(data);
      }
    });

    const local = getLocalUsers();
    const map = new Map<string, StoredUserRecord>();
    local.forEach((u) => {
      if (!deletedSet.has(u.id) && !deletedSet.has(u.email.toLowerCase().trim())) {
        map.set(u.email.toLowerCase().trim(), u);
      }
    });
    firestoreUsers.forEach((u) => {
      if (!deletedSet.has(u.id) && !deletedSet.has(u.email.toLowerCase().trim())) {
        map.set(u.email.toLowerCase().trim(), u);
      }
    });
    const merged = Array.from(map.values());
    try {
      localStorage.setItem('smartestate_users_db', JSON.stringify(merged));
    } catch (e) {}
    return merged;
  } catch (e) {
    console.warn('Could not fetch Firestore users:', e);
  }
  return getLocalUsers();
}

export async function fetchFirestorePredictions(): Promise<PredictionRecord[]> {
  try {
    const querySnapshot = await getDocs(collection(db, 'predictions'));
    const firestorePreds: PredictionRecord[] = [];
    querySnapshot.forEach((docSnap) => {
      firestorePreds.push(docSnap.data() as PredictionRecord);
    });
    if (firestorePreds.length > 0) {
      const local = getLocalPredictions();
      const map = new Map<string, PredictionRecord>();
      local.forEach((p) => map.set(p.id, p));
      firestorePreds.forEach((p) => map.set(p.id, p));
      const merged = Array.from(map.values());
      const deduplicated = deduplicatePredictionRecords(merged);
      try {
        localStorage.setItem('smartestate_predictions', JSON.stringify(deduplicated));
      } catch (e) {}
      return deduplicated;
    }
  } catch (e) {
    console.warn('Could not fetch Firestore predictions:', e);
  }
  return getLocalPredictions();
}

export async function syncAllDataToFirestore(): Promise<{ usersCount: number; predsCount: number }> {
  let uCount = 0;
  let pCount = 0;
  try {
    const users = getLocalUsers();
    for (const u of users) {
      if (u && u.id) {
        const payload = JSON.parse(JSON.stringify(u));
        await setDoc(doc(db, 'users', u.id), payload);
        uCount++;
      }
    }
    const preds = getLocalPredictions();
    for (const p of preds) {
      if (p && p.id) {
        const payload = JSON.parse(JSON.stringify(p));
        await setDoc(doc(db, 'predictions', p.id), payload);
        pCount++;
      }
    }
  } catch (err) {
    console.error('Error syncing all data to Firestore:', err);
    throw err;
  }
  return { usersCount: uCount, predsCount: pCount };
}



