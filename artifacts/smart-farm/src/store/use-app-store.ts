import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Language = 'en' | 'hi' | 'mr';

interface AppState {
  language: Language;
  setLanguage: (lang: Language) => void;
  isSimulatorOn: boolean;
  setIsSimulatorOn: (on: boolean) => void;
  selectedCrop: string | null;
  setSelectedCrop: (crop: string | null) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      language: 'en',
      setLanguage: (lang) => set({ language: lang }),
      isSimulatorOn: true,
      setIsSimulatorOn: (on) => set({ isSimulatorOn: on }),
      selectedCrop: null,
      setSelectedCrop: (crop) => set({ selectedCrop: crop }),
    }),
    {
      name: 'shetkari-app-storage',
    }
  )
);
