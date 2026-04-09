import { useGetSensorData, getGetSensorDataQueryKey } from '@workspace/api-client-react';
import { useTranslation } from '@/lib/translations';
import { useAppStore } from '@/store/use-app-store';
import { AppLayout } from '@/components/layout/AppLayout';
import { MetricCard } from '@/components/MetricCard';
import { Link } from 'wouter';
import { format } from 'date-fns';
import { Droplets, ThermometerSun, Wind, Activity, RefreshCw, BarChart2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LiveData() {
  const { language } = useAppStore();
  const tr = useTranslation();
  
  const { data: sensorData, isLoading, refetch, isRefetching } = useGetSensorData({
    query: { 
      queryKey: getGetSensorDataQueryKey(),
      refetchInterval: 3000 
    }
  });

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
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                </span>
                {tr('sensor.connected', language)}
              </span>
              <span>•</span>
              <span>
                {tr('sensor.last_updated', language)}: {sensorData?.connectedAt ? format(new Date(sensorData.connectedAt), 'HH:mm:ss') : '-'}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => refetch()}
              disabled={isRefetching}
              className="p-3 rounded-xl bg-muted text-foreground hover:bg-accent hover:text-primary transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${isRefetching ? 'animate-spin' : ''}`} />
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
