import React from 'react';
import {
  Home,
  BrainCircuit,
  History,
  BarChart3,
  Calculator,
  User,
  Settings,
  LogOut,
  Moon,
  Sun,
  ShieldCheck,
} from 'lucide-react';
import { ScreenType, User as UserType } from '../types';

interface NavbarProps {
  currentScreen: ScreenType;
  setScreen: (screen: ScreenType) => void;
  user: UserType | null;
  onLogout: () => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentScreen,
  setScreen,
  user,
  onLogout,
  darkMode,
  setDarkMode,
}) => {
  if (currentScreen === 'splash' || currentScreen === 'login' || currentScreen === 'register') {
    return null;
  }

  const isOwnerOrAdmin =
    user?.role === 'admin' ||
    user?.email?.toLowerCase().trim() === 'pratikpanzade000@gmail.com' ||
    user?.email?.toLowerCase().trim() === 'aiml43465@gmail.com';

  const navItems = [
    { id: 'dashboard' as ScreenType, label: 'Dashboard', icon: Home },
    { id: 'prediction' as ScreenType, label: 'Predict Price', icon: BrainCircuit },
    { id: 'history' as ScreenType, label: 'History', icon: History },
    { id: 'analytics' as ScreenType, label: 'Analytics', icon: BarChart3 },
    { id: 'emi' as ScreenType, label: 'EMI Calc', icon: Calculator },
    ...(isOwnerOrAdmin
      ? [{ id: 'admin' as ScreenType, label: 'Admin Logs', icon: ShieldCheck }]
      : []),
    { id: 'profile' as ScreenType, label: 'Profile', icon: User },
    { id: 'settings' as ScreenType, label: 'Settings', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => setScreen('dashboard')}
            className="flex items-center gap-3 text-left group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-md shadow-indigo-600/30 transition-transform group-hover:scale-105">
              S
            </div>
            <div>
              <span className="font-extrabold text-slate-900 dark:text-white text-lg tracking-tight block leading-none">
                SmartEstate AI
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider block mt-1 text-indigo-600 dark:text-indigo-400">
                House Price AI Platform
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentScreen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setScreen(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shadow-xs font-bold border border-indigo-200/60 dark:border-indigo-800/60'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/70 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* User Controls */}
          <div className="flex items-center gap-2">
            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Toggle Dark Mode"
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
            </button>

            {user && (
              <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => setScreen('profile')}
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
                  title="View Profile"
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold overflow-hidden border border-indigo-500 bg-indigo-600 text-white shadow-xs">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      user.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 max-w-[120px] truncate">
                    {user.name}
                  </span>
                </button>
                <button
                  onClick={onLogout}
                  className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="md:hidden flex items-center justify-between py-2 border-t border-slate-100 dark:border-slate-800 overflow-x-auto gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setScreen(item.id)}
                className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};

