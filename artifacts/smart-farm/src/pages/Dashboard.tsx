import { useGetSensorData, useGetWeather } from '@workspace/api-client-react';
import { useTranslation } from '@/lib/translations';
import { useAppStore } from '@/store/use-app-store';
import { AppLayout } from '@/components/layout/AppLayout';
import { MetricCard } from '@/components/MetricCard';
import { Link } from 'wouter';
import { Droplets, ThermometerSun, Wind, Power, AlertTriangle, ArrowRight, CloudRain } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const { language } = useAppStore();
  const tr = useTranslation();
  
  const { data: sensorData, isLoading: isLoadingSensor } = useGetSensorData({
    query: { refetchInterval: 5000 } // Auto refresh every 5s
  });
  
  const { data: weatherData, isLoading: isLoadingWeather } = useGetWeather();

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
             {/* landing page hero scenic farm landscape */}
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
                Smart Farming Intelligence
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
                  <div className="p-3 bg-blue-500/20 rounded-xl text-blue-100">
                    <CloudRain className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">{tr('weather.summary', language)}</h3>
                    <p className="text-white/70 text-sm">{weatherData.description}</p>
                  </div>
                </div>
                {weatherData.alerts.length > 0 && (
                  <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-3 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-300 shrink-0" />
                    <div>
                      <p className="text-red-100 text-sm font-medium">{weatherData.alerts[0].message}</p>
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
          />
        </div>

      </div>
    </AppLayout>
  );
}
