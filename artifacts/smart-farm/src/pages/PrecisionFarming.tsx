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
  Download,
  Crosshair,
  Satellite,
  Activity,
  ShieldAlert,
  FlaskConical,
  LocateFixed
} from "lucide-react";
import FarmMapSelector from "../components/FarmMapSelector";

interface GridCell {
  id: string;
  status: string;
  color: string;
  totalStress: number;
  diseaseRisk: number;
  needs: {
    water: number;
    n: number;
    p: number;
    k: number;
    pesticide: number;
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
  grid: GridCell[];
  parcel: {
    center: [number, number];
    boundary: number[];
  };
  heatmap: string | null;
  bbox: number[];
  summary: {
    totalWater: number;
    totalNitrogen: number;
    totalPhosphorous: number;
    totalPotassium: number;
    totalPesticide: number;
    criticalSquares: number;
    moderateSquares: number;
    healthySquares: number;
  };
}

const PrecisionFarming: React.FC = () => {
  const [data, setData] = useState<PrecisionData | null>(null);
  const [bbox, setBbox] = useState<number[]>([73.91, 20.08, 73.92, 20.09]); // Nashik Default
  const [center, setCenter] = useState<[number, number]>([20.0485, 74.1200]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCell, setSelectedCell] = useState<GridCell | null>(null);
  const [missionActive, setMissionActive] = useState(false);
  const [missionStatus, setMissionStatus] = useState("System Ready");
  const [isLiveMode, setIsLiveMode] = useState(false);
  const [urbanNotice, setUrbanNotice] = useState(false);
  const [lastSearchTime, setLastSearchTime] = useState<number>(0);
  const [polygon, setPolygon] = useState<any>(null);
  const [missionProgress, setMissionProgress] = useState<{ eta: number, targets: number }>({ eta: 0, targets: 0 });
  const [isMatching, setIsMatching] = useState(false);
  const [confidence, setConfidence] = useState<"High" | "Medium" | "Low" | null>(null);
  const [matchSource, setMatchSource] = useState<"Satellite" | "Document Assisted">("Satellite");

  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setIsMatching(true);
    setMatchSource("Document Assisted");
    
    // Simulate Document Analysis & High-Precision Boundary Extraction
    await new Promise(r => setTimeout(r, 2500));
    
    // Generate a very specific, irregular "Extracted Shape" to simulate OCR/CV results
    const [lat, lon] = center;
    const extractedShape: number[][] = [
       [lat - 0.0006, lon - 0.0007],
       [lat + 0.0005, lon - 0.0008],
       [lat + 0.0009, lon + 0.0004],
       [lat + 0.0002, lon + 0.0009],
       [lat - 0.0007, lon + 0.0006],
       [lat - 0.0006, lon - 0.0007]
    ];
    
    setPolygon(extractedShape);
    setConfidence("High");
    setIsMatching(false);
  };

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

  const handleBboxChange = (newBbox: number[]) => {
    setBbox(newBbox);
  };

  const handlePolygonChange = (newPolygon: any) => {
    setPolygon(newPolygon);
  };

  const handleCenterChange = (newCenter: [number, number]) => {
    setCenter(newCenter);
  };

