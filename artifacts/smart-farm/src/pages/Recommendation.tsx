import { useGetRecommendation, getGetRecommendationQueryKey } from '@workspace/api-client-react';
import { useTranslation } from '@/lib/translations';
import { useAppStore } from '@/store/use-app-store';
import { useTTS } from '@/hooks/use-tts';
import { AppLayout } from '@/components/layout/AppLayout';
import { ShieldCheck, AlertTriangle, AlertOctagon, CheckCircle2, ShoppingCart, Volume2, SquareSquare } from 'lucide-react';
import { motion } from 'framer-motion';

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Recommendation() {
  const { isSimulatorOn } = useAppStore();
  const tr = useTranslation();
  const { speak, isPlaying } = useTTS();
  
  const { data: rec, isLoading, refetch } = useGetRecommendation({
    query: {
      queryKey: getGetRecommendationQueryKey(),
      refetchInterval: 3000
    }
  });

  const translateDynamic = (text: string) => {
    if (!text) return text;
    // Check for ML Forecast suffix
    if (text.includes(" (ML Forecast: ")) {
      const parts = text.split(" (ML Forecast: ");
      const base = tr(parts[0].trim());
      const suffixRaw = parts[1]; // e.g. "45% moisture in next step)"
      const percent = suffixRaw.split("%")[0];
      return `${base} (${tr("ML Forecast")}: ${percent}% ${tr("moisture in next step")})`;
    }
    return tr(text);
  };

  // Ensure hardware is synced even from the Recommendation page
  useEffect(() => {
    let interval: any;
    if (!isSimulatorOn) {
      const fetchAndSync = async () => {
        try {
          const response = await axios.get('http://10.154.16.104/', { timeout: 3000 });
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
    const text = `${tr('audio.recommendation_intro')} ${tr('audio.crop_condition')} ${translateDynamic(rec.cropCondition)}. ${tr('audio.main_issue')} ${tr(rec.identifiedIssue)}. ${tr('audio.suggested_actions')}: ${rec.suggestedActions.map(a => tr(a)).join(', ')}. ${tr('audio.recommended_fertilizer')} ${tr(rec.fertilizerRecommendation.name)} ${tr('audio.npk_ratio')} ${rec.fertilizerRecommendation.npkRatio}.`;
    speak(text);
  };

  const riskStyles = {
    low: "bg-green-100 text-green-800 border-green-200",
    medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
    high: "bg-red-100 text-red-800 border-red-200"
  };

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
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Actions */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-display font-bold text-foreground">
            {tr('nav.recommendation')}
          </h1>
          <button
            onClick={handleSpeak}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all ${
              isPlaying ? 'bg-primary text-white shadow-lg shadow-primary/30 animate-pulse' : 'bg-white border-2 border-border text-foreground hover:border-primary/50'
            }`}
          >
            <Volume2 className="w-5 h-5" />
            {tr('action.listen')}
          </button>
        </div>

        {/* Main Condition Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-3xl p-8 border border-border/50 shadow-lg shadow-black/5"
        >
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-1 space-y-4">
              <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold border ${riskStyles[rec.riskLevel]}`}>
                <RiskIcon className="w-4 h-4" />
                {tr('rec.risk_level')}: {tr(`rec.${rec.riskLevel}`)}
              </div>
              
              <h2 className="text-2xl font-bold text-foreground">
                {translateDynamic(rec.cropCondition)}
              </h2>
              
              <div className="bg-red-50 text-red-900 p-4 rounded-2xl border border-red-100">
                <p className="font-semibold text-sm uppercase tracking-wider mb-1 opacity-70">{tr('rec.identified_issue')}</p>
                <p className="text-lg">{tr(rec.identifiedIssue)}</p>
              </div>
            </div>
            
            {/* Suggested Actions */}
            <div className="flex-1 w-full bg-slate-50 rounded-2xl p-6 border border-slate-100">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <CheckCircle2 className="text-primary w-5 h-5" />
                {tr('rec.suggested_actions')}
              </h3>
              <ul className="space-y-3">
                {rec.suggestedActions.map((action, idx) => (
                  <motion.li 
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * idx }}
                    className="flex items-start gap-3 p-3 rounded-xl bg-white border border-slate-200/50 shadow-sm"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    <span className="text-slate-700 font-medium">{tr(action)}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Fertilizer Recommendation */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-xl font-display font-bold mb-4">{tr('rec.recommended_product')}</h3>
          <div className="bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded-3xl p-6 flex flex-col sm:flex-row items-center gap-6">
            <div className="w-24 h-24 bg-white rounded-2xl shadow-sm flex items-center justify-center shrink-0">
               <SquareSquare className="w-10 h-10 text-primary/40" />
            </div>
            
            <div className="flex-1 space-y-2">
              <h4 className="text-xl font-bold text-foreground">{tr(rec.fertilizerRecommendation.name)}</h4>
              <div className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-lg mb-2">
                NPK: {rec.fertilizerRecommendation.npkRatio}
              </div>
              <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                {tr(rec.fertilizerRecommendation.usageInfo)}
              </p>
            </div>
            
            <a 
              href={rec.fertilizerRecommendation.buyLink}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-xl font-bold hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-1 transition-all"
            >
              <ShoppingCart className="w-5 h-5" />
              {tr('rec.buy_on')} {rec.fertilizerRecommendation.platform}
            </a>
          </div>
        </motion.div>

      </div>
    </AppLayout>
  );
}
