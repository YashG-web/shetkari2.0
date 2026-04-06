import { Language } from '../store/use-app-store';

type TranslationMap = Record<string, Record<Language, string>>;

export const t: TranslationMap = {
  // Navigation
  "nav.dashboard": { en: "Dashboard", hi: "डैशबोर्ड", mr: "डॅशबोर्ड" },
  "nav.live_data": { en: "Live Data", hi: "लाइव डेटा", mr: "थेट डेटा" },
  "nav.recommendation": { en: "Recommendation", hi: "सिफारिश", mr: "शिफारस" },
  "nav.fertilizers": { en: "Fertilizers", hi: "उर्वरक", mr: "खते" },
  "nav.crop_analysis": { en: "Crop Analysis", hi: "फसल विश्लेषण", mr: "पीक विश्लेषण" },
  "nav.simulator": { en: "Simulator", hi: "सिम्युलेटर", mr: "सिम्युलेटर" },

  // Dashboard & Live Data
  "sensor.soil_moisture": { en: "Soil Moisture", hi: "मिट्टी की नमी", mr: "मातीची आर्द्रता" },
  "sensor.temperature": { en: "Temperature", hi: "तापमान", mr: "तापमान" },
  "sensor.humidity": { en: "Humidity", hi: "नमी", mr: "आर्द्रता" },
  "sensor.pump_status": { en: "Water Pump", hi: "पानी का पंप", mr: "पाण्याचा पंप" },
  "sensor.connected": { en: "System Connected", hi: "सिस्टम कनेक्टेड है", mr: "सिस्टम कनेक्टेड आहे" },
  "sensor.last_updated": { en: "Last Updated", hi: "अंतिम अद्यतन", mr: "शेवटचे अपडेट" },
  "sensor.refresh": { en: "Refresh Data", hi: "डेटा रिफ्रेश करें", mr: "डेटा रिफ्रेश करा" },
  "sensor.future_moisture": { en: "Future Moisture (AI)", hi: "भविष्य की नमी (AI)", mr: "भविष्यातील ओलावा (AI)" },
  "sensor.prediction_status": { en: "AI Prediction Status", hi: "AI भविष्यवाणी स्थिति", mr: "AI अंदाज स्थिति" },
  
  "weather.summary": { en: "Weather Summary", hi: "मौसम सारांश", mr: "हवामानाचा सारांश" },
  "weather.alerts": { en: "Active Alerts", hi: "सक्रिय अलर्ट", mr: "सक्रिय अलर्ट" },

  // Actions
  "action.get_recommendation": { en: "Get Recommendation", hi: "सिफारिश प्राप्त करें", mr: "शिफारस मिळवा" },
  "action.analyze": { en: "Analyze Now", hi: "विश्लेषण करें", mr: "विश्लेषण करा" },
  "action.buy_now": { en: "Buy Now", hi: "अभी खरीदें", mr: "आता खरेदी करा" },
  "action.upload_photo": { en: "Upload Photo", hi: "फोटो अपलोड करें", mr: "फोटो अपलोड करा" },
  "action.take_photo": { en: "Take Photo", hi: "फोटो खींचे", mr: "फोटो काढा" },
  "action.listen": { en: "Listen", hi: "सुनें", mr: "ऐका" },

  // General Status
  "status.loading": { en: "Loading data...", hi: "डेटा लोड हो रहा है...", mr: "डेटा लोड होत आहे..." },
  "status.error": { en: "Failed to load data", hi: "डेटा लोड करने में विफल", mr: "डेटा लोड करण्यात अयशस्वी" },
  "status.on": { en: "ON", hi: "चालू", mr: "चालू" },
  "status.off": { en: "OFF", hi: "बंद", mr: "बंद" },
};

export function useTranslation() {
  return function translate(key: keyof typeof t, lang: Language): string {
    return t[key]?.[lang] || key;
  };
}
