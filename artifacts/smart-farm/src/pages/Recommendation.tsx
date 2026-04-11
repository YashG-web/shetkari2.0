import { useGetRecommendation, getGetRecommendationQueryKey } from '@workspace/api-client-react';
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
  Activity
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Recommendation() {
  const { language, isSimulatorOn } = useAppStore();
  const tr = useTranslation();
  const { speak, isPlaying } = useTTS();
  
  const { data: rec, isLoading, refetch } = useGetRecommendation({
    query: {
      queryKey: getGetRecommendationQueryKey(),
      refetchInterval: 3000
    }
  });

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
          const response = await axios.get('http://10.154.16.92/', { timeout: 3000 });
          const raw = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
          
          const regex = new RegExp(`"?soil"?\\s*[:=]\\s*"?([0-9.]+)"?`, 'i');
          const match = JSON.stringify(raw).match(regex);
          const soilRaw = match ? Number(match[1]) : (raw.soil ? Number(raw.soil) : NaN);
          
          if (!isNaN(soilRaw)) {
            await axios.post('/api/iot/sync', {
              soilRaw,
              temperature: parseFloat(raw.temp || raw.temperature || 0),
              humidity: parseFloat(raw.hum || raw.humidity || 0)
            });
            refetch(); // Trigger UI update after sync
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

  const handleSpeak = () => {
    if (!rec) return;
    speak(tr(rec.irrigationAdvisory, language));
  };

  const riskStyles = {
    low: "bg-green-100 text-green-800 border-green-200",
    medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
    high: "bg-red-100 text-red-800 border-red-200"
  } as const;

  const RiskIcon = {
    low: ShieldCheck,
    medium: AlertTriangle,
    high: AlertOctagon
  }[rec?.riskLevel || 'low'];

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </AppLayout>
    );
  }

  if (!rec) return null;

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-10 pb-20">
        
        {/* Header Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-display font-bold text-foreground">
              {tr('nav.recommendation', language)}
            </h1>
            <p className="text-muted-foreground font-medium mt-1">{tr('rec.subtitle', language)}</p>
          </div>
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
                <div className="md:col-span-5 bg-blue-50/50 dark:bg-blue-950/20 p-8 flex flex-col justify-center border-r border-blue-100 dark:border-blue-900/30">
                  <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black border mb-6 ${riskStyles[rec.riskLevel as keyof typeof riskStyles]}`}>
                    <RiskIcon className="w-3.5 h-3.5" />
                    {tr('rec.system_status', language)}{tr(`rec.${rec.riskLevel}`, language)}

                  </div>
                  <h4 className="text-2xl font-bold leading-tight mb-4">{tr(rec.cropCondition, language)}</h4>
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
                    <h5 className="text-xs font-black uppercase tracking-widest text-blue-600 mb-3">{tr('rec.irrigation_advisory', language)}</h5>
                    <p className="text-xl font-medium text-foreground leading-relaxed italic">
                      "{tr(rec.irrigationAdvisory || "Maintain current moisture levels for optimal growth.", language)}"
                    </p>

                  </div>
                  
                  <div className="pt-6 border-t border-blue-50">
                    <h5 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">{tr('rec.recommended_actions', language)}</h5>
                    <ul className="grid sm:grid-cols-2 gap-3">
                      {rec.suggestedActions.slice(0, 4).map((action, idx) => (
                        <li key={idx} className="flex items-center gap-3 text-sm font-medium text-muted-foreground group/item">
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
                      <h4 className="text-3xl font-bold text-foreground">{rec.fertilizerRecommendation.name}</h4>
                      <p className="text-emerald-600 font-bold text-sm tracking-wide mt-1">{tr('rec.chemical_comp', language)}{rec.fertilizerRecommendation.npkRatio}</p>
                    </div>
                  </div>
                  
                  <a 
                    href={rec.fertilizerRecommendation.buyLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-10 py-5 bg-slate-900 text-white rounded-[20px] font-black group transition-all hover:scale-105 active:scale-95 shadow-xl shadow-black/10"
                  >
                    <ShoppingCart className="w-5 h-5 group-hover:animate-bounce" />
                    {tr('rec.buy_on', language)} {rec.fertilizerRecommendation.platform.toUpperCase()}

                  </a>
                </div>

                <div className="grid md:grid-cols-2 gap-12">
                   <div className="space-y-4">
                      <h5 className="text-xs font-black uppercase tracking-widest text-muted-foreground">{tr('rec.why_product', language)}</h5>
                      <p className="text-foreground font-medium leading-relaxed italic">
                        "{tr(rec.fertilizerRecommendation.usageInfo, language)}"
                      </p>
                   </div>
                   <div className="space-y-4">
                    <h5 className="text-xs font-black uppercase tracking-widest text-muted-foreground">{tr(rec.app_strategy || "rec.app_strategy", language)}</h5>
                    <div className="bg-emerald-50/50 dark:bg-emerald-900/10 p-5 rounded-3xl border border-emerald-100 text-sm font-medium text-emerald-900 dark:text-emerald-200">
                       {tr(rec.app_desc || "Not Available", language)}
                    </div>


                   </div>
                </div>
              </div>
            </Card>
          </motion.div>

        </div>
      </div>
    </AppLayout>
  );
}
