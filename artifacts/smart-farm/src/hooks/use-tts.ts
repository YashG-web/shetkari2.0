import { useCallback, useEffect, useState } from 'react';
import { useAppStore } from '@/store/use-app-store';

export function useTTS() {
  const language = useAppStore((state) => state.language);
  const [isPlaying, setIsPlaying] = useState(false);

  const langMap = {
    en: 'en-IN', // Indian English for better local accent
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
    utterance.lang = langMap[language] || 'en-US';
    utterance.rate = 0.9; // Slightly slower for better comprehension
    
    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
  }, [language]);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  }, []);

  return { speak, stop, isPlaying };
}
