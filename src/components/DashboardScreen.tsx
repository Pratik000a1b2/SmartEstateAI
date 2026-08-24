import React, { useEffect, useState } from 'react';
import {
  BrainCircuit,
  History,
  BarChart3,
  Calculator,
  User as UserIcon,
  Settings,
  TrendingUp,
  Building,
  DollarSign,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Activity,
  Layers,
  Award,
} from 'lucide-react';
import { ScreenType, User, PredictionRecord, ThemeAccent } from '../types';
import { apiGetPredictions, formatINR } from '../lib/api';
import { formatRealIndianPrice } from '../lib/location_rates';
import { THEME_PRESETS } from '../lib/theme';

interface DashboardScreenProps {
  user: User | null;
  setScreen: (screen: ScreenType) => void;
  accentTheme?: ThemeAccent;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  user,
  setScreen,
  accentTheme = 'indigo',
}) => {
  const [predictions, setPredictions] = useState<PredictionRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const themeConfig = THEME_PRESETS[accentTheme] || THEME_PRESETS.indigo;

  useEffect(() => {
    fetchPredictions();
  }, []);

  const fetchPredictions = async () => {
    try {
      const data = await apiGetPredictions(user?.id || 'user_default');
      setPredictions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const prices = predictions.map((p) => p.predictedPrice);
  const totalCount = predictions.length;
  const avgPrice = totalCount > 0 ? Math.round(prices.reduce((a, b) => a + b, 0) / totalCount) : 11500000;
  const highestPrice = totalCount > 0 ? Math.max(...prices) : 24500000;

  // Calculate average score
  const avgScore = totalCount > 0
    ? Math.round(predictions.reduce((a, b) => a + b.investmentScore, 0) / totalCount)
    : 85;

  const quickTools = [
    {
      id: 'prediction' as ScreenType,
      title: 'Predict Price',
      desc: 'ML Spatial Regression Engine with 12 Input Features',
      icon: BrainCircuit,
      color: 'text-white',
      badge: 'Scikit-Learn ML',
      useThemeBg: true,
    },
    {
      id: 'history' as ScreenType,
      title: 'Valuation History',
      desc: 'View, Search & Export Saved Records',
      icon: History,
      color: 'bg-purple-600 text-white',
      badge: `${totalCount} Saved`,
      useThemeBg: false,
    },
    {
      id: 'analytics' as ScreenType,
      title: 'Market Analytics',
      desc: 'Distribution & Valuation Trends',
      icon: BarChart3,
      color: 'bg-amber-500 text-white',
      badge: 'Visual Charts',
      useThemeBg: false,
    },
    {
      id: 'emi' as ScreenType,
      title: 'EMI Calculator',
      desc: 'Mortgage Estimator & Breakdown',
      icon: Calculator,
      color: 'bg-emerald-600 text-white',
      badge: 'Finance',
      useThemeBg: false,
    },
    {
      id: 'profile' as ScreenType,
      title: 'User Profile',
      desc: 'Account Details & Performance',
      icon: UserIcon,
      color: 'bg-blue-600 text-white',
      badge: 'Account',
      useThemeBg: false,
    },
    {
      id: 'settings' as ScreenType,
      title: 'Settings',
      desc: 'Appearance, Theme & Preferences',
      icon: Settings,
      color: 'bg-slate-700 text-white',
      badge: 'Prefs',
      useThemeBg: false,
    },
  ];

  // Est monthly EMI calculation
  const monthlyRate = 0.075 / 12;
  const estEmi = Math.round((avgPrice * monthlyRate * Math.pow(1 + monthlyRate, 240)) / (Math.pow(1 + monthlyRate, 240) - 1));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Header with Luxury Visuals */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
              style={{
                backgroundColor: `${themeConfig.hex}15`,
                color: themeConfig.hex,
                border: `1px solid ${themeConfig.hex}30`,
              }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>SmartEstate Intelligence Suite</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Portfolio & Valuation Dashboard
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Welcome back, <span className="font-semibold text-slate-800 dark:text-slate-200">{user?.name || 'Jane Doe'}</span>. Real-time valuation and econometric overview.
          </p>
        </div>

        <button
          onClick={() => setScreen('prediction')}
          className="px-5 py-2.5 text-white rounded-2xl font-bold text-sm shadow-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 self-start sm:self-auto cursor-pointer"
          style={{
            backgroundColor: themeConfig.hex,
            boxShadow: `0 10px 25px -5px ${themeConfig.hex}40`,
          }}
        >
          <BrainCircuit className="w-4 h-4" />
          <span>New AI Valuation</span>
        </button>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-12 gap-6">
        {/* Bento Box 1: Welcome & Summary Card */}
        <div className="col-span-12 lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-sm flex flex-col justify-between relative overflow-hidden group">
          <div
            className="absolute -right-10 -top-10 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none transition-colors"
            style={{ backgroundColor: themeConfig.hex }}
          />

          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 rounded-full text-xs font-bold uppercase tracking-wider border border-emerald-200 dark:border-emerald-800/50">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Active Market Spatial Inference</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
              Average predicted benchmark is{' '}
              <span style={{ color: themeConfig.hex }}>
                {formatRealIndianPrice(avgPrice).formattedShort}
              </span>{' '}
              ({formatRealIndianPrice(avgPrice).formattedFull}) across tracked prime micro-markets.
            </h2>
          </div>

          <div className="relative z-10 grid grid-cols-3 gap-4 pt-6 mt-6 border-t border-slate-100 dark:border-slate-800/80">
            <div>
              <p className="text-slate-400 dark:text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                Total Saved
              </p>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                {totalCount}
              </p>
            </div>
            <div>
              <p className="text-slate-400 dark:text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                Model R² Score
              </p>
              <p className="text-2xl font-extrabold mt-0.5" style={{ color: themeConfig.hex }}>
                0.892
              </p>
            </div>
            <div>
              <p className="text-slate-400 dark:text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                5-Yr Appreciation
              </p>
              <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">
                +14.8%
              </p>
            </div>
          </div>
        </div>

        {/* Bento Box 2: Investment Score Card */}
        <div
          className="col-span-12 lg:col-span-4 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col justify-between relative overflow-hidden min-h-[300px]"
          style={{
            background: `linear-gradient(135deg, ${themeConfig.hex}ee 0%, #0f172a 100%)`,
          }}
        >
          <div className="absolute -bottom-8 -right-8 p-4 opacity-10 pointer-events-none">
            <Building className="w-48 h-48 text-white" />
          </div>

          <div>
            <p className="text-white/80 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Investment Viability Score
            </p>
          </div>

          <div className="flex flex-col items-center justify-center my-4">
            <div className="relative flex items-center justify-center">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="52"
                  stroke="rgba(255, 255, 255, 0.15)"
                  strokeWidth="10"
                  fill="none"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="52"
                  stroke="#ffffff"
                  strokeWidth="10"
                  fill="none"
                  strokeDasharray="326"
                  strokeDashoffset={326 - (326 * avgScore) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute text-4xl font-extrabold tracking-tight">
                {avgScore}
              </span>
            </div>
            <p className="mt-4 text-center text-white/90 text-xs font-medium px-2 leading-relaxed">
              Strong positive outlook for long-term equity growth & rental capitalization.
            </p>
          </div>

          <button
            onClick={() => setScreen('prediction')}
            className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Run Valuation</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Bento Box 3: Price Trend Mini Bar Chart */}
        <div className="col-span-12 md:col-span-6 lg:col-span-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Demand Momentum
            </p>
            <span className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-bold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              +5.2% Q-o-Q
            </span>
          </div>

          <div className="flex items-end justify-between h-28 gap-2 px-1 pt-2">
            <div className="w-full rounded-t-lg transition-all" style={{ height: '40%', backgroundColor: `${themeConfig.hex}30` }} />
            <div className="w-full rounded-t-lg transition-all" style={{ height: '65%', backgroundColor: `${themeConfig.hex}40` }} />
            <div className="w-full rounded-t-lg transition-all" style={{ height: '50%', backgroundColor: `${themeConfig.hex}30` }} />
            <div className="w-full rounded-t-lg transition-all" style={{ height: '85%', backgroundColor: `${themeConfig.hex}60` }} />
            <div className="w-full rounded-t-lg shadow-md transition-all" style={{ height: '100%', backgroundColor: themeConfig.hex }} />
            <div className="w-full rounded-t-lg transition-all" style={{ height: '70%', backgroundColor: `${themeConfig.hex}50` }} />
          </div>

          <div className="flex justify-between mt-4 text-[10px] font-bold text-slate-400 uppercase">
            <span>Jan</span>
            <span>Feb</span>
            <span>Mar</span>
            <span>Apr</span>
            <span>May</span>
            <span>Jun</span>
          </div>
        </div>

        {/* Bento Box 4: Recent Predictions List */}
        <div className="col-span-12 md:col-span-6 lg:col-span-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Recent Valuations
              </p>
              <span className="text-xs font-semibold" style={{ color: themeConfig.hex }}>{totalCount} saved</span>
            </div>

            <div className="space-y-3">
              {predictions.length > 0 ? (
                predictions.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        {item.bedrooms} Bed, {item.bathrooms} Bath • {item.area} sq.ft
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5 capitalize">
                        {item.location?.locality || item.furnishingstatus}
                      </p>
                    </div>
                    <p className="text-xs font-extrabold" style={{ color: themeConfig.hex }}>
                      {formatRealIndianPrice(item.predictedPrice).formattedShort}
                    </p>
                  </div>
                ))
              ) : (
                <>
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40">
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">3BHK Luxury Residence</p>
                      <p className="text-[10px] text-slate-400">Kharadi, Pune • 1,650 sq.ft</p>
                    </div>
                    <p className="text-xs font-extrabold" style={{ color: themeConfig.hex }}>₹1.46 Cr</p>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40">
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">2BHK Modern Apt</p>
                      <p className="text-[10px] text-slate-400">Whitefield, Bengaluru • 1,200 sq.ft</p>
                    </div>
                    <p className="text-xs font-extrabold" style={{ color: themeConfig.hex }}>₹1.08 Cr</p>
                  </div>
                </>
              )}
            </div>
          </div>

          <button
            onClick={() => setScreen('history')}
            className="mt-4 text-xs font-bold hover:underline flex items-center justify-center gap-1 py-1 cursor-pointer"
            style={{ color: themeConfig.hex }}
          >
            <span>View All Valuations</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Bento Box 5: Estimated EMI Calculator Card */}
        <div className="col-span-12 lg:col-span-4 bg-slate-900 dark:bg-slate-800/90 rounded-3xl p-6 text-white flex items-center justify-between shadow-lg border border-slate-800">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Estimated Monthly EMI
            </p>
            <p className="text-2xl font-extrabold text-white mt-1">
              {formatINR(estEmi)}
              <span className="text-xs text-slate-400 font-normal"> / mo</span>
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">Based on 20 yr @ 7.5% fixed interest</p>
          </div>

          <button
            onClick={() => setScreen('emi')}
            className="h-12 w-12 rounded-2xl flex items-center justify-center transition-all shadow-md shrink-0 text-white cursor-pointer hover:opacity-90"
            style={{ backgroundColor: themeConfig.hex }}
            title="Open EMI Calculator"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Quick Access Platform Tools */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Platform Tools & Analytics Modules
          </h2>
          <span
            className="text-xs font-bold px-3 py-1 rounded-full border"
            style={{
              backgroundColor: `${themeConfig.hex}15`,
              color: themeConfig.hex,
              borderColor: `${themeConfig.hex}30`,
            }}
          >
            SmartEstate Enterprise
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.id}
                onClick={() => setScreen(tool.id)}
                className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all text-left group relative overflow-hidden cursor-pointer"
                style={{
                  '--hover-border': themeConfig.hex,
                } as any}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`p-3 rounded-2xl ${tool.color} shadow-md`}
                    style={tool.useThemeBg ? { backgroundColor: themeConfig.hex } : {}}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    {tool.badge}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base group-hover:opacity-90 transition-colors flex items-center justify-between">
                  <span>{tool.title}</span>
                  <ArrowRight
                    className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: themeConfig.hex }}
                  />
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {tool.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
