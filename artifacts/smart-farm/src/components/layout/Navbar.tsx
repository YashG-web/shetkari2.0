import { Link, useLocation } from 'wouter';
import { useAppStore, Language } from '@/store/use-app-store';
import { Menu, X, Globe, Activity } from 'lucide-react';
import { useTranslation } from '@/lib/translations';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGetSimulatorConfig, useUpdateSimulatorConfig, getGetSimulatorConfigQueryKey } from '@workspace/api-client-react';
import { useQueryClient } from "@tanstack/react-query";
import { toast } from 'sonner';

export function Navbar() {
  const queryClient = useQueryClient();
  const [location] = useLocation();
  const { language, setLanguage, isSimulatorOn, setIsSimulatorOn } = useAppStore();
  const tr = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const { data: config } = useGetSimulatorConfig();
  const updateConfig = useUpdateSimulatorConfig({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetSimulatorConfigQueryKey() });
      }
    }
  });

  // Sync state with backend config on mount
  useEffect(() => {
    if (config) {
      setIsSimulatorOn(config.enabled ?? true);
    }
  }, [config, setIsSimulatorOn]);

  const toggleSimulator = () => {
    const newVal = !isSimulatorOn;
    setIsSimulatorOn(newVal);
    if (config) {
      updateConfig.mutate({ 
        data: { 
          ...config, 
          enabled: newVal 
        } 
      });
      toast.info(newVal ? "Simulator Mode Active" : "Live IoT Mode Active");
    }
  };

  const navLinks = [
    { path: '/', label: tr('nav.dashboard', language) },
    { path: '/live-data', label: tr('nav.live_data', language) },
    { path: '/recommendation', label: tr('nav.recommendation', language) },
    { path: '/fertilizer', label: tr('nav.fertilizers', language) },
    { path: '/crop-analysis', label: tr('nav.crop_analysis', language) },
    { path: '/simulator', label: tr('nav.simulator', language) },
    { path: '/support', label: tr('nav.support', language) },
  ];

  const toggleLang = () => {
    const nextLang: Record<Language, Language> = { en: 'hi', hi: 'mr', mr: 'en' };
    setLanguage(nextLang[language]);
  };

  return (
    <header className="sticky top-0 z-50 w-full glass-card border-b border-white/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-3">
            <div className="w-14 h-14 flex items-center justify-center">
              <img src="/images/Traditional farmer with wheat and sickle.png" alt="Shetkari Logo" className="w-full h-full object-contain" />
            </div>
            <span className="font-display font-bold text-2xl tracking-tight text-foreground">
              SHET<span className="text-primary">KARI</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = location === link.path;
              return (
                <Link key={link.path} href={link.path} className={`text-sm font-medium transition-colors relative py-2 ${isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
                  {link.label}
                  {isActive && (
                    <motion.div layoutId="navbar-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Controls */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={toggleSimulator}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all font-bold text-xs ring-1 ${
                isSimulatorOn 
                  ? 'bg-amber-50 text-amber-600 ring-amber-200 shadow-sm' 
                  : 'bg-emerald-50 text-emerald-600 ring-emerald-200 shadow-sm shadow-emerald-100'
              }`}
            >
              <Activity className={`w-4 h-4 ${!isSimulatorOn ? 'animate-pulse' : ''}`} />
              {isSimulatorOn ? tr('nav.sim_on') : tr('nav.live_mode')}
            </button>

            <button 
              onClick={toggleLang}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent/50 hover:bg-accent text-primary transition-colors font-medium text-sm"
            >
              <Globe className="w-4 h-4" />
              {language.toUpperCase()}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-4">
            <button 
              onClick={toggleLang}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-accent/50 text-primary"
            >
              {language.toUpperCase()}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-foreground p-2 -mr-2"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t bg-white/95 backdrop-blur-xl"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => {
                const isActive = location === link.path;
                return (
                  <Link 
                    key={link.path} 
                    href={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`block px-4 py-3 rounded-xl text-base font-medium ${isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
