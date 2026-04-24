import { useGetRecommendation, getGetRecommendationQueryKey, useGetSensorData, getGetSensorDataQueryKey } from '@workspace/api-client-react';
import { useTranslation } from '@/lib/translations';
import { useAppStore } from '@/store/use-app-store';
import { useTTS } from '@/hooks/use-tts';
import { AppLayout } from '@/components/layout/AppLayout';
import { 
  ShieldCheck, 
  AlertTriangle, 
  AlertOctagon, 
  CheckCircle2, 
  ShoppingCart, 
  Volume2, 
  SquareSquare,
  Droplets,
  ThermometerSun,
  Wind,
  Activity,
  XCircle
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { cropProfiles } from '@/lib/crop-profiles';

export default function Recommendation() {
  const { language, isSimulatorOn, selectedCrop, setSelectedCrop } = useAppStore();
  const tr = useTranslation();
  const { speak, isPlaying } = useTTS();

  const CROP_CONFIG: Record<string, { bgImage: string; name: string; traits: string[] }> = {
    rice: { 
       bgImage: '/images/rice-bg.jpg', 
       name: 'crop.rice',
       traits: ['rec.rice_water_tolerance', 'rec.rice_disease_watch']
    },
    wheat: { 
       bgImage: '/images/wheat-bg.jpg', 
       name: 'crop.wheat',
       traits: ['rec.wheat_drainage_needed', 'rec.wheat_rust_watch']
    },
    sunflower: { 
       bgImage: '/images/sunflower-bg.jpeg', 
       name: 'crop.sunflower',
       traits: ['rec.sunflower_drought_tolerant', 'rec.sunflower_soil_prep']
    },
    cotton: { 
       bgImage: '/images/cotton-bg.jpeg', 
       name: 'crop.cotton',
       traits: ['rec.cotton_moderate_water', 'rec.cotton_pest_watch']
    },
  };

  const cropContext = selectedCrop ? CROP_CONFIG[selectedCrop] : null;
  
  const { data: rec, isLoading, refetch } = useGetRecommendation({
    query: {
      queryKey: getGetRecommendationQueryKey(),
      refetchInterval: 3000
    }
  });

  const mockRec = {
    cropCondition: "status.optimum",
    riskLevel: "low",
    identifiedIssue: "Soil moisture is stable. No immediate irrigation needed.",
    suggestedActions: [
      "status.monitor_moisture",
      "status.maintain_current_schedule"
    ],
    fertilizerRecommendation: {
      name: "Organic Compost",
      npkRatio: "1-1-1",
      buyLink: "https://www.google.com/search?q=buy+organic+compost",
      platform: "amazon",
      usageInfo: "Apply 2kg per square meter for optimal soil health."
    },
    app_strategy: "rec.app_strategy",
    app_desc: "Apply evenly across the field during general maintenance."
  };

  const baseRec = rec || mockRec;

  const { data: sensorData } = useGetSensorData({
    query: {
      queryKey: getGetSensorDataQueryKey(),
      refetchInterval: 3000
    }
  });

  // 1. Intelligence Layer: Override activeRec based on crop profile
  const activeRec = useMemo(() => {
    if (!selectedCrop || !cropProfiles[selectedCrop]) return baseRec;

    const profile = cropProfiles[selectedCrop];
    const liveMoisture = sensorData?.soilMoisture ?? 50; // default 50 if loading
    
    // Deep clone to avoid mutating the original fetched data
    const enhancedRec = JSON.parse(JSON.stringify(baseRec));

    let cropRisk = "low";
    let cropIssue = `Soil moisture (${liveMoisture}%) is suitable for ${profile.display_name} cultivation.`;

    if (liveMoisture > profile.optimal_moisture[1]) {
      cropRisk = profile.overwater_risk;
      cropIssue = `Excess moisture warning for ${profile.display_name}. Current moisture (${liveMoisture}%) exceeds optimal range max (${profile.optimal_moisture[1]}%).`;
    } else if (liveMoisture < profile.optimal_moisture[0]) {
      cropRisk = "high";
      cropIssue = `Critically low moisture for ${profile.display_name}. Current moisture (${liveMoisture}%) is below optimal range min (${profile.optimal_moisture[0]}%).`;
    }

    // Enhance the condition strings dynamically
    enhancedRec.cropCondition = `Recommendation for ${profile.display_name} Crop`;
    
    // Only override risk and issue if the crop threshold implies a worse problem
    if (cropRisk === "high" || (cropRisk === "medium" && enhancedRec.riskLevel === "low")) {
      enhancedRec.riskLevel = cropRisk;
    }
    enhancedRec.identifiedIssue = cropIssue;
    
    // Prepend the specific recommendation style
    enhancedRec.suggestedActions = [
      profile.recommendation_style,
      ...enhancedRec.suggestedActions
    ];

    return enhancedRec;
  }, [baseRec, selectedCrop, sensorData]);

  useEffect(() => {
    if (rec) console.log("Recommendation Data:", rec);
  }, [rec]);

  const translateDynamic = (text: string) => {
    if (!text) return text;
    // Check for ML Forecast suffix
    if (text.includes(" (ML Forecast: ")) {
      const parts = text.split(" (ML Forecast: ");
      const base = tr(parts[0].trim(), language);
      const suffixRaw = parts[1]; // e.g. "45% moisture in next step)"
      const percent = suffixRaw.split("%")[0];
      return `${base} (${tr("ML Forecast", language)}: ${percent}% ${tr("moisture in next step", language)})`;
    }
    return tr(text, language);
  };

  // Ensure hardware is synced even from the Recommendation page
  useEffect(() => {
    let interval: any;
    if (!isSimulatorOn) {
      const fetchAndSync = async () => {
        try {
          const response = await axios.get('http://10.15.208.92/', { timeout: 3000 });
          const raw = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
          
          const regexSoil = new RegExp(`"?soil"?\\s*[:=]\\s*"?([0-9.]+)"?`, 'i');
          const matchSoil = JSON.stringify(raw).match(regexSoil);
          const soilRaw = matchSoil ? Number(matchSoil[1]) : (raw.soil !== undefined ? Number(raw.soil) : 500);
          
          const regexTemp = new RegExp(`"?temp"?\\s*[:=]\\s*"?([0-9.]+)"?`, 'i');
          const matchTemp = JSON.stringify(raw).match(regexTemp);
          const temperature = matchTemp ? Number(matchTemp[1]) : (raw.temp !== undefined ? Number(raw.temp) : 25);

          const regexHum = new RegExp(`"?hum"?\\s*[:=]\\s*"?([0-9.]+)"?`, 'i');
          const matchHum = JSON.stringify(raw).match(regexHum);
          const humidity = matchHum ? Number(matchHum[1]) : (raw.hum !== undefined ? Number(raw.hum) : 60);
          
          if (!isNaN(soilRaw)) {
            await axios.post('/api/iot/sync', { 
              soilRaw, 
              temperature, 
              humidity 
            });
            console.log(`📡 IoT Sync: SoilRaw=${soilRaw}, Temp=${temperature}, Hum=${humidity} -> Mapping Corrected.`);
          }
        } catch (err) {
          console.error("Recommendation page sync failed", err);
        }
      };
      
      fetchAndSync();
      interval = setInterval(fetchAndSync, 3000);
    }
    return () => clearInterval(interval);
  }, [isSimulatorOn, refetch]);

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </AppLayout>
    );
  }

  if (!activeRec) return null;

  const handleSpeak = () => {
    const text = `${tr(activeRec.cropCondition, language)}. ${tr('rec.suggested_actions', language)}: ${tr(activeRec.suggestedActions[0], language)}`;
    speak(text);
  };

  const riskStyles = {
    low: "bg-green-100 text-green-800 border-green-200",
    medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
    high: "bg-red-100 text-red-800 border-red-200"
  } as const;

  const RiskIconMap = {
    low: ShieldCheck,
    medium: AlertTriangle,
    high: AlertOctagon
  };

  const RiskIcon = RiskIconMap[activeRec.riskLevel as keyof typeof RiskIconMap] || ShieldCheck;

  return (
    <div className="relative min-h-screen">
      {/* Dynamic Background Overlay */}
      {cropContext && (
         <div className="fixed inset-0 z-0 pointer-events-none">
            <img 
               src={cropContext.bgImage} 
               alt="Crop Background" 
               className="w-full h-full object-cover opacity-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
         </div>
      )}

      <AppLayout>
        <div className="relative z-10 max-w-4xl mx-auto space-y-10 pb-20">
        
        {/* Header Actions */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div>
            <h1 className="text-4xl font-display font-bold text-foreground">
              {cropContext 
                 ? `${tr('rec.for_crop', language) || "Recommendation for"} ${tr(cropContext.name, language) || cropContext.name.split('.')[1]} Crop` 
                 : tr('nav.recommendation', language)}
            </h1>
            <p className="text-muted-foreground font-medium mt-1">{tr('rec.subtitle', language)}</p>
            {cropContext && (
               <button 
                  onClick={() => setSelectedCrop(null)}
                  className="mt-3 flex items-center gap-1.5 text-xs font-bold text-red-500 hover:text-red-600 border border-red-200 bg-red-50 px-3 py-1.5 rounded-full transition-colors"
               >
                  <XCircle className="w-3.5 h-3.5" />
                  {tr('action.clear_crop', language) || "Clear Crop Selection"}
               </button>
            )}
          </div>
          <div className="flex items-center gap-4">
             {cropContext && (
                <Badge className="bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 px-4 py-2">
                   {tr(cropContext.name, language) || cropContext.name.split('.')[1]} Selected
                </Badge>
             )}
             <button
               onClick={handleSpeak}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all shadow-lg ${
              isPlaying 
                ? 'bg-primary text-white shadow-primary/30 animate-pulse' 
                : 'bg-white border-2 border-border text-foreground hover:border-primary/50'
            }`}
          >
            <Volume2 className="w-5 h-5" />
            {tr('action.listen', language)}
          </button>
          </div>
        </div>

        <div className="grid gap-10">
          
          {/* CARD 1: Environmental & Irrigation Recommendation */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="group"
          >
            <div className="flex items-center gap-2 mb-4">
               <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Droplets className="w-5 h-5 text-blue-600" />
               </div>
               <h3 className="text-xl font-display font-bold">{tr('rec.env_analysis', language)}</h3>
            </div>
            
            <Card className="rounded-[40px] overflow-hidden border-2 border-blue-100 dark:border-blue-900/30 shadow-2xl shadow-blue-500/5">
              <div className="grid md:grid-cols-12">
                <div className="md:col-span-5 bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/5 border-r border-primary/10 p-8 flex flex-col justify-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                     <RiskIcon className="w-32 h-32 text-primary" />
                  </div>
                  <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black border mb-6 w-fit ${riskStyles[activeRec.riskLevel as keyof typeof riskStyles] || 'bg-slate-100 text-slate-600'}`}>
                    <RiskIcon className="w-3.5 h-3.5" />
                    {tr('rec.risk_level', language)}: {tr(`rec.${activeRec.riskLevel}`, language) || activeRec.riskLevel}
                  </div>
                  <h4 className="text-2xl font-bold leading-tight mb-4">{tr(activeRec.cropCondition, language) || activeRec.cropCondition}</h4>
                  <div className="flex items-center gap-4 text-muted-foreground">
                     <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 px-3 py-1 rounded-lg border text-[10px] font-bold">
                        <ThermometerSun className="w-3.5 h-3.5 text-orange-500" /> {tr('rec.temp_stable', language)}
                     </div>
                     <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 px-3 py-1 rounded-lg border text-[10px] font-bold">
                        <Wind className="w-3.5 h-3.5 text-teal-500" /> {tr('rec.humid_optimal', language)}
                     </div>
                  </div>
                </div>
                
                <div className="md:col-span-7 p-8 space-y-6">
                  <div className="relative">
                    <h5 className="text-xs font-black uppercase tracking-widest text-blue-600 mb-3">{tr('rec.identified_issue', language)}</h5>
                    <p className="text-xl font-medium text-foreground leading-relaxed italic">
                      "{translateDynamic(activeRec.identifiedIssue)}"
                    </p>
                  </div>
                  
                  <div className="pt-6 border-t border-blue-50">
                    <h5 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">{tr('rec.recommended_actions', language)}</h5>
                    <ul className="grid sm:grid-cols-2 gap-3">
                      {/* Crop Specific Traits override/addition */}
                      {cropContext && cropContext.traits.map((trait, idx) => (
                        <li key={`trait-${idx}`} className="flex items-center gap-3 text-sm font-bold text-primary group/item">
                          <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                          {tr(trait, language) || trait.split('.')[1].replace(/_/g, ' ')}
                        </li>
                      ))}
                      {activeRec.suggestedActions.slice(0, 4).map((action, idx) => (
                        <li key={`action-${idx}`} className="flex items-center gap-3 text-sm font-medium text-muted-foreground group/item">
                          <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                          {tr(action, language)}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* CARD 2: Soil Nutrient & NPK Recommendation */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="group"
          >
            <div className="flex items-center gap-2 mb-4">
               <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-emerald-600" />
               </div>
               <h3 className="text-xl font-display font-bold">{tr('rec.soil_analysis', language)}</h3>
            </div>
            
            <Card className="rounded-[40px] overflow-hidden border-2 border-emerald-100 dark:border-emerald-900/30 shadow-2xl shadow-emerald-500/5">
              <div className="p-8">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 mb-8 pb-8 border-b border-emerald-50 dark:border-emerald-900/10">
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 bg-white dark:bg-slate-900 rounded-3xl shadow-lg border border-emerald-50 flex items-center justify-center p-4">
                       <SquareSquare className="w-full h-full text-emerald-500/30" />
                    </div>
                    <div>
                      <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white border-none px-3 py-1 mb-2">{tr('rec.recommended_product', language)}</Badge>
                      <h4 className="text-3xl font-bold text-foreground">{activeRec.fertilizerRecommendation.name}</h4>
                      <p className="text-emerald-600 font-bold text-sm tracking-wide mt-1">{tr('rec.chemical_comp', language)}{activeRec.fertilizerRecommendation.npkRatio}</p>
                    </div>
                  </div>
                  
                  <a 
                    href={activeRec.fertilizerRecommendation.buyLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-10 py-5 bg-slate-900 text-white rounded-[20px] font-black group transition-all hover:scale-105 active:scale-95 shadow-xl shadow-black/10"
                  >
                    <ShoppingCart className="w-5 h-5 group-hover:animate-bounce" />
                    {tr('rec.buy_on', language)} {activeRec.fertilizerRecommendation.platform.toUpperCase()}

                  </a>
                </div>

                <div className="grid md:grid-cols-2 gap-12">
                   <div className="space-y-4">
                      <h5 className="text-xs font-black uppercase tracking-widest text-muted-foreground">{tr('rec.why_product', language)}</h5>
                      <p className="text-foreground font-medium leading-relaxed italic">
                        "{tr(activeRec.fertilizerRecommendation.usageInfo, language)}"
                      </p>
                   </div>
                   <div className="space-y-4">
                    <h5 className="text-xs font-black uppercase tracking-widest text-muted-foreground">{tr(activeRec.app_strategy || "rec.app_strategy", language)}</h5>
                    <div className="bg-emerald-50/50 dark:bg-emerald-900/10 p-5 rounded-3xl border border-emerald-100 text-sm font-medium text-emerald-900 dark:text-emerald-200">
                       {tr(activeRec.app_desc || "Not Available", language)}
                    </div>


                   </div>
                </div>
              </div>
            </Card>
          </motion.div>

        </div>
      </div>
    </AppLayout>
    </div>
  );
}
