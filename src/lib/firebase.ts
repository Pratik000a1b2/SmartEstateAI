/**
 * SmartEstate™ Cloud Storage & Realtime Synchronization Client
 * 
 * Copyright (c) SmartEstate Systems. All Rights Reserved.
 * Lead Developer: Pratik Panzade <pratikpanzade000@gmail.com>
 * 
 * @module FirebaseCloudService
 * @version 2.4.0
 */

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { initializeFirestore, getFirestore, Firestore, setLogLevel } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import firebaseConfigJson from '../../firebase-applet-config.json';

// Keep Firestore logs clean from benign transient connectivity/offline retry logs
try {
  setLogLevel('error');
} catch (e) {}

const getInitialConfig = () => {
  try {
    const custom = localStorage.getItem('custom_firebase_config');
    if (custom) {
      const parsed = JSON.parse(custom);
      if (parsed && parsed.projectId && parsed.apiKey) {
        return parsed;
      }
    }
  } catch (e) {}

  return {
    apiKey: firebaseConfigJson.apiKey,
    authDomain: firebaseConfigJson.authDomain,
    projectId: firebaseConfigJson.projectId,
    storageBucket: firebaseConfigJson.storageBucket,
    messagingSenderId: firebaseConfigJson.messagingSenderId,
    appId: firebaseConfigJson.appId,
    firestoreDatabaseId: (firebaseConfigJson as any).firestoreDatabaseId || '(default)',
  };
};

const config = getInitialConfig();

let app: FirebaseApp;
if (getApps().length === 0) {
  app = initializeApp(config);
} else {
  app = getApp();
}

export const auth: Auth = getAuth(app);

const getDbInstance = (): Firestore => {
  const dbId = (config.firestoreDatabaseId && config.firestoreDatabaseId !== '(default)')
    ? config.firestoreDatabaseId
    : undefined;
  try {
    return initializeFirestore(app, {
      experimentalAutoDetectLongPolling: true,
    }, dbId);
  } catch (e) {
    return dbId ? getFirestore(app, dbId) : getFirestore(app);
  }
};

export const db: Firestore = getDbInstance();

export function saveCustomFirebaseConfig(newConfig: any) {
  try {
    localStorage.setItem('custom_firebase_config', JSON.stringify(newConfig));
    window.location.reload();
  } catch (e) {
    console.error('Error saving custom firebase config', e);
  }
}

export function resetToDefaultFirebaseConfig() {
  try {
    localStorage.removeItem('custom_firebase_config');
    window.location.reload();
  } catch (e) {
    console.error('Error resetting firebase config', e);
  }
}

export function getCurrentFirebaseProjectId() {
  return config.projectId || 'smartestateai-97a8c';
}

export default app;

