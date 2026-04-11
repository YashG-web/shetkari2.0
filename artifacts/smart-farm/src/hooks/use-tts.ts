import { useCallback, useEffect, useState } from 'react';
import { useAppStore } from '@/store/use-app-store';

export function useTTS() {
  const language = useAppStore((state) => state.language);
  const [isPlaying, setIsPlaying] = useState(false);

  const langMap: Record<string, string> = {
    en: 'en-IN',
    hi: 'hi-IN',
    mr: 'mr-IN',
  };

  useEffect(() => {
    // Stop speaking when component unmounts
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const speak = useCallback((text: string) => {
    if (!window.speechSynthesis) {
      console.warn('Speech synthesis not supported');
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const lang = langMap[language] || 'en-IN';
    utterance.lang = lang;
    
    // Attempt to find a native voice for the selected language
    const voices = window.speechSynthesis.getVoices();
    
    // Find best match: exact lang first, then same language code
    const voice = voices.find(v => v.lang === lang) || 
                  voices.find(v => v.lang.startsWith(lang.split('-')[0]));
    
    if (voice) {
      utterance.voice = voice;
    }

    utterance.rate = 0.85; 
    utterance.pitch = 1.0;
    
    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = (event) => {
      console.error('Speech error:', event);
      setIsPlaying(false);
    };

    window.speechSynthesis.speak(utterance);
  }, [language]);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  }, []);

  return { speak, stop, isPlaying };
}
