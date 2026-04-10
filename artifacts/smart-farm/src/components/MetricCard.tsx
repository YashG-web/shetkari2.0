import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { useTranslation } from '@/lib/translations';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  trend?: string;
  isPositive?: boolean;
  colorClass?: string;
  delay?: number;
  predictedValue?: number | string;
  statusMessage?: string;
}

export function MetricCard({ title, value, unit, icon: Icon, trend, isPositive, colorClass = "text-primary", delay = 0, predictedValue, statusMessage }: MetricCardProps) {
  const tr = useTranslation();
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      className="bg-card rounded-3xl p-6 shadow-sm shadow-black/5 border border-border/60 hover:shadow-lg hover:border-primary/20 transition-all duration-300 relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-10 transition-opacity">
        <Icon className="w-12 h-12" />
      </div>

      <div className="flex items-start justify-between relative z-10">
        <div className={`p-3 rounded-2xl bg-muted/50 ${colorClass}`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <div className={`px-2.5 py-1 rounded-full text-xs font-medium ${isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {trend}
          </div>
        )}
      </div>
      
      <div className="mt-6 relative z-10">
        <h3 className="text-sm font-medium text-muted-foreground mb-1">{title}</h3>
        <div className="flex items-baseline gap-1.5 flex-wrap">
          <span className="text-3xl font-display font-bold text-foreground tracking-tight">{value}</span>
          {unit && <span className="text-sm font-semibold text-muted-foreground">{unit}</span>}
          
          {predictedValue !== undefined && (
            <div className="w-full mt-2 flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/40 text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest border border-indigo-100 dark:border-indigo-900/50">
                {tr('sensor.ai_accuracy')}: {predictedValue}{unit}
              </span>
            </div>
          )}

          {statusMessage && (
            <div className="w-full mt-2">
              <p className="text-[11px] font-medium text-muted-foreground italic leading-tight border-l-2 border-primary/20 pl-2">
                {statusMessage}
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

