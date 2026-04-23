import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, ImageOverlay, useMap, Rectangle, Popup, Marker, Circle, Polygon, GeoJSON } from "react-leaflet";
import L from "leaflet";
import * as turf from '@turf/turf';
import { Search, Map as MapIcon, Crosshair, Zap, Droplets, FlaskConical, Target, RefreshCw, Square, Hexagon, Trash2, MousePointer2 } from "lucide-react";

// --- Leaflet Fix for Icons ---
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const droneIcon = L.icon({
  iconUrl: '/agri-drone.png',
  iconSize: [60, 60],
  iconAnchor: [30, 30],
  className: 'drone-flying'
});

import { generateSmartGridCells } from "../lib/geospatial-utils";

interface FarmMapSelectorProps {
  onBboxChange: (bbox: number[]) => void;
  heatmap?: string | null;
  heatmapBbox?: number[];
  grid?: any[];
  onCellClick?: (cell: any) => void;
  missionActive?: boolean;
  onMissionFinish?: () => void;
  onMissionStatus?: (status: string) => void;
  center?: [number, number];
  onCenterChange?: (center: [number, number]) => void;
  onSearchComplete?: () => void;
  onPolygonChange?: (polygon: number[][]) => void;
  onMissionProgress?: (progress: { eta: number, targets: number }) => void;
  areaScale?: number;
  isLive?: boolean;
  sizeHint?: 'small' | 'large';
  confidence?: 'High' | 'Medium' | 'Low' | null;
  polygon?: number[][];
}

