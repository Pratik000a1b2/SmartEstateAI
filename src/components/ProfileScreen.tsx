import React, { useEffect, useState } from 'react';
import { User as UserIcon, Mail, ShieldCheck, Award, Building, Sparkles, Cpu, Database, Activity } from 'lucide-react';
import { User } from '../types';
import { MODEL_METRICS } from '../lib/ml_engine';

interface ProfileScreenProps {
  user: User | null;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ user }) => {
  const [predictionCount, setPredictionCount] = useState(0);

  useEffect(() => {
    fetch('/api/predictions')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setPredictionCount(data.length);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm text-center space-y-4 relative overflow-hidden">
        <div className="w-20 h-20 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto shadow-inner overflow-hidden border-2 border-indigo-200 dark:border-indigo-700">
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt={user?.name || 'User profile'}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          ) : (
            <UserIcon className="w-10 h-10" />
          )}
        </div>

        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
            {user?.name || 'Alex Johnson'}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-center gap-1.5 font-mono">
            <Mail className="w-3.5 h-3.5" />
            <span>{user?.email || 'alex@smartestate.ai'}</span>
          </p>
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
          {user?.provider === 'google' ? (
            <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-xs font-semibold border border-blue-200 dark:border-blue-800 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified Google Auth</span>
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-xs font-semibold border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Active Pro Engineer</span>
            </span>
          )}
          <span className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-xs font-semibold border border-indigo-200 dark:border-indigo-800 flex items-center gap-1">
            <Cpu className="w-3.5 h-3.5" />
            <span>Ridge Regression v2.4</span>
          </span>
        </div>
      </div>

      {/* Domain Engineering Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-center space-y-1 shadow-sm">
          <Activity className="w-5 h-5 text-indigo-600 mx-auto" />
          <div className="text-xl font-extrabold text-slate-900 dark:text-white">{MODEL_METRICS.r2Score}</div>
          <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Model R² Performance</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-center space-y-1 shadow-sm">
          <Award className="w-5 h-5 text-emerald-600 mx-auto" />
          <div className="text-xl font-extrabold text-slate-900 dark:text-white">{predictionCount}</div>
          <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Valuations Ingested</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-center space-y-1 shadow-sm">
          <Database className="w-5 h-5 text-purple-600 mx-auto" />
          <div className="text-xl font-extrabold text-slate-900 dark:text-white">Firestore Cloud</div>
          <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Persistent Cloud DB</div>
        </div>
      </div>

      {/* Engineer Info Card */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
          <Cpu className="w-5 h-5" />
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">
            AI & Machine Learning Engineering Specs
          </h3>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          Engineered by <strong>Pratik Panzade</strong> (Lead AI/ML Engineer). Built with Scikit-Learn L2 regularized regression models, NumPy vector standard scaling, 95% confidence bounds, and real-time client & server edge inference.
        </p>
      </div>
    </div>
  );
};
