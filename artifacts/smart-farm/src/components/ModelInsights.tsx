import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, CheckCircle2, AlertCircle, Thermometer, Wind, CloudRain, Droplets } from 'lucide-react';

interface ModelInsightsProps {
  insights: string[];
}

export function ModelInsights({ insights }: ModelInsightsProps) {
  return (
    <div className="bg-slate-50 dark:bg-slate-900/40 rounded-3xl p-8 border border-white/40 dark:border-slate-800 shadow-sm relative group overflow-hidden">
      <div className="absolute top-0 left-0 p-4 opacity-5 group-hover:scale-110 transition-transform -rotate-12">
        <Info className="w-48 h-48 text-slate-400" />
      </div>
      
      <div className="relative flex flex-col md:flex-row gap-8 items-center justify-between">
        <div className="flex-1 space-y-4">
          <h2 className="text-2xl font-display font-black text-slate-800 dark:text-slate-100 flex items-center gap-3">
            <span className="p-3 bg-primary text-white rounded-2xl shadow-lg shadow-primary/20">
              🧠 AI Reasoner
            </span>
            Insights & Logic
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-lg leading-relaxed max-w-xl">
            Our **Decision Tree (Explainability Model)** interprets real-time sensor streams to provide human-readable logic for its current predictions.
          </p>
        </div>
        
        <div className="flex-1 w-full space-y-3">
          <AnimatePresence mode="popLayout">
            {insights.map((insight, idx) => (
              <motion.div
                key={insight}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-start gap-4 p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-all group/item overflow-hidden relative"
              >
                <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded-xl group-hover/item:bg-primary/10 transition-colors">
                  {insight.includes('🌧️') ? <CloudRain className="w-5 h-5 text-blue-500" /> : 
                   insight.includes('🔥') ? <Thermometer className="w-5 h-5 text-orange-500" /> :
                   insight.includes('⚠️') ? <AlertCircle className="w-5 h-5 text-red-500" /> :
                   <CheckCircle2 className="w-5 h-5 text-green-500" />}
                </div>
                <p className="text-slate-700 dark:text-slate-300 font-bold text-sm md:text-base pr-4">
                  {insight}
                </p>
                <div className="absolute right-0 top-0 bottom-0 w-1 bg-primary scale-y-0 group-hover/item:scale-y-100 transition-transform origin-top" />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Explainable Path Footer */}
      <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
        <span className="flex items-center gap-2">
          <Info className="w-4 h-4" />
          Explainability Mode: Decision Tree Regressor
        </span>
        <span className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
          Refined by rule-mappings
        </span>
      </div>
    </div>
  );
}
