import { useGetSensorData, getGetSensorDataQueryKey } from '@workspace/api-client-react';
import { useTranslation } from '@/lib/translations';
import { useAppStore } from '@/store/use-app-store';
import { AppLayout } from '@/components/layout/AppLayout';
import { MetricCard } from '@/components/MetricCard';
import { Link } from 'wouter';
import { format } from 'date-fns';
import { Droplets, ThermometerSun, Wind, Activity, RefreshCw, BarChart2, Zap, Wifi, WifiOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function LiveData() {
  const { language } = useAppStore();
  const tr = useTranslation();
  
  const { isSimulatorOn } = useAppStore();
  
  const { data: simData, isLoading: isLoadingSim, refetch: refetchSim, isRefetching: isRefSim } = useGetSensorData({
    query: { 
      queryKey: getGetSensorDataQueryKey(),
      enabled: isSimulatorOn,
      refetchInterval: 3000 
    }
  });

  const [iotData, setIotData] = useState<any>(null);
  const [isIotLoading, setIsIotLoading] = useState(false);
  const [iotError, setIotError] = useState<string | null>(null);

  useEffect(() => {
    let interval: any;
    if (!isSimulatorOn) {
      const fetchIot = async () => {
        try {
          setIsIotLoading(true);
          const res = await axios.get('http://10.154.16.104/', { timeout: 3000 });
          setIotError(null);
          
          let raw = res.data;
          console.log("🔍 [IOT DEBUG] LiveData Hardware Response:", raw);
          
          if (typeof raw === 'string') {
            try {
              raw = JSON.parse(raw);
            } catch (e) {
              console.warn("JSON.parse failed, using regex fallback");
              const extract = (key: string) => {
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
          const moisture = isNaN(soilRaw) ? 0 : Math.max(0, Math.min(100, Number((100 - (soilRaw / 10.23)).toFixed(1))));
          
          const processed = {
            ...raw,
            soilRaw,
            soilMoisture: moisture,
            temperature: tempVal !== null ? parseFloat(tempVal) : 0,
            humidity: humVal !== null ? parseFloat(humVal) : 0,
            status: 'online',
            timestamp: new Date().toISOString()
          };

          console.log("✅ [IOT DEBUG] LiveData Processed:", processed);
          setIotData(processed);

          // Sync to backend
          if (!isNaN(soilRaw)) {
            axios.post('/api/iot/sync', {
              soilRaw,
              temperature: processed.temperature,
              humidity: processed.humidity
            }).catch(err => console.error("Sync to backend failed", err));
          }
        } catch (err: any) {
          setIotError(err.message);
        } finally {
          setIsIotLoading(false);
        }
      };
      fetchIot();
      interval = setInterval(fetchIot, 3000);
    }
    return () => clearInterval(interval);
  }, [isSimulatorOn]);

  const sensorData = isSimulatorOn ? simData : iotData;
  const isLoading = isSimulatorOn ? isLoadingSim : isIotLoading && !iotData;
  const isRefreshing = isSimulatorOn ? isRefSim : isIotLoading;
  const refetch = isSimulatorOn ? refetchSim : () => {};
  const isOffline = !isSimulatorOn && !!iotError;

  return (
    <AppLayout>
      <div className="space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card p-6 rounded-3xl border border-border/50 shadow-sm">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">
              {tr('nav.live_data', language)}
            </h1>
            <div className="flex items-center gap-3 mt-2 text-muted-foreground text-sm font-medium">
              <span className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isOffline ? 'bg-red-500' : 'bg-primary'}`}></span>
                  <span className={`relative inline-flex rounded-full h-3 w-3 ${isOffline ? 'bg-red-500' : 'bg-primary'}`}></span>
                </span>
                {isOffline ? "ESP32 Offline" : (isSimulatorOn ? "Simulator Active" : "IoT Sensor Online")}
              </span>
              <span>•</span>
              <span>
                {tr('sensor.last_updated', language)}: {sensorData?.timestamp || sensorData?.connectedAt ? format(new Date(sensorData.timestamp || sensorData.connectedAt), 'HH:mm:ss') : '-'}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className={`p-2 rounded-lg ${isOffline ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'} hidden md:flex items-center gap-2 text-xs font-bold ring-1 ring-inset`}>
              {isOffline ? <WifiOff className="w-4 h-4" /> : <Wifi className="w-4 h-4" />}
              {isOffline ? 'DISCONNECTED' : 'STABLE SIGNAL'}
            </div>
            <button 
              onClick={() => isSimulatorOn ? refetch() : null}
              disabled={isRefreshing}
              className="p-3 rounded-xl bg-muted text-foreground hover:bg-accent hover:text-primary transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
            <Link 
              href="/recommendation"
              className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 transition-all"
            >
              {tr('action.analyze', language)}
            </Link>
          </div>
        </div>

        {/* Two Column Layout for Categories */}
        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Environment */}
          <div className="space-y-4">
            <h2 className="text-xl font-display font-bold text-foreground flex items-center gap-2">
              <ThermometerSun className="text-orange-500 w-6 h-6" />
              Environment Metrics
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <MetricCard
                title={tr('sensor.soil_moisture', language)}
                value={isLoading ? '-' : sensorData?.soilMoisture ?? '-'}
                unit="%"
                icon={Droplets}
                colorClass="text-blue-500"
              />
              <MetricCard
                title={tr('sensor.temperature', language)}
                value={isLoading ? '-' : sensorData?.temperature ?? '-'}
                unit="°C"
                icon={ThermometerSun}
                colorClass="text-orange-500"
              />
              <MetricCard
                title={tr('sensor.humidity', language)}
                value={isLoading ? '-' : sensorData?.humidity ?? '-'}
                unit="%"
                icon={Wind}
                colorClass="text-teal-500"
              />
            </div>
          </div>

          {/* Soil NPK */}
          <div className="space-y-4">
            <h2 className="text-xl font-display font-bold text-foreground flex items-center gap-2">
              <Activity className="text-primary w-6 h-6" />
              Soil Nutrients (NPK)
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <MetricCard
                title="Nitrogen (N)"
                value={isLoading ? '-' : sensorData?.nitrogen ?? '-'}
                unit="ppm"
                icon={BarChart2}
                colorClass="text-purple-500"
              />
              <MetricCard
                title="Phosphorus (P)"
                value={isLoading ? '-' : sensorData?.phosphorus ?? '-'}
                unit="ppm"
                icon={BarChart2}
                colorClass="text-pink-500"
              />
              <MetricCard
                title="Potassium (K)"
                value={isLoading ? '-' : sensorData?.potassium ?? '-'}
                unit="ppm"
                icon={BarChart2}
                colorClass="text-yellow-500"
              />
            </div>
          </div>

        </div>
      </div>
    </AppLayout>
  );
}
