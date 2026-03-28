import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  trend?: string;
  isPositive?: boolean;
  colorClass?: string;
  delay?: number;
}

export function MetricCard({ title, value, unit, icon: Icon, trend, isPositive, colorClass = "text-primary", delay = 0 }: MetricCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      className="bg-card rounded-3xl p-6 shadow-sm shadow-black/5 border border-border/60 hover:shadow-lg hover:border-primary/20 transition-all duration-300"
    >
      <div className="flex items-start justify-between">
        <div className={`p-3 rounded-2xl bg-muted/50 ${colorClass}`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <div className={`px-2.5 py-1 rounded-full text-xs font-medium ${isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {trend}
          </div>
        )}
      </div>
      
      <div className="mt-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-1">{title}</h3>
        <div className="flex items-baseline gap-1.5">
          <span className="text-3xl font-display font-bold text-foreground tracking-tight">{value}</span>
          {unit && <span className="text-sm font-semibold text-muted-foreground">{unit}</span>}
        </div>
      </div>
    </motion.div>
  );
}
