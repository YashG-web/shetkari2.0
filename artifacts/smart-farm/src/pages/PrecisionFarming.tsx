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
import { AppLayout } from "@/components/layout/AppLayout";
import { useTranslation } from "@/lib/translations";

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
    areaScale?: number;
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
  const tr = useTranslation();
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

  const handleBboxChange = (newBbox: number[]) => setBbox(newBbox);
  const handlePolygonChange = (newPolygon: any) => setPolygon(newPolygon);
  const handleCenterChange = (newCenter: [number, number]) => setCenter(newCenter);

  const toggleLiveLocation = () => {
    if (!isLiveMode) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            try {
              const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`);
              const loc = await res.json();
              
              const agTags = ['farmland', 'rural', 'village', 'orchard', 'vineyard', 'farm', 'meadow', 'grass', 'allotments', 'agriculture', 'farmyard'];
              const urbanTags = ['city', 'town', 'suburb'];
              
              const isFarmland = agTags.some(tag => loc.address && loc.address[tag]);
              const isUrban = urbanTags.some(tag => loc.address && loc.address[tag]);

              if (isUrban && !isFarmland) {
                  setUrbanNotice(true);
                  setTimeout(() => setUrbanNotice(false), 5000);
                  setCenter([latitude, longitude]);
                  setIsLiveMode(true);
              } else {
                  setCenter([latitude, longitude]);
                  setIsLiveMode(true);
              }
            } catch (err) {
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
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <Activity className="w-12 h-12 text-primary animate-pulse" />
          <p className="font-mono text-sm tracking-widest uppercase opacity-50">{tr('status.loading')}</p>
        </div>
      </AppLayout>
    );
  }

  const criticalCells = data?.grid?.filter(c => c.status === "Critical") || [];

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Top Navigation HUD / Header */}
        <div className="flex flex-col lg:flex-row justify-end items-start lg:items-center gap-6 mb-6">
          <div className="flex items-center gap-4">
             {urbanNotice && (
                <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-600 px-4 py-2 rounded-xl text-xs font-bold animate-in slide-in-from-top duration-300 shadow-sm">
                   <ShieldAlert className="w-4 h-4" />
                   {tr('pf.no_farmland_detected')}
                </div>
             )}
             
             <button 
                onClick={toggleLiveLocation}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs tracking-widest uppercase transition-all border ${isLiveMode ? 'bg-primary text-white border-primary shadow-lg shadow-primary/30' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 shadow-sm'}`}
             >
                <LocateFixed className="w-4 h-4" />
                {isLiveMode ? tr('pf.live_gps_active') : tr('pf.enable_live_farm')}
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
          {/* Left: Tactical Map HUD */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="glass-card bg-white/50 backdrop-blur-xl border border-primary/10 rounded-[40px] overflow-hidden flex flex-col relative group shadow-sm">
               <div className="p-6 pb-0 flex items-center justify-between relative z-10">
                  <h2 className="text-2xl font-bold text-slate-900">
                      {tr('pf.my_field')}
                  </h2>
                  <div className="flex items-center gap-4">
                      {/* Plot Verification Hub */}
                      <div className="bg-white/80 border border-primary/10 rounded-2xl p-2 px-4 flex items-center gap-4 shadow-sm">
                         <div className="flex flex-col">
                            <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">{tr('pf.parcel_confidence')}</p>
                            <div className="flex items-center gap-2">
                               <div className={`w-1.5 h-1.5 rounded-full ${confidence === 'High' ? 'bg-primary' : confidence === 'Medium' ? 'bg-amber-500' : 'bg-red-500'}`} />
                               <span className="text-[10px] font-extrabold text-slate-700 uppercase">{confidence ? tr(`pf.${confidence.toLowerCase()}`) : tr('pf.unknown')}</span>
                            </div>
                         </div>
                         <div className="h-6 w-px bg-slate-200" />
                         <label className="flex items-center gap-2 cursor-pointer group">
                            <input type="file" className="hidden" onChange={handleDocumentUpload} />
                            <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                               {isMatching ? <RefreshCw className="w-3 h-3 text-primary animate-spin" /> : <Download className="w-3 h-3 text-primary" />}
                            </div>
                            <div className="flex flex-col">
                               <span className="text-[9px] font-extrabold text-slate-700 uppercase leading-none">{tr('pf.upload_plot_doc')}</span>
                               <span className="text-[8px] font-bold text-slate-500 uppercase">{matchSource === 'Satellite' ? tr('pf.satellite') : tr('pf.doc_assisted')}</span>
                            </div>
                         </label>
                      </div>

                      <div className="text-right hidden sm:block">
                         <p className="text-[9px] font-bold text-slate-500 uppercase">{tr('pf.field_area')}</p>
                         <p className="text-sm font-extrabold text-slate-900">{data?.parcel?.areaScale ? `${data.parcel.areaScale.toFixed(2)} ${tr('pf.hectare')}` : `1.0 ${tr('pf.hectare')}`}</p>
                      </div>
                  </div>
               </div>
               
               <div className="px-6 pb-6 pt-4">
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
               <div className="p-4 bg-slate-50 border-t border-primary/5 flex justify-between items-center px-8">
                  <div className="flex gap-6">
                     <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-primary shadow-sm shadow-primary/30" />
                        <span className="text-[10px] font-bold text-slate-600 uppercase">{tr('pf.optimal')}</span>
                     </div>
                     <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-amber-500 shadow-sm shadow-amber-500/30" />
                        <span className="text-[10px] font-bold text-slate-600 uppercase">{tr('pf.moderate')}</span>
                     </div>
                     <div className="flex items-center gap-2 text-red-500">
                        <div className="w-3 h-3 rounded bg-red-500 shadow-sm shadow-red-500/30" />
                        <span className="text-[10px] font-bold uppercase">{tr('pf.critical')}</span>
                     </div>
                  </div>
                  <div className="font-mono text-[10px] font-bold text-slate-500 tracking-tighter uppercase">
                     {tr('pf.parcel_coordinates')}: {center[0].toFixed(4)}N / {center[1].toFixed(4)}E
                  </div>
               </div>
            </div>

            {/* Bottom HUD: Drone Command Console */}
            <div className="glass-card bg-white/60 border border-primary/10 rounded-[40px] p-8 flex flex-col md:flex-row items-center gap-10 shadow-sm">
               <div className="flex-1 space-y-4 w-full">
                  <div className="flex items-center justify-between">
                     <h4 className="text-slate-900 font-extrabold text-lg flex items-center gap-3">
                        <Navigation className="w-6 h-6 text-primary" />
                        {tr('pf.drone_command')}
                     </h4>
                     <div className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary rounded-full text-[10px] font-bold tracking-widest uppercase">
                        {tr('pf.ready_for_deployment')}
                     </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                     <div className="bg-white/80 border border-primary/5 p-4 rounded-3xl shadow-sm">
                        <p className="text-[9px] font-bold text-slate-500 uppercase mb-1">{tr('pf.red_zones')}</p>
                        <p className="text-2xl font-black text-slate-900">{missionActive ? missionProgress.targets : criticalCells.length}</p>
                     </div>
                     <div className="bg-white/80 border border-primary/5 p-4 rounded-3xl shadow-sm">
                        <p className="text-[9px] font-bold text-slate-500 uppercase mb-1">{tr('pf.mission_eta')}</p>
                        <p className="text-2xl font-black text-slate-900">
                            {missionActive ? (missionProgress.eta > 60 ? `${Math.floor(missionProgress.eta / 60)}m` : `${missionProgress.eta}s`) : '--'}
                        </p>
                     </div>
                     <div className="bg-white/80 border border-primary/5 p-4 rounded-3xl overflow-hidden relative shadow-sm">
                        <p className="text-[9px] font-bold text-slate-500 uppercase mb-1 whitespace-nowrap">{tr('pf.telemetry_status')}</p>
                        <p className="text-xs font-bold text-primary font-mono italic flex items-center gap-2">
                           <div className={`w-2 h-2 rounded-full ${missionActive ? 'bg-primary animate-pulse' : 'bg-slate-300'}`} />
                           {missionStatus.toUpperCase()}
                        </p>
                     </div>
                  </div>
               </div>

               <div className="w-full md:w-auto">
                   <button 
                     onClick={() => setMissionActive(true)}
                     disabled={missionActive || criticalCells.length === 0}
                     className={`w-full md:w-[240px] h-[80px] font-black rounded-3xl shadow-lg flex flex-col items-center justify-center transition-all group active:scale-95 ${missionActive ? 'bg-slate-100 text-slate-400 shadow-none border border-slate-200' : 'bg-primary hover:bg-primary/90 text-white shadow-primary/30'}`}
                   >
                      <Wind className={`w-8 h-8 mb-1 ${missionActive ? 'animate-spin' : 'group-hover:rotate-12 transition-transform'}`} />
                      <span className="text-[10px] tracking-widest uppercase">{missionActive ? tr('pf.mission_active') : tr('pf.launch_mission')}</span>
                   </button>
               </div>
            </div>
          </div>

          {/* Right: Telemetry stack */}
          <div className="lg:col-span-4 flex flex-col gap-6">
             <div className="glass-card bg-white/60 border border-primary/10 rounded-[40px] p-8 space-y-8 flex-1 shadow-sm">
                <div>
                   <div className="flex items-center justify-between mb-6">
                      <p className="text-[10px] font-bold uppercase text-slate-500 tracking-widest">{tr('pf.resource_matrix')}</p>
                      <RefreshCw className={`w-3 h-3 text-slate-400 ${refreshing ? 'animate-spin' : ''}`} />
                   </div>
                   
                   <div className="space-y-4">
                      <div className="bg-white p-5 rounded-3xl border border-primary/5 shadow-sm group hover:border-primary/20 transition-colors">
                         <div className="flex items-center justify-between mb-2">
                            <p className="text-[9px] font-bold text-blue-500 uppercase tracking-widest">{tr('pf.water_matrix')}</p>
                            <Droplets className="w-4 h-4 text-blue-500" />
                         </div>
                         <div className="flex items-baseline gap-2">
                            <p className="text-4xl font-black text-slate-900">{data?.summary.totalWater}</p>
                            <span className="text-xs font-bold text-slate-500 uppercase">{tr('pf.liters')}</span>
                         </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                         <div className="bg-white p-4 rounded-3xl border border-primary/5 shadow-sm">
                            <p className="text-[9px] font-bold text-primary uppercase mb-1">{tr('pf.nitrogen')}</p>
                            <p className="text-2xl font-black text-slate-900">{data?.summary.totalNitrogen}g</p>
                         </div>
                         <div className="bg-white p-4 rounded-3xl border border-primary/5 shadow-sm">
                            <p className="text-[9px] font-bold text-amber-500 uppercase mb-1">{tr('pf.phosphorus')}</p>
                            <p className="text-2xl font-black text-slate-900">{data?.summary.totalPhosphorous}g</p>
                         </div>
                         <div className="bg-white p-4 rounded-3xl border border-primary/5 shadow-sm">
                            <p className="text-[9px] font-bold text-indigo-500 uppercase mb-1">{tr('pf.potassium')}</p>
                            <p className="text-2xl font-black text-slate-900">{data?.summary.totalPotassium}g</p>
                         </div>
                         <div className="bg-white p-4 rounded-3xl border border-primary/5 shadow-sm">
                            <p className="text-[9px] font-bold text-purple-500 uppercase mb-1">{tr('pf.pesticide')}</p>
                            <p className="text-2xl font-black text-slate-900">{data?.summary.totalPesticide}L</p>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="space-y-4 pt-8 border-t border-primary/10">
                   <p className="text-[10px] font-bold uppercase text-slate-500 tracking-widest mb-4">{tr('pf.parcel_env')}</p>
                   <div className="flex items-center justify-between bg-white border border-primary/5 p-4 rounded-2xl shadow-sm">
                      <div className="flex items-center gap-3">
                         <div className="p-2 bg-orange-500/10 rounded-lg text-orange-500"><Thermometer className="w-4 h-4" /></div>
                         <span className="text-sm font-bold text-slate-700">{tr('pf.temperature')}</span>
                      </div>
                      <span className="text-lg font-black text-slate-900">{Math.round(data?.weather.temp || 0)}°C</span>
                   </div>
                   <div className="flex items-center justify-between bg-white border border-primary/5 p-4 rounded-2xl shadow-sm">
                      <div className="flex items-center gap-3">
                         <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500"><Droplets className="w-4 h-4" /></div>
                         <span className="text-sm font-bold text-slate-700">{tr('pf.humidity')}</span>
                      </div>
                      <span className="text-lg font-black text-slate-900">{data?.weather.humidity}%</span>
                   </div>
                </div>

                <div className="bg-gradient-to-br from-primary to-emerald-600 rounded-[32px] p-8 text-white relative overflow-hidden group shadow-xl shadow-primary/20">
                   <div className="relative z-10 flex flex-col justify-between h-full">
                      <div className="flex justify-between items-start">
                         <p className="text-[10px] font-bold uppercase tracking-widest text-white/80">{tr('pf.health_score')}</p>
                         <Activity className="w-4 h-4 text-white" />
                      </div>
                      <div className="mt-4">
                         <h3 className="text-6xl font-black">{100 - Math.round(data?.weather.stressFactor || 0)}%</h3>
                         <p className="text-xs font-bold font-mono uppercase mt-2 text-white/90 tracking-tighter">{tr('pf.vitality_index')}</p>
                      </div>
                   </div>
                   <Zap size={140} className="absolute right-[-20px] bottom-[-20px] opacity-20 group-hover:scale-110 transition-transform duration-700" />
                </div>
             </div>

             {/* Alerts Log */}
             <div className="glass-card bg-white/60 border border-primary/10 rounded-[40px] p-8 shadow-sm">
                <h4 className="text-slate-900 font-extrabold mb-6 text-sm flex items-center gap-2 uppercase">
                   <ShieldAlert className="w-4 h-4 text-red-500" />
                   {tr('pf.anomaly_log')}
                </h4>
                <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                   {criticalCells.map(cell => (
                      <div 
                         key={cell.id} 
                         onClick={() => setSelectedCell(cell)}
                         className="p-4 bg-white border border-primary/5 border-l-4 border-l-red-500 rounded-xl hover:border-red-200 transition-all cursor-pointer group flex items-center justify-between shadow-sm"
                      >
                         <div>
                            <p className="text-[10x] font-bold uppercase text-slate-500 leading-none mb-1">{cell.id}</p>
                            <p className="text-sm font-bold text-slate-900 uppercase tracking-tighter">{cell.recommendations[0]}</p>
                         </div>
                         <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform group-hover:text-primary" />
                      </div>
                   ))}
                   {criticalCells.length === 0 && (
                      <div className="text-center py-10 bg-white rounded-2xl border border-primary/5">
                         <CheckCircle2 className="w-10 h-10 text-primary/30 mx-auto mb-2" />
                         <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{tr('pf.no_anomalies')}</p>
                      </div>
                   )}
                </div>
             </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default PrecisionFarming;