const FarmMapSelector: React.FC<FarmMapSelectorProps> = ({ 
  onBboxChange, 
  heatmap, 
  heatmapBbox, 
  grid: externalGrid, 
  onCellClick,
  missionActive,
  onMissionFinish,
  onMissionStatus,
  center: initialCenter,
  onCenterChange,
  onSearchComplete,
  onPolygonChange,
  onMissionProgress,
  areaScale,
  isLive,
  sizeHint = 'small',
  confidence,
  polygon: externalPolygon
}) => {
  const [center, setCenter] = useState<[number, number]>(initialCenter || [20.0485, 74.1200]); // Sinnar Farm Zone
  const [bbox, setBbox] = useState<number[]>([]);
  const [parcelBoundary, setParcelBoundary] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [internalGrid, setInternalGrid] = useState<any[]>([]);
  const [internalAreaScale, setInternalAreaScale] = useState<number | null>(null);
  
  // Selection Mode State
  const [selectionMode, setSelectionMode] = useState<'idle' | 'rectangle' | 'polygon'>('idle');
  const [tempPolygon, setTempPolygon] = useState<L.LatLng[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);

  const prevCenterRef = useRef<[number, number] | undefined>(undefined);

  useEffect(() => {
    // If an external polygon is provided (e.g. from upload), prioritize it
    if (externalPolygon && externalPolygon.length > 0) {
       setParcelBoundary(externalPolygon);
       // Calculate center of external polygon
       const lats = externalPolygon.map(p => p[0]);
       const lons = externalPolygon.map(p => p[1]);
       const lat = (Math.min(...lats) + Math.max(...lats)) / 2;
       const lon = (Math.min(...lons) + Math.max(...lons)) / 2;
       setCenter([lat, lon]);
       
       // Update bbox
       const newBbox = [Math.min(...lons), Math.min(...lats), Math.max(...lons), Math.max(...lats)];
       setBbox(newBbox);
       onBboxChange(newBbox);
       return;
    }

    if (!initialCenter) {
       setCenter([20.0485, 74.1200]);
       return;
    }

    const [lat, lon] = initialCenter;
    const [prevLat, prevLon] = prevCenterRef.current || [0, 0];
    
    if (Math.abs(lat - prevLat) > 0.00001 || Math.abs(lon - prevLon) > 0.00001) {
       prevCenterRef.current = initialCenter;
       setCenter([lat, lon]);
    }
  }, [initialCenter, externalPolygon]);

  // Sync internal grid with external data or generate default
  useEffect(() => {
    if (!parcelBoundary) return;

    const smartCells = generateSmartGridCells(parcelBoundary, 10);
    
    if (externalGrid && externalGrid.length > 0) {
       const enrichedCells = smartCells.map((cell, idx) => {
          const resourceTemplate = externalGrid[idx % externalGrid.length];
          return {
             ...cell,
             status: resourceTemplate.status,
             color: resourceTemplate.color,
             totalStress: resourceTemplate.totalStress,
             needs: resourceTemplate.needs,
             recommendations: resourceTemplate.recommendations
          };
       });
       setInternalGrid(enrichedCells);
    } else {
       // Fallback to default healthy grid
       setInternalGrid(smartCells);
    }
  }, [externalGrid, parcelBoundary]);

  const handleManualSelection = (feature: any) => {
    if (!feature || !feature.geometry) return;

    setParcelBoundary(feature);
    
    // Calculate bbox and area
    const bbox = turf.bbox(feature);
    setBbox(bbox);
    onBboxChange(bbox);

    const area = turf.area(feature);
    const hectareScale = area / 10000;
    setInternalAreaScale(hectareScale);

    // Extract flat coords for legacy support
    let flatCoords: [number, number][] = [];
    const geom = feature.geometry;
    if (geom && geom.coordinates) {
      if (geom.type === 'Polygon' && geom.coordinates[0]) {
        flatCoords = geom.coordinates[0].map((c: any) => [c[1], c[0]]);
      } else if (geom.type === 'MultiPolygon' && geom.coordinates[0] && geom.coordinates[0][0]) {
        flatCoords = geom.coordinates[0][0].map((c: any) => [c[1], c[0]]);
      }
    }
    if (onPolygonChange) onPolygonChange(flatCoords);
  };

  const handleSearch = async () => {
    if (!searchQuery || isSearching) return;
    setIsSearching(true);
    try {
      // 1. Try finding actual farmland first
      let res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=farmland+near+${searchQuery}+India&limit=5`);
      let data = await res.json();
      
      let bestResult = data.find((r: any) => 
        r.type === 'farmland' || 
        r.type === 'farm' || 
        r.class === 'landuse' || 
        r.display_name.toLowerCase().includes('farm')
      );

      if (!bestResult) {
        const res2 = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}+India&limit=1`);
        const data2 = await res2.json();
        if (data2.length > 0) bestResult = data2[0];
      }

      if (bestResult) {
        const lat = parseFloat(bestResult.lat);
        const lon = parseFloat(bestResult.lon);
        setCenter([lat, lon]);
        if (onSearchComplete) onSearchComplete();
      }
    } catch (e) {
      console.error("Search failed", e);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full h-full min-h-[550px]">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search regional farmland (Punjab, Nashik, etc)..." 
            className="w-full pl-10 pr-4 py-3 bg-slate-900/40 backdrop-blur border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-white placeholder:text-slate-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <button 
          onClick={handleSearch}
          disabled={isSearching}
          className="px-6 py-3 bg-emerald-600 text-white font-black rounded-2xl hover:bg-emerald-500 transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-50"
        >
          {isSearching ? <RefreshCw className="w-4 h-4 animate-spin text-white" /> : <Crosshair className="w-4 h-4" />}
          ANALYSIS
        </button>
      </div>

      <div className="flex-1 rounded-[32px] overflow-hidden border-2 border-white/5 shadow-2xl relative z-0 min-h-[500px] bg-slate-950">
        <MapContainer 
          center={center} 
          zoom={18} 
          style={{ height: "500px", width: "100%" }} 
          zoomControl={false}
          scrollWheelZoom={false}
        >
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
          />

          <MapUpdater center={center} selectionMode={selectionMode} />
          
          <SelectionHandler 
            mode={selectionMode} 
            onComplete={(feature) => {
              handleManualSelection(feature);
              setSelectionMode('idle');
            }} 
          />

          {/* IRREGULAR Parcel Boundary */}
          {parcelBoundary && (
            <GeoJSON 
              key={`boundary-${center[0]}-${center[1]}`}
              data={parcelBoundary}
              style={{ 
                color: '#10b981', 
                weight: 6, 
                fillOpacity: 0.35, 
                fillColor: '#10b981', 
                className: 'farm-boundary-glow' 
              }}
            />
          )}

          {/* Smart Grid ONLY inside Polygon */}
          {internalGrid.length > 0 && (
            <PolygonGridOverlay grid={internalGrid} onCellClick={onCellClick} />
          )}

          {/* Intelligent Drone Mission */}
          {missionActive && internalGrid.length > 0 && (
            <DroneSimulator 
              bbox={bbox} 
              grid={internalGrid} 
              onFinish={onMissionFinish} 
              onStatus={onMissionStatus} 
              onProgress={onMissionProgress}
            />
          )}

          {/* Selection Toolbar */}
          <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
             <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl p-2 flex flex-col gap-2 shadow-2xl">
                <button 
                  onClick={() => setSelectionMode(selectionMode === 'rectangle' ? 'idle' : 'rectangle')}
                  className={`p-3 rounded-xl transition-all ${selectionMode === 'rectangle' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/40' : 'text-slate-400 hover:bg-white/5'}`}
                  title="Rectangle Select"
                >
                   <Square className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setSelectionMode(selectionMode === 'polygon' ? 'idle' : 'polygon')}
                  className={`p-3 rounded-xl transition-all ${selectionMode === 'polygon' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/40' : 'text-slate-400 hover:bg-white/5'}`}
                  title="Polygon Select"
                >
                   <Hexagon className="w-5 h-5" />
                </button>
                <div className="h-px bg-white/10 mx-2" />
                <button 
                  onClick={() => {
                    setParcelBoundary(null);
                    setInternalGrid([]);
                    setSelectionMode('idle');
                    setTempPolygon([]);
                  }}
                  className="p-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all"
                  title="Clear Selection"
                >
                   <Trash2 className="w-5 h-5" />
                </button>
             </div>
             
             {selectionMode !== 'idle' && (
                <div className="bg-emerald-500 text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg animate-pulse">
                   {selectionMode === 'rectangle' ? 'Drag to select area' : 'Click corners to draw'}
                </div>
             )}
          </div>

          <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-2 pointer-events-none">
             <div className="bg-slate-950/90 backdrop-blur rounded-xl p-3 text-white border border-white/10 shadow-2xl">
                <div className="flex items-center gap-2 mb-1">
                   <Target className="w-3 h-3 text-emerald-500" />
                   <p className="text-[10px] font-black uppercase opacity-60 leading-none">Smart Parcel Locked</p>
                </div>
                <p className="text-xs font-bold font-mono text-emerald-400">
                   {(internalAreaScale || areaScale) ? `${(internalAreaScale || areaScale)?.toFixed(2)} HECTARE PLOT` : 'DETECTING FULL PLOT...'}
                </p>
                <div className="flex items-center gap-2 mt-1">
                   <div className={`w-1.5 h-1.5 rounded-full ${confidence === 'High' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                   <p className="text-[8px] font-black uppercase text-slate-400">Confidence: {confidence || 'Calculating...'}</p>
                </div>
                <p className="text-[9px] text-slate-500 mt-1 uppercase font-bold">Click map to select adjacent parcel</p>
             </div>
          </div>
        </MapContainer>
      </div>
    </div>
  );
};

const SelectionHandler: React.FC<{ 
  mode: 'idle' | 'rectangle' | 'polygon', 
  onComplete: (feat: any) => void 
}> = ({ mode, onComplete }) => {
  const map = useMap();
  const [dragStart, setDragStart] = useState<L.LatLng | null>(null);
  const [dragEnd, setDragEnd] = useState<L.LatLng | null>(null);
  const [polyPoints, setPolyPoints] = useState<L.LatLng[]>([]);

  useEffect(() => {
    if (mode === 'idle') {
      map.dragging.enable();
      map.doubleClickZoom.enable();
      setDragStart(null);
      setDragEnd(null);
      setPolyPoints([]);
      return;
    }

    map.dragging.disable(); // Disable map panning when selecting
    map.doubleClickZoom.disable(); // Disable dblclick zoom

    const onMouseDown = (e: L.LeafletMouseEvent) => {
      if (mode === 'rectangle') {
        setDragStart(e.latlng);
        setDragEnd(e.latlng);
      }
    };

    const onMouseMove = (e: L.LeafletMouseEvent) => {
      if (mode === 'rectangle' && dragStart) {
        setDragEnd(e.latlng);
      }
    };

    const onMouseUp = (e: L.LeafletMouseEvent) => {
      if (mode === 'rectangle' && dragStart && dragEnd) {
        const bounds = L.latLngBounds(dragStart, dragEnd);
        const nw = bounds.getNorthWest();
        const ne = bounds.getNorthEast();
        const se = bounds.getSouthEast();
        const sw = bounds.getSouthWest();
        
        const feature = turf.polygon([[
          [nw.lng, nw.lat],
          [ne.lng, ne.lat],
          [se.lng, se.lat],
          [sw.lng, sw.lat],
          [nw.lng, nw.lat]
        ]]);
        
        onComplete(feature);
        setDragStart(null);
        setDragEnd(null);
      }
    };

    const onClick = (e: L.LeafletMouseEvent) => {
      L.DomEvent.stopPropagation(e as any);
      if (mode === 'polygon') {
        setPolyPoints(prev => [...prev, e.latlng]);
      }
    };

    const onDblClick = (e: L.LeafletMouseEvent) => {
      L.DomEvent.stopPropagation(e as any);
      if (mode === 'polygon' && polyPoints.length >= 3) {
        const coords = polyPoints.map(p => [p.lng, p.lat]);
        coords.push(coords[0]); // Close
        const feature = turf.polygon([coords]);
        onComplete(feature);
        setPolyPoints([]);
      }
    };

    map.on('mousedown', onMouseDown);
    map.on('mousemove', onMouseMove);
    map.on('mouseup', onMouseUp);
    map.on('click', onClick);
    map.on('dblclick', onDblClick);

    return () => {
      map.dragging.enable();
      map.doubleClickZoom.enable();
      map.off('mousedown', onMouseDown);
      map.off('mousemove', onMouseMove);
      map.off('mouseup', onMouseUp);
      map.off('click', onClick);
      map.off('dblclick', onDblClick);
    };
  }, [mode, dragStart, dragEnd, polyPoints, map, onComplete]);

  return (
    <>
      {mode === 'rectangle' && dragStart && dragEnd && (
        <Rectangle 
          bounds={L.latLngBounds(dragStart, dragEnd)} 
          pathOptions={{ color: '#10b981', weight: 2, fillOpacity: 0.2, dashArray: '5, 5' }} 
        />
      )}
      {mode === 'polygon' && polyPoints.length > 0 && (
        <>
          <Polygon 
            positions={polyPoints} 
            pathOptions={{ color: '#10b981', weight: 2, fillOpacity: 0.2, dashArray: '5, 5' }} 
          />
          {polyPoints.map((p, i) => (
            <Circle 
              key={i} 
              center={p} 
              radius={2} 
              pathOptions={{ color: '#fff', fillColor: '#10b981', fillOpacity: 1, weight: 2 }} 
            />
          ))}
        </>
      )}
    </>
  );
};

const DroneSimulator: React.FC<{ 
  bbox: number[], 
  grid: any[], 
  onFinish?: () => void, 
  onStatus?: (s: string) => void,
  onProgress?: (p: { eta: number, targets: number }) => void 
}> = ({ bbox, grid, onFinish, onStatus, onProgress }) => {
  if (!bbox || bbox.length < 4 || !grid || grid.length === 0) return null;

  const basePos: [number, number] = [bbox[1], bbox[0]];
  const [dronePos, setDronePos] = useState<[number, number]>(basePos);
  const [isAction, setIsAction] = useState(false);
  const [actionType, setActionType] = useState<"water" | "npk" | "pesticide" | null>(null);
  
  const missionRef = useRef<any[]>([]);
  const animationRef = useRef<number | null>(null);
  const missionInProgress = useRef(false);

  useEffect(() => {
    if (!grid || grid.length === 0 || missionInProgress.current) return;
    
    // Check if this is a new parcel or just a data refresh
    const missionId = `${bbox[0]}-${bbox[1]}`;
    if (missionRef.current.length > 0 && missionInProgress.current) return;

    missionInProgress.current = true;

    // 1. SCAN PHASE (Sample some points across the grid)
    const scanWaypoints = grid.filter((_, i) => i % 15 === 0).map(c => ({
      lat: c.center[0],
      lon: c.center[1],
      id: 'Scanning Zone',
      type: 'scan'
    }));

    // 2. MITIGATION PHASE (Only Critical Zones)
    const targets = grid.filter(c => c.status === 'Critical').map((c) => {
      let type: any = "npk";
      if (c.needs.water > 5) type = "water";
      if (c.needs.pesticide > 0.5) type = "pesticide";

      return {
        lat: c.center[0],
        lon: c.center[1],
        type,
        id: c.id
      };
    });

    missionRef.current = [
      { lat: basePos[0], lon: basePos[1], id: 'Launch Pad', type: 'base' },
      ...scanWaypoints,
      ...targets,
      { lat: basePos[0], lon: basePos[1], id: 'Returning to Base', type: 'base' }
    ];
    
    startMission();
    
    return () => { 
      // We don't reset missionInProgress here because we want it to persist across re-renders
      // unless the component is actually unmounting or bbox changes
    };
  }, [bbox]); // Only restart mission if the bounding box (parcel) changes

  const startMission = async () => {
    if (!missionRef.current.length) return;
    setDronePos([missionRef.current[0].lat, missionRef.current[0].lon]);
    
    for (let i = 0; i < missionRef.current.length - 1; i++) {
      const target = missionRef.current[i+1];
      
      // Update telemetry
      const remaining = missionRef.current.length - (i + 1);
      onProgress?.({
        eta: Math.max(0, remaining * 12), // 12s per point approx
        targets: missionRef.current.filter((m, idx) => idx > i && ['water', 'npk', 'pesticide'].includes(m.type)).length
      });

      if (target.type === 'scan') onStatus?.(`Scanning irregular parcel boundary...`);
      else if (target.type === 'base') onStatus?.("Grounded.");
      else onStatus?.(`Mitigating ${target.id}: ${target.type.toUpperCase()} injection...`);

      await smoothMove(missionRef.current[i], target);
      
      if (['water', 'npk', 'pesticide'].includes(target.type)) {
        setIsAction(true);
        setActionType(target.type);
        await new Promise(r => setTimeout(r, 1500));
        setIsAction(false);
        setActionType(null);
      }
    }
    
    onStatus?.("Mission Complete. Irregular Parcel Protected.");
    setTimeout(() => onFinish?.(), 1000);
  };

  const smoothMove = (start: any, end: any) => {
    return new Promise<void>((resolve) => {
      const duration = end.type === 'scan' ? 1000 : 2000;
      const startTime = performance.now();
      const animate = (time: number) => {
        const elapsed = time - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
        setDronePos([start.lat + (end.lat - start.lat) * ease, start.lon + (end.lon - start.lon) * ease]);
        if (progress < 1) animationRef.current = requestAnimationFrame(animate);
        else resolve();
      };
      animationRef.current = requestAnimationFrame(animate);
    });
  };

  return (
    <>
      <Circle center={dronePos} radius={1.5} pathOptions={{ color: '#000', fillColor: '#000', fillOpacity: 0.3, weight: 0 }} />
      {isAction && (
        <Circle 
          center={dronePos} 
          radius={8} 
          pathOptions={{ 
            color: actionType === 'water' ? '#3b82f6' : actionType === 'npk' ? '#f59e0b' : '#a855f7', 
            fillOpacity: 0.2, 
            className: "animate-ping" 
          }} 
        />
      )}
      <Marker position={dronePos} icon={droneIcon} zIndexOffset={5000} />
      <MapFollower pos={dronePos} active={!isAction} />
    </>
  );
};

const MapFollower: React.FC<{ pos: [number, number], active: boolean }> = ({ pos, active }) => {
  const map = useMap();
  const lastUpdateRef = useRef(0);

  useEffect(() => { 
    if (!active) return;
    
    const now = performance.now();
    // Synchronize map center with drone position without built-in animations to avoid jitter
    // We update every ~32ms (roughly 30fps) to keep CPU usage low while maintaining smoothness
    if (now - lastUpdateRef.current > 32) {
      map.setView(pos, map.getZoom(), { animate: false }); 
      lastUpdateRef.current = now;
    }
  }, [pos, active, map]);
  return null;
};

const PolygonGridOverlay: React.FC<{ grid: any[], onCellClick?: (cell: any) => void }> = ({ grid, onCellClick }) => {
  return (
    <>
      {grid.map((cell) => {
        return (
          <GeoJSON
            key={cell.id}
            data={cell.geometry}
            eventHandlers={{ click: () => onCellClick?.(cell) }}
            style={{
              color: cell.color,
              weight: 1.5,
              opacity: 0.9,
              fillOpacity: cell.status === 'Critical' ? 0.75 : cell.status === 'Moderate' ? 0.45 : 0.3,
              fillColor: cell.color,
              className: cell.status === 'Critical' ? 'animate-pulse' : ''
            }}
          >
             <Popup>
                <div className="p-2 min-w-[200px] bg-slate-900 text-white rounded-lg">
                   <h4 className="font-bold border-b border-white/10 pb-2 mb-2">{cell.id} Analysis</h4>
                   <div className="space-y-2">
                      <div className="flex justify-between text-xs"><span>Status</span> <span className="font-bold uppercase" style={{ color: cell.color }}>{cell.status}</span></div>
                      <div className="flex justify-between text-xs"><span>Moisture Stress</span> <span className="font-bold">{cell.totalStress.toFixed(1)}%</span></div>
                      {cell.needs.pesticide > 0 && <div className="text-[10px] text-purple-400 font-bold uppercase tracking-widest">Fungal Risk Detected</div>}
                      <div className="mt-3 pt-2 border-t border-white/5 space-y-1">
                         <div className="flex items-center gap-2 text-blue-400 text-[10px]"><Droplets className="w-3 h-3"/> {cell.needs.water.toFixed(1)}L Water</div>
                         <div className="flex items-center gap-2 text-emerald-400 text-[10px]"><FlaskConical className="w-3 h-3"/> {cell.needs.n.toFixed(1)}g Nitrogen</div>
                      </div>
                   </div>
                </div>
             </Popup>
          </GeoJSON>
        );
      })}
    </>
  );
};

const MapUpdater: React.FC<{ center: [number, number], selectionMode: string }> = ({ center, selectionMode }) => {
  const map = useMap();
  const prevCenterRef = useRef<[number, number]>(center);

  useEffect(() => {
    if (!map || selectionMode !== 'idle') return;
    
    const dist = map.distance(prevCenterRef.current, center);
    if (dist < 10) return;

    prevCenterRef.current = center;

    try {
      map.flyTo(center, 18, { animate: true, duration: 1.5 });
      const timer = setTimeout(() => {
        const container = map.getContainer();
        if (container && container.offsetParent !== null) {
          map.invalidateSize();
        }
      }, 300);
      return () => clearTimeout(timer);
    } catch (e) {
      console.warn("Leaflet MapUpdater error:", e);
    }
  }, [center, map, selectionMode]);
  return null;
};

export default FarmMapSelector;
