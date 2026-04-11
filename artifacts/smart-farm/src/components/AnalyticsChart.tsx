import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, BarChart, Bar, Legend } from "recharts";
import { useTranslation } from "@/lib/translations";
import { useAppStore } from "@/store/use-app-store";

// Mock historical data for the trend chart
const weekData = [
  { day: "Mon", moisture: 45, temp: 24, humidity: 62 },
  { day: "Tue", moisture: 42, temp: 26, humidity: 58 },
  { day: "Wed", moisture: 38, temp: 28, humidity: 55 },
  { day: "Thu", moisture: 65, temp: 25, humidity: 70 }, // After watering
  { day: "Fri", moisture: 60, temp: 23, humidity: 75 },
  { day: "Sat", moisture: 55, temp: 24, humidity: 68 },
  { day: "Sun", moisture: 50, temp: 26, humidity: 65 },
];

interface AnalyticsChartProps {
  currentData?: {
    soilMoisture: number;
    nitrogen: number;
    phosphorus: number;
    potassium: number;
    tsForecastData?: { time: string; value: number }[];
  };
}

export function AnalyticsChart({ currentData }: AnalyticsChartProps) {
  const tr = useTranslation();

  // Combine mock week data with live forecast if available
  // For a better UX, we'll merge the last point of history with the forecast
  const chartData = currentData?.tsForecastData && currentData.tsForecastData.length > 0
    ? [
        { day: "Past", moisture: currentData.soilMoisture, temp: 25, type: 'actual' },
        ...currentData.tsForecastData.map(d => ({ day: d.time, moisture: d.value, type: 'predicted' }))
      ]
    : weekData;

  // NPK Data
  const npkData = [
    { name: tr("live.nitrogen", language), value: currentData?.nitrogen || 0, fill: "#3b82f6" },
    { name: tr("live.phosphorus", language), value: currentData?.phosphorus || 0, fill: "#eab308" },
    { name: tr("live.potassium", language), value: currentData?.potassium || 0, fill: "#8b5cf6" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
      {/* Trend Area Chart (Moisture vs Temp) */}
      <div className="glass-card rounded-2xl p-6 shadow-sm border border-border/50 bg-card overflow-hidden">
        <h3 className="text-xl font-bold mb-6 text-foreground font-display flex items-center gap-2">
          {currentData?.tsForecastData ? tr("7-Hour AI Forecast", language) : tr("7-Day Environment Trend", language)}
          {currentData?.tsForecastData && <span className="text-[10px] bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full uppercase tracking-widest font-black">AI Active</span>}
        </h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorMoisture" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="opacity-10" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} className="text-xs" tick={{ fill: 'currentColor', opacity: 0.6 }} />
              <YAxis axisLine={false} tickLine={false} className="text-xs" tick={{ fill: 'currentColor', opacity: 0.6 }} domain={[0, 100]} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              
              {currentData?.tsForecastData ? (
                <>
                  <Area type="monotone" dataKey="moisture" name={tr('status.predicted_trend')} stroke="#8b5cf6" strokeWidth={3} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorForecast)" />
                </>
              ) : (
                <>
                  <Area type="monotone" dataKey="moisture" name={tr('sensor.soil_moisture')} stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorMoisture)" />
                  <Area type="monotone" dataKey="temp" name={tr('sensor.temperature')} stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="rgba(249, 115, 22, 0.1)" />
                </>
              )}
              <Legend verticalAlign="top" height={36} iconType="circle" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* NPK Bar Chart */}
      <div className="glass-card rounded-2xl p-6 shadow-sm border border-border/50 bg-card">
        <h3 className="text-xl font-bold mb-6 text-foreground font-display">{tr("Current Soil NPK Levels", language)}</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={npkData} margin={{ top: 10, right: 30, left: -10, bottom: 10 }} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="currentColor" className="opacity-10" />
              <XAxis type="number" domain={[0, 100]} axisLine={false} tickLine={false} className="text-xs" tick={{ fill: 'currentColor', opacity: 0.6 }} />
              <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} className="text-xs font-medium" tick={{ fill: 'currentColor', opacity: 0.8 }} width={110} />
              <Tooltip 
                cursor={{ fill: 'currentColor', opacity: 0.05 }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="value" name="Level mg/kg" radius={[0, 6, 6, 0]} barSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

