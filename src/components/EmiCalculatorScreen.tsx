import React, { useState } from 'react';
import { Calculator, Percent, Calendar, CheckCircle2 } from 'lucide-react';
import { formatINR } from '../lib/api';
import { ThemeAccent } from '../types';
import { THEME_PRESETS } from '../lib/theme';

interface EmiCalculatorScreenProps {
  accentTheme?: ThemeAccent;
}

export const EmiCalculatorScreen: React.FC<EmiCalculatorScreenProps> = ({ accentTheme = 'indigo' }) => {
  const themeConfig = THEME_PRESETS[accentTheme] || THEME_PRESETS.indigo;
  const [loanAmount, setLoanAmount] = useState<number>(5000000); // 50 Lakhs default
  const [interestRate, setInterestRate] = useState<number>(8.5);
  const [tenureYears, setTenureYears] = useState<number>(20);

  // EMI Formula: P * r * (1 + r)^n / ((1 + r)^n - 1)
  const monthlyRate = interestRate / 12 / 100;
  const months = tenureYears * 12;

  const emi =
    monthlyRate > 0
      ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1)
      : loanAmount / months;

  const totalPayable = emi * months;
  const totalInterest = totalPayable - loanAmount;

  const principalRatio = Math.round((loanAmount / totalPayable) * 100);
  const interestRatio = 100 - principalRatio;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      <div>
        <div className="flex items-center gap-2.5">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-md"
            style={{ backgroundColor: themeConfig.hex }}
          >
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Home Loan EMI Calculator (₹ INR)
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Calculate monthly home loan payments, interest breakdown, and amortization in Indian Rupees.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls Column */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <h2 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            Loan Parameters
          </h2>

          {/* Principal */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Loan Amount (₹)</span>
              <span className="font-extrabold" style={{ color: themeConfig.hex }}>{formatINR(loanAmount)}</span>
            </div>
            <input
              type="range"
              min={500000}
              max={50000000}
              step={100000}
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
              style={{ accentColor: themeConfig.hex }}
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-bold">
              <span>₹5 Lakhs</span>
              <span>₹5 Crores</span>
            </div>
          </div>

          {/* Interest */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Interest Rate (% p.a.)</span>
              <span className="font-extrabold" style={{ color: themeConfig.hex }}>{interestRate.toFixed(1)}%</span>
            </div>
            <input
              type="range"
              min={2.0}
              max={18.0}
              step={0.1}
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
              style={{ accentColor: themeConfig.hex }}
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-bold">
              <span>2.0%</span>
              <span>18.0%</span>
            </div>
          </div>

          {/* Tenure */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Loan Tenure (Years)</span>
              <span className="font-extrabold" style={{ color: themeConfig.hex }}>{tenureYears} Years</span>
            </div>
            <input
              type="range"
              min={1}
              max={30}
              step={1}
              value={tenureYears}
              onChange={(e) => setTenureYears(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
              style={{ accentColor: themeConfig.hex }}
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-bold">
              <span>1 Year</span>
              <span>30 Years</span>
            </div>
          </div>
        </div>

        {/* Calculation Result Column */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-slate-900 text-white p-8 rounded-3xl border border-slate-800 shadow-xl space-y-6 relative overflow-hidden">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1">
                Estimated Monthly EMI
              </span>
              <div className="text-4xl font-extrabold tracking-tight" style={{ color: themeConfig.hex }}>
                {formatINR(emi)}
                <span className="text-sm font-normal text-slate-300"> / month</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10 text-xs">
              <div>
                <span className="text-slate-400 block mb-0.5">Principal Loan</span>
                <span className="font-extrabold text-sm text-white">{formatINR(loanAmount)}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Total Interest</span>
                <span className="font-extrabold text-sm text-white">{formatINR(totalInterest)}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Total Payable</span>
                <span className="font-extrabold text-sm text-white">{formatINR(totalPayable)}</span>
              </div>
            </div>

            {/* Split Bar */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs text-slate-300 font-medium">
                <span>Principal ({principalRatio}%)</span>
                <span>Interest ({interestRatio}%)</span>
              </div>
              <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex">
                <div style={{ width: `${principalRatio}%`, backgroundColor: themeConfig.hex }} className="h-full rounded-l-full" />
                <div style={{ width: `${interestRatio}%` }} className="h-full bg-amber-400 rounded-r-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
