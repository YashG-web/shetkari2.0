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
import { Droplets, ThermometerSun, Wind, Power, AlertTriangle, ArrowRight, CloudRain, Sparkles, Sprout, Activity, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Dashboard() {
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

  const { isSimulatorOn, language } = useAppStore();

  const [hardwareData, setHardwareData] = useState<any>(null);
  const [isHardwareOffline, setIsHardwareOffline] = useState(false);

  // Directly fetch from hardware when Simulator is OFF
  useEffect(() => {
    let interval: any;
    if (!isSimulatorOn) {
      const fetchHardware = async () => {
        try {
          const response = await axios.get('http://10.154.16.92/', { timeout: 3000 });
          setIsHardwareOffline(false);
          
          let raw = response.data;
          console.log("🔍 [IOT DEBUG] Dashboard Raw Response:", raw);

          // Robust parsing logic
          if (typeof raw === 'string') {
            try {
              raw = JSON.parse(raw);
            } catch (e) {
              console.warn("JSON.parse failed, using regex fallback");
              const extract = (key: string) => {
                // Improved regex to handle "soil":123, "soil":"123", soil:123, etc.
                const regex = new RegExp(`"?${key}"?\\s*[:=]\\s*"?([0-9.]+)"?`, 'i');
                const match = raw.match(regex);
                return match ? match[1] : null;
              };
              raw = {
                soil: extract('soil') || extract('moisture'),
                temp: extract('temp') || extract('temperature'),
                hum: extract('hum') || extract('humidity')
              };
            }
          }
          
          if (!raw || typeof raw !== 'object') return;

          // Aggressive field detection 
          const getField = (keys: string[]) => {
            for (const k of keys) {
              const val = raw[k] ?? raw[k.toLowerCase()] ?? raw[k.toUpperCase()];
              if (val !== undefined && val !== null) return val;
            }
            return null;
          };

          const soilVal = getField(['soil', 'moisture', 's']);
          const tempVal = getField(['temp', 'temperature', 't']);
          const humVal = getField(['hum', 'humidity', 'h']);

          const soilRaw = soilVal !== null ? Number(soilVal) : NaN;
          // Typical mapping: 1023 (dry) -> 0%, 0 (wet) -> 100%
          const moisture = isNaN(soilRaw) ? 0 : Math.max(0, Math.min(100, Number((100 - (soilRaw / 10.23)).toFixed(1))));
          
          const temperature = tempVal !== null ? parseFloat(tempVal) : 0;
          const humidity = humVal !== null ? parseFloat(humVal) : 0;

          const processed = {
            ...raw,
            soilRaw, // Keep the raw number for debugging
            soilMoisture: moisture,
            temperature,
            humidity,
            status: 'online',
            timestamp: new Date().toISOString()
          };

          console.log("✅ [IOT DEBUG] Dashboard Processed Data:", processed);
          setHardwareData(processed);

          // Sync to backend
          if (!isNaN(soilRaw)) {
            axios.post('/api/iot/sync', {
              soilRaw,
              temperature,
              humidity
            }).catch(err => console.error("Sync to backend failed", err));
          }

        } catch (err) {
          console.error("Hardware network fetch failed", err);
          setIsHardwareOffline(true);
        }
      };

      fetchHardware();
      interval = setInterval(fetchHardware, 3000);
    }
    return () => clearInterval(interval);
  }, [isSimulatorOn]);

  // MERGE LOGIC: Prioritize Live Hardware for environment, but keep Simulator for NPK & AI
  const activeSensorData = isSimulatorOn ? sensorData : {
    ...sensorData,    // Start with all simulated fields (NPK, AI Insights, etc.)
    ...hardwareData,  // Override with Live Sensors (Moisture, Temp, Hum)
  };

  const isGlobalLoading = isSimulatorOn ? isLoadingSensor : (!hardwareData && !isHardwareOffline);
  const isOffline = !isSimulatorOn && isHardwareOffline;

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
                {tr('dash.title', language)}
              </h1>
              <p className="text-primary-foreground/80 text-lg md:text-xl font-medium mb-8">
                {tr('dash.subtitle', language)}
              </p>
              
              <Link 
                href="/recommendation" 
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary rounded-2xl font-bold hover:bg-opacity-90 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/10"
              >
                {tr('action.get_recommendation')}
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
                    <h3 className="text-slate-900 font-bold text-lg">{tr("weather.summary")}</h3>
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
          
          {/* Mode Indicator Overlay */}
          <div className="absolute top-4 right-4 flex gap-2">
            {!isSimulatorOn && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black shadow-lg backdrop-blur-md border ${
                  isOffline 
                    ? 'bg-red-500/90 text-white border-red-400' 
                    : 'bg-emerald-500/90 text-white border-emerald-400'
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${isOffline ? 'bg-white animate-pulse' : 'bg-white shadow-[0_0_8px_white]'}`} />
                {isOffline ? tr('dash.esp_offline', language) : tr('dash.live_data', language)}
              </motion.div>
            )}
            {isSimulatorOn && (
              <div className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black bg-amber-500/90 text-white border border-amber-400 shadow-lg backdrop-blur-md">
                <Zap className="w-3 h-3 fill-current" />
                {tr('dash.sim_mode', language)}
              </div>
            )}
          </div>
        </motion.div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title={tr('sensor.soil_moisture', language)}
            value={isGlobalLoading || isOffline ? '-' : activeSensorData?.soilMoisture ?? '-'}
            unit={isOffline ? "" : "%"}
            icon={Droplets}
            colorClass="text-blue-500"
            delay={0.1}
            predictedValue={(activeSensorData as any)?.rfPrediction}
          />
          <MetricCard
            title={tr('sensor.temperature', language)}
            value={isGlobalLoading || isOffline ? '-' : activeSensorData?.temperature ?? '-'}
            unit={isOffline ? "" : "°C"}
            icon={ThermometerSun}
            colorClass="text-orange-500"
            delay={0.2}
          />
          <MetricCard
            title={tr('sensor.humidity', language)}
            value={isGlobalLoading || isOffline ? '-' : activeSensorData?.humidity ?? '-'}
            unit={isOffline ? "" : "%"}
            icon={Wind}
            colorClass="text-teal-500"
            delay={0.3}
          />
          <MetricCard
            title={tr('sensor.pump_status', language)}
            value={isGlobalLoading || isOffline ? '-' : tr(activeSensorData?.pumpStatus === 'ON' ? 'status.on' : 'status.off', language)}
            icon={Power}
            colorClass={activeSensorData?.pumpStatus === 'ON' && !isOffline ? 'text-primary' : 'text-gray-400'}
            delay={0.4}
            statusMessage={isOffline ? tr('sensor.esp32_offline', language) : (activeSensorData as any)?.ruleEngineOutput}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MetricCard
            title={tr('rec.irrigation_advisory', language)}
            value={isGlobalLoading ? '-' : tr(activeSensorData?.irrigationAdvisory ?? '-', language)}
            icon={CloudRain}
            colorClass="text-blue-600"
            delay={0.5}
            statusMessage={isGlobalLoading ? undefined : `${tr('status.logic', language)}: ${tr('Environmental Physics', language)}`}

          />
          <MetricCard
            title={tr('dash.ai_fert_rec', language)}
            value={isGlobalLoading ? '-' : tr(activeSensorData?.fertilizerRecommendation ?? '-', language)}
            icon={Sprout}
            colorClass="text-green-600"
            delay={0.6}
            statusMessage={isGlobalLoading ? undefined : `${tr('status.source', language)}: ${tr(activeSensorData?.fertilizerSource ?? 'Fallback', language)}`}

          />
        </div>

        {/* Analytics Section */}
        <AnalyticsChart 
          currentData={{
            soilMoisture: activeSensorData?.soilMoisture || 0,
            nitrogen: activeSensorData?.nitrogen || 0,
            phosphorus: activeSensorData?.phosphorus || 0,
            potassium: activeSensorData?.potassium || 0,
            tsForecastData: (activeSensorData as any)?.tsForecastData
          }} 
        />

        {/* AI Reasoner Ribbon */}
        {(activeSensorData as any)?.dtInsights && (activeSensorData as any).dtInsights.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl p-4 border border-indigo-100 dark:border-indigo-900/50 flex flex-col md:flex-row items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-600 text-white rounded-lg">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold text-indigo-900 dark:text-indigo-200 uppercase tracking-tight">{tr('section.ai_reasoner', language)}</span>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {(activeSensorData as any).dtInsights.map((insight: string, i: number) => (
                <span key={i} className="text-xs font-medium text-indigo-700 dark:text-indigo-300 bg-white dark:bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-100 dark:border-indigo-900 shadow-sm">
                  {tr(insight, language)}
                </span>
              ))}
            </div>
          </motion.div>
        )}

      </div>
    </AppLayout>
  );
}
