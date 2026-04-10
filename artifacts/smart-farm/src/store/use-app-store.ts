import { create } from 'zustand';

export type Language = 'en' | 'hi' | 'mr';

interface AppState {
  language: Language;
  setLanguage: (lang: Language) => void;
  isSimulatorOn: boolean;
  setIsSimulatorOn: (on: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  language: 'en',
  setLanguage: (lang) => set({ language: lang }),
  isSimulatorOn: true,
  setIsSimulatorOn: (on) => set({ isSimulatorOn: on }),
}));
