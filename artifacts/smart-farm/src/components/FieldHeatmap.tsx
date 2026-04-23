import React from "react";
import { motion } from "framer-motion";

interface Zone {
  id: string;
  stressLevel: string;
  color: string;
  recommendation?: string;
}

interface FieldHeatmapProps {
  zones: Zone[];
  onZoneClick: (zoneId: string) => void;
  selectedZoneId?: string;
}

const FieldHeatmap: React.FC<FieldHeatmapProps> = ({ zones, onZoneClick, selectedZoneId }) => {
  // Define coordinates for 6 zones on a 400x400 grid (will scale)
  const zonePaths = [
    { id: "Zone 1", path: "M 10 10 L 190 10 L 190 120 L 10 120 Z" },
    { id: "Zone 2", path: "M 200 10 L 390 10 L 390 120 L 200 120 Z" },
    { id: "Zone 3", path: "M 10 130 L 190 130 L 190 260 L 10 260 Z" },
    { id: "Zone 4", path: "M 200 130 L 390 130 L 390 260 L 200 260 Z" },
    { id: "Zone 5", path: "M 10 270 L 190 270 L 190 390 L 10 390 Z" },
    { id: "Zone 6", path: "M 200 270 L 390 270 L 390 390 L 200 390 Z" },
  ];

  const getColor = (zoneId: string) => {
    const zone = zones.find((z) => z.id === zoneId);
    if (!zone) return "rgba(0,0,0,0.1)";
    switch (zone.color) {
      case "green": return "rgba(34, 197, 94, 0.45)"; // healthy
      case "yellow": return "rgba(234, 179, 8, 0.55)"; // moderate
      case "orange": return "rgba(249, 115, 22, 0.65)"; // warning
      case "red": return "rgba(239, 68, 68, 0.75)"; // high stress
      default: return "rgba(0,0,0,0.1)";
    }
  };

  return (
    <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10 group">
      {/* Farm Background Image */}
      <img 
        src="/images/farm_heatmap_bg.png" 
        alt="Farm Aerial View" 
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />

      {/* SVG Overlay for Heatmap */}
      <svg 
        viewBox="0 0 400 400" 
        className="absolute inset-0 w-full h-full cursor-crosshair"
        xmlns="http://www.w3.org/2000/svg"
      >
        {zonePaths.map((zPath) => {
          const isSelected = selectedZoneId === zPath.id;
          return (
            <motion.path
              key={zPath.id}
              d={zPath.path}
              fill={getColor(zPath.id)}
              stroke={isSelected ? "#FFF" : "rgba(255, 255, 255, 0.3)"}
              strokeWidth={isSelected ? 4 : 1}
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: 1,
                scale: isSelected ? 1.02 : 1,
              }}
              whileHover={{ 
                fillOpacity: 0.9, 
                strokeWidth: 3,
                stroke: "#FFF"
              }}
              onClick={() => onZoneClick(zPath.id)}
              className="transition-all duration-300 pointer-events-auto"
            />
          );
        })}
      </svg>

      {/* Labels for zones */}
      <div className="absolute inset-0 pointer-events-none p-4">
        {zonePaths.map((zPath) => {
           // Simple positioning logic for labels
           const left = zPath.id.includes("2") || zPath.id.includes("4") || zPath.id.includes("6") ? "75%" : "25%";
           const top = zPath.id.includes("1") || zPath.id.includes("2") ? "15%" : (zPath.id.includes("3") || zPath.id.includes("4") ? "50%" : "85%");
           
           return (
             <div 
               key={`label-${zPath.id}`}
               className="absolute transform -translate-x-1/2 -translate-y-1/2 text-white font-bold text-xs bg-black/40 backdrop-blur-sm px-2 py-1 rounded"
               style={{ left, top }}
             >
               {zPath.id}
             </div>
           );
        })}
      </div>
    </div>
  );
};

export default FieldHeatmap;
