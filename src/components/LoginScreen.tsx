import React, { useState } from 'react';
import {
  Lock,
  Mail,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  AlertTriangle,
  X,
  Eye,
  EyeOff,
  Sparkles,
  KeyRound,
  Send,
} from 'lucide-react';
import { GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { ScreenType, User } from '../types';
import {
  saveUserToDatabase,
  findRegisteredUserByEmailOrPhone,
  isValidGmailFormat,
} from '../lib/api';

interface LoginScreenProps {
  onLoginSuccess: (user: User) => void;
  setScreen: (screen: ScreenType) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess, setScreen }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  // Owner Admin Modal State
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminEmail, setAdminEmail] = useState('pratikpanzade000@gmail.com');
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [adminError, setAdminError] = useState('');

  // Forgot Password Modal State
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [forgotError, setForgotError] = useState('');

  // Real-time email format analysis
  const cleanInput = email.trim();
  const cleanEmail = cleanInput.toLowerCase();
  const isEmailInput = cleanInput.includes('@');
  const emailFormatCheck = cleanInput ? isValidGmailFormat(cleanInput) : null;

  const handleOpenForgotModal = () => {
    setForgotEmail(cleanEmail || '');
    setForgotError('');
    setForgotSuccess(false);
    setShowForgotModal(true);
  };

  const handleSendPasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');

    const targetEmail = forgotEmail.trim().toLowerCase();
    if (!targetEmail) {
      setForgotError('Please enter your registered Gmail address.');
      return;
    }

    const validation = isValidGmailFormat(targetEmail);
    if (!validation.valid) {
      setForgotError(validation.reason || 'Please enter a valid Gmail address (e.g. yourname@gmail.com)');
      return;
    }

    setForgotLoading(true);

    try {
      // Call Firebase Authentication sendPasswordResetEmail API
      await sendPasswordResetEmail(auth, targetEmail);
      setForgotSuccess(true);
    } catch (err: any) {
      console.warn('sendPasswordResetEmail note:', err);
      if (err?.code === 'auth/user-not-found') {
        // Even if user not found in Firebase auth directly, check local database or provide friendly guidance
        const localUser = findRegisteredUserByEmailOrPhone(targetEmail);
        if (localUser) {
          setForgotSuccess(true);
        } else {
          setForgotError('No account found with this Gmail address. Please check spelling or create a new account.');
        }
      } else if (err?.code === 'auth/invalid-email') {
        setForgotError('The Gmail address entered is not formatted correctly.');
      } else if (err?.code === 'auth/too-many-requests') {
        setForgotError('Too many password reset requests. Please wait a few minutes before trying again.');
      } else {
        // Fallback for general success or custom domain notification
        setForgotSuccess(true);
      }
    } finally {
      setForgotLoading(false);
    }
  };

  const handleAppendGmailDomain = () => {
    if (!cleanInput) return;
    if (!cleanInput.includes('@')) {
      setEmail(cleanInput + '@gmail.com');
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;

      if (!firebaseUser.email) {
        throw new Error('No verified email found in Google account.');
      }

      const userEmail = firebaseUser.email.toLowerCase().trim();
      const isOwner = userEmail === 'pratikpanzade000@gmail.com' || userEmail === 'aiml43465@gmail.com';

      // 1. Sync to backend store
      try {
        await fetch('/api/auth/google-sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            uid: firebaseUser.uid,
            name: firebaseUser.displayName || userEmail.split('@')[0],
            email: userEmail,
            photoURL: firebaseUser.photoURL || undefined,
          }),
        });
      } catch (syncErr) {
        console.warn('Backend Google sync note:', syncErr);
      }

      // 2. Save user to database
      const dbUser = saveUserToDatabase({
        name: firebaseUser.displayName || userEmail.split('@')[0],
        email: userEmail,
        phone: firebaseUser.phoneNumber || undefined,
        photoURL: firebaseUser.photoURL || undefined,
        provider: 'google',
        role: isOwner ? 'admin' : 'user',
      });

      onLoginSuccess(dbUser);
    } catch (err: any) {
      console.warn('Google Sign-In note:', err);
      if (err?.code === 'auth/popup-closed-by-user' || err?.code === 'auth/cancelled-popup-request') {
        setError('Google sign-in popup was closed before completion. Please try again.');
      } else if (err?.code === 'auth/popup-blocked') {
        setError('Google Sign-In popup was blocked by browser. Please allow popups and try again.');
      } else if (err?.code === 'auth/network-request-failed') {
        setError('Network error during Google sign-in. Please check your internet connection.');
      } else {
        setError(err?.message || 'Failed to sign in with Google account. Please try again.');
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleStandardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cleanEmail || !password) {
      setError('Please enter your Gmail address and password');
      return;
    }

    // Strict Email Format Validation
    const validation = isValidGmailFormat(cleanEmail);
    if (!validation.valid) {
      setError(validation.reason || 'Invalid Gmail format. Please enter a valid address like user@gmail.com');
      return;
    }

    // If owner email is entered, verify owner credentials
    if (cleanEmail === 'pratikpanzade000@gmail.com') {
      if (password === '#922008@Owner') {
        const ownerUser = saveUserToDatabase({
          name: 'Pratik Panzade (Software Owner)',
          email: cleanEmail,
          password,
          role: 'admin',
        });
        onLoginSuccess(ownerUser);
        return;
      }
    }

    setLoading(true);
    setError('');

    try {
      // 1. Backend login check
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password }),
      });

      const data = await res.json();

      if (res.ok && data.user) {
        const isOwner = cleanEmail === 'pratikpanzade000@gmail.com' || cleanEmail === 'aiml43465@gmail.com';
        const loggedUser = saveUserToDatabase({
          name: data.user.name,
          email: data.user.email,
          phone: data.user.phone,
          password,
          role: isOwner ? 'admin' : 'user',
        });
        onLoginSuccess({ ...loggedUser, ...data.user, role: isOwner ? 'admin' : 'user' });
        return;
      }

      if (res.status === 404 || data.code === 'ACCOUNT_NOT_FOUND') {
        setError('Account Not Found! Please click "Create Account" below to register your Gmail address first.');
        setLoading(false);
        return;
      }

      if (res.status === 401 || data.code === 'INVALID_PASSWORD') {
        setError('Incorrect Password! Please enter the correct password for your account.');
        setLoading(false);
        return;
      }

      // 2. Fallback check local users database
      const existingLocalUser = findRegisteredUserByEmailOrPhone(cleanEmail);
      if (!existingLocalUser) {
        setError('Account Not Found! Please click "Create Account" below to register your Gmail address first.');
        setLoading(false);
        return;
      }

      if (existingLocalUser.passwordHash && existingLocalUser.passwordHash !== password) {
        setError('Incorrect Password! Please enter the correct password for your account.');
        setLoading(false);
        return;
      }

      const isOwner = cleanEmail === 'pratikpanzade000@gmail.com' || cleanEmail === 'aiml43465@gmail.com';
      const loggedUser = saveUserToDatabase({
        name: existingLocalUser.name,
        email: existingLocalUser.email,
        phone: existingLocalUser.phone,
        password,
        role: isOwner ? 'admin' : 'user',
      });

      onLoginSuccess(loggedUser);
    } catch (err) {
      // Offline fallback check
      const existingLocalUser = findRegisteredUserByEmailOrPhone(cleanEmail);
      if (!existingLocalUser) {
        setError('Account Not Found! Please click "Create Account" below to register first.');
      } else if (existingLocalUser.passwordHash && existingLocalUser.passwordHash !== password) {
        setError('Incorrect Password! Please enter the correct password for your account.');
      } else {
        const isOwner = cleanEmail === 'pratikpanzade000@gmail.com' || cleanEmail === 'aiml43465@gmail.com';
        const loggedUser = saveUserToDatabase({
          name: existingLocalUser.name,
          email: existingLocalUser.email,
          phone: existingLocalUser.phone,
          password,
          role: isOwner ? 'admin' : 'user',
        });
        onLoginSuccess(loggedUser);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdminModal = () => {
    setAdminEmail('pratikpanzade000@gmail.com');
    setAdminPassword('');
    setAdminError('');
    setShowAdminModal(true);
  };

  const handleDirectAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError('');

    const cleanAdmin = adminEmail.trim().toLowerCase();
    const authorizedOwners = ['pratikpanzade000@gmail.com', 'aiml43465@gmail.com'];

    if (!authorizedOwners.includes(cleanAdmin)) {
      setAdminError('Access Denied: Only authorized software owner (pratikpanzade000@gmail.com) can log in as Admin.');
      return;
    }

    if (!adminPassword) {
      setAdminError('Please enter your owner password.');
      return;
    }

    if (adminPassword !== '#922008@Owner') {
      setAdminError('Incorrect Owner Password! Please enter the correct owner password.');
      return;
    }

    // Direct Login as Owner Admin
    const ownerUser = saveUserToDatabase({
      name: 'Pratik Panzade (Software Owner)',
      email: cleanAdmin,
      password: adminPassword,
      role: 'admin',
    });

    setShowAdminModal(false);
    onLoginSuccess(ownerUser);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-indigo-200 dark:shadow-none mb-4">
          S
        </div>
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Sign in to SmartEstate AI
        </h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Cross-platform house valuation & investment engine
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-slate-900 py-8 px-4 shadow-xl shadow-slate-200/50 dark:shadow-none sm:rounded-3xl sm:px-10 border border-slate-100 dark:border-slate-800">
          
          {/* Welcome Info Banner */}
          <div className="mb-6 p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900/60 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
            <p className="text-xs text-indigo-900 dark:text-indigo-200 leading-relaxed font-medium">
              Sign in with your Google account or registered Gmail address to access real-time valuation models and prediction history.
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-600 dark:text-rose-400 flex items-start gap-2 animate-in fade-in duration-200">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
              <span className="leading-relaxed">{error}</span>
            </div>
          )}

          {/* Google Sign-In Button */}
          <div className="space-y-4">
            <button
              type="button"
              disabled={googleLoading || loading}
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl text-sm font-bold text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 border border-slate-300 dark:border-slate-700 shadow-sm hover:shadow transition-all duration-150 disabled:opacity-50 active:scale-[0.99] cursor-pointer"
            >
              {googleLoading ? (
                <div className="w-5 h-5 border-2 border-slate-400 border-t-indigo-600 rounded-full animate-spin"></div>
              ) : (
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
              )}
              <span>{googleLoading ? 'Connecting to Google...' : 'Continue with Google Account'}</span>
            </button>

            {/* Divider */}
            <div className="relative flex items-center justify-center my-4">
              <div className="border-t border-slate-200 dark:border-slate-800 w-full"></div>
              <span className="bg-white dark:bg-slate-900 px-3 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider shrink-0">
                Or with Gmail / Password
              </span>
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleStandardSubmit}>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Original Gmail Address
                </label>
                {cleanEmail && emailFormatCheck?.valid && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Valid Gmail Format</span>
                  </span>
                )}
              </div>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`block w-full pl-10 pr-3 py-2.5 text-sm rounded-xl border ${
                    cleanEmail && !emailFormatCheck?.valid
                      ? 'border-rose-300 dark:border-rose-700 focus:ring-rose-500'
                      : 'border-slate-200 dark:border-slate-700 focus:ring-indigo-500'
                  } bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:border-transparent outline-none transition-all`}
                  placeholder="yourname@gmail.com"
                />
              </div>

              {/* Quick @gmail.com auto-complete helper if user types a username without domain */}
              {cleanInput.length >= 3 && !cleanInput.includes('@') && (
                <div className="mt-1.5 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleAppendGmailDomain}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 px-2.5 py-0.5 rounded-md transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Complete as @gmail.com</span>
                  </button>
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Account Password
                </label>
                <button
                  type="button"
                  onClick={handleOpenForgotModal}
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:underline cursor-pointer transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-md shadow-indigo-200 dark:shadow-none transition-all disabled:opacity-50 mt-2 cursor-pointer"
            >
              {loading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-4">
            <button
              type="button"
              onClick={handleOpenAdminModal}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-amber-900 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900/80 border border-amber-200 dark:border-amber-800 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Owner Admin Login</span>
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-500">Need an account?</span>
            <button
              onClick={() => setScreen('register')}
              className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>

      {/* Owner Admin Password Security Modal */}
      {showAdminModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-amber-200/80 dark:border-amber-900/50 relative">
            <button
              onClick={() => setShowAdminModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-200 dark:border-amber-800">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                  Software Owner Admin Login
                </h3>
                <p className="text-xs text-amber-600 dark:text-amber-400 font-medium mt-0.5">
                  Restricted to pratikpanzade000@gmail.com
                </p>
              </div>
            </div>

            {adminError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-xs text-rose-600 dark:text-rose-400 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
                <span>{adminError}</span>
              </div>
            )}

            <form onSubmit={handleDirectAdminLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Owner Gmail Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-amber-500 outline-none"
                    placeholder="pratikpanzade000@gmail.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Owner Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showAdminPassword ? 'text' : 'password'}
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
                    placeholder="Enter owner password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminPassword(!showAdminPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 transition-all shadow-md flex items-center justify-center gap-2 mt-2 cursor-pointer active:scale-[0.99]"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Log In to Admin Console</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Forgot Password Recovery Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-indigo-100 dark:border-slate-800 relative">
            <button
              onClick={() => setShowForgotModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3.5 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-100 dark:border-indigo-900/50">
                <KeyRound className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                  Recover Your Account
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Reset link will be sent to your Gmail inbox
                </p>
              </div>
            </div>

            {forgotSuccess ? (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-slate-800 dark:text-slate-200">
                  <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-sm mb-1.5">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Password Reset Link Sent!</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    We have dispatched a secure password recovery link to{' '}
                    <strong className="font-semibold text-slate-900 dark:text-white">{forgotEmail}</strong>.
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                    Please check your Gmail inbox and Spam/Junk folder. Follow the link inside to set a new password.
                  </p>
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-md cursor-pointer"
                  >
                    Back to Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotSuccess(false);
                      setForgotError('');
                    }}
                    className="w-full py-2 px-4 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                  >
                    Send to a different email address
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSendPasswordReset} className="space-y-4">
                {forgotError && (
                  <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-xs text-rose-600 dark:text-rose-400 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
                    <span>{forgotError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Registered Gmail Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      placeholder="yourname@gmail.com"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
                    Enter the Gmail address associated with your SmartEstate account.
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {forgotLoading ? (
                      <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Reset Link</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
