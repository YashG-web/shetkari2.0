import { useGetRecommendation } from '@workspace/api-client-react';
import { useTranslation } from '@/lib/translations';
import { useAppStore } from '@/store/use-app-store';
import { useTTS } from '@/hooks/use-tts';
import { AppLayout } from '@/components/layout/AppLayout';
import { ShieldCheck, AlertTriangle, AlertOctagon, CheckCircle2, ShoppingCart, Volume2, SquareSquare } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Recommendation() {
  const { language } = useAppStore();
  const tr = useTranslation();
  const { speak, isPlaying } = useTTS();
  
  const { data: rec, isLoading } = useGetRecommendation();

  const handleSpeak = () => {
    if (!rec) return;
    const text = `Crop Condition is ${rec.cropCondition}. The main issue identified is ${rec.identifiedIssue}. Here are the suggested actions: ${rec.suggestedActions.join(', ')}. Recommended fertilizer is ${rec.fertilizerRecommendation.name} with NPK ratio ${rec.fertilizerRecommendation.npkRatio}.`;
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
            {tr('nav.recommendation', language)}
          </h1>
          <button
            onClick={handleSpeak}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all ${
              isPlaying ? 'bg-primary text-white shadow-lg shadow-primary/30 animate-pulse' : 'bg-white border-2 border-border text-foreground hover:border-primary/50'
            }`}
          >
            <Volume2 className="w-5 h-5" />
            {tr('action.listen', language)}
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
                Risk Level: {rec.riskLevel.toUpperCase()}
              </div>
              
              <h2 className="text-2xl font-bold text-foreground">
                {rec.cropCondition}
              </h2>
              
              <div className="bg-red-50 text-red-900 p-4 rounded-2xl border border-red-100">
                <p className="font-semibold text-sm uppercase tracking-wider mb-1 opacity-70">Identified Issue</p>
                <p className="text-lg">{rec.identifiedIssue}</p>
              </div>
            </div>
            
            {/* Suggested Actions */}
            <div className="flex-1 w-full bg-slate-50 rounded-2xl p-6 border border-slate-100">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <CheckCircle2 className="text-primary w-5 h-5" />
                Suggested Actions
              </h3>
              <ul className="space-y-3">
                {rec.suggestedActions.map((action, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-slate-700">
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="font-medium leading-relaxed">{action}</span>
                  </li>
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
          <h3 className="text-xl font-display font-bold mb-4">Recommended Product</h3>
          <div className="bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded-3xl p-6 flex flex-col sm:flex-row items-center gap-6">
            <div className="w-24 h-24 bg-white rounded-2xl shadow-sm flex items-center justify-center shrink-0">
               <SquareSquare className="w-10 h-10 text-primary/40" />
            </div>
            
            <div className="flex-1 text-center sm:text-left">
              <h4 className="text-2xl font-bold text-foreground">{rec.fertilizerRecommendation.name}</h4>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-2 mb-3">
                <span className="bg-white border border-border px-3 py-1 rounded-full text-sm font-semibold text-muted-foreground">
                  NPK: {rec.fertilizerRecommendation.npkRatio}
                </span>
              </div>
              <p className="text-muted-foreground text-sm max-w-lg">{rec.fertilizerRecommendation.usageInfo}</p>
            </div>
            
            <a 
              href={rec.fertilizerRecommendation.buyLink}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-xl font-bold hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-1 transition-all"
            >
              <ShoppingCart className="w-5 h-5" />
              Buy on {rec.fertilizerRecommendation.platform}
            </a>
          </div>
        </motion.div>

      </div>
    </AppLayout>
  );
}
