import { Link, useLocation } from 'wouter';
import { useAppStore, Language } from '@/store/use-app-store';
import { Leaf, Menu, X, Globe } from 'lucide-react';
import { useTranslation } from '@/lib/translations';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function Navbar() {
  const [location] = useLocation();
  const { language, setLanguage } = useAppStore();
  const tr = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { path: '/', label: tr('nav.dashboard', language) },
    { path: '/live-data', label: tr('nav.live_data', language) },
    { path: '/recommendation', label: tr('nav.recommendation', language) },
    { path: '/fertilizer', label: tr('nav.fertilizers', language) },
    { path: '/crop-analysis', label: tr('nav.crop_analysis', language) },
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
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-emerald-400 flex items-center justify-center shadow-lg shadow-primary/30">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="font-display font-bold text-2xl tracking-tight text-foreground">
              Smart<span className="text-primary">Farm</span>
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
