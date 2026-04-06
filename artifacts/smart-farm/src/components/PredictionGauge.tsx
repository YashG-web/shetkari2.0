import React from 'react';
import { motion } from 'framer-motion';

interface PredictionGaugeProps {
  value: number;
  label: string;
}

export function PredictionGauge({ value, label }: PredictionGaugeProps) {
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const progress = (value / 100) * circumference;
  
  // Color based on moisture level
  const getColor = (v: number) => {
    if (v < 30) return "#ef4444"; // Red
    if (v < 50) return "#f59e0b"; // Amber
    return "#3b82f6"; // Blue
  };

  const color = getColor(value);

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-primary/10 transition-colors" />
      
      <div className="relative w-48 h-48">
        {/* Background Track */}
        <svg className="w-full h-full -rotate-90">
          <circle
            cx="96"
            cy="96"
            r={radius}
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            className="text-slate-100 dark:text-slate-800"
          />
          {/* Progress Bar */}
          <motion.circle
            cx="96"
            cy="96"
            r={radius}
            stroke={color}
            strokeWidth="12"
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - progress }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            strokeLinecap="round"
          />
        </svg>
        
        {/* Value Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span 
            key={value}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-5xl font-display font-black text-slate-900 dark:text-white"
          >
            {value}%
          </motion.span>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Accuracy Mode</span>
        </div>
      </div>
      
      <div className="mt-6 text-center">
        <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
          {label}
        </h3>
        <p className="text-sm text-slate-400 font-medium mt-1">Random Forest Intelligence</p>
      </div>
      
      {/* Risk Indicator Badge */}
      <div className="mt-4">
        <span className={`px-4 py-1 rounded-full text-xs font-black uppercase tracking-tighter ${
          value < 30 ? 'bg-red-100 text-red-600' : 
          value < 50 ? 'bg-amber-100 text-amber-600' : 
          'bg-blue-100 text-blue-600'
        }`}>
          {value < 30 ? 'Critical Stress' : value < 50 ? 'Moderate Alert' : 'Optimal Hydration'}
        </span>
      </div>
    </div>
  );
}
