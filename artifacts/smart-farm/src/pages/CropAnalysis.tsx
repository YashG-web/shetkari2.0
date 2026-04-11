import { useState, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { AppLayout } from '@/components/layout/AppLayout';
import { useTranslation } from '@/lib/translations';
import { useAppStore } from '@/store/use-app-store';
import { useTTS } from '@/hooks/use-tts';
import { UploadCloud, Camera, CheckCircle2, Volume2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

type AnalysisResult = {
  stage: string;
  confidence: number;
  recommendation: string;
} | null;

export default function CropAnalysis() {
  const { language } = useAppStore();
  const tr = useTranslation();
  const { toast } = useToast();
  const { speak, isPlaying } = useTTS();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult>(null);

  const { mutate: analyzeImage, isPending: isAnalyzing } = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/growth-stage', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Analysis failed');
      }

      return response.json();
    },
    onSuccess: (data) => {
      console.log('Analysis Success:', data);
      setResult({
        stage: data.stage,
        confidence: data.confidence,
        recommendation: data.recommendation,
      });
      toast({
        title: tr('Analysis Complete', language),
        description: `${tr('sensor.crop_condition', language)}: ${tr(data.stage, language)}`,
      });
    },
    onError: (error: Error) => {
      console.error('Analysis Error:', error);
      toast({
        title: 'Analysis Failed',
        description: error.message,
        variant: 'destructive',
      });
      setPreviewUrl(null);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create preview
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    
    // Trigger Real AI Analysis
    setResult(null);
    analyzeImage(file);
  };

  const handleSpeak = () => {
    if (!result) return;
    speak(tr(result.recommendation, language));
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">
            {tr('nav.crop_analysis', language)}
          </h1>
          <p className="text-muted-foreground mt-2">Upload a photo of your crop to instantly identify its current growth stage and get optimization tips.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Upload Section */}
          <div className="space-y-6">
            <div className="bg-card rounded-3xl p-8 border-2 border-dashed border-border flex flex-col items-center justify-center text-center h-[400px] relative overflow-hidden group">
              <input 
                type="file" 
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
              
              {previewUrl ? (
                <div className="absolute inset-0 w-full h-full">
                  <img src={previewUrl} alt="Crop preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-white/20 backdrop-blur-md text-white px-6 py-3 rounded-xl font-bold hover:bg-white/30"
                    >
                      Change Photo
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                    <UploadCloud className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Upload Crop Image</h3>
                  <p className="text-muted-foreground mb-8 text-sm px-8">Drag and drop or click to upload a clear photo of your plant's development area.</p>
                  
                  <div className="flex gap-4">
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-foreground text-background px-6 py-3 rounded-xl font-semibold hover:bg-primary transition-colors"
                    >
                      Browse Files
                    </button>
                    <button 
                      onClick={() => {
                        if (fileInputRef.current) {
                          fileInputRef.current.capture = "environment";
                          fileInputRef.current.click();
                        }
                      }}
                      className="bg-muted text-foreground px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:bg-accent hover:text-primary transition-colors"
                    >
                      <Camera className="w-5 h-5" />
                      {tr("Take Photo", language)}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-card rounded-3xl p-8 border border-border shadow-sm min-h-[400px] flex flex-col relative">
            <AnimatePresence mode="wait">
              {!isAnalyzing && !result && (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground"
                >
                  <Camera className="w-16 h-16 opacity-20 mb-4" />
                  <p>{tr("Upload an image to see AI analysis results here.", language)}</p>
                </motion.div>
              )}

              {isAnalyzing && (
                <motion.div 
                  key="analyzing"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex-1 flex flex-col items-center justify-center text-center"
                >
                  <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                  <h3 className="text-xl font-bold text-foreground">{tr("Analyzing Image...", language)}</h3>
                  <p className="text-muted-foreground mt-2">{tr("Our AI is analyzing crop development patterns and flowering stages.", language)}</p>
                </motion.div>
              )}

              {result && !isAnalyzing && (
                <motion.div 
                  key="result"
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="flex-1"
                >
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="text-2xl font-bold text-foreground">{tr("Analysis Complete", language)}</h3>
                    <button
                      onClick={handleSpeak}
                      className={`p-3 rounded-full transition-all ${
                        isPlaying ? 'bg-primary text-white animate-pulse' : 'bg-muted text-foreground hover:text-primary'
                      }`}
                    >
                      <Volume2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-primary/5 border border-primary/10 rounded-2xl p-5">
                      <p className="text-primary/60 font-semibold text-xs uppercase tracking-wider mb-1">🌼 {tr("Growth Stage", language)}</p>
                      <p className="text-foreground font-bold text-lg">{tr(result.stage, language)}</p>
                    </div>
                    
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 relative overflow-hidden">
                      <p className="text-slate-500 font-semibold text-xs uppercase tracking-wider mb-1">📊 Confidence</p>
                      <div className="flex items-center gap-2">
                        <p className="text-slate-900 font-bold text-lg">{result.confidence}%</p>
                        {result.confidence < 40 && (
                          <Badge variant="outline" className="text-[10px] bg-amber-50 text-amber-600 border-amber-200">
                            {tr("Low Confidence", language)}
                          </Badge>
                        )}
                      </div>
                      {result.confidence < 40 && (
                        <p className="text-[10px] text-amber-500 mt-2 italic leading-tight">
                          * {tr("Prediction is uncertain. Ensure the photo is clear and well-lit.", language)}
                        </p>
                      )}
                    </div>

                    <div className="bg-muted/30 rounded-2xl p-5">
                      <p className="text-foreground font-bold mb-3 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                        {tr('action.analyze', language)}
                      </p>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {tr(result.recommendation, language)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </AppLayout>
  );
}
