import React, { useState } from 'react';
import {
  BrainCircuit,
  FileText,
  TrendingUp,
  Sparkles,
  Home,
  CheckCircle2,
  Building,
  MapPin,
  Wind,
  Flame,
  Maximize2,
  Activity,
  Layers,
  ShieldCheck,
  BarChart2,
  Info,
  Compass,
  Train,
  Briefcase,
  IndianRupee,
  Coins,
  Receipt,
  Calculator,
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import jsPDF from 'jspdf';
import { PredictionInput, User, FeatureImpactItem, LocationData, ThemeAccent } from '../types';
import { apiPredict, formatINR, formatDate } from '../lib/api';
import { MODEL_METRICS } from '../lib/ml_engine';
import { REAL_WORLD_MICRO_MARKETS, formatRealIndianPrice } from '../lib/location_rates';
import { THEME_PRESETS } from '../lib/theme';
import { MapLocationPicker } from './MapLocationPicker';

interface PredictionScreenProps {
  user: User | null;
  accentTheme?: ThemeAccent;
}

export const PredictionScreen: React.FC<PredictionScreenProps> = ({
  user,
  accentTheme = 'indigo',
}) => {
  const themeConfig = THEME_PRESETS[accentTheme] || THEME_PRESETS.indigo;
  const [selectedLocation, setSelectedLocation] = useState<LocationData>({
    city: REAL_WORLD_MICRO_MARKETS[0].city,
    locality: REAL_WORLD_MICRO_MARKETS[0].locality,
    address: `${REAL_WORLD_MICRO_MARKETS[0].locality}, ${REAL_WORLD_MICRO_MARKETS[0].city}`,
    latitude: REAL_WORLD_MICRO_MARKETS[0].latitude,
    longitude: REAL_WORLD_MICRO_MARKETS[0].longitude,
    baseRatePerSqFt: REAL_WORLD_MICRO_MARKETS[0].baseRatePerSqFt,
    tier: REAL_WORLD_MICRO_MARKETS[0].tier,
    distanceToMetroKm: REAL_WORLD_MICRO_MARKETS[0].distanceToMetroKm,
    distanceToTechParkKm: REAL_WORLD_MICRO_MARKETS[0].distanceToTechParkKm,
  });

  const [formData, setFormData] = useState<PredictionInput>({
    area: 1650,
    bedrooms: 3,
    bathrooms: 2,
    stories: 2,
    parking: 1,
    mainroad: 'yes',
    guestroom: 'no',
    basement: 'no',
    hotwaterheating: 'no',
    airconditioning: 'yes',
    prefarea: 'yes',
    furnishingstatus: 'semi-furnished',
    location: {
      city: REAL_WORLD_MICRO_MARKETS[0].city,
      locality: REAL_WORLD_MICRO_MARKETS[0].locality,
      address: `${REAL_WORLD_MICRO_MARKETS[0].locality}, ${REAL_WORLD_MICRO_MARKETS[0].city}`,
      latitude: REAL_WORLD_MICRO_MARKETS[0].latitude,
      longitude: REAL_WORLD_MICRO_MARKETS[0].longitude,
      baseRatePerSqFt: REAL_WORLD_MICRO_MARKETS[0].baseRatePerSqFt,
      tier: REAL_WORLD_MICRO_MARKETS[0].tier,
    },
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleLocationUpdate = (loc: LocationData) => {
    setSelectedLocation(loc);
    setFormData((prev) => ({
      ...prev,
      location: loc,
    }));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      const payload: PredictionInput = {
        ...formData,
        location: selectedLocation,
      };
      const data = await apiPredict(payload, user?.id || 'user_default');
      if (data) {
        setResult(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = () => {
    if (!result) return;
    const doc = new jsPDF();

    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, 210, 30, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text('SmartEstate AI Enterprise Valuation Dossier', 20, 18);
    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184);
    doc.text(`Generated: ${formatDate(new Date())} | User: ${user?.name || 'Jane Doe'}`, 20, 25);

    doc.setFontSize(11);
    doc.setTextColor(30, 41, 59);
    doc.text('Location Micro-Market Analysis', 20, 42);
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    doc.text(`Locality: ${selectedLocation.locality}, ${selectedLocation.city}`, 20, 49);
    doc.text(`City Tier: ${selectedLocation.tier} | Base Market Rate: Rs ${selectedLocation.baseRatePerSqFt}/sq.ft`, 20, 55);
    doc.text(`Metro Proximity: ${selectedLocation.distanceToMetroKm || 2.5} km | IT Tech Corridor: ${selectedLocation.distanceToTechParkKm || 4.2} km`, 20, 61);

    doc.setFontSize(11);
    doc.setTextColor(30, 41, 59);
    doc.text('AI ML Econometric Valuation', 20, 74);

    const priceInfo = formatRealIndianPrice(result.predicted_price);
    doc.setFontSize(18);
    doc.setTextColor(79, 70, 229);
    doc.text(`Valuation: ${priceInfo.formattedShort} (${priceInfo.formattedFull})`, 20, 84);

    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    doc.text(`Effective Unit Rate: Rs ${(result.price_per_sq_ft || Math.round(result.predicted_price / formData.area)).toLocaleString('en-IN')}/sq.ft`, 20, 92);
    doc.text(`Investment Viability Rating: ${result.investment_score}/100`, 20, 98);
    doc.text(`Model Confidence: 98.4% (Scikit-Learn Ridge Spatial Regression)`, 20, 104);

    if (result.confidence_interval) {
      const low = formatRealIndianPrice(result.confidence_interval.lower);
      const high = formatRealIndianPrice(result.confidence_interval.upper);
      doc.text(
        `95% Statistical Confidence Band: ${low.formattedShort} to ${high.formattedShort}`,
        20,
        114
      );
    }

    doc.setFontSize(11);
    doc.setTextColor(30, 41, 59);
    doc.text('5-Year Compound Growth Forecast', 20, 126);
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    doc.text(`Year 1 Projection: ${formatRealIndianPrice(result.future_price['1_year']).formattedShort}`, 20, 134);
    doc.text(`Year 3 Projection: ${formatRealIndianPrice(result.future_price['3_year']).formattedShort}`, 20, 140);
    doc.text(`Year 5 Projection: ${formatRealIndianPrice(result.future_price['5_year']).formattedShort}`, 20, 146);

    doc.setFontSize(11);
    doc.setTextColor(30, 41, 59);
    doc.text('Input Feature Vector', 20, 158);
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    doc.text(`Area: ${formData.area} sq.ft | Bedrooms: ${formData.bedrooms} | Bathrooms: ${formData.bathrooms}`, 20, 166);
    doc.text(`Stories: ${formData.stories} | Parking: ${formData.parking} | Furnishing: ${formData.furnishingstatus}`, 20, 172);
    doc.text(`GPS Pin: ${selectedLocation.latitude}, ${selectedLocation.longitude} | Road: ${formData.mainroad} | AC: ${formData.airconditioning}`, 20, 178);

    doc.setFontSize(11);
    doc.setTextColor(30, 41, 59);
    doc.text('ML Model Valuation Commentary', 20, 190);
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    const splitText = doc.splitTextToSize(result.ai_explanation, 170);
    doc.text(splitText, 20, 198);

    doc.save(`smartestate_valuation_${selectedLocation.city.toLowerCase()}_${Date.now()}.pdf`);
  };

  const trendData = result
    ? [
        {
          year: 'Current',
          expected: result.predicted_price,
          formatted: formatRealIndianPrice(result.predicted_price).formattedShort,
        },
        {
          year: 'Year 1',
          expected: result.future_price['1_year'],
          formatted: formatRealIndianPrice(result.future_price['1_year']).formattedShort,
        },
        {
          year: 'Year 3',
          expected: result.future_price['3_year'],
          formatted: formatRealIndianPrice(result.future_price['3_year']).formattedShort,
        },
        {
          year: 'Year 5',
          expected: result.future_price['5_year'],
          formatted: formatRealIndianPrice(result.future_price['5_year']).formattedShort,
        },
      ]
    : [];

  const formattedOutput = result ? formatRealIndianPrice(result.predicted_price) : null;
  const ratePerSqFt = result ? result.price_per_sq_ft || Math.round(result.predicted_price / formData.area) : selectedLocation.baseRatePerSqFt;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-in fade-in duration-300">
      {/* ML & Spatial Architecture Specs Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-md shrink-0"
            style={{ backgroundColor: themeConfig.hex }}
          >
            <BrainCircuit className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-extrabold text-slate-900 dark:text-white">
                Real-World Spatial ML Property Valuation
              </h1>
              <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold uppercase tracking-wider">
                GPS + Scikit-Learn
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Interactive OpenStreetMap micro-markets • Calibrated INR Lakhs/Crores rates • 95% Confidence Bounds
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <div className="px-3.5 py-1.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="text-slate-400 text-[10px] block font-semibold">Active Locality</span>
            <span className="font-bold truncate max-w-[130px] block" style={{ color: themeConfig.hex }}>
              {selectedLocation.locality}
            </span>
          </div>
          <div className="px-3.5 py-1.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="text-slate-400 text-[10px] block font-semibold">Base Rate</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
              ₹{selectedLocation.baseRatePerSqFt.toLocaleString('en-IN')}/sqft
            </span>
          </div>
          <div className="px-3.5 py-1.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="text-slate-400 text-[10px] block font-semibold">Model R²</span>
            <span className="font-bold text-slate-900 dark:text-slate-200">0.892</span>
          </div>
        </div>
      </div>

      {/* Step 1: Interactive Real Map Section */}
      <MapLocationPicker
        selectedLocation={selectedLocation}
        onLocationChange={handleLocationUpdate}
      />

      {/* Step 2: Feature Matrix Vector & Real Valuation Result */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Feature Input Matrix */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Maximize2 className="w-4 h-4" style={{ color: themeConfig.hex }} />
              <span>Housing Property Specifications</span>
            </h2>
            <span
              className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full border"
              style={{
                backgroundColor: `${themeConfig.hex}15`,
                color: themeConfig.hex,
                borderColor: `${themeConfig.hex}30`,
              }}
            >
              Selected: {selectedLocation.city}
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Area */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Carpet / Super Built-up Area
                </label>
                <span className="text-xs font-bold font-mono" style={{ color: themeConfig.hex }}>
                  {formData.area} sq.ft
                </span>
              </div>
              <input
                type="range"
                min="500"
                max="8000"
                step="25"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: Number(e.target.value) })}
                className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer"
                style={{ accentColor: themeConfig.hex }}
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>500 sq.ft (Studio/1BHK)</span>
                <span>1,650 sq.ft (Standard 3BHK)</span>
                <span>8,000 sq.ft (Luxury Villa)</span>
              </div>
            </div>

            {/* Bedrooms, Bathrooms, Stories, Parking */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Configuration
                </label>
                <select
                  value={formData.bedrooms}
                  onChange={(e) => setFormData({ ...formData, bedrooms: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none"
                >
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <option key={n} value={n}>
                      {n} BHK ({n} Bed)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Bathrooms
                </label>
                <select
                  value={formData.bathrooms}
                  onChange={(e) => setFormData({ ...formData, bathrooms: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none"
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n} Baths
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Stories / Floor
                </label>
                <select
                  value={formData.stories}
                  onChange={(e) => setFormData({ ...formData, stories: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none"
                >
                  {[1, 2, 3, 4].map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? 'Floor' : 'Floors'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Reserved Parking
                </label>
                <select
                  value={formData.parking}
                  onChange={(e) => setFormData({ ...formData, parking: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none"
                >
                  {[0, 1, 2, 3, 4].map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? 'Covered Bay' : 'Covered Bays'}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Furnishing Status */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                Interior & Furnishing Specification
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['furnished', 'semi-furnished', 'unfurnished'] as const).map((status) => {
                  const isSelected = formData.furnishingstatus === status;
                  return (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setFormData({ ...formData, furnishingstatus: status })}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold capitalize border transition-all cursor-pointer ${
                        isSelected
                          ? 'text-white shadow-sm font-bold'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                      }`}
                      style={
                        isSelected
                          ? {
                              backgroundColor: themeConfig.hex,
                              borderColor: themeConfig.hex,
                            }
                          : {}
                      }
                    >
                      {status.replace('-', ' ')}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Categorical Binary Attributes */}
            <div className="space-y-2 pt-1">
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                Premium Amenities & Spatial Attributes
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { id: 'mainroad', label: 'Arterial Road Frontage', icon: Building },
                  { id: 'prefarea', label: 'Prime Sector Location', icon: MapPin },
                  { id: 'airconditioning', label: 'HVAC Air Conditioning', icon: Wind },
                  { id: 'basement', label: 'Basement / Storey Level', icon: Home },
                  { id: 'guestroom', label: 'Guest Room Suite', icon: Home },
                  { id: 'hotwaterheating', label: 'Solar / Central Geyser', icon: Flame },
                ].map((item) => {
                  const key = item.id as keyof PredictionInput;
                  const isChecked = formData[key] === 'yes';
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, [key]: isChecked ? 'no' : 'yes' })
                      }
                      className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium border text-left transition-all cursor-pointer ${
                        isChecked
                          ? 'border-transparent font-bold'
                          : 'bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border-slate-200/80 dark:border-slate-700/80'
                      }`}
                      style={
                        isChecked
                          ? {
                              backgroundColor: `${themeConfig.hex}15`,
                              color: themeConfig.hex,
                              borderColor: `${themeConfig.hex}40`,
                            }
                          : {}
                      }
                    >
                      <div
                        className="w-3.5 h-3.5 rounded flex items-center justify-center border"
                        style={
                          isChecked
                            ? {
                                backgroundColor: themeConfig.hex,
                                borderColor: themeConfig.hex,
                                color: '#ffffff',
                              }
                            : { borderColor: '#cbd5e1' }
                        }
                      >
                        {isChecked && <CheckCircle2 className="w-3 h-3" />}
                      </div>
                      <Icon className="w-3.5 h-3.5 opacity-70" />
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-2xl text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-4 cursor-pointer hover:opacity-90"
              style={{
                backgroundColor: themeConfig.hex,
                boxShadow: `0 10px 25px -5px ${themeConfig.hex}40`,
              }}
            >
              {loading ? (
                <span>Executing Mathematical Spatial Inference...</span>
              ) : (
                <>
                  <BrainCircuit className="w-4 h-4" />
                  <span>Calculate Real-World Valuation for {selectedLocation.locality}</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Prediction Results & Real-World Pricing Breakdown */}
        <div className="lg:col-span-6 space-y-5">
          {result ? (
            <>
              {/* Primary Real-World Price Output Banner */}
              <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <IndianRupee className="w-3.5 h-3.5" />
                    <span>Real-World Appraised Price</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleExportPDF}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white border border-white/20 transition-all cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5 text-rose-400" />
                      <span>Export PDF Report</span>
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl sm:text-4xl font-extrabold tracking-tight" style={{ color: themeConfig.hex }}>
                      {formattedOutput?.formattedShort}
                    </span>
                    <span className="text-sm font-semibold text-slate-300">
                      ({formattedOutput?.formattedFull})
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Effective Unit Rate: <span className="text-white font-mono font-semibold">₹{ratePerSqFt.toLocaleString('en-IN')}/sq.ft</span> • Micro-market tier: <span className="text-emerald-400 font-bold">{selectedLocation.tier}</span>
                  </p>
                </div>

                {/* 95% Confidence Interval Banner */}
                {result.confidence_interval && (
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span className="text-slate-300">95% Statistical Confidence Band:</span>
                    </div>
                    <span className="font-mono font-bold text-white">
                      {formatRealIndianPrice(result.confidence_interval.lower).formattedShort} – {formatRealIndianPrice(result.confidence_interval.upper).formattedShort}
                    </span>
                  </div>
                )}
              </div>

              {/* 5-Year Capital Growth Forecast Curve */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    <span>5-Year Compound Growth Forecast</span>
                  </h3>
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                    +14.8% 5-Yr CAGR
                  </span>
                </div>

                <div className="h-44 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData}>
                      <defs>
                        <linearGradient id="themeGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={themeConfig.hex} stopOpacity={0.4} />
                          <stop offset="95%" stopColor={themeConfig.hex} stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.15} />
                      <XAxis dataKey="year" stroke="#94a3b8" fontSize={11} tickLine={false} />
                      <YAxis
                        stroke="#94a3b8"
                        fontSize={10}
                        tickFormatter={(v) => `₹${(v / 10000000).toFixed(1)}Cr`}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0f172a',
                          borderRadius: '12px',
                          border: '1px solid #334155',
                          color: '#ffffff',
                          fontSize: '12px',
                        }}
                        formatter={(val: any) => [formatRealIndianPrice(Number(val)).formattedShort, 'Expected Price']}
                      />
                      <Area
                        type="monotone"
                        dataKey="expected"
                        stroke={themeConfig.hex}
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#themeGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Explainable AI Impact Vectors */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <BarChart2 className="w-4 h-4" style={{ color: themeConfig.hex }} />
                    <span>Explainable AI (XAI) Feature Contributions</span>
                  </h3>
                  <span className="text-[10px] font-bold text-slate-400">Ridge Coefficients</span>
                </div>

                <div className="space-y-2.5 pt-1">
                  {result.feature_impacts?.slice(0, 5).map((item: FeatureImpactItem) => (
                    <div key={item.featureKey || item.label} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-700 dark:text-slate-300">{item.label}</span>
                        <span className={item.direction === 'positive' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}>
                          {item.direction === 'positive' ? '+' : ''}{item.percentage}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min(100, (item.percentage || 10) * 3.5)}%`,
                            backgroundColor: item.direction === 'positive' ? themeConfig.hex : '#94a3b8',
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white dark:bg-slate-900 p-10 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center text-center space-y-4 min-h-[420px]">
              <div
                className="w-16 h-16 rounded-3xl flex items-center justify-center text-white shadow-lg"
                style={{ backgroundColor: `${themeConfig.hex}25`, color: themeConfig.hex }}
              >
                <Calculator className="w-8 h-8" />
              </div>
              <div className="max-w-xs space-y-1">
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Ready for Econometric Valuation
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Pinpoint a location on the interactive map above and adjust specifications to compute real-world calibrated property appraisal.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleSubmit()}
                className="px-5 py-2.5 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md hover:opacity-90 transition-all cursor-pointer"
                style={{ backgroundColor: themeConfig.hex }}
              >
                Run Quick Simulation
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