  const toggleLiveLocation = () => {
    if (!isLiveMode) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            try {
              // Check if urban via reverse geocoding
              const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`);
              const loc = await res.json();
              
              // More comprehensive agricultural tags
              const agTags = ['farmland', 'rural', 'village', 'orchard', 'vineyard', 'farm', 'meadow', 'grass', 'allotments', 'agriculture', 'farmyard'];
              const urbanTags = ['city', 'town', 'suburb'];
              
              const isFarmland = agTags.some(tag => loc.address && loc.address[tag]);
              const isUrban = urbanTags.some(tag => loc.address && loc.address[tag]);

              if (isUrban && !isFarmland) {
                  setUrbanNotice(true);
                  setTimeout(() => setUrbanNotice(false), 5000);
                  // Allow analysis anyway, but as "Simulated Parcel"
                  setCenter([latitude, longitude]);
                  setIsLiveMode(true);
              } else {
                  setCenter([latitude, longitude]);
                  setIsLiveMode(true);
              }
            } catch (err) {
              console.error("Reverse geocoding failed, allowing simulation mode", err);
              setCenter([latitude, longitude]);
              setIsLiveMode(true);
            }
          },
          (error) => {
            console.error("Geolocation error", error);
            alert("Please enable location services to use live farm mode.");
          }
        );
      }
    } else {
      setIsLiveMode(false);
      setCenter([20.0815, 73.9174]); // Back to Nashik Demo
    }
  };

  if (loading && !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white gap-4">
        <Activity className="w-12 h-12 text-emerald-500 animate-pulse" />
        <p className="font-mono text-sm tracking-widest uppercase opacity-50">Initializing Satellite Uplink...</p>
      </div>
    );
  }

  const criticalCells = data?.grid?.filter(c => c.status === "Critical") || [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-6 lg:p-8 selection:bg-emerald-500/30">
      {/* Top Navigation HUD */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8 border-b border-white/5 pb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-extrabold text-white tracking-tighter flex items-center gap-3">
              <Satellite className="w-8 h-8 text-emerald-400" />
              AGRI-OPTIX <span className="text-emerald-500 font-light underline decoration-emerald-500/30 underline-offset-4">PRO</span>
            </h1>
            <div className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded text-[10px] font-black text-emerald-400 tracking-widest uppercase">
              Precision Optimized
            </div>
          </div>
          <p className="text-slate-500 font-medium text-sm">Automated Precision Farming & Resource Intelligence v4.0</p>
        </div>

        <div className="flex items-center gap-4">
           {urbanNotice && (
              <div className="flex items-center gap-2 bg-orange-500/20 border border-orange-500/30 text-orange-400 px-4 py-2 rounded-xl text-xs font-bold animate-in slide-in-from-top duration-300">
                 <ShieldAlert className="w-4 h-4" />
                 NO FARMLAND DETECTED. SWITCHING TO DEMO MODE.
              </div>
           )}
           
           <button 
              onClick={toggleLiveLocation}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-black text-xs tracking-widest uppercase transition-all border ${isLiveMode ? 'bg-emerald-500 text-white border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10'}`}
           >
              <LocateFixed className="w-4 h-4" />
              {isLiveMode ? "LIVE GPS ACTIVE" : "ENABLE LIVE FARM MODE"}
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
        {/* Left: Tactical Map HUD */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[40px] overflow-hidden flex flex-col flex-1 relative group">
             <div className="p-6 pb-0 flex items-center justify-between relative z-10">
                <div className="flex flex-col">
                   <h3 className="text-xl font-black text-white flex items-center gap-2">
                       <Crosshair className="w-5 h-5 text-emerald-500" />
                       TERRAIN ANALYSIS
                   </h3>
                   <div className="flex items-center gap-2 mt-1">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <p className="text-[10px] font-mono text-slate-500 tracking-tighter uppercase">Scanning Multi-Spectral Band Sentinel-2</p>
                   </div>
                </div>
                
                <div className="flex items-center gap-4">
                    {/* Plot Verification Hub */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-2 px-4 flex items-center gap-4">
                       <div className="flex flex-col">
                          <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Parcel Confidence</p>
                          <div className="flex items-center gap-2">
                             <div className={`w-1.5 h-1.5 rounded-full ${confidence === 'High' ? 'bg-emerald-500' : confidence === 'Medium' ? 'bg-amber-500' : 'bg-red-500'}`} />
                             <span className="text-[10px] font-black text-white uppercase">{confidence || 'Unknown'}</span>
                          </div>
                       </div>
                       <div className="h-6 w-px bg-white/10" />
                       <label className="flex items-center gap-2 cursor-pointer group">
                          <input type="file" className="hidden" onChange={handleDocumentUpload} />
                          <div className="p-2 bg-emerald-500/10 rounded-lg group-hover:bg-emerald-500/20 transition-colors">
                             {isMatching ? <RefreshCw className="w-3 h-3 text-emerald-400 animate-spin" /> : <Download className="w-3 h-3 text-emerald-400" />}
                          </div>
                          <div className="flex flex-col">
                             <span className="text-[9px] font-black text-white uppercase leading-none">Upload Plot Doc</span>
                             <span className="text-[8px] font-bold text-slate-500 uppercase">{matchSource}</span>
                          </div>
                       </label>
                    </div>

                    <div className="text-right hidden sm:block">
                       <p className="text-[9px] font-black text-slate-500 uppercase">Field Area</p>
                       <p className="text-sm font-black text-white">{data?.parcel?.areaScale ? `${data.parcel.areaScale.toFixed(2)} HECTARE` : '1.0 HECTARE'}</p>
                    </div>
                </div>
             </div>
             
             <div className="p-6 h-full min-h-[500px]">
                <FarmMapSelector 
                   onBboxChange={handleBboxChange}
                   grid={data?.grid}
                   onCellClick={(cell) => setSelectedCell(cell)}
                   missionActive={missionActive}
                   onMissionFinish={() => setMissionActive(false)}
                   onMissionStatus={setMissionStatus}
                   onPolygonChange={handlePolygonChange}
                   onMissionProgress={setMissionProgress}
                   areaScale={data?.parcel?.areaScale}
                   center={center}
                   onCenterChange={handleCenterChange} 
                   confidence={confidence} 
                   sizeHint="small"
                   polygon={polygon}
                />
             </div>

             {/* Map Footer HUD */}
             <div className="p-4 bg-black/40 border-t border-white/5 flex justify-between items-center px-8">
                <div className="flex gap-6">
                   <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                      <span className="text-[10px] font-black text-slate-400">OPTIMAL</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                      <span className="text-[10px] font-black text-slate-400">MODERATE</span>
                   </div>
                   <div className="flex items-center gap-2 text-red-500">
                      <div className="w-3 h-3 rounded bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                      <span className="text-[10px] font-black">CRITICAL</span>
                   </div>
                </div>
                <div className="font-mono text-[10px] text-slate-500 tracking-tighter">
                   PARCEL COORDINATES: {center[0].toFixed(4)}N / {center[1].toFixed(4)}E
                </div>
             </div>
          </div>

          {/* Bottom HUD: Drone Command Console */}
          <div className="bg-slate-900/60 backdrop-blur-2xl border border-white/5 rounded-[40px] p-8 flex flex-col md:flex-row items-center gap-10">
             <div className="flex-1 space-y-4 w-full">
                <div className="flex items-center justify-between">
                   <h4 className="text-white font-black text-lg flex items-center gap-3">
                      <Navigation className="w-6 h-6 text-emerald-500" />
                      DRONE COMMAND CENTER
                   </h4>
                   <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-black tracking-widest uppercase">
                      READY FOR DEPLOYMENT
                   </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                   <div className="bg-white/5 border border-white/5 p-4 rounded-3xl">
                      <p className="text-[9px] font-black text-slate-500 uppercase mb-1">Red Zones Targeted</p>
                      <p className="text-2xl font-black text-white">{missionActive ? missionProgress.targets : criticalCells.length}</p>
                   </div>
                   <div className="bg-white/5 border border-white/5 p-4 rounded-3xl">
                      <p className="text-[9px] font-black text-slate-500 uppercase mb-1">Mission ETA</p>
                      <p className="text-2xl font-black text-white">
                          {missionActive ? (missionProgress.eta > 60 ? `${Math.floor(missionProgress.eta / 60)}m` : `${missionProgress.eta}s`) : '--'}
                      </p>
                   </div>
                   <div className="bg-white/5 border border-white/5 p-4 rounded-3xl overflow-hidden relative">
                      <p className="text-[9px] font-black text-slate-500 uppercase mb-1 whitespace-nowrap">Telemetry Status</p>
                      <p className="text-xs font-bold text-emerald-400 font-mono italic flex items-center gap-2">
                         <div className={`w-2 h-2 rounded-full ${missionActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-700'}`} />
                         {missionStatus.toUpperCase()}
                      </p>
                   </div>
                </div>
             </div>

             <div className="w-full md:w-auto">
                 <button 
                   onClick={() => setMissionActive(true)}
                   disabled={missionActive || criticalCells.length === 0}
                   className={`w-full md:w-[240px] h-[80px] font-black rounded-3xl shadow-[0_10px_40px_rgba(16,185,129,0.3)] flex flex-col items-center justify-center transition-all group active:scale-95 ${missionActive ? 'bg-slate-800 text-slate-500' : 'bg-emerald-600 hover:bg-emerald-500 text-white'}`}
                 >
                    <Wind className={`w-8 h-8 mb-1 ${missionActive ? 'animate-spin' : 'group-hover:rotate-12 transition-transform'}`} />
                    <span className="text-[10px] tracking-widest uppercase">{missionActive ? 'Mission Active' : 'Launch Autonomous Mission'}</span>
                 </button>
             </div>
          </div>
        </div>

        {/* Right: Telemetry stack */}
        <div className="lg:col-span-4 flex flex-col gap-6">
           <div className="bg-slate-900/60 border border-white/5 rounded-[40px] p-8 space-y-8 flex-1">
              <div>
                 <div className="flex items-center justify-between mb-6">
                    <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Resource Matrix</p>
                    <RefreshCw className={`w-3 h-3 text-slate-600 ${refreshing ? 'animate-spin' : ''}`} />
                 </div>
                 
                 <div className="space-y-4">
                    <div className="bg-white/5 p-5 rounded-3xl border border-white/5 group hover:bg-white/10 transition-colors">
                       <div className="flex items-center justify-between mb-2">
                          <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Water Matrix Needed</p>
                          <Droplets className="w-4 h-4 text-blue-500" />
                       </div>
                       <div className="flex items-baseline gap-2">
                          <p className="text-4xl font-black text-white">{data?.summary.totalWater}</p>
                          <span className="text-xs font-bold text-slate-500">LITERS</span>
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div className="bg-white/5 p-4 rounded-3xl border border-white/5">
                          <p className="text-[9px] font-black text-emerald-400 uppercase mb-1">Nitrogen (N)</p>
                          <p className="text-2xl font-black text-white">{data?.summary.totalNitrogen}g</p>
                       </div>
                       <div className="bg-white/5 p-4 rounded-3xl border border-white/5">
                          <p className="text-[9px] font-black text-amber-400 uppercase mb-1">Phosphorus (P)</p>
                          <p className="text-2xl font-black text-white">{data?.summary.totalPhosphorous}g</p>
                       </div>
                       <div className="bg-white/5 p-4 rounded-3xl border border-white/5">
                          <p className="text-[9px] font-black text-indigo-400 uppercase mb-1">Potassium (K)</p>
                          <p className="text-2xl font-black text-white">{data?.summary.totalPotassium}g</p>
                       </div>
                       <div className="bg-white/5 p-4 rounded-3xl border border-white/5">
                          <p className="text-[9px] font-black text-purple-400 uppercase mb-1">Pesticide</p>
                          <p className="text-2xl font-black text-white">{data?.summary.totalPesticide}L</p>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="space-y-4 pt-8 border-t border-white/5">
                 <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-4">Parcel Environment</p>
                 <div className="flex items-center justify-between bg-white/5 p-4 rounded-2xl">
                    <div className="flex items-center gap-3">
                       <div className="p-2 bg-orange-500/10 rounded-lg text-orange-400"><Thermometer className="w-4 h-4" /></div>
                       <span className="text-sm font-bold">Temperature</span>
                    </div>
                    <span className="text-lg font-black text-white">{Math.round(data?.weather.temp || 0)}°C</span>
                 </div>
                 <div className="flex items-center justify-between bg-white/5 p-4 rounded-2xl">
                    <div className="flex items-center gap-3">
                       <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400"><Droplets className="w-4 h-4" /></div>
                       <span className="text-sm font-bold">Humidity</span>
                    </div>
                    <span className="text-lg font-black text-white">{data?.weather.humidity}%</span>
                 </div>
              </div>

              <div className="bg-emerald-600 rounded-[32px] p-8 text-white relative overflow-hidden group shadow-2xl shadow-emerald-500/20">
                 <div className="relative z-10 flex flex-col justify-between h-full">
                    <div className="flex justify-between items-start">
                       <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Parcel Health Score</p>
                       <Activity className="w-4 h-4 text-emerald-300" />
                    </div>
                    <div className="mt-4">
                       <h3 className="text-6xl font-black">{100 - Math.round(data?.weather.stressFactor || 0)}%</h3>
                       <p className="text-xs font-bold font-mono uppercase mt-2 opacity-80 tracking-tighter">Vitality Index Optimal</p>
                    </div>
                 </div>
                 <Zap size={140} className="absolute right-[-20px] bottom-[-20px] opacity-10 group-hover:scale-110 transition-transform duration-700" />
              </div>
           </div>

           {/* Alerts Log */}
           <div className="bg-slate-900/60 border border-white/5 rounded-[40px] p-8">
              <h4 className="text-white font-black mb-6 text-sm flex items-center gap-2">
                 <ShieldAlert className="w-4 h-4 text-red-500" />
                 REAL-TIME ANOMALY LOG
              </h4>
              <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                 {criticalCells.map(cell => (
                    <div 
                       key={cell.id} 
                       onClick={() => setSelectedCell(cell)}
                       className="p-4 bg-white/5 border-l-4 border-red-500 rounded-xl hover:bg-white/10 transition-all cursor-pointer group flex items-center justify-between"
                    >
                       <div>
                          <p className="text-[10x] font-black uppercase text-slate-500 leading-none mb-1">{cell.id}</p>
                          <p className="text-sm font-bold text-white uppercase tracking-tighter">{cell.recommendations[0]}</p>
                       </div>
                       <ChevronRight className="w-4 h-4 text-slate-600 group-hover:translate-x-1 transition-transform" />
                    </div>
                 ))}
                 {criticalCells.length === 0 && (
                    <div className="text-center py-10">
                       <CheckCircle2 className="w-10 h-10 text-emerald-500/20 mx-auto mb-2" />
                       <p className="text-xs font-bold text-slate-600 uppercase tracking-widest">No anomalies detected</p>
                    </div>
                 )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default PrecisionFarming;
