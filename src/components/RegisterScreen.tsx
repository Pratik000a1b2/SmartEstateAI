import React, { useState } from 'react';
import {
  Lock,
  Mail,
  User as UserIcon,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { ScreenType, User } from '../types';
import {
  saveUserToDatabase,
  findRegisteredUserByEmailOrPhone,
  isValidGmailFormat,
} from '../lib/api';

interface RegisterScreenProps {
  onRegisterSuccess: (user: User) => void;
  setScreen: (screen: ScreenType) => void;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ onRegisterSuccess, setScreen }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  const cleanEmail = email.trim().toLowerCase();
  const emailFormatCheck = cleanEmail ? isValidGmailFormat(cleanEmail) : null;

  const handleAppendGmailDomain = () => {
    if (!cleanEmail) return;
    if (!cleanEmail.includes('@')) {
      setEmail(cleanEmail + '@gmail.com');
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

      // 2. Save user to local database / cache
      const dbUser = saveUserToDatabase({
        name: firebaseUser.displayName || userEmail.split('@')[0],
        email: userEmail,
        phone: firebaseUser.phoneNumber || undefined,
        photoURL: firebaseUser.photoURL || undefined,
        provider: 'google',
        role: isOwner ? 'admin' : 'user',
      });

      onRegisterSuccess(dbUser);
    } catch (err: any) {
      console.warn('Google Sign-In note:', err);
      if (err?.code === 'auth/popup-closed-by-user' || err?.code === 'auth/cancelled-popup-request') {
        setError('Google sign-in popup was closed before completion. Please try again.');
      } else if (err?.code === 'auth/popup-blocked') {
        setError('Google Sign-In popup was blocked by browser. Please allow popups and try again.');
      } else if (err?.code === 'auth/network-request-failed') {
        setError('Network error during Google sign-in. Please check your internet connection.');
      } else {
        setError(err?.message || 'Failed to register with Google account. Please try again.');
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleRegisterDirect = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 1. Name validation
    if (!name.trim()) {
      setError('Please enter your full name');
      return;
    }

    // 2. Strict Gmail Format Validation
    if (!cleanEmail) {
      setError('Please enter your original Gmail address');
      return;
    }

    const validation = isValidGmailFormat(cleanEmail);
    if (!validation.valid) {
      setError(validation.reason || 'Please enter a valid and original Gmail address (e.g. yourname@gmail.com)');
      return;
    }

    // Must be a valid @gmail.com or @googlemail.com address
    if (!cleanEmail.endsWith('@gmail.com') && !cleanEmail.endsWith('@googlemail.com')) {
      setError('Please enter a valid Gmail address ending with @gmail.com');
      return;
    }

    // 3. Password validation
    if (!password || password.length < 4) {
      setError('Password must be at least 4 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match! Please enter identical passwords.');
      return;
    }

    // 4. Check if user already exists
    const existingLocal = findRegisteredUserByEmailOrPhone(cleanEmail);
    if (existingLocal) {
      setError('An account already exists with this Gmail address! Please Sign In instead.');
      return;
    }

    setLoading(true);

    try {
      // Backend registration call
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: cleanEmail,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Registration failed. Please check your details.');
        setLoading(false);
        return;
      }

      const isOwner = cleanEmail === 'pratikpanzade000@gmail.com' || cleanEmail === 'aiml43465@gmail.com';

      const dbUser = saveUserToDatabase({
        name: name.trim(),
        email: cleanEmail,
        password,
        provider: 'password',
        role: isOwner ? 'admin' : 'user',
      });

      onRegisterSuccess({ ...dbUser, ...data.user, role: isOwner ? 'admin' : 'user' });
    } catch (err) {
      // Local fallback registration
      const isOwner = cleanEmail === 'pratikpanzade000@gmail.com' || cleanEmail === 'aiml43465@gmail.com';
      const dbUser = saveUserToDatabase({
        name: name.trim(),
        email: cleanEmail,
        password,
        provider: 'password',
        role: isOwner ? 'admin' : 'user',
      });
      onRegisterSuccess(dbUser);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-x-hidden">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-indigo-200 dark:shadow-none mb-4">
          S
        </div>
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Create SmartEstate Account
        </h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Instant registration with valid Gmail address or Google account
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-slate-900 py-8 px-4 shadow-xl shadow-slate-200/50 dark:shadow-none sm:rounded-3xl sm:px-10 border border-slate-100 dark:border-slate-800">
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-600 dark:text-rose-400 flex items-start gap-2 animate-in fade-in duration-200">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
              <span className="leading-relaxed">{error}</span>
            </div>
          )}

          <div className="space-y-4">
            {/* Google Sign-Up Button */}
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
              <span>{googleLoading ? 'Connecting to Google...' : 'Sign up with Google Account'}</span>
            </button>

            {/* Divider */}
            <div className="relative flex items-center justify-center my-3">
              <div className="border-t border-slate-200 dark:border-slate-800 w-full"></div>
              <span className="bg-white dark:bg-slate-900 px-3 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider shrink-0">
                Or Register with Gmail
              </span>
            </div>

            <form className="space-y-4" onSubmit={handleRegisterDirect}>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    placeholder="e.g. Alex Johnson"
                  />
                </div>
              </div>

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
                    required
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
                {cleanEmail.length >= 3 && !cleanEmail.includes('@') && (
                  <div className="mt-1.5 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleAppendGmailDomain}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 px-2.5 py-0.5 rounded-md transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Auto-complete as @gmail.com</span>
                    </button>
                  </div>
                )}

                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Registration requires a real and valid Gmail address (e.g. username@gmail.com).
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    placeholder="Minimum 4 characters"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Confirm Password
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    placeholder="Re-enter password"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || googleLoading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-md shadow-indigo-200 dark:shadow-none transition-all disabled:opacity-50 mt-4 cursor-pointer active:scale-[0.99]"
              >
                {loading ? (
                  <span>Creating Account...</span>
                ) : (
                  <>
                    <span>Register Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-500">Already registered?</span>
            <button
              onClick={() => setScreen('login')}
              className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
