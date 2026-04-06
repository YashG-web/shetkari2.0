import React from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend, ReferenceLine } from "recharts";
import { TrendingUp, Clock, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

interface ForecastChartProps {
  data: { time: string; value: number }[];
  currentValue: number;
}

export function ForecastChart({ data, currentValue }: ForecastChartProps) {
  // Mock historical data leading to current value for a continuous look
  const pastData = [
    { time: "09:00", value: currentValue + 5, type: 'actual' },
    { time: "10:00", value: currentValue + 3, type: 'actual' },
    { time: "11:00", value: currentValue + 1, type: 'actual' },
    { time: "12:00", value: currentValue, type: 'actual' },
  ];

  // Combine past (actual) and future (predicted)
  const chartData = [
    ...pastData,
    ...data.map(d => ({ ...d, type: 'predicted' }))
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-3xl p-8 border border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/60 shadow-xl overflow-hidden relative"
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8 border-b border-slate-100 dark:border-slate-800 pb-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-display font-black text-slate-800 dark:text-slate-100 flex items-center gap-3">
             <TrendingUp className="w-8 h-8 text-indigo-500" />
             Future Trends
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm flex items-center gap-2">
            <Clock className="w-4 h-4" />
            24-Hour Predictive Forecast (Time Series Model)
          </p>
        </div>
        
        {data.length > 0 && (
          <div className="bg-indigo-50 dark:bg-indigo-950/40 px-6 py-4 rounded-2xl border border-indigo-100 dark:border-indigo-900 flex flex-col items-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Next Peak Forecast</span>
            <span className="text-3xl font-black text-indigo-900 dark:text-indigo-200">{data[data.length - 1].value}%</span>
          </div>
        )}
      </div>

      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="opacity-10" />
            <XAxis 
              dataKey="time" 
              axisLine={false} 
              tickLine={false} 
              className="text-xs font-bold" 
              tick={{ fill: 'currentColor', opacity: 0.6 }} 
              interval={1}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              className="text-xs font-bold" 
              tick={{ fill: 'currentColor', opacity: 0.6 }} 
              domain={[0, 100]}
            />
            <Tooltip 
              contentStyle={{ 
                borderRadius: '16px', 
                border: 'none', 
                boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)'
              }}
              labelStyle={{ fontWeight: 'bold' }}
            />
            <ReferenceLine x="12:00" stroke="#f97316" strokeDasharray="5 5" label={{ value: 'Now', position: 'top', fill: '#f97316', fontWeight: 'bold' }} />
            
            <Area 
              type="monotone" 
              dataKey="value" 
              name="Actual Level"
              stroke="#3b82f6" 
              strokeWidth={4} 
              fillOpacity={1} 
              fill="url(#colorActual)" 
              dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
              activeDot={{ r: 6 }}
              connectNulls
              data={chartData.filter(d => d.type === 'actual')}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              name="Predicted Trend"
              stroke="#8b5cf6" 
              strokeWidth={4} 
              strokeDasharray="8 8"
              fillOpacity={1} 
              fill="url(#colorPredicted)" 
              connectNulls
              data={chartData.filter(d => d.type === 'predicted' || d.time === '12:00')}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
    </motion.div>
  );
}
