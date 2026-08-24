import React, { useEffect } from 'react';
import { Building2, Sparkles, ShieldCheck } from 'lucide-react';
import { ScreenType } from '../types';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      {/* Background Subtle Gradient Spheres */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center max-w-sm">
        <div className="w-24 h-24 rounded-3xl bg-blue-600 flex items-center justify-center text-white shadow-2xl shadow-blue-500/30 mb-8 animate-bounce">
          <Building2 className="w-12 h-12" />
        </div>

        <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">
          SmartEstate™ Enterprise
        </h1>
        <p className="text-slate-400 text-sm mb-8">
          Regression Modeling & Real Estate Portfolio Analytics Suite
        </p>

        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/80 border border-slate-700/80 text-xs text-slate-300 mb-12">
          <Sparkles className="w-4 h-4 text-indigo-400 animate-spin" />
          <span>Loading Engine & Synchronizing Database...</span>
        </div>

        <div className="w-48 h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full animate-pulse" />
        </div>

        <div className="mt-12 flex items-center gap-1.5 text-xs text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Created by Pratik Panzade • v2.4.0</span>
        </div>
      </div>
    </div>
  );
};
