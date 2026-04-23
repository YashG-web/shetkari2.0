import React, { useState, useEffect, useCallback } from "react";
import { 
  CloudRain, 
  Droplets, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw,
  Navigation,
  Thermometer,
  Wind,
  Zap,
  ChevronRight,
  Download
} from "lucide-react";
import FarmMapSelector from "../components/FarmMapSelector";

interface GridCell {
  id: string;
  status: string;
  color: string;
  totalStress: number;
  needs: {
    water: number;
    n: number;
    p: number;
    k: number;
  };
  recommendations: string[];
}

interface PrecisionData {
  weather: {
    temp: number;
    humidity: number;
    windSpeed: number;
    condition: number;
    stressFactor: number;
    lastUpdated?: string;
  };
  sensor: {
    moisture: number;
    status: string;
    lastUpdated: string;
  };
  grid: GridCell[];
  heatmap: string | null;
  bbox: number[];
  summary: {
    totalWater: number;
    totalNitrogen: number;
    totalPhosphorous: number;
    totalPotassium: number;
    criticalSquares: number;
    moderateSquares: number;
    healthySquares: number;
  };
}

const PrecisionFarmingSatellite: React.FC = () => {
  const [data, setData] = useState<PrecisionData | null>(null);
  const [bbox, setBbox] = useState<number[]>([73.85, 18.51, 73.86, 18.53]);
  const [center, setCenter] = useState<[number, number]>([18.5204, 73.8567]); // Pune Default
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCell, setSelectedCell] = useState<GridCell | null>(null);
  const [missionActive, setMissionActive] = useState(false);
  const [missionStatus, setMissionStatus] = useState("Idle");
  const [lastSearchTime, setLastSearchTime] = useState<number>(0);
  const [polygon, setPolygon] = useState<number[][]>([]);
  const [missionProgress, setMissionProgress] = useState<{ eta: number, targets: number }>({ eta: 0, targets: 0 });

  const fetchData = useCallback(async (currentBbox: number[], currentPolygon?: number[][]) => {
    try {
      setRefreshing(true);
      const polyParam = currentPolygon ? `&polygon=${JSON.stringify(currentPolygon)}` : '';
      const res = await fetch(`/api/precision-farming/data?bbox=${JSON.stringify(currentBbox)}${polyParam}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Failed to fetch precision data", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData(bbox, polygon);
    const interval = setInterval(() => fetchData(bbox, polygon), 45000);
    return () => clearInterval(interval);
  }, [bbox, polygon, fetchData]);

  // Automatic Mission Trigger: Start if new data comes in after a search and contains critical cells
  useEffect(() => {
    if (data && lastSearchTime > 0 && Date.now() - lastSearchTime < 5000) {
      const hasCritical = data.grid.some(c => c.status === "Critical");
      if (hasCritical && !missionActive) {
        setMissionActive(true);
        setLastSearchTime(0); // Reset after triggering
      }
    }
  }, [data, lastSearchTime, missionActive]);

  const handleBboxChange = (newBbox: number[]) => {
    setBbox(newBbox);
  };

  const handlePolygonChange = (newPolygon: number[][]) => {
    setPolygon(newPolygon);
  };

  const handleCenterChange = (newCenter: [number, number]) => {
    setCenter(newCenter);
  };

  const handleSearchComplete = () => {
    setLastSearchTime(Date.now());
  };

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <RefreshCw className="w-12 h-12 text-blue-500 animate-spin" />
      </div>
    );
  }

  const criticalCells = data?.grid?.filter(c => c.status !== "Healthy") || [];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Navigation className="w-10 h-10 text-emerald-600" />
            Satellite Precision Optimizer
          </h1>
          <p className="text-slate-500 mt-1 font-medium text-lg">
            Sentinel-2 Multispectral Analysis: NDMI Moisture Stress Mapping
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white/80 backdrop-blur px-4 py-2 rounded-2xl shadow-sm border border-slate-100">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <span className="text-slate-600 font-bold text-sm flex items-center gap-2">
            Live Satellite Feed
            {refreshing && <RefreshCw className="w-3 h-3 animate-spin text-slate-400" />}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Map Integration */}
        <div className="lg:col-span-8 flex flex-col gap-6">
           <div className="bg-white p-6 rounded-[40px] shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
              <div className="flex items-center justify-between px-2 py-3 mb-4">
                 <h3 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                    NDMI Heat Intensity
                    <span className="text-xs bg-emerald-100 text-emerald-700 font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">Satellite Heatmap Overlay</span>
                 </h3>
              </div>
              
              <FarmMapSelector 
                 onBboxChange={handleBboxChange}
                 heatmap={data?.heatmap}
                 heatmapBbox={data?.bbox}
                 grid={data?.grid}
                 onCellClick={setSelectedCell}
                 missionActive={missionActive}
                 onMissionFinish={() => setMissionActive(false)}
                 onMissionStatus={setMissionStatus}
                 center={center}
                 onCenterChange={handleCenterChange}
                 onSearchComplete={handleSearchComplete}
                 onPolygonChange={handlePolygonChange}
onMissionProgress={setMissionProgress}
                 areaScale={data?.parcel?.areaScale}
              />

              {/* Legend with Fix for JSX Error */}
              <div className="mt-6 flex flex-col gap-4 bg-slate-50 p-6 rounded-3xl border border-slate-100">
                 <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Moisture Stress Scale (NDMI Index):</p>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                       <div className="w-3 h-3 rounded-full bg-emerald-500" />
                       <span className="text-xs font-bold text-slate-600">Healthy (&gt; 0.3)</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <div className="w-3 h-3 rounded-full bg-amber-500" />
                       <span className="text-xs font-bold text-slate-600">Moderate (-0.1 to 0.3)</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <div className="w-3 h-3 rounded-full bg-red-500" />
                       <span className="text-xs font-bold text-slate-600">Critical (&lt; -0.1)</span>
                    </div>
                 </div>
              </div>
           </div>

           {/* Drone Mission Command Console */}
           <div className="bg-slate-900 p-10 rounded-[48px] shadow-2xl border border-white/5 relative overflow-hidden group">
              <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full group-hover:bg-emerald-500/20 transition-all duration-1000" />
              
              <div className="relative z-10 flex flex-col lg:flex-row gap-12">
                 {/* Left: Mission Action */}
                 <div className="flex-1 space-y-8">
                    <div className="flex items-center gap-4">
                       <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                          <Wind className="text-emerald-400 w-8 h-8 animate-pulse" />
                       </div>
                       <div>
                          <h3 className="text-white font-black text-3xl tracking-tight">Drone Command Center</h3>
                          <div className="flex items-center gap-2 mt-1">
                             <div className={`w-2 h-2 rounded-full ${missionActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`} />
                             <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">{missionActive ? 'Mission Live' : 'System Ready'}</p>
                          </div>
                       </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                       <div className="bg-white/5 p-6 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors">
                          <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-2">Red Zones Targeted</p>
                          <p className="text-4xl font-black text-white">{missionActive ? missionProgress.targets : criticalCells.length}</p>
                       </div>
                       <div className="bg-white/5 p-6 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors">
                          <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-2">Mission ETA</p>
                          <p className="text-4xl font-black text-white">
                             {missionActive ? (missionProgress.eta > 60 ? `${Math.floor(missionProgress.eta / 60)}m ${missionProgress.eta % 60}s` : `${missionProgress.eta}s`) : '--'}
                          </p>
                       </div>
                    </div>
                 </div>

                 {/* Right: Telemetry & Controls */}
                 <div className="lg:w-1/3 flex flex-col gap-6">
                    <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-sm">
                       <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-3 flex items-center gap-2">
                          <Zap className="w-3 h-3" /> Telemetry Status
                       </p>
                       <div className="text-emerald-400 font-mono font-bold text-sm tracking-tight overflow-hidden text-ellipsis whitespace-nowrap">
                          {missionStatus}
                       </div>
                    </div>
                    <button 
                      onClick={() => setMissionActive(true)}
                      disabled={missionActive || criticalCells.length === 0}
                      className={`w-full py-6 font-black rounded-[24px] transition-all flex items-center justify-center gap-3 disabled:opacity-50 ${missionActive ? "bg-slate-800 text-slate-500" : "bg-emerald-500 text-slate-900 hover:bg-emerald-400 shadow-xl shadow-emerald-500/20 active:scale-95"}`}
                    >
                      {missionActive ? (
                        <>
                          <RefreshCw className="w-6 h-6 animate-spin" />
                          IN FLIGHT
                        </>
                      ) : (
                        <>
                          <Navigation className="w-6 h-6" />
                          LAUNCH AUTONOMOUS MISSION
                        </>
                      )}
                    </button>
                 </div>
              </div>
           </div>
        </div>

        {/* Right Column: Resource Dashboard */}
        <div className="lg:col-span-4 flex flex-col gap-6">
           <div className="bg-white p-8 rounded-[40px] shadow-xl border border-slate-100">
              <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
                 <AlertTriangle className="text-amber-500" />
                 Actionable Insights
              </h3>
              <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                 {criticalCells.map((cell, i) => (
                   <div key={i} onClick={() => setSelectedCell(cell)} className="p-5 bg-slate-50 rounded-3xl border border-transparent hover:border-red-200 cursor-pointer transition-all">
                      <div className="flex items-center justify-between mb-2">
                         <span className="font-black text-slate-900">{cell.id}</span>
                         <span className="text-[10px] font-black bg-red-100 text-red-600 px-2 py-0.5 rounded-full">CRITICAL</span>
                      </div>
                      <p className="text-sm font-bold text-slate-500 mb-3">{cell.recommendations[0]}</p>
                      <div className="flex items-center gap-3 opacity-60">
                         <div className="flex items-center gap-1 text-[11px] font-bold"><Droplets className="w-3 h-3" /> {cell.needs.water.toFixed(1)}L</div>
                         <div className="flex items-center gap-1 text-[11px] font-bold"><Zap className="w-3 h-3" /> {cell.needs.n.toFixed(1)}g N</div>
                      </div>
                   </div>
                 ))}
                 {criticalCells.length === 0 && (
                   <div className="text-center py-12 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                      <p className="text-slate-400 font-bold">Field status is optimal.</p>
                   </div>
                 )}
              </div>
           </div>

            <div className="bg-slate-900 p-8 rounded-[40px] text-white shadow-2xl flex flex-col gap-8">
               <div>
                  <div className="flex items-center justify-between mb-4">
                     <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Farm Stats Summary</p>
                     <span className="text-[10px] font-black bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
                        {data?.parcel?.areaScale || 1.0} HECTARES
                     </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                       <p className="text-[9px] font-black uppercase text-blue-400 mb-1 leading-none">Total Water</p>
                       <p className="text-2xl font-black">{data?.summary.totalWater}L</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                       <p className="text-[9px] font-black uppercase text-emerald-400 mb-1 leading-none">Total Nitrogen</p>
                       <p className="text-2xl font-black">{data?.summary.totalNitrogen}g</p>
                    </div>
                 </div>
              </div>

              <div className="pt-8 border-t border-white/10">
                 <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-4">Satellite Node Status</p>
                 <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                       <div className="flex items-center gap-3"><CloudRain className="text-blue-400" /> <span className="font-bold">Humidity</span></div>
                       <span className="font-black">{data?.weather.humidity}%</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                       <div className="flex items-center gap-3"><Thermometer className="text-orange-400" /> <span className="font-bold">Crop Temp</span></div>
                       <span className="font-black">{Math.round(data?.weather.temp || 0)}°C</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default PrecisionFarmingSatellite;
