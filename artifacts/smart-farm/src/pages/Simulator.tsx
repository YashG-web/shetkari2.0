import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  useGetSimulatorConfig, 
  useUpdateSimulatorConfig, 
  useGetLatestSimulatorData, 
  useGenerateBulkData, 
  getGetSimulatorConfigQueryKey,
  getGetLatestSimulatorDataQueryKey
} from '@workspace/api-client-react';
import { useState, useEffect } from 'react';
import { useQueryClient } from "@tanstack/react-query";
import { 
  Database, Zap, Settings2, Activity, Download, Play, Square, 
  Thermometer, Droplets, Wind, CloudRain, Beaker, FlaskConical,
  BrainCircuit, Factory, Scale, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from "sonner";

export default function Simulator() {
  const queryClient = useQueryClient();
  const [isSimulating, setIsSimulating] = useState(false);
  const [bulkDuration, setBulkDuration] = useState<"1-month" | "3-months" | "6-months" | "1-year">("1-month");
  const [history, setHistory] = useState<any[]>([]);
  
  // Local state for immediate UI feedback and drafting
  const [localConfig, setLocalConfig] = useState<any>(null);
  const [draftConfig, setDraftConfig] = useState<any>(null);
  const [isDirty, setIsDirty] = useState(false);

  const { data: serverConfig, isSuccess: isConfigLoaded } = useGetSimulatorConfig();
  
  // Update local state when server data arrives
  useEffect(() => {
    if (serverConfig) {
      setLocalConfig(serverConfig);
      setDraftConfig(serverConfig);
      setIsDirty(false);
    }
  }, [serverConfig]);

  const updateConfigMutation = useUpdateSimulatorConfig({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetSimulatorConfigQueryKey() });
        setIsDirty(false);
        toast.success("Simulation parameters updated");
      }
    }
  });
  
  const { data: latestData } = useGetLatestSimulatorData({
    query: { 
      queryKey: getGetLatestSimulatorDataQueryKey(),
      enabled: isSimulating, 
      refetchInterval: 400, // Near-realtime polling
    }
  });

  const generateBulk = useGenerateBulkData();

  // Add to history when new data arrives
  useEffect(() => {
    if (latestData) {
      console.log("📥 Fetched Live Stream Data:", latestData);
      setHistory(prev => [latestData, ...prev].slice(0, 50));
    }
  }, [latestData]);

  const handleToggleModel = (model: string) => {
    if (!localConfig) return;
    const newConfig = {
      ...localConfig,
      models: {
        ...localConfig.models,
        [model]: !localConfig.models[model]
      }
    };
    setLocalConfig(newConfig);
    setDraftConfig(newConfig);
    updateConfigMutation.mutate({ data: newConfig });
  };

  const handleControlChange = (key: string, value: any, instant = false) => {
    if (!draftConfig) return;
    const newConfig = {
      ...draftConfig,
      controls: {
        ...draftConfig.controls,
        [key]: value
      }
    };
    setDraftConfig(newConfig);
    setIsDirty(true);

    if (instant) {
      setLocalConfig(newConfig);
      updateConfigMutation.mutate({ data: newConfig });
    }
  };

  const applyChanges = () => {
    if (!draftConfig) return;
    setLocalConfig(draftConfig);
    updateConfigMutation.mutate({ data: draftConfig });
  };

  const handleBulkGenerate = async () => {
    try {
      toast.info(`Generating ${bulkDuration} dataset...`);
      const csvData = await generateBulk.mutateAsync({ data: { duration: bulkDuration } });
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `farm_simulation_${bulkDuration}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Dataset downloaded successfully");
    } catch (error) {
      toast.error("Failed to generate dataset");
    }
  };

  if (!isConfigLoaded || !draftConfig) return <div className="p-8 text-center text-muted-foreground animate-pulse">Establishing secure link to simulation engine...</div>;

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto space-y-8 pb-12">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-display font-bold text-foreground flex items-center gap-3">
              <Factory className="w-10 h-10 text-primary" />
              Smart Farm Simulator
            </h1>
            <p className="text-muted-foreground text-lg font-medium mt-1">
              Test ML models and generate synthetic datasets in a controlled environment.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {isDirty && (
              <Button 
                variant="outline" 
                onClick={() => { setDraftConfig(localConfig); setIsDirty(false); }}
                className="rounded-xl border-dashed"
              >
                Reset
              </Button>
            )}
            <Button 
              size="lg" 
              variant={isSimulating ? "destructive" : "default"}
              onClick={() => setIsSimulating(!isSimulating)}
              className="rounded-2xl px-8 font-bold shadow-lg shadow-primary/20"
            >
              {isSimulating ? (
                <>
                  <Square className="w-5 h-5 mr-2 fill-current" />
                  Stop Simulation
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2 fill-current" />
                  Start Simulation
                </>
              )}
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column - Controls */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Model Toggle Panel */}
            <Card className="glass-card overflow-hidden">
              <CardHeader className="bg-primary/5">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <BrainCircuit className="w-6 h-6 text-primary" />
                  ML Models
                </CardTitle>
                <CardDescription>Enable models to generate predictions</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                {[
                  { id: 'randomForest', name: 'Random Forest', desc: 'Moisture Accuracy' },
                  { id: 'regression', name: 'Decision Tree', desc: 'Reasoning Insights' },
                  { id: 'lstm', name: 'Time Series', desc: '7-Hour Forecasting' },
                  { id: 'ruleEngine', name: 'Rule Engine', desc: 'Automation Layer' },
                  { id: 'growthAI', name: 'Growth Stage AI', desc: 'Real-time Crop Analysis' },
                ].map((model) => (
                  <div key={model.id} className="flex items-center justify-between group">
                    <div className="space-y-0.5">
                      <div className="text-sm font-bold text-foreground">{model.name}</div>
                      <div className="text-xs text-muted-foreground">{model.desc}</div>
                    </div>
                    <Switch 
                      checked={draftConfig.models[model.id]}
                      onCheckedChange={() => handleToggleModel(model.id)}
                      className="data-[state=checked]:bg-primary"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Environment Manipulation */}
            <Card className="glass-card">
              <CardHeader className="border-b border-border/10 pb-4">
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2 text-xl text-primary">
                    <Settings2 className="w-6 h-6" />
                    Env Controls
                  </CardTitle>
                  <Button 
                    size="sm" 
                    disabled={!isDirty} 
                    onClick={applyChanges}
                    className="h-8 rounded-lg font-bold"
                  >
                    Apply Changes
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-8 pt-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold flex items-center gap-2">
                       <CloudRain className="w-4 h-4 text-blue-500" />
                       Rain Condition
                    </span>
                    <Badge variant={draftConfig.controls.rain ? "default" : "secondary"} className="rounded-md">
                      {draftConfig.controls.rain ? "RAINING" : "NO RAIN"}
                    </Badge>
                  </div>
                  <Switch 
                    checked={draftConfig.controls.rain}
                    onCheckedChange={(val) => handleControlChange('rain', val, true)}
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm font-bold flex items-center gap-2">
                      <Thermometer className="w-4 h-4 text-orange-500" />
                      Temperature ({draftConfig.controls.temperature}°C)
                    </span>
                  </div>
                  <Slider 
                    value={[draftConfig.controls.temperature]}
                    min={0} max={50} step={1}
                    onValueChange={([val]) => handleControlChange('temperature', val)}
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm font-bold flex items-center gap-2">
                      <Wind className="w-4 h-4 text-teal-500" />
                      Humidity ({draftConfig.controls.humidity}%)
                    </span>
                  </div>
                  <Slider 
                    value={[draftConfig.controls.humidity]}
                    min={0} max={100} step={1}
                    onValueChange={([val]) => handleControlChange('humidity', val)}
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm font-bold flex items-center gap-2">
                      <Droplets className="w-4 h-4 text-blue-400" />
                      Soil Moisture ({draftConfig.controls.soilMoisture}%)
                    </span>
                  </div>
                  <Slider 
                    value={[draftConfig.controls.soilMoisture]}
                    min={0} max={100} step={1}
                    onValueChange={([val]) => handleControlChange('soilMoisture', val)}
                  />
                </div>

                <div className="space-y-6 pt-2 border-t border-border/10">
                   <div className="flex items-center gap-2">
                      <Beaker className="w-4 h-4 text-purple-500" /> 
                      <span className="text-sm font-bold">Soil Nutrients (N-P-K)</span>
                   </div>
                   
                   <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
                          <label>Nitrogen (N)</label>
                          <span className="text-primary">{draftConfig.controls.nitrogen} mg/kg</span>
                        </div>
                        <Slider 
                           value={[draftConfig.controls.nitrogen]}
                           min={0} max={140} step={1}
                           onValueChange={([val]) => handleControlChange('nitrogen', val)}
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
                          <label>Phosphorus (P)</label>
                          <span className="text-primary">{draftConfig.controls.phosphorus} mg/kg</span>
                        </div>
                        <Slider 
                           value={[draftConfig.controls.phosphorus]}
                           min={0} max={140} step={1}
                           onValueChange={([val]) => handleControlChange('phosphorus', val)}
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
                          <label>Potassium (K)</label>
                          <span className="text-primary">{draftConfig.controls.potassium} mg/kg</span>
                        </div>
                        <Slider 
                           value={[draftConfig.controls.potassium]}
                           min={0} max={140} step={1}
                           onValueChange={([val]) => handleControlChange('potassium', val)}
                        />
                      </div>
                   </div>

                   <div className="space-y-2 pt-2">
                      <span className="text-xs font-bold flex items-center gap-1">
                        <FlaskConical className="w-3 h-3 text-emerald-500" /> Soil pH ({draftConfig.controls.pH})
                      </span>
                      <Slider 
                         value={[draftConfig.controls.pH]}
                         min={4} max={10} step={0.1}
                         onValueChange={([val]) => handleControlChange('pH', val)}
                      />
                   </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Generation & Table */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Bulk Generation Card */}
            <Card className="bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-950/20 dark:to-background border-indigo-100 dark:border-indigo-900 shadow-xl overflow-hidden relative">
               <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                  <Database className="w-32 h-32" />
               </div>
               <CardContent className="pt-8 pb-8 flex flex-col md:flex-row items-center gap-8 relative z-10">
                  <div className="flex-1 text-center md:text-left space-y-2">
                    <h3 className="text-2xl font-bold font-display">Dataset Factory</h3>
                    <p className="text-muted-foreground font-medium">Generate years of high-quality synthetic data for your ML training pipelines instantly.</p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-4 min-w-[320px]">
                    <Select value={bulkDuration} onValueChange={(v: any) => setBulkDuration(v)}>
                      <SelectTrigger className="w-full sm:w-[140px] rounded-xl font-bold h-12 bg-white">
                        <SelectValue placeholder="Duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-month">1 Month</SelectItem>
                        <SelectItem value="3-months">3 Months</SelectItem>
                        <SelectItem value="6-months">6 Months</SelectItem>
                        <SelectItem value="1-year">1 Year</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button 
                      onClick={handleBulkGenerate} 
                      className="w-full sm:w-auto rounded-xl px-10 h-12 font-bold bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200"
                    >
                      <Download className="w-5 h-5 mr-2" />
                      Generate CSV
                    </Button>
                  </div>
               </CardContent>
            </Card>

            {/* Live Visualization Panel */}
            <Card className="glass-card min-h-[500px]">
               <CardHeader className="flex flex-row items-center justify-between border-b border-white/40 pb-6">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                       <Activity className="w-6 h-6 text-primary animate-pulse" />
                       Live Stream Data
                    </CardTitle>
                    <CardDescription>Real-time simulation updates every 3 seconds</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={isSimulating ? "default" : "outline"} className="px-3 py-1 rounded-full font-bold">
                      {isSimulating ? "STREAM ACTIVE" : "STREAM PAUSED"}
                    </Badge>
                  </div>
               </CardHeader>
               <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-muted/30">
                        <TableRow>
                          <TableHead className="font-bold">Timestamp</TableHead>
                          <TableHead className="font-bold">Soil (%)</TableHead>
                          <TableHead className="font-bold">Temp (°C)</TableHead>
                          <TableHead className="font-bold">Rain</TableHead>
                          <TableHead className="font-bold">Growth</TableHead>
                          <TableHead className="font-bold">AI Analytics</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <AnimatePresence>
                          {history.map((row, i) => (
                            <motion.tr 
                              key={row.timestamp + i}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="group hover:bg-muted/50 transition-colors"
                            >
                              <TableCell className="font-mono text-xs text-muted-foreground">
                                {new Date(row.timestamp).toLocaleTimeString()}
                              </TableCell>
                              <TableCell className="font-bold">
                                <div className="flex items-center gap-2">
                                  {row.soilMoisture}%
                                  <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500" style={{ width: `${row.soilMoisture}%` }} />
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="font-medium">{row.temperature}°</TableCell>
                              <TableCell>
                                {row.rain ? (
                                  <Badge className="bg-blue-100 text-blue-700 border-none">Yes</Badge>
                                ) : (
                                  <Badge variant="outline" className="opacity-50">No</Badge>
                                )}
                              </TableCell>
                              <TableCell>
                                  {localConfig.models.growthAI && (
                                    <div className="flex flex-col gap-0.5">
                                      <span className="text-xs font-bold text-emerald-600">{row.growthStage}</span>
                                      <span className="text-[10px] text-muted-foreground">{row.growthConfidence}% conf.</span>
                                    </div>
                                  )}
                                </TableCell>
                                <TableCell>
                                <div className="flex flex-wrap gap-2">
                                  {localConfig.models.decisionTree && (
                                    <Badge variant="secondary" className="bg-indigo-100 text-indigo-700 border-none font-bold text-[10px]">
                                      DT (Reasoner): Active
                                    </Badge>
                                  )}
                                  {localConfig.models.randomForest && row.rfPrediction && (
                                    <Badge variant="secondary" className="bg-orange-100 text-orange-700 border-none font-bold text-[10px]">
                                      RF (Accuracy): {row.rfPrediction}%
                                    </Badge>
                                  )}
                                  {localConfig.models.ruleEngine && (
                                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-none font-bold text-[10px]">
                                      Rule: {row.pumpStatus || "Auto"}
                                    </Badge>
                                  )}
                                </div>
                              </TableCell>
                            </motion.tr>
                          ))}
                        </AnimatePresence>
                        {history.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={5} className="h-64 text-center">
                               <div className="flex flex-col items-center gap-4 text-muted-foreground">
                                  <Database className="w-12 h-12 opacity-20" />
                                  <p className="font-medium">No live data yet. Click "Start Simulation" to begin.</p>
                                </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
               </CardContent>
            </Card>
            {/* Logic Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className={`glass-card border-l-4 transition-all duration-500 ${
                  latestData?.fertilizerSource === "AI" 
                    ? "border-l-emerald-500 bg-emerald-50/10 dark:bg-emerald-500/5 shadow-emerald-100/20" 
                    : "border-l-orange-500 bg-orange-50/10 dark:bg-orange-500/5"
                }`}>
                   <CardHeader>
                     <CardTitle className={`text-lg flex items-center gap-2 ${
                       latestData?.fertilizerSource === "AI" ? "text-emerald-600 dark:text-emerald-400" : "text-orange-600 dark:text-orange-400"
                     }`}>
                       <FlaskConical className="w-5 h-5" />
                       AI Fertilizer Forecast
                     </CardTitle>
                   </CardHeader>
                   <CardContent>
                     <div className="space-y-3">
                       <div className="relative group">
                         <p className="text-sm font-bold text-foreground bg-white/50 dark:bg-black/40 p-3 rounded-xl border border-border/50 min-h-[60px] flex flex-col items-center justify-center text-center shadow-inner">
                           <span className="text-xs text-muted-foreground uppercase tracking-tight mb-1">Recommended Plan</span>
                           {latestData?.fertilizerRecommendation || "Awaiting AI Analysis..."}
                         </p>
                       </div>
                       
                       <div className="flex items-center justify-between pt-1">
                          <Badge variant="outline" className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0 ${
                            latestData?.fertilizerSource === "AI" ? "border-emerald-200 text-emerald-700" : "border-orange-200 text-orange-700"
                          }`}>
                            Source: {latestData?.fertilizerSource || "Calculating"}
                          </Badge>
                          
                          {latestData?.fertilizerSource === "AI" ? (
                            <div className="flex items-center gap-1 text-[9px] font-bold text-emerald-600 animate-pulse">
                              <Zap className="w-3 h-3 fill-current" />
                              OPTIMIZED
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-[9px] font-bold text-orange-600">
                              <Info className="w-3 h-3" />
                              STABLE
                            </div>
                          )}
                       </div>
                     </div>
                   </CardContent>
                </Card>

                <Card className="glass-card">
                   <CardHeader>
                     <CardTitle className="text-lg flex items-center gap-2">
                       <Scale className="w-5 h-5 text-primary" />
                       Rule Engine Logic
                     </CardTitle>
                   </CardHeader>
                   <CardContent>
                     <p className="text-sm font-medium text-muted-foreground bg-muted/30 p-4 rounded-xl border italic">
                       "{latestData?.ruleEngineOutput || "Awaiting simulation..."}"
                     </p>
                   </CardContent>
                </Card>
                 <Card className="glass-card bg-emerald-50/20 dark:bg-emerald-500/5">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2 text-emerald-600">
                        <Activity className="w-5 h-5" />
                        Growth Stage Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-end">
                        <div className="space-y-1">
                          <span className="text-xs font-bold text-muted-foreground uppercase">Current Stage</span>
                          <div className="text-2xl font-black text-foreground">{latestData?.growthStage || "Initial"}</div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-bold text-muted-foreground uppercase">Confidence</span>
                          <div className="text-lg font-bold text-emerald-500">{latestData?.growthConfidence || 0}%</div>
                        </div>
                      </div>
                      
                      {/* Visual Growth Progress */}
                      <div className="space-y-1.5 pt-2">
                        <div className="flex justify-between text-[10px] font-bold text-muted-foreground italic">
                          <span>Seedling</span>
                          <span>Harvest</span>
                        </div>
                        <div className="h-3 bg-muted rounded-full overflow-hidden border border-emerald-100 dark:border-emerald-900/30">
                          <motion.div 
                            className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600" 
                            initial={{ width: 0 }}
                            animate={{ width: `${(Math.min(4, ["Young Bud", "Mature Bud", "Early Bloom", "Full Bloom", "Wilthed"].indexOf(latestData?.growthStage || "") + 1) / 5) * 100}%` }}
                          />
                        </div>
                      </div>
                    </CardContent>
                 </Card>
                 <Card className="glass-card">
                    <CardHeader>
                     <CardTitle className="text-lg flex items-center gap-2">
                       <Info className="w-5 h-5 text-primary" />
                       Simulator Hint
                     </CardTitle>
                   </CardHeader>
                   <CardContent className="text-sm text-muted-foreground">
                     Try turning on **Rain** and watch the **Soil Moisture** increase over time. High **Temperature** will accelerate evaporation.
                   </CardContent>
                </Card>
             </div>

          </div>

        </div>
      </div>
    </AppLayout>
  );
}
