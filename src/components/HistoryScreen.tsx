import React, { useEffect, useState } from 'react';
import { History, Search, Trash2, FileText, Calendar, Building2, MapPin, IndianRupee } from 'lucide-react';
import jsPDF from 'jspdf';
import { PredictionRecord, User, ThemeAccent } from '../types';
import { apiGetPredictions, apiDeletePrediction, apiDeleteAllPredictions, formatINR, formatDate } from '../lib/api';
import { formatRealIndianPrice } from '../lib/location_rates';
import { THEME_PRESETS } from '../lib/theme';

interface HistoryScreenProps {
  user: User | null;
  accentTheme?: ThemeAccent;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({ user, accentTheme = 'indigo' }) => {
  const themeConfig = THEME_PRESETS[accentTheme] || THEME_PRESETS.indigo;
  const [predictions, setPredictions] = useState<PredictionRecord[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const data = await apiGetPredictions(user?.id || 'user_default');
      setPredictions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOne = async (id: string) => {
    try {
      setPredictions((prev) => prev.filter((p) => p.id !== id));
      await apiDeletePrediction(id);
    } catch (err) {
      console.error(err);
    }
  };

  const handleConfirmClearAll = async () => {
    setShowClearConfirm(false);
    try {
      setPredictions([]);
      await apiDeleteAllPredictions();
    } catch (err) {
      console.error(err);
    }
  };

  const exportHistoryPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setTextColor(30, 41, 59);
    doc.text('SmartEstate AI - Real-World Prediction History Report', 20, 20);

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Total Appraisals: ${predictions.length} | Exported: ${formatDate(new Date())}`, 20, 28);

    let y = 40;
    predictions.forEach((item, index) => {
      if (y > 260) {
        doc.addPage();
        y = 20;
      }
      const formatted = formatRealIndianPrice(item.predictedPrice);
      const loc = item.location?.locality || item.location?.city || 'Prime Belt';
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42);
      doc.text(
        `${index + 1}. ${loc} - ${formatted.formattedShort} (${formatted.formattedFull})`,
        20,
        y
      );
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text(`Specs: ${item.area} sq.ft (${item.bedrooms}BHK) | Rating: ${item.investmentAdvice} | Date: ${formatDate(item.createdAt)}`, 25, y + 6);
      y += 16;
    });

    doc.save('smartestate_history_summary.pdf');
  };

  const filtered = predictions.filter((p) => {
    const term = search.toLowerCase();
    const loc = (p.location?.locality || p.location?.city || '').toLowerCase();
    return (
      p.predictedPrice.toString().includes(term) ||
      p.area.toString().includes(term) ||
      loc.includes(term) ||
      p.investmentAdvice.toLowerCase().includes(term)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-md"
            style={{ backgroundColor: themeConfig.hex }}
          >
            <History className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Valuation History & Saved Appraisals
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Search, manage, and download verified real-world property valuations.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {predictions.length > 0 && (
            <>
              <button
                onClick={exportHistoryPDF}
                className="px-4 py-2.5 rounded-xl text-white font-semibold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer hover:opacity-90"
                style={{ backgroundColor: themeConfig.hex }}
              >
                <FileText className="w-4 h-4" />
                <span>Export History PDF</span>
              </button>
              <button
                onClick={() => setShowClearConfirm(true)}
                className="px-4 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 font-semibold text-xs hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear All</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by locality, city, price, or area..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm outline-none transition-all"
        />
      </div>

      {/* Predictions List */}
      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200/80 dark:border-slate-800 space-y-3">
          <Building2 className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
          <h3 className="font-bold text-slate-700 dark:text-slate-300 text-base">
            No Saved Appraisals Found
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {search ? 'No history records match your search criteria.' : 'Start a new prediction on the interactive map to record valuations.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => {
            const formatted = formatRealIndianPrice(item.predictedPrice);
            const locality = item.location?.locality || item.location?.city || 'Selected Locality';
            const ratePerSqFt = item.pricePerSqFt || Math.round(item.predictedPrice / item.area);

            return (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all space-y-3 relative group"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div
                      className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md w-fit mb-1 border"
                      style={{
                        backgroundColor: `${themeConfig.hex}15`,
                        color: themeConfig.hex,
                        borderColor: `${themeConfig.hex}30`,
                      }}
                    >
                      <MapPin className="w-3 h-3" />
                      <span className="truncate max-w-[170px]">{locality}</span>
                    </div>
                    <div className="flex items-baseline gap-1.5 mt-0.5">
                      <span className="text-xl font-extrabold text-slate-900 dark:text-white font-mono">
                        {formatted.formattedShort}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        ({formatted.formattedFull})
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteOne(item.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                    title="Delete Record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
                  <div className="flex justify-between">
                    <span><strong>Area:</strong> {item.area} sq.ft ({item.bedrooms}BHK)</span>
                    <span className="text-slate-400">₹{ratePerSqFt.toLocaleString('en-IN')}/sqft</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>{item.bathrooms} Baths • {item.parking} Car Parking</span>
                    <span>{item.stories} Floors</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {item.investmentAdvice}
                  </span>
                  <span className="text-[11px] text-slate-400">{formatDate(item.createdAt)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-sm w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400">
              <div className="p-2.5 rounded-2xl bg-rose-50 dark:bg-rose-950/50">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">Clear All History?</h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Are you sure you want to permanently delete all saved valuation prediction records? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmClearAll}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-200 dark:shadow-none transition-colors cursor-pointer"
              >
                Confirm Delete All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
