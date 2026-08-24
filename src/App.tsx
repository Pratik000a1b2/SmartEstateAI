import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from './lib/firebase';
import { ScreenType, User } from './types';
import { getDeletedUserIdentifiers } from './lib/api';
import { Navbar } from './components/Navbar';
import { SplashScreen } from './components/SplashScreen';
import { LoginScreen } from './components/LoginScreen';
import { RegisterScreen } from './components/RegisterScreen';
import { DashboardScreen } from './components/DashboardScreen';
import { PredictionScreen } from './components/PredictionScreen';
import { HistoryScreen } from './components/HistoryScreen';
import { AnalyticsScreen } from './components/AnalyticsScreen';
import { EmiCalculatorScreen } from './components/EmiCalculatorScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { AdminDatabaseScreen } from './components/AdminDatabaseScreen';

export default function App() {
  const [currentScreen, setScreen] = useState<ScreenType>('splash');
  const [user, setUser] = useState<User | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('smartestate_theme');
    return saved ? saved === 'dark' : true;
  });


  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('smartestate_user');
    setScreen('login');
  };

  // Continuous real-time session validation & auto-logout for deleted users across all devices
  useEffect(() => {
    const checkSessionValidity = async () => {
      const savedUserRaw = localStorage.getItem('smartestate_user');
      if (!savedUserRaw) {
        if (user) {
          handleLogout();
        }
        return;
      }

      try {
        const activeUser: User = JSON.parse(savedUserRaw);
        const userEmailLower = (activeUser.email || '').toLowerCase().trim();
        const userIdLower = (activeUser.id || '').toLowerCase().trim();

        // Admin accounts should NEVER be auto-logged out by deletion rules
        if (activeUser.role === 'admin' || userEmailLower === 'pratikpanzade000@gmail.com') {
          if (!user || user.id !== activeUser.id) {
            setUser(activeUser);
          }
          return;
        }

        // 1. Check local deleted set
        const deletedSet = getDeletedUserIdentifiers();
        const isDeletedLocally =
          deletedSet.has(activeUser.id) ||
          deletedSet.has(userIdLower) ||
          (userEmailLower && deletedSet.has(userEmailLower));

        if (isDeletedLocally) {
          handleLogout();
          return;
        }

        // 2. Check backend server DB status (for remote deletion by admin)
        try {
          const res = await fetch(`/api/auth/check-status?id=${encodeURIComponent(activeUser.id)}&email=${encodeURIComponent(activeUser.email || '')}`);
          if (res.ok) {
            const status = await res.json();
            if (status.deleted === true) {
              handleLogout();
              return;
            }
          }
        } catch (e) {}

        if (!user || user.id !== activeUser.id) {
          setUser(activeUser);
        }
      } catch (err) {
        console.error('Session parse error:', err);
      }
    };

    checkSessionValidity();

    // Listen for storage events (cross-tab) and custom delete events
    const handleStorageChange = (e: StorageEvent) => {
      if (
        e.key === 'smartestate_user' ||
        e.key === 'smartestate_deleted_users' ||
        e.key === 'smartestate_users_db' ||
        !e.key
      ) {
        checkSessionValidity();
      }
    };

    const handleCustomDeleteEvent = () => {
      checkSessionValidity();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('smartestate_user_deleted', handleCustomDeleteEvent);

    // Fast 1.5-second interval heartbeat to catch remote deletions instantly
    const intervalId = setInterval(checkSessionValidity, 1500);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('smartestate_user_deleted', handleCustomDeleteEvent);
      clearInterval(intervalId);
    };
  }, [user]);

  // Firestore real-time snapshot listener for instant cross-device account deletion auto-logout
  useEffect(() => {
    if (!user) return;

    const uId = (user.id || '').toLowerCase().trim();
    const uEmail = (user.email || '').toLowerCase().trim();

    // Admin accounts are exempt from auto-logout on deleted_users listener
    if (user.role === 'admin' || uEmail === 'pratikpanzade000@gmail.com') return;

    let unsub1: (() => void) | null = null;
    let unsub2: (() => void) | null = null;

    try {
      if (user.id) {
        unsub1 = onSnapshot(
          doc(db, 'deleted_users', user.id),
          (docSnap) => {
            if (docSnap.exists()) {
              handleLogout();
            }
          },
          (err) => {
            // Gracefully handle or log transient firestore error
            console.warn('Deleted user listener note (id):', err?.message || err);
          }
        );
      }
      if (uEmail) {
        unsub2 = onSnapshot(
          doc(db, 'deleted_users', uEmail),
          (docSnap) => {
            if (docSnap.exists()) {
              handleLogout();
            }
          },
          (err) => {
            // Gracefully handle or log transient firestore error
            console.warn('Deleted user listener note (email):', err?.message || err);
          }
        );
      }
    } catch (e) {
      console.warn('Snapshot setup note:', e);
    }

    return () => {
      if (unsub1) unsub1();
      if (unsub2) unsub2();
    };
  }, [user]);

  // Enforce auth: redirect unauthenticated users to login screen
  useEffect(() => {
    if (!user && currentScreen !== 'splash' && currentScreen !== 'login' && currentScreen !== 'register') {
      setScreen('login');
    }
  }, [user, currentScreen]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      localStorage.setItem('smartestate_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      localStorage.setItem('smartestate_theme', 'light');
    }
  }, [darkMode]);

  const handleSplashComplete = () => {
    if (user) {
      setScreen('dashboard');
    } else {
      setScreen('login');
    }
  };

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    localStorage.setItem('smartestate_user', JSON.stringify(loggedInUser));
    setScreen('dashboard');
  };

  const isAuthScreen = currentScreen === 'splash' || currentScreen === 'login' || currentScreen === 'register';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200 relative">
      {/* Floating Theme Switcher for Login/Register/Splash screens */}
      {isAuthScreen && (
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="fixed top-4 right-4 z-50 p-2.5 rounded-full bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-md backdrop-blur-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
        </button>
      )}

      <Navbar
        currentScreen={currentScreen}
        setScreen={setScreen}
        user={user}
        onLogout={handleLogout}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      <main>
        {currentScreen === 'splash' && <SplashScreen onComplete={handleSplashComplete} />}

        {currentScreen === 'login' && (
          <LoginScreen onLoginSuccess={handleLoginSuccess} setScreen={setScreen} />
        )}

        {currentScreen === 'register' && (
          <RegisterScreen onRegisterSuccess={handleLoginSuccess} setScreen={setScreen} />
        )}

        {currentScreen === 'dashboard' && (
          <DashboardScreen user={user} setScreen={setScreen} />
        )}

        {currentScreen === 'prediction' && (
          <PredictionScreen user={user} />
        )}

        {currentScreen === 'history' && (
          <HistoryScreen user={user} />
        )}

        {currentScreen === 'analytics' && (
          <AnalyticsScreen user={user} />
        )}

        {currentScreen === 'emi' && (
          <EmiCalculatorScreen />
        )}

        {currentScreen === 'admin' && <AdminDatabaseScreen user={user} />}

        {currentScreen === 'profile' && <ProfileScreen user={user} />}

        {currentScreen === 'settings' && (
          <SettingsScreen
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            onLogout={handleLogout}
          />
        )}
      </main>
    </div>
  );
}


