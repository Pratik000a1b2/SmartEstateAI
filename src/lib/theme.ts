import { ThemeAccent, ThemeConfig } from '../types';

export const THEME_PRESETS: Record<ThemeAccent, ThemeConfig> = {
  indigo: {
    id: 'indigo',
    name: 'Royal Sapphire',
    primaryClass: 'bg-indigo-600 hover:bg-indigo-700 text-white',
    bgLightClass: 'bg-indigo-50 dark:bg-indigo-950/40',
    borderClass: 'border-indigo-200 dark:border-indigo-800',
    textClass: 'text-indigo-600 dark:text-indigo-400',
    hex: '#4f46e5',
  },
  emerald: {
    id: 'emerald',
    name: 'Emerald Luxe',
    primaryClass: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    bgLightClass: 'bg-emerald-50 dark:bg-emerald-950/40',
    borderClass: 'border-emerald-200 dark:border-emerald-800',
    textClass: 'text-emerald-600 dark:text-emerald-400',
    hex: '#059669',
  },
  violet: {
    id: 'violet',
    name: 'Imperial Amethyst',
    primaryClass: 'bg-violet-600 hover:bg-violet-700 text-white',
    bgLightClass: 'bg-violet-50 dark:bg-violet-950/40',
    borderClass: 'border-violet-200 dark:border-violet-800',
    textClass: 'text-violet-600 dark:text-violet-400',
    hex: '#7c3aed',
  },
  cyan: {
    id: 'cyan',
    name: 'Oceanic Aqua',
    primaryClass: 'bg-cyan-600 hover:bg-cyan-700 text-white',
    bgLightClass: 'bg-cyan-50 dark:bg-cyan-950/40',
    borderClass: 'border-cyan-200 dark:border-cyan-800',
    textClass: 'text-cyan-600 dark:text-cyan-400',
    hex: '#0891b2',
  },
  amber: {
    id: 'amber',
    name: 'Sunset Gold',
    primaryClass: 'bg-amber-600 hover:bg-amber-700 text-white',
    bgLightClass: 'bg-amber-50 dark:bg-amber-950/40',
    borderClass: 'border-amber-200 dark:border-amber-800',
    textClass: 'text-amber-600 dark:text-amber-400',
    hex: '#d97706',
  },
  rose: {
    id: 'rose',
    name: 'Crimson Ruby',
    primaryClass: 'bg-rose-600 hover:bg-rose-700 text-white',
    bgLightClass: 'bg-rose-50 dark:bg-rose-950/40',
    borderClass: 'border-rose-200 dark:border-rose-800',
    textClass: 'text-rose-600 dark:text-rose-400',
    hex: '#e11d48',
  },
};

export const DEFAULT_THEME_ACCENT: ThemeAccent = 'indigo';
