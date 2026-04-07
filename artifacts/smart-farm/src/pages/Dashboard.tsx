import { 
  useGetSensorData, 
  useGetWeather, 
  usePredictMoisture,
  getGetSensorDataQueryKey,
  getGetWeatherQueryKey
} from '@workspace/api-client-react';
import { useTranslation } from '@/lib/translations';
import { useAppStore } from '@/store/use-app-store';
import { AppLayout } from '@/components/layout/AppLayout';
import { MetricCard } from '@/components/MetricCard';
import { AnalyticsChart } from '@/components/AnalyticsChart';
import { Link } from 'wouter';
import { Droplets, ThermometerSun, Wind, Power, AlertTriangle, ArrowRight, CloudRain, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const { language } = useAppStore();
  const tr = useTranslation();
  
  const { data: sensorData, isLoading: isLoadingSensor } = useGetSensorData({
    query: { 
      queryKey: getGetSensorDataQueryKey(),
      refetchInterval: 3000 
    }
  });

  const { data: weatherData, isLoading: isLoadingWeather } = useGetWeather({
    query: {
      queryKey: getGetWeatherQueryKey()
    }
  });

  return (
    <AppLayout>
      <div className="space-y-8">
        
        {/* Hero Banner */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative rounded-3xl overflow-hidden bg-primary/10 border border-primary/20"
        >
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80&fit=crop" 
              alt="Farm Hero" 
              className="w-full h-full object-cover opacity-20 mix-blend-overlay"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/40 mix-blend-multiply" />
          </div>
          
          <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-primary-foreground max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 text-balance">
                SHETKARI Intelligence
              </h1>
              <p className="text-primary-foreground/80 text-lg md:text-xl font-medium mb-8">
                Real-time insights and AI recommendations for optimal crop health and yield.
              </p>
              
              <Link 
                href="/recommendation" 
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary rounded-2xl font-bold hover:bg-opacity-90 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/10"
              >
                {tr('action.get_recommendation', language)}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            
            {/* Weather Widget */}
            {!isLoadingWeather && weatherData && (
              <div className="glass-card rounded-2xl p-6 min-w-[280px]">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-blue-500/10 rounded-xl text-blue-600 drop-shadow-sm">
                    <CloudRain className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-slate-900 font-bold text-lg">{tr("weather.summary", language)}</h3>
                    <p className="text-slate-700 font-medium text-sm capitalize">{weatherData.description}</p>
                  </div>
                </div>
                {weatherData.alerts.length > 0 && (
                  <div className="bg-red-600 border border-red-700 rounded-xl p-4 flex items-start gap-3 shadow-lg shadow-red-900/40 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                    <AlertTriangle className="w-6 h-6 text-white shrink-0 animate-pulse drop-shadow-md z-10" />
                    <div className="z-10">
                      <p className="text-white text-sm font-bold tracking-wide drop-shadow-sm">{weatherData.alerts[0].message}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title={tr('sensor.soil_moisture', language)}
            value={isLoadingSensor ? '-' : sensorData?.soilMoisture ?? '-'}
            unit="%"
            icon={Droplets}
            colorClass="text-blue-500"
            delay={0.1}
            predictedValue={(sensorData as any)?.rfPrediction}
          />
          <MetricCard
            title={tr('sensor.temperature', language)}
            value={isLoadingSensor ? '-' : sensorData?.temperature ?? '-'}
            unit="°C"
            icon={ThermometerSun}
            colorClass="text-orange-500"
            delay={0.2}
          />
          <MetricCard
            title={tr('sensor.humidity', language)}
            value={isLoadingSensor ? '-' : sensorData?.humidity ?? '-'}
            unit="%"
            icon={Wind}
            colorClass="text-teal-500"
            delay={0.3}
          />
          <MetricCard
            title={tr('sensor.pump_status', language)}
            value={isLoadingSensor ? '-' : tr(sensorData?.pumpStatus === 'ON' ? 'status.on' : 'status.off', language)}
            icon={Power}
            colorClass={sensorData?.pumpStatus === 'ON' ? 'text-primary' : 'text-gray-400'}
            delay={0.4}
            statusMessage={(sensorData as any)?.ruleEngineOutput}
          />
        </div>

        {/* Analytics Section */}
        <AnalyticsChart 
          currentData={{
            soilMoisture: sensorData?.soilMoisture || 0,
            nitrogen: sensorData?.nitrogen || 0,
            phosphorus: sensorData?.phosphorus || 0,
            potassium: sensorData?.potassium || 0,
            tsForecastData: (sensorData as any)?.tsForecastData
          }} 
        />

        {/* AI Reasoner Ribbon */}
        {(sensorData as any)?.dtInsights && (sensorData as any).dtInsights.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl p-4 border border-indigo-100 dark:border-indigo-900/50 flex flex-col md:flex-row items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-600 text-white rounded-lg">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold text-indigo-900 dark:text-indigo-200 uppercase tracking-tight">AI Reasoner (Decision Tree):</span>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {(sensorData as any).dtInsights.map((insight: string, i: number) => (
                <span key={i} className="text-xs font-medium text-indigo-700 dark:text-indigo-300 bg-white dark:bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-100 dark:border-indigo-900 shadow-sm">
                  {insight}
                </span>
              ))}
            </div>
          </motion.div>
        )}

      </div>
    </AppLayout>
  );
}

