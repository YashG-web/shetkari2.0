import { useAppStore, Language } from '../store/use-app-store';

type TranslationMap = Record<string, Record<Language, string>>;

export const t: TranslationMap = {
  // Navigation
  "nav.dashboard": { en: "Dashboard", hi: "डैशबोर्ड", mr: "डॅशबोर्ड" },
  "nav.live_data": { en: "Live Data", hi: "लाइव डेटा", mr: "थेट डेटा" },
  "nav.recommendation": { en: "Recommendation", hi: "सिफारिश", mr: "शिफारस" },
  "nav.fertilizers": { en: "Fertilizers", hi: "उर्वरक", mr: "खते" },
  "nav.crop_analysis": { en: "Crop Analysis", hi: "फसल विश्लेषण", mr: "पीक विश्लेषण" },
  "nav.simulator": { en: "Simulator", hi: "सिम्युलेटर", mr: "सिम्युलेटर" },
  "nav.support": { en: "Help & Support", hi: "सहायता और समर्थन", mr: "मदत आणि समर्थन" },

  // Dashboard & Hero
  "app.title": { en: "SHETKARI Intelligence", hi: "शेतकरी इंटेलिजेंस", mr: "शेतकरी बुद्धिमत्ता" },
  "app.subtitle": { en: "Real-time insights and AI recommendations for optimal crop health and yield.", hi: "इष्टतम फसल स्वास्थ्य और उपज के लिए वास्तविक समय की अंतर्दृष्टि और एआई सिफारिशें।", mr: "इष्टतम पीक आरोग्य आणि उत्पन्नासाठी रिअल-टाइम इनसाइट्स आणि एआय शिफारसी." },
  
  // Status & Sensors
  "sensor.soil_moisture": { en: "Soil Moisture", hi: "मिट्टी की नमी", mr: "मातीची आर्द्रता" },
  "sensor.temperature": { en: "Temperature", hi: "तापमान", mr: "तापमान" },
  "sensor.humidity": { en: "Humidity", hi: "नमी", mr: "आर्द्रता" },
  "sensor.pump_status": { en: "Water Pump", hi: "पानी का पंप", mr: "पाण्याचा पंप" },
  "sensor.connected": { en: "System Connected", hi: "सिस्टम कनेक्टेड है", mr: "सिस्टम कनेक्टेड आहे" },
  "sensor.last_updated": { en: "Last Updated", hi: "अंतिम अद्यतन", mr: "शेवटचे अपडेट" },
  "sensor.refresh": { en: "Refresh Data", hi: "डेटा रिफ्रेश करें", mr: "डेटा रिफ्रेश करा" },
  "sensor.future_moisture": { en: "Future Moisture (AI)", hi: "भविष्य की नमी (AI)", mr: "भविष्यातील ओलावा (AI)" },
  "sensor.prediction_status": { en: "AI Prediction Status", hi: "AI भविष्यवाणी स्थिति", mr: "AI अंदाज स्थिति" },
  
  "sensor.esp32_offline": { en: "ESP32 Offline", hi: "ESP32 ऑफ़लाइन", mr: "ESP32 ऑफलाइन" },
  "sensor.simulator_active": { en: "Simulator Active", hi: "सिम्युलेटर सक्रिय", mr: "सिम्युलेटर सक्रिय" },
  "sensor.iot_online": { en: "IoT Sensor Online", hi: "IoT सेंसर ऑनलाइन", mr: "IoT सेन्सर ऑनलाइन" },
  "sensor.ai_accuracy": { en: "AI Accuracy Check", hi: "एआई सटीकता जांच", mr: "एआय अचूकता तपासणी" },
  "sensor.nitrogen": { en: "Nitrogen (N)", hi: "नाइट्रोजन (N)", mr: "नायट्रोजन (N)" },
  "sensor.phosphorus": { en: "Phosphorus (P)", hi: "फास्फोरस (P)", mr: "फॉस्फरस (P)" },
  "sensor.potassium": { en: "Potassium (K)", hi: "पोटेशियम (K)", mr: "पोटॅशियम (K)" },
  
  "status.disconnected": { en: "DISCONNECTED", hi: "डिस्कनेक्ट", mr: "डिस्कनेक्ट" },
  "status.stable": { en: "STABLE SIGNAL", hi: "स्थिर सिग्नल", mr: "स्थिर सिग्नल" },

  "weather.summary": { en: "Weather Summary", hi: "मौसम सारांश", mr: "हवामानाचा सारांश" },
  "weather.alerts": { en: "Active Alerts", hi: "सक्रिय अलर्ट", mr: "सक्रिय अलर्ट" },

  // Sections
  "section.environment": { en: "Environment Metrics", hi: "पर्यावरण मेट्रिक्स", mr: "पर्यावरण मेट्रिक्स" },
  "section.nutrients": { en: "Soil Nutrients (NPK)", hi: "मिट्टी के पोषक तत्व (NPK)", mr: "मातीतील पोषक तत्वे (NPK)" },
  "section.ai_reasoner": { en: "AI Reasoner (Decision Tree):", hi: "AI तर्क (Decision Tree):", mr: "AI तर्क (Decision Tree):" },
  "section.fertilizer_recommendation": { en: "AI Fertilizer Recommendation", hi: "एआई उर्वरक सिफारिश", mr: "एआय खत शिफारस" },
  "section.growth_analysis": { en: "Growth Stage Analysis", hi: "विकास चरण विश्लेषण", mr: "वाढ स्टेज विश्लेषण" },
  "section.trend_forecast": { en: "7-Hour AI Forecast", hi: "7-घंटे एआई पूर्वानुमान", mr: "7-तास एआय अंदाज" },
  "section.trend_history": { en: "7-Day Environment Trend", hi: "7-दिवसीय पर्यावरण रुझान", mr: "7-दिवसीय पर्यावरण कल" },

  // Actions
  "action.get_recommendation": { en: "Get Recommendation", hi: "सिफारिश प्राप्त करें", mr: "शिफारस मिळवा" },
  "action.analyze": { en: "Analyze Now", hi: "विश्लेषण करें", mr: "विश्लेषण करा" },
  "action.buy": { en: "Buy", hi: "अभी खरीदें", mr: "खरेदी करा" },
  "action.buy_now": { en: "Buy Now", hi: "अभी खरीदें", mr: "आता खरेदी करा" },
  "action.upload_photo": { en: "Upload Photo", hi: "फोटो अपलोड करें", mr: "फोटो अपलोड करा" },
  "action.take_photo": { en: "Take Photo", hi: "फोटो खींचे", mr: "फोटो काढा" },
  "action.listen": { en: "Listen", hi: "सुनें", mr: "ऐका" },
  "action.browse_files": { en: "Browse Files", hi: "फाइलें ब्राउज़ करें", mr: "फाईल्स ब्राउझ करा" },
  "action.change_photo": { en: "Change Photo", hi: "फोटो बदलें", mr: "फोटो बदला" },

  // Simulator
  "sim.title": { en: "Smart Farm Simulator", hi: "स्मार्ट फार्म सिम्युलेटर", mr: "स्मार्ट फार्म सिम्युलेटर" },
  "sim.subtitle": { en: "Test ML models and generate synthetic datasets in a controlled environment.", hi: "नियंत्रित वातावरण में एमएल मॉडल का परीक्षण करें और सिंथेटिक डेटासेट उत्पन्न करें।", mr: "नियंत्रित वातावरणात एमएल मॉडेल्सची चाचणी करा आणि सिंथेटिक डेटासेट तयार करा." },
  "sim.start": { en: "Start Simulation", hi: "सिमुलेशन शुरू करें", mr: "सिमुलेशन सुरू करा" },
  "sim.stop": { en: "Stop Simulation", hi: "सिमुलेशन बंद करें", mr: "सिमुलेशन थांबवा" },
  "sim.ml_models": { en: "ML Models", hi: "एमएल मॉडल", mr: "ML मॉडेल्स" },
  "sim.env_controls": { en: "Env Controls", hi: "पर्यावरण नियंत्रण", mr: "पर्यावरण नियंत्रणे" },
  "sim.apply": { en: "Apply Changes", hi: "परिवर्तन लागू करें", mr: "बदल लागू करा" },
  "sim.dataset_factory": { en: "Dataset Factory", hi: "डेटासेट फैक्ट्री", mr: "डेटासेट फॅक्टरी" },
  "sim.generate_csv": { en: "Generate CSV", hi: "CSV उत्पन्न करें", mr: "CSV जनरेट करा" },
  "sim.live_stream": { en: "Live Stream Data", hi: "लाइव स्ट्रीम डेटा", mr: "थेट प्रवाहित डेटा" },

  "rec.risk_level": { en: "Risk Level", hi: "जोखिम स्तर", mr: "धोका पातळी" },
  "rec.identified_issue": { en: "Identified Issue", hi: "पहचानी गई समस्या", mr: "ओळखलेली समस्या" },
  "rec.suggested_actions": { en: "Suggested Actions", hi: "सुझाए गए कार्य", mr: "सुचवलेली कृती" },
  "rec.recommended_product": { en: "Recommended Product", hi: "अनुशंसित उत्पाद", mr: "शिफारस केलेले उत्पादन" },
  "rec.buy_on": { en: "Buy on", hi: "पर खरीदें", mr: "वर खरेदी करा" },
  "rec.low": { en: "LOW", hi: "कम", mr: "कमी" },
  "rec.medium": { en: "MEDIUM", hi: "मध्यम", mr: "मध्यम" },
  "rec.high": { en: "HIGH", hi: "उच्च", mr: "उच्च" },

  "fert.subtitle": { en: "Recommended fertilizers based on common soil deficiencies.", hi: "आम मिट्टी की कमियों के आधार पर अनुशंसित उर्वरक।", mr: "सामान्य मातीतील कमतरतांवर आधारित शिफारस केलेली खते." },

  "analysis.subtitle": { en: "Upload a photo of your crop to instantly identify its current growth stage and get optimization tips.", hi: "अपनी फसल की एक तस्वीर अपलोड करें ताकि उसके वर्तमान विकास चरण की तुरंत पहचान की जा सके और अनुकूलन युक्तियां प्राप्त की जा सकें।", mr: "आपल्या पिकाचा फोटो अपलोड करा, जेणेकरून त्याच्या सध्याच्या वाढीच्या स्टेजची त्वरित ओळख होईल आणि ऑप्टिमायझेशन टिप्स मिळतील." },
  "analysis.upload_title": { en: "Upload Crop Image", hi: "फसल की छवि अपलोड करें", mr: "पिकाची प्रतिमा अपलोड करा" },
  "analysis.upload_desc": { en: "Drag and drop or click to upload a clear photo of your plant's development area.", hi: "अपने पौधे के विकास क्षेत्र की स्पष्ट तस्वीर अपलोड करने के लिए ड्रैग और ड्रॉप करें या क्लिक करें।", mr: "आपल्या वनस्पतीच्या विकास क्षेत्राचा स्पष्ट फोटो अपलोड करण्यासाठी ड्रॅग आणि ड्रॉप करा किंवा क्लिक करा." },
  "analysis.empty_state": { en: "Upload an image to see AI analysis results here.", hi: "एआई विश्लेषण परिणाम यहां देखने के लिए एक छवि अपलोड करें।", mr: "येथे एआय विश्लेषण निकाल पाहण्यासाठी प्रतिमा अपलोड करा." },
  "analysis.analyzing_title": { en: "Analyzing Image...", hi: "छवि का विश्लेषण किया जा रहा है...", mr: "प्रतिमेचे विश्लेषण केले जात आहे..." },
  "analysis.analyzing_desc": { en: "Our AI is analyzing crop development patterns and flowering stages.", hi: "हमारा एआई फसल विकास पैटर्न और फूलों के चरणों का विश्लेषण कर रहा है।", mr: "आमचे एआय पीक विकास पॅटर्न आणि फुलांच्या टप्प्यांचे विश्लेषण करत आहे." },
  "analysis.complete_title": { en: "Analysis Complete", hi: "विश्लेषण पूरा हुआ", mr: "विश्लेषण पूर्ण झाले" },
  "analysis.growth_stage_label": { en: "🌼 Growth Stage", hi: "🌼 विकास चरण", mr: "🌼 वाढीचा टप्पा" },
  "analysis.confidence_label": { en: "📊 Confidence", hi: "📊 आत्मविश्वास", mr: "📊 आत्मविश्वास" },
  "analysis.recommendation_label": { en: "AI Recommendation", hi: "एआई सिफारिश", mr: "एआय शिफारस" },
  "analysis.low_confidence": { en: "Low Confidence", hi: "कम आत्मविश्वास", mr: "कमी आत्मविश्वास" },
  "analysis.uncertain_hint": { en: "* Prediction is uncertain. Ensure the photo is clear and well-lit.", hi: "* भविष्यवाणी अनिश्चित है। सुनिश्चित करें कि फोटो स्पष्ट और अच्छी तरह से प्रकाशित है।", mr: "* अंदाज अनिश्चित आहे. फोटो स्पष्ट आणि प्रकाशमान असल्याची खात्री करा." },

  "sim.ml_models_desc": { en: "Enable models to generate predictions", hi: "भविष्यवाणियां उत्पन्न करने के लिए मॉडल सक्षम करें", mr: "अंदाज तयार करण्यासाठी मॉडेल्स सक्षम करा" },
  "sim.reset": { en: "Reset", hi: "रीसेट", mr: "रीसेट" },
  "sim.rain_condition": { en: "Rain Condition", hi: "बारिश की स्थिति", mr: "पावसाची स्थिती" },
  "sim.dataset_desc": { en: "Generate years of high-quality synthetic data for your ML training pipelines instantly.", hi: "तुरंत अपने एमएल प्रशिक्षण पाइपलाइन के लिए उच्च गुणवत्ता वाले सिंथेटिक डेटा के वर्ष उत्पन्न करें।", mr: "आपल्या ML प्रशिक्षण पाइपलाइनसाठी त्वरित उच्च-गुणवत्तेच्या सिंथेटिक डेटाची वर्षे तयार करा." },
  "sim.duration": { en: "Duration", hi: "अवधि", mr: "कालावधी" },
  "sim.live_stream_desc": { en: "Real-time simulation updates every 3 seconds", hi: "वास्तविक समय सिमुलेशन हर 3 सेकंड में अपडेट होता है", mr: "रिअल-टाइम सिमुलेशन दर 3 सेकंदांनी अपडेट होते" },
  "sim.stream_active": { en: "STREAM ACTIVE", hi: "स्ट्रीम सक्रिय", mr: "स्ट्रीम सक्रिय" },
  "sim.stream_paused": { en: "STREAM PAUSED", hi: "स्ट्रीम रुकी हुई", mr: "स्ट्रीम थांबली" },
  "sim.no_data": { en: "No live data yet. Click \"Start Simulation\" to begin.", hi: "अभी तक कोई लाइव डेटा नहीं है। शुरू करने के लिए \"सिमुलेशन शुरू करें\" पर क्लिक करें।", mr: "अद्याप कोणताही थेट डेटा नाही. सुरू करण्यासाठी \"सिमुलेशन सुरू करा\" वर क्लिक करा." },
  "sim.hint_title": { en: "Simulator Hint", hi: "सिम्युलेटर संकेत", mr: "सिम्युलेटर संकेत" },
  "sim.hint_desc": { en: "Try turning on **Rain** and watch the **Soil Moisture** increase over time. High **Temperature** will accelerate evaporation.", hi: "**बारिश** चालू करने का प्रयास करें और समय के साथ **मिट्टी की नमी** बढ़ते हुए देखें। उच्च **तापमान** वाष्पीकरण को तेज करेगा।", mr: "**पाऊस** चालू करून पहा आणि वेळोवेळी **मातीचा ओलावा** वाढताना पहा. उच्च **तापमान** बाष्पीभवन वेगवान करेल." },

  "table.timestamp": { en: "Timestamp", hi: "समय", mr: "वेळ" },
  "table.soil": { en: "Soil (%)", hi: "मिट्टी (%)", mr: "माती (%)" },
  "table.temp": { en: "Temp (°C)", hi: "तापमान (°C)", mr: "तापमान (°C)" },
  "table.rain": { en: "Rain", hi: "बारिश", mr: "पाऊस" },
  "table.growth": { en: "Growth", hi: "विकास", mr: "वाढ" },
  "table.ai_analytics": { en: "AI Analytics", hi: "एआई एनालिटिक्स", mr: "AI विश्लेषण" },
  "table.yes": { en: "Yes", hi: "हाँ", mr: "हो" },
  "table.no": { en: "No", hi: "नहीं", mr: "नाही" },
  "table.active": { en: "Active", hi: "सक्रिय", mr: "सक्रिय" },

  "section.fertilizer_forecast": { en: "AI Fertilizer Forecast", hi: "एआई उर्वरक पूर्वानुमान", mr: "एआय खत अंदाज" },
  "section.rule_engine": { en: "Rule Engine Logic", hi: "नियम इंजन तर्क", mr: "रूल इंजिन लॉजिक" },

  "status.awaiting_ai": { en: "Awaiting AI Analysis...", hi: "एआई विश्लेषण की प्रतीक्षा है...", mr: "AI विश्लेषणाची प्रतीक्षा आहे..." },
  "status.source": { en: "Source", hi: "स्रोत", mr: "स्रोत" },
  "status.optimized": { en: "OPTIMIZED", hi: "अनुकूलित", mr: "ऑप्टिमाइझ केलेले" },
  "status.stable_tag": { en: "STABLE", hi: "स्थिर", mr: "स्थिर" },
  "status.raining": { en: "RAINING", hi: "बारिश हो रही है", mr: "पाऊस पडत आहे" },
  "status.no_rain": { en: "NO RAIN", hi: "बारिश नहीं", mr: "पाऊस नाही" },
  "status.ai_active": { en: "AI ACTIVE", hi: "एआई सक्रिय", mr: "AI सक्रिय" },
  "status.predicted_trend": { en: "Predicted Trend", hi: "अनुमानित रुझान", mr: "अंदाज कल" },

  // Recommendation Data (Backend)
  "Poor - Crop shows signs of severe water stress": { 
    en: "Poor - Crop shows signs of severe water stress", 
    hi: "खराब - फसल गंभीर पानी के तनाव के लक्षण दिखाती है", 
    mr: "खराब - पिकामध्ये पाण्याचे तीव्र ताण दिसून येत आहे" 
  },
  "Moderate - Potential nutrient deficiency detected": { 
    en: "Moderate - Potential nutrient deficiency detected", 
    hi: "मध्यम - संभावित पोषक तत्वों की कमी का पता चला है", 
    mr: "मध्यम - संभाव्य पोषक तत्वांची कमतरता आढळली आहे" 
  },
  "Moderate - Heat stress warning": { 
    en: "Moderate - Heat stress warning", 
    hi: "मध्यम - गर्मी के तनाव की चेतावनी", 
    mr: "मध्यम - उष्णतेच्या ताणाची चेतावणी" 
  },
  "Good - Optimal growing conditions": { 
    en: "Good - Optimal growing conditions", 
    hi: "अच्छा - इष्टतम बढ़ती स्थितियाँ", 
    mr: "चांगले - वाढीसाठी अनुकूल स्थिती" 
  },

  "Critically low soil moisture detected": { 
    en: "Critically low soil moisture detected", 
    hi: "मिट्टी की नमी में गंभीर कमी का पता चला है", 
    mr: "मातीतील ओलावा अत्यंत कमी असल्याचे आढळले आहे" 
  },
  "Low NPK levels causing stunted growth or leaf discoloration": { 
    en: "Low NPK levels causing stunted growth or leaf discoloration", 
    hi: "कम NPK स्तर के कारण विकास रुक रहा है या पत्तियों का रंग बदल रहा है", 
    mr: "कमी NPK पातळीमुळे वाढ खुंटणे किंवा पानांचा रंग बदलणे" 
  },
  "High ambient temperature causing transpiration stress": { 
    en: "High ambient temperature causing transpiration stress", 
    hi: "उच्च तापमान के कारण वाष्पोत्सर्जन तनाव", 
    mr: "उच्च तापमानामुळे बाष्पोत्सर्जन ताण" 
  },
  "No significant issues detected": { 
    en: "No significant issues detected", 
    hi: "कोई महत्वपूर्ण समस्या नहीं पाई गई", 
    mr: "कोणतीही विशेष समस्या आढळली नाही" 
  },

  "Immediately start irrigation cycle": { en: "Immediately start irrigation cycle", hi: "तुरंत सिंचाई चक्र शुरू करें", mr: "त्वरित सिंचन चक्र सुरू करा" },
  "Check soil for crusting or hydrophobic behavior": { en: "Check soil for crusting or hydrophobic behavior", hi: "मिट्टी की पपड़ी या पानी रोकने वाले व्यवहार की जांच करें", mr: "मातीवर कडक थर किंवा पाणी न शोषण्याची तपासणी करा" },
  "Monitor temperature to prevent heat shock": { en: "Monitor temperature to prevent heat shock", hi: "गर्मी के झटके को रोकने के लिए तापमान की निगरानी करें", mr: "उष्णतेचा झटका टाळण्यासाठी तापमानावर लक्ष ठेवा" },
  "Add organic mulch to retain moisture": { en: "Add organic mulch to retain moisture", hi: "नमी बनाए रखने के लिए जैविक मल्च डालें", mr: "ओलावा टिकवून ठेवण्यासाठी सेंद्रिय आच्छादन (मूलच) वापरा" },
  "Apply balanced NPK fertilizer within 48 hours": { en: "Apply balanced NPK fertilizer within 48 hours", hi: "48 घंटों के भीतर संतुलित NPK उर्वरक डालें", mr: "४८ तासांच्या आत संतुलित NPK खत द्या" },
  "Perform a leaf tissue test for micronutrient check": { en: "Perform a leaf tissue test for micronutrient check", hi: "सूक्ष्म पोषक तत्वों की जांच के लिए पत्तियों का परीक्षण करें", mr: "सूक्ष्म पोषक तत्वांच्या तपासणीसाठी पानांची चाचणी करा" },
  "Adjust irrigation to ensure nutrient uptake": { en: "Adjust irrigation to ensure nutrient uptake", hi: "पोषक तत्वों के अवशोषण के लिए सिंचाई समायोजित करें", mr: "पोषक तत्वे शोषली जाण्यासाठी सिंचन समायोजित करा" },
  "Ensure soil pH is between 6.0 and 7.0": { en: "Ensure soil pH is between 6.0 and 7.0", hi: "निश्चित करें कि मिट्टी का पीएच 6.0 और 7.0 के बीच है", mr: "मातीचा पीएच ६.० ते ७.० दरम्यान असल्याची खात्री करा" },
  "Use misting or overhead irrigation for cooling": { en: "Use misting or overhead irrigation for cooling", hi: "ठंडक के लिए मिस्टिंग या ओवरहेड सिंचाई का उपयोग करें", mr: "थंडव्यासाठी मिस्टिंग किंवा ओव्हरहेड सिंचनाचा वापर करा" },
  "Avoid mid-day field activities": { en: "Avoid mid-day field activities", hi: "दोपहर की खेत गतिविधियों से बचें", mr: "भरदुपारी शेतातील कामे टाळा" },
  "Monitor for leaf wilting": { en: "Monitor for leaf wilting", hi: "पत्तियों के मुरझाने की निगरानी करें", mr: "पाने सुकून पडण्यावर लक्ष ठेवा" },
  "Check for pest outbreaks which are common in heat": { en: "Check for pest outbreaks which are common in heat", hi: "गर्मी में कीटों के प्रकोप की जांच करें", mr: "उष्णतेत वाढणाऱ्या किडींच्या प्रादुर्भावाची तपासणी करा" },
  "Maintain current management practices": { en: "Maintain current management practices", hi: "वर्तमान प्रबंधन प्रथाओं को बनाए रखें", mr: "सध्याच्या व्यवस्थापन पद्धती चालू ठेवा" },
  "Scout field for early signs of pests/diseases": { en: "Scout field for early signs of pests/diseases", hi: "कीटों/रोगों के शुरुआती लक्षणों के लिए खेत का निरीक्षण करें", mr: "कीड/रोगांच्या सुरुवातीच्या लक्षणांसाठी शेताची पाहणी करा" },
  "Continue real-time monitoring": { en: "Continue real-time monitoring", hi: "वास्तविक समय की निगरानी जारी रखें", mr: "रिअल-टाइम देखरेख सुरू ठेवा" },
  "Clean irrigation filters": { en: "Clean irrigation filters", hi: "सिंचाई फिल्टर साफ करें", mr: "सिंचन फिल्टर स्वच्छ करा" },

  // Fertilizers (Catalog)
  "Liquid Humic Acid": { en: "Liquid Humic Acid", hi: "तरल ह्यूमिक एसिड", mr: "द्रवरूप ह्युमिक ऍसिड" },
  "Apply 5L per hectare via irrigation to improve water retention and soil structure.": { 
    en: "Apply 5L per hectare via irrigation to improve water retention and soil structure.", 
    hi: "जल धारण और मिट्टी की संरचना में सुधार के लिए सिंचाई के माध्यम से प्रति हेक्टेयर 5 लीटर डालें।", 
    mr: "पाणी धरून ठेवण्याची क्षमता आणि मातीची रचना सुधारण्यासाठी प्रति हेक्टरी ५ लिटर सिंचनाद्वारे द्या." 
  },
  "Iffco NPK 12-32-16": { en: "Iffco NPK 12-32-16", hi: "इफको NPK 12-32-16", mr: "इफको NPK 12-32-16" },
  "Apply 50 kg per hectare. Suitable for all field crops during vegetative stage.": { 
    en: "Apply 50 kg per hectare. Suitable for all field crops during vegetative stage.", 
    hi: "प्रति हेक्टेयर 50 किलोग्राम डालें। वानस्पतिक अवस्था के दौरान सभी फसलों के लिए उपयुक्त।", 
    mr: "प्रति हेक्टरी ५० किलो द्या. पिकांच्या वाढीच्या अवस्थेत सर्व पिकांसाठी उपयुक्त." 
  },
  "Seaweed Extract": { en: "Seaweed Extract", hi: "समुद्री शैवाल का अर्क", mr: "सीवीड अर्क (समुद्री शेवाळ अर्क)" },
  "Spray 2ml per Liter of water as foliar spray to help plants cope with abiotic stress.": { 
    en: "Spray 2ml per Liter of water as foliar spray to help plants cope with abiotic stress.", 
    hi: "पौधों को अजैविक तनाव से निपटने में मदद करने के लिए 2 मिली प्रति लीटर पानी में मिलाकर छिड़काव करें।", 
    mr: "अजैविक ताण सहन करण्यासाठी २ मिली प्रति लिटर पाण्यात मिसळून पानांवर फवारणी करा." 
  },
  "Coromandel Gromor 14-35-14": { en: "Coromandel Gromor 14-35-14", hi: "कोरोमंडल ग्रोमोर 14-35-14", mr: "कोरोमंडल ग्रोमोर 14-35-14" },
  "Periodic application as per crop cycle. No urgent requirement.": { 
    en: "Periodic application as per crop cycle. No urgent requirement.", 
    hi: "फसल चक्र के अनुसार समय-समय पर प्रयोग। कोई तत्काल आवश्यकता नहीं।", 
    mr: "पीक चक्रानुसार वेळोवेळी वापर करा. कोणतीही तातडीची गरज नाही." 
  },
  "Organic Compost": { en: "Organic Compost", hi: "जैविक खाद (कंपोस्ट)", mr: "सेंद्रिय खत (कंपोस्ट)" },
  "Apply 1-2 tons per hectare and mix into topsoil before irrigation.": { 
    en: "Apply 1-2 tons per hectare and mix into topsoil before irrigation.", 
    hi: "प्रति हेक्टेयर 1-2 टन डालें और सिंचाई से पहले ऊपरी मिट्टी में मिला दें।", 
    mr: "प्रति हेक्टरी १-२ टन वापरा आणि सिंचनापूर्वी मातीत मिसळून द्या." 
  },
  "DAP 18-46-0": { en: "DAP 18-46-0", hi: "DAP 18-46-0", mr: "DAP 18-46-0" },
  "Apply at sowing stage as per crop advisory, avoid direct root contact.": { 
    en: "Apply at sowing stage as per crop advisory, avoid direct root contact.", 
    hi: "फसल सलाह के अनुसार बुआई के समय डालें, जड़ों के सीधे संपर्क से बचें।", 
    mr: "पीक सल्ल्यानुसार पेरणीच्या वेळी वापरा, मुळांच्या थेट संपर्कापासून टाळा." 
  },
  "Muriate of Potash": { en: "Muriate of Potash", hi: "म्यूरेट ऑफ पोटाश", mr: "म्युरेट ऑफ पोटॅश" },
  "Apply 20-40 kg per acre based on soil test for potassium correction.": { 
    en: "Apply 20-40 kg per acre based on soil test for potassium correction.", 
    hi: "पोटेशियम सुधार के लिए मिट्टी परीक्षण के आधार पर 20-40 किलोग्राम प्रति एकड़ डालें।", 
    mr: "पोटॅशच्या कमतरतेसाठी माती परीक्षणाआधारे प्रति एकर २०-४० किलो वापरा." 
  },
  "Urea 46-0-0": { en: "Urea 46-0-0", hi: "यूरिया 46-0-0", mr: "युरिया 46-0-0" },
  "Split apply during vegetative stage and irrigate immediately after application.": { 
    en: "Split apply during vegetative stage and irrigate immediately after application.", 
    hi: "वानस्पतिक अवस्था के दौरान टुकड़ों में डालें और डालने के तुरंत बाद सिंचाई करें।", 
    mr: "वाढीच्या अवस्थेत हप्त्यांमध्ये द्या आणि दिल्यानंतर लगेच पाणी द्या." 
  },
  "Follow agronomist guidance and soil test recommendations before application.": { 
    en: "Follow agronomist guidance and soil test recommendations before application.", 
    hi: "प्रयोग करने से पहले कृषि विज्ञानी मार्गदर्शन और मिट्टी परीक्षण सिफारिशों का पालन करें।", 
    mr: "वापरण्यापूर्वी कृषी तज्ञांचे मार्गदर्शन आणि माती परीक्षण शिफारसींचे पालन करा." 
  },

  // Crop Analysis (ML Service)
  "Young Bud": { en: "Young Bud", hi: "कली (शुरुआती)", mr: "सुरुवातीची कळी" },
  "Mature Bud": { en: "Mature Bud", hi: "परिपक्व कली", mr: "परिपक्व कळी" },
  "Early Bloom": { en: "Early Bloom", hi: "शुरुआती फूल", mr: "सुरुवातीचे फूल" },
  "Full Bloom": { en: "Full Bloom", hi: "पूर्ण फूल", mr: "पूर्ण उमललेले फूल" },
  "Wilted": { en: "Wilted", hi: "मुरझाया हुआ", mr: "सुकलेले" },

  "Young bud stage - ensure adequate soil moisture and avoid water stress. Monitor for early pests.": {
    en: "Young bud stage - ensure adequate soil moisture and avoid water stress. Monitor for early pests.",
    hi: "कली की शुरुआती अवस्था - मिट्टी में पर्याप्त नमी सुनिश्चित करें और पानी की कमी से बचें। शुरुआती कीटों की निगरानी करें।",
    mr: "सुरुवातीची कळी अवस्था - मातीत पुरेसा ओलावा असल्याची खात्री करा आणि पाण्याचा ताण टाळा. सुरुवातीच्या किडींवर लक्ष ठेवा."
  },
  "Mature bud stage - optimal time for nutrient boosting. Keep environment stable for blooming.": {
    en: "Mature bud stage - optimal time for nutrient boosting. Keep environment stable for blooming.",
    hi: "परिपक्व कली अवस्था - पोषक तत्वों को बढ़ाने के लिए इष्टतम समय। फूलों के खिलने के लिए सुरक्षित वातावरण बनाए रखें।",
    mr: "परिपक्व कळी अवस्था - पोषक तत्वे वाढवण्यासाठी उत्तम वेळ. फुले उमलण्यासाठी वातावरण स्थिर ठेवा."
  },
  "Early bloom stage - protect from extreme temperatures. Soil should be consistently damp.": {
    en: "Early bloom stage - protect from extreme temperatures. Soil should be consistently damp.",
    hi: "फूलों के खिलने की शुरुआती अवस्था - अत्यधिक तापमान से बचाएं। मिट्टी लगातार नम होनी चाहिए।",
    mr: "सुरुवातीची फुलण्याची अवस्था - अति तापमानापासून संरक्षण करा. माती सतत ओलसर असावी."
  },
  "Full bloom stage - peak beauty and health. Ensure good ventilation and light.": {
    en: "Full bloom stage - peak beauty and health. Ensure good ventilation and light.",
    hi: "पूर्ण फूल अवस्था - स्वास्थ्य और सुंदरता का चरम स्तर। अच्छी हवा और रोशनी सुनिश्चित करें।",
    mr: "पूर्ण उमललेले फूल - पीक उत्तम आरोग्य आणि सौंदर्याच्या शिखरावर आहे. हवा खेळती आणि पुरेसा प्रकाश असल्याची खात्री करा."
  },
  "Wilted stage - bloom cycle ending. Monitor for hydration levels and transition to standard care.": {
    en: "Wilted stage - bloom cycle ending. Monitor for hydration levels and transition to standard care.",
    hi: "मुरझाई हुई अवस्था - फूलों का चक्र समाप्त हो रहा है। नमी के स्तर की निगरानी करें और सामान्य देखभाल शुरू करें।",
    mr: "सुकलेली अवस्था - फुलण्याचे चक्र संपत आहे. आर्द्रतेच्या पातळीवर लक्ष ठेवा आणि सामान्य काळजी घेण्यास सुरुवात करा."
  },
  "Continue regular crop monitoring and standard care.": {
    en: "Continue regular crop monitoring and standard care.",
    hi: "नियमित फसल निगरानी और सामान्य देखभाल जारी रखें।",
    mr: "नियमित पीक पाहणी आणि सामान्य काळजी सुरू ठेवा."
  },

  "analysis.status_prefix": { en: "The crop is in the", hi: "फसल", mr: "पीक" },
  "analysis.status_suffix": { en: "stage", hi: "अवस्था में है", mr: "टप्प्यात आहे" },
  "analysis.confidence_prefix": { en: "with", hi: "के साथ", mr: "सह" },
  "analysis.confidence_suffix": { en: "percent confidence", hi: "प्रतिशत आत्मविश्वास", mr: "टक्के आत्मविश्वास" },
  "analysis.recommendation_prefix": { en: "The AI recommendation is", hi: "एआई सिफारिश यह है", mr: "AI शिफारस अशी आहे" },
  "analysis.ai_recommendation": { en: "AI Recommendation", hi: "एआई सिफारिश", mr: "एआय शिफारस" },

  "audio.recommendation_intro": { en: "Here is your farm recommendation.", hi: "यहाँ आपकी खेत की सिफारिश है।", mr: "येथे तुमच्या शेतीसाठी शिफारस आहे." },
  "audio.crop_condition": { en: "Crop Condition is", hi: "फसल की स्थिति है", mr: "पिकाची स्थिती आहे" },
  "audio.main_issue": { en: "The main issue identified is", hi: "मुख्य समस्या की पहचान की गई है", mr: "ओळखलेली मुख्य समस्या आहे" },
  "audio.suggested_actions": { en: "Here are the suggested actions", hi: "यहाँ सुझाए गए कार्य हैं", mr: "येथे सुचवलेले उपाय आहेत" },
  "audio.recommended_fertilizer": { en: "Recommended fertilizer is", hi: "अनुशंसित उर्वरक है", mr: "शिफारस केलेले खत आहे" },
  "audio.npk_ratio": { en: "with NPK ratio", hi: "NPK अनुपात के साथ", mr: "NPK गुणोत्तरासह" },

  "ML Forecast": { en: "ML Forecast", hi: "एमएल पूर्वानुमान", mr: "ML अंदाज" },
  "moisture in next step": { en: "moisture in next step", hi: "अगले चरण में नमी", mr: "पुढील टप्प्यातील ओलावा" },
  
  "analysis.current_stage": { en: "Current Stage", hi: "वर्तमान चरण", mr: "सध्याची स्टेज" },
  "sensor.ph": { en: "Soil pH", hi: "मिट्टी pH", mr: "मातीचा pH" },

  // General Status
  "status.loading": { en: "Loading data...", hi: "डेटा लोड हो रहा है...", mr: "डेटा लोड होत आहे..." },
  "status.error": { en: "Failed to load data", hi: "डेटा लोड करने में विफल", mr: "डेटा लोड करण्यात अयशस्वी" },
  "status.on": { en: "ON", hi: "चालू", mr: "चालू" },
  "status.off": { en: "OFF", hi: "बंद", mr: "बंद" },
  // Recommendation
  "rec.subtitle": { en: "AI-driven agronomy based on real-time sensor streams.", hi: "वास्तविक समय सेंसर स्ट्रीम पर आधारित एआई-संचालित कृषि विज्ञान।", mr: "रिअल-टाइम सेन्सर प्रवाहावर आधारित एआय-चालित कृषिशास्त्र." },
  "rec.env_analysis": { en: "Environmental & Irrigation Analysis", hi: "पर्यावरण और सिंचाई विश्लेषण", mr: "पर्यावरण आणि सिंचन विश्लेषण" },
  "rec.system_status": { en: "SYSTEM STATUS: ", hi: "सिस्टम स्थिति: ", mr: "सिस्टम स्थिती: " },
  "rec.temp_stable": { en: "TEMP: STABLE", hi: "तापमान: स्थिर", mr: "तापमान: स्थिर" },
  "rec.humid_optimal": { en: "HUMID: OPTIMAL", hi: "नमी: इष्टतम", mr: "आर्द्रता: इष्टतम" },
  "rec.irrigation_advisory": { en: "Irrigation Advisory", hi: "सिंचाई सलाह", mr: "सिंचन सल्ला" },
  "rec.recommended_actions": { en: "Recommended Actions", hi: "अनुशंसित कार्य", mr: "शिफारस केलेले उपाय" },
  "rec.soil_analysis": { en: "Soil Nutrient & NPK Analysis", hi: "मृदा पोषक तत्व और एनपीके विश्लेषण", mr: "मातीतील पोषक तत्व आणि NPK विश्लेषण" },
  "rec.recommended_product": { en: "RECOMMENDED PRODUCT", hi: "अनुशंसित उत्पाद", mr: "शिफारस केलेले उत्पादन" },

  // Support Page
  "support.title": { en: "Help & Support", hi: "सहायता और समर्थन", mr: "मदत आणि समर्थन" },
  "support.subtitle": { en: "Get practical advice or troubleshooting help for your farm and devices.", hi: "अपने खेत और उपकरणों के लिए व्यावहारिक सलाह या समस्या निवारण सहायता प्राप्त करें।", mr: "तुमच्या शेतात आणि उपकरणांसाठी व्यावहारिक सल्ला किंवा मदतीसाठी संपर्क करा." },
  "support.call_now": { en: "Call Now", hi: "अभी कॉल करें", mr: "आता कॉल करा" },
  "support.expert": { en: "Crop Expert (Govt Helpline)", hi: "फसल विशेषज्ञ (सरकारी हेल्पलाइन)", mr: "पीक तज्ज्ञ (शासकीय हेल्पलाइन)" },
  "support.expert_desc": { en: "For crop disease, fertilizer, irrigation, and farming guidance", hi: "फसल रोग, उर्वरक, सिंचाई और खेती मार्गदर्शन के लिए", mr: "पीक रोग, खत, सिंचन आणि शेती मार्गदर्शनासाठी" },
  "support.hardware": { en: "Hardware / Sensor Support", hi: "हार्डवेयर / सेंसर समर्थन", mr: "हार्डवेअर / सेन्सर समर्थन" },
  "support.hardware_desc": { en: "For IoT sensor issues, connectivity, and device troubleshooting", hi: "IoT सेंसर समस्याओं, कनेक्टिविटी और डिवाइस समस्या निवारण के लिए", mr: "IoT सेन्सर समस्या, कनेक्टिव्हिटी आणि डिव्हाइसमधील अडचणींसाठी" },
  "support.emergency": { en: "Emergency Help", hi: "आपातकालीन सहायता", mr: "आणीबाणीची मदत" },
  "support.emergency_desc": { en: "For urgent emergency farming or safety support", hi: "तत्काल आपातकालीन खेती या सुरक्षा सहायता के लिए", mr: "तातडीची शेती किंवा सुरक्षिततेच्या मदतीसाठी" },
  "support.why_call": { en: "Why to call?", hi: "कॉल क्यों करें?", mr: "कॉल कशासाठी?" },
  "rec.chemical_comp": { en: "Chemical Composition: NPK ", hi: "रासायनिक संरचना: NPK ", mr: "रासायनिक रचना: NPK " },
  "rec.buy_on": { en: "BUY ON ", hi: "खरीदें ", mr: "खरेदी करा " },
  "rec.why_product": { en: "Why this product?", hi: "यह उत्पाद क्यों?", mr: "हे उत्पादन का?" },
  "rec.app_strategy": { en: "Application Strategy", hi: "आवेदन रणनीति", mr: "वापरण्याची पद्धत" },
  "rec.app_desc": { en: "Apply during early morning or late evening for maximum absorption. Ensure soil moisture is above 40% before application.", hi: "अधिकतम अवशोषण के लिए सुबह या देर शाम के दौरान लागू करें। आवेदन से पहले मिट्टी की नमी 40% से ऊपर सुनिश्चित करें।", mr: "जास्तीत जास्त शोषणासाठी लवकर सकाळी किंवा संध्याकाळी याचा वापर करा. लादण्यापूर्वी मातीची आर्द्रता 40% च्या वर असल्याची खात्री करा." },
  
  // Live Data
  "live.esp_offline": { en: "ESP32 Offline", hi: "ESP32 ऑफ़लाइन", mr: "ESP32 बंद आहे" },
  "live.sim_active": { en: "Simulator Active", hi: "सिम्युलेटर सक्रिय", mr: "सिम्युलेटर सक्रिय" },
  "live.sensor_online": { en: "IoT Sensor Online", hi: "IoT सेंसर ऑनलाइन है", mr: "IoT सेन्सर चालू आहे" },
  "live.disconnected": { en: "DISCONNECTED", hi: "संपर्क टूट गया", mr: "संपर्क तुटला" },
  "live.stable_signal": { en: "STABLE SIGNAL", hi: "स्थिर संकेत", mr: "स्थिर सिग्नल" },
  "live.env_metrics": { en: "Environment Metrics", hi: "पर्यावरण मेट्रिक्स", mr: "पर्यावरण मेट्रिक्स" },
  "live.soil_nutrients": { en: "Soil Nutrients (NPK)", hi: "मृदा पोषक तत्व (NPK)", mr: "मातीचे पोषक तत्व (NPK)" },
  "live.nitrogen": { en: "Nitrogen (N)", hi: "नाइट्रोजन (N)", mr: "नायट्रोजन (N)" },
  "live.phosphorus": { en: "Phosphorus (P)", hi: "फास्फोरस (P)", mr: "फॉस्फरस (P)" },
  "live.potassium": { en: "Potassium (K)", hi: "पोटेशियम (K)", mr: "पोटॅशियम (K)" },
  "live.analyzing_env": { en: "Analyzing environmental conditions...", hi: "पर्यावरणीय स्थितियों का विश्लेषण...", mr: "पर्यावरणाच्या स्थितीत विश्लेषण करत आहे..." },
  "live.fert_rec": { en: "Fertilizer Recommendation", hi: "उर्वरक की सिफारिश", mr: "खताची शिफारस" },
  "live.analyzing_nutrients": { en: "Analyzing nutrient balance...", hi: "पोषक तत्वों के संतुलन का विश्लेषण...", mr: "पोषक तत्त्वांच्या समतोलाचे विश्लेषण करत आहे..." },

  // Dashboard
  "dash.title": { en: "SHETKARI Intelligence", hi: "शेतकरी इंटेलिजेंस", mr: "शेतकरी इंटेलिजेंस" },
  "dash.subtitle": { en: "Real-time insights and AI recommendations for optimal crop health and yield.", hi: "इष्टतम फसल स्वास्थ्य और उपज के लिए रीयल-टाइम अंतर्दृष्टि और एआई सिफारिशें।", mr: "इष्टतम पीक आरोग्य आणि उत्पन्नासाठी रिअल-टाइम इनसाइट्स आणि AI शिफारसी." },
  "dash.esp_offline": { en: "ESP32: OFFLINE", hi: "ESP32: ऑफ़लाइन", mr: "ESP32: बंद आहे" },
  "dash.live_data": { en: "LIVE IOT DATA", hi: "लाइव IOT डेटा", mr: "थेट IOT डेटा" },
  "dash.sim_mode": { en: "SIMULATION MODE", hi: "सिमुलेशन मोड", mr: "सिम्युलेशन मोड" },
  "dash.ai_fert_rec": { en: "AI Fertilizer Recommendation", hi: "एआई उर्वरक सिफारिश", mr: "AI खताची शिफारस" },

  // Dynamic Recommendations (from Backend)
  "Poor - Crop shows signs of severe water stress": { en: "Poor - Crop shows signs of severe water stress", hi: "खराब - फसल गंभीर जल तनाव के संकेत दिखाती है", mr: "खराब - पीक गंभीर पाणी ताण दर्शवते" },
  "Moderate - Potential nutrient deficiency detected": { en: "Moderate - Potential nutrient deficiency detected", hi: "मध्यम - संभावित पोषक तत्वों की कमी का पता चला", mr: "मध्यम - संभाव्य पोषक तत्वांची कमतरता आढळली" },
  "Moderate - Heat stress warning": { en: "Moderate - Heat stress warning", hi: "मध्यम - गर्मी के तनाव की चेतावनी", mr: "मध्यम - उष्णता तणावाची चेतावणी" },
  "Good - Optimal growing conditions": { en: "Good - Optimal growing conditions", hi: "अच्छा - इष्टतम बढ़ती स्थितियां", mr: "चांगले - वाढीसाठी अनुकूल परिस्थिती" },

  "Critically low soil moisture detected": { en: "Critically low soil moisture detected", hi: "मिट्टी की नमी बहुत कम पाई गई", mr: "मातीची आर्द्रता अत्यंत कमी आढळली" },
  "Low NPK levels causing stunted growth or leaf discoloration": { en: "Low NPK levels causing stunted growth or leaf discoloration", hi: "कम एनपीके स्तर के कारण विकास रुकना या पत्तियों का रंग खराब होना", mr: "कमी NPK पातळीमुळे वाढ खुंटणे किंवा पाने पिवळी पडणे" },
  "High ambient temperature causing transpiration stress": { en: "High ambient temperature causing transpiration stress", hi: "उच्च परिवेश तापमान वाष्पोत्सर्जन तनाव का कारण बन रहा है", mr: "वातावरणातील उच्च तापमानामुळे बाष्पोत्सर्जन ताण निर्माण होत आहे" },
  "No significant issues detected": { en: "No significant issues detected", hi: "कोई महत्वपूर्ण समस्या नहीं पाई गई", mr: "कोणतीही महत्त्वपूर्ण समस्या आढळली नाही" },

  "Immediately start irrigation cycle": { en: "Immediately start irrigation cycle", hi: "तुरंत सिंचाई चक्र शुरू करें", mr: "त्वरीत सिंचन चक्र सुरू करा" },
  "Check soil for crusting or hydrophobic behavior": { en: "Check soil for crusting or hydrophobic behavior", hi: "मिट्टी की पपड़ी या हाइड्रोफोबिक व्यवहार की जाँच करें", mr: "मातीवर कडक थर किंवा पाणी न शोषण्याचे वर्तन तपासा" },
  "Monitor temperature to prevent heat shock": { en: "Monitor temperature to prevent heat shock", hi: "हीट शॉक को रोकने के लिए तापमान की निगरानी करें", mr: "उष्णतेचा झटका टाळण्यासाठी तापमानावर लक्ष ठेवा" },
  "Add organic mulch to retain moisture": { en: "Add organic mulch to retain moisture", hi: "नमी बनाए रखने के लिए जैविक मल्च डालें", mr: "ओलावा टिकवून ठेवण्यासाठी सेंद्रिय आच्छादन (mulch) वापरा" },
  "Apply balanced NPK fertilizer within 48 hours": { en: "Apply balanced NPK fertilizer within 48 hours", hi: "48 घंटों के भीतर संतुलित एनपीके उर्वरक लागू करें", mr: "पुढील ४८ तासांत संतुलित NPK खताचा वापर करा" },
  "Perform a leaf tissue test for micronutrient check": { en: "Perform a leaf tissue test for micronutrient check", hi: "सूक्ष्म पोषक तत्वों की जांच के लिए पत्तियों का परीक्षण करें", mr: "सूक्ष्म पोषक तत्वांच्या तपासणीसाठी पानांची चाचणी करा" },
  "Adjust irrigation to ensure nutrient uptake": { en: "Adjust irrigation to ensure nutrient uptake", hi: "पोषक तत्वों के अवशोषण को सुनिश्चित करने के लिए सिंचाई को समायोजित करें", mr: "पोषक तत्व शोषले जातील याची खात्री करण्यासाठी सिंचन समायोजित करा" },
  "Ensure soil pH is between 6.0 and 7.0": { en: "Ensure soil pH is between 6.0 and 7.0", hi: "सुनिश्चित करें कि मिट्टी का पीएच 6.0 और 7.0 के बीच है", mr: "मातीचा पीएच ६.० ते ७.० दरम्यान असल्याची खात्री करा" },
  "Use misting or overhead irrigation for cooling": { en: "Use misting or overhead irrigation for cooling", hi: "ठंडा करने के लिए मिस्टिंग या ओवरहेड सिंचाई का उपयोग करें", mr: "थंडावा देण्यासाठी फॉगर्स किंवा ओव्हरहेड सिंचनाचा वापर करा" },
  "Avoid mid-day field activities": { en: "Avoid mid-day field activities", hi: "दोपहर की गतिविधियों से बचें", mr: "दुपारच्या शेती कामांना टाळा" },
  "Monitor for leaf wilting": { en: "Monitor for leaf wilting", hi: "पत्तियों के मुरझाने की निगरानी करें", mr: "पाने कोमेजण्यावर लक्ष ठेवा" },
  "Check for pest outbreaks which are common in heat": { en: "Check for pest outbreaks which are common in heat", hi: "गर्मी में कीटों के प्रकोप की जाँच करें", mr: "उष्णतेमध्ये होणाऱ्या कीड प्रादुर्भावाची तपासणी करा" },
  "Maintain current management practices": { en: "Maintain current management practices", hi: "वर्तमान प्रबंधन प्रथाओं को बनाए रखें", mr: "सध्याच्या व्यवस्थापन पद्धती चालू ठेवा" },
  "Scout field for early signs of pests/diseases": { en: "Scout field for early signs of pests/diseases", hi: "कीटों/रोगों के शुरुआती संकेतों के लिए खेत की जाँच करें", mr: "कीड/रोगांच्या सुरुवातीच्या लक्षणांसाठी शेताची पाहणी करा" },
  "Continue real-time monitoring": { en: "Continue real-time monitoring", hi: "रीयल-टाइम निगरानी जारी रखें", mr: "रिअल-टाइम देखरेख सुरू ठेवा" },
  "Clean irrigation filters": { en: "Clean irrigation filters", hi: "सिंचाई फिल्टर साफ करें", mr: "सिंचन फिल्टर साफ करा" },

  "Rain detected. Natural irrigation sufficient. Keep pumps off.": { en: "Rain detected. Natural irrigation sufficient. Keep pumps off.", hi: "बारिश का पता चला। प्राकृतिक सिंचाई पर्याप्त है। पंप बंद रखें।", mr: "पाऊस आढळला. नैसर्गिक सिंचन पुरेसे आहे. पंप बंद ठेवा." },
  "Critical: Soil is too dry. Immediate irrigation required.": { en: "Critical: Soil is too dry. Immediate irrigation required.", hi: "गंभीर: मिट्टी बहुत सूखी है। तत्काल सिंचाई आवश्यक है।", mr: "गंभीर: माती खूप कोरडी आहे. त्वरित सिंचन आवश्यक आहे." },
  "High evaporation alert. Supplemental irrigation recommended.": { en: "High evaporation alert. Supplemental irrigation recommended.", hi: "उच्च वाष्पीकरण अलर्ट। पूरक सिंचाई की सिफारिश की गई।", mr: "उच्च बाष्पीभवन अलर्ट. पूरक सिंचनाची शिफारस केली जाते." },
  "High humidity. Reduced transpiration. Water sparingly to avoid fungal risk.": { en: "High humidity. Reduced transpiration. Water sparingly to avoid fungal risk.", hi: "उच्च आर्द्रता। कम वाष्पोत्सर्जन। कवक जोखिम से बचने के लिए कम पानी दें।", mr: "उच्च आर्द्रता. कमी बाष्पोत्सर्जन. बुरशीचा धोका टाळण्यासाठी कमी पाणी द्या." },
  "Soil is well-saturated. Irrigation not required.": { en: "Soil is well-saturated. Irrigation not required.", hi: "मिट्टी अच्छी तरह से संतृप्त है। सिंचाई की आवश्यकता नहीं है।", mr: "माती चांगली ओलावलेली आहे. सिंचनाची गरज नाही." },
  "Soil moisture is stable. No immediate irrigation needed.": { en: "Soil moisture is stable. No immediate irrigation needed.", hi: "मिट्टी की नमी स्थिर है। तत्काल सिंचाई की आवश्यकता नहीं है।", mr: "मातीची आर्द्रता स्थिर आहे. त्वरित सिंचनाची गरज नाही." },
  "Analyzing soil moisture...": { en: "Analyzing soil moisture...", hi: "मिट्टी की नमी का विश्लेषण...", mr: "मातीची आर्द्रता तपासत आहे..." },
  "Analyzing environmental conditions...": { en: "Analyzing environmental conditions...", hi: "पर्यावरणीय स्थितियों का विश्लेषण...", mr: "पर्यावरणाच्या स्थितीचे विश्लेषण करत आहे..." },

  "Apply 5L per hectare via irrigation to improve water retention and soil structure.": { en: "Apply 5L per hectare via irrigation to improve water retention and soil structure.", hi: "जल धारण और मिट्टी की संरचना में सुधार के लिए सिंचाई के माध्यम से प्रति हेक्टेयर 5 लीटर लगाएं।", mr: "पाणी धरून ठेवण्याची क्षमता आणि मातीची रचना सुधारण्यासाठी प्रति हेक्टर ५ लिटर ठिबकद्वारे द्या." },
  "Apply 50 kg per hectare. Suitable for all field crops during vegetative stage.": { en: "Apply 50 kg per hectare. Suitable for all field crops during vegetative stage.", hi: "प्रति हेक्टेयर 50 किलोग्राम लगाएं। वानस्पतिक अवस्था के दौरान सभी क्षेत्रीय फसलों के लिए उपयुक्त।", mr: "प्रति हेक्टर ५० किलोचा वापर करा. शाकीय वाढीच्या अवस्थेत सर्व पिकांसाठी उपयुक्त." },
  "Spray 2ml per Liter of water as foliar spray to help plants cope with abiotic stress.": { en: "Spray 2ml per Liter of water as foliar spray to help plants cope with abiotic stress.", hi: "अजैविक तनाव से निपटने में पौधों की मदद करने के लिए पर्णीय स्प्रे के रूप में प्रति लीटर पानी में 2 मिलीलीटर स्प्रे करें।", mr: "अजैविक ताणाशी लढण्यासाठी पानांवर २ मिली प्रति लिटर या प्रमाणात फवारणी करा." },
  "Periodic application as per crop cycle. No urgent requirement.": { en: "Periodic application as per crop cycle. No urgent requirement.", hi: "फसल चक्र के अनुसार समय-समय पर आवेदन। कोई तत्काल आवश्यकता नहीं है।", mr: "पीक चक्रानुसार वेळोवेळी वापर करा. कोणतीही तातडीची गरज नाही." },
  "Apply 1-2 tons per hectare and mix into topsoil before irrigation.": { en: "Apply 1-2 tons per hectare and mix into topsoil before irrigation.", hi: "प्रति हेक्टेयर 1-2 टन लगाएं और सिंचाई से पहले ऊपरी मिट्टी में मिला दें।", mr: "प्रति हेक्टर १-२ टन वापरा आणि सिंचनापूर्वी मातीत मिसळून द्या." },
  "Apply at sowing stage as per crop advisory, avoid direct root contact.": { en: "Apply at sowing stage as per crop advisory, avoid direct root contact.", hi: "फसल सलाह के अनुसार बुआई के चरण में आवेदन करें, सीधे जड़ संपर्क से बचें।", mr: "पीक सल्ल्यानुसार पेरणीच्या वेळी वापरा, मुळांशी थेट संपर्क टाळा." },
  "Apply 20-40 kg per acre based on soil test for potassium correction.": { en: "Apply 20-40 kg per acre based on soil test for potassium correction.", hi: "पोटेशियम सुधार के लिए मिट्टी परीक्षण के आधार पर 20-40 किलोग्राम प्रति एकड़ लगाएं।", mr: "पोटॅशियमच्या कमतरतेसाठी माती परीक्षणाद्वारे प्रति एकर २०-४० किलो वापरा." },
  "Split apply during vegetative stage and irrigate immediately after application.": { en: "Split apply during vegetative stage and irrigate immediately after application.", hi: "वानस्पतिक अवस्था के दौरान टुकड़ों में लगाएं और लगाने के तुरंत बाद सिंचाई करें।", mr: "शाकीय वाढीच्या काळात विभागून द्या आणि खत दिल्यावर लगेच पाणी द्या." },
  "Follow agronomist guidance and soil test recommendations before application.": { en: "Follow agronomist guidance and soil test recommendations before application.", hi: "आवेदन से पहले कृषिविज्ञानी के मार्गदर्शन और मिट्टी परीक्षण सिफारिशों का पालन करें।", mr: "वापरण्यापूर्वी कृषी तज्ज्ञांचे मार्गदर्शन आणि माती परीक्षणाचा सल्ला घ्या." },

  // AI Insights (Decision Tree)
  "🌧️ Recent rainfall boosted soil moisture levels.": { en: "🌧️ Recent rainfall boosted soil moisture levels.", hi: "🌧️ हाल की बारिश ने मिट्टी की नमी के स्तर को बढ़ा दिया है।", mr: "🌧️ नुकत्याच झालेल्या पावसामुळे मातीतील ओलावा वाढला आहे." },
  "🔥 High ambient temperature is accelerating evaporation.": { en: "🔥 High ambient temperature is accelerating evaporation.", hi: "🔥 उच्च परिवेश तापमान वाष्पीकरण को तेज कर रहा है।", mr: "🔥 वातावरणातील उच्च तापमानामुळे बाष्पीभवन वेगाने होत आहे." },
  "💧 High humidity is reducing transpiration stress.": { en: "💧 High humidity is reducing transpiration stress.", hi: "💧 उच्च आर्द्रता वाष्पोत्सर्जन तनाव को कम कर रही है।", mr: "💧 हवेतील जास्त आर्द्रतेमुळे बाष्पोत्सर्जन ताण कमी होत आहे." },
  "⚠️ Critical: Low moisture detected by sensors.": { en: "⚠️ Critical: Low moisture detected by sensors.", hi: "⚠️ गंभीर: सेंसर द्वारा कम नमी का पता चला है।", mr: "⚠️ गंभीर: सेन्सरद्वारे कमी ओलावा आढळला आहे." },
  "🔥 Extreme heat detected.": { en: "🔥 Extreme heat detected.", hi: "🔥 अत्यधिक गर्मी का पता चला।", mr: "🔥 अत्यंत उष्णता आढळली." },
  "📉 Nitrogen levels are dropping due to crop uptake.": { en: "📉 Nitrogen levels are dropping due to crop uptake.", hi: "📉 फसल द्वारा ग्रहण किए जाने के कारण नाइट्रोजन का स्तर गिर रहा है।", mr: "📉 पिकामुळे नायट्रोजनची पातळी कमी होत आहे." },
  "⚠️ Alert: Severe Nitrogen deficiency detected.": { en: "⚠️ Alert: Severe Nitrogen deficiency detected.", hi: "⚠️ अलर्ट: गंभीर नाइट्रोजन की कमी पाई गई।", mr: "⚠️ अलर्ट: नत्राची (Nitrogen) तीव्र कमतरता आढळली आहे." },
  "🍀 Environmental conditions are currently stable.": { en: "🍀 Environmental conditions are currently stable.", hi: "🍀 पर्यावरणीय स्थितियां वर्तमान में स्थिर हैं।", mr: "🍀 सध्या पर्यावरणीय परिस्थिती स्थिर आहे." },
  "Establishing initial baseline...": { en: "Establishing initial baseline...", hi: "प्रारंभिक आधार रेखा स्थापित की जा रही है...", mr: "सुरुवातीची आधारभूत माहिती गोळा करत आहे..." },
  "Waiting for sensor stream...": { en: "Waiting for sensor stream...", hi: "सेंसर स्ट्रीम की प्रतीक्षा की जा रही है...", mr: "सेन्सर डेटाची प्रतीक्षा करत आहे..." },
  "AI Reasoner disabled": { en: "AI Reasoner disabled", hi: "एआई तर्ककर्ता अक्षम है", mr: "AI तर्ककर्ता बंद आहे" },
  "AI Service temporarily offline.": { en: "AI Service temporarily offline.", hi: "एआई सेवा अस्थायी रूप से ऑफ़लाइन है।", mr: "AI सेवा तात्पुरती बंद आहे." },
  "Sync simulation step": { en: "Sync simulation step", hi: "सिमुलेशन चरण सिंक करें", mr: "सिम्युलेशन स्टेप सिंक करा" },

  // Growth Stages
  "Young Bud": { en: "Young Bud", hi: "नन्ही कली", mr: "कोवळी कळी" },
  "Mature Bud": { en: "Mature Bud", hi: "परिपक्व कली", mr: "पक्व कळी" },
  "Early Bloom": { en: "Early Bloom", hi: "शुरुआती खिलाव", mr: "सुरुवातीचा बहर" },
  "Full Bloom": { en: "Full Bloom", hi: "पूरा खिलाव", mr: "पूर्ण बहर" },
  "Wilted": { en: "Wilted", hi: "मुरझाया हुआ", mr: "कोमेजलेले" },
  "Young bud stage - ensure adequate soil moisture and avoid water stress. Monitor for early pests.": { 
    en: "Young bud stage - ensure adequate soil moisture and avoid water stress. Monitor for early pests.", 
    hi: "नन्ही कली अवस्था - पर्याप्त मिट्टी की नमी सुनिश्चित करें और जल तनाव से बचें। शुरुआती कीटों की निगरानी करें।", 
    mr: "कोवळ्या कळीची अवस्था - मातीत पुरेसा ओलावा असल्याची खात्री करा आणि पाण्याचा ताण टाळा. सुरुवातीच्या कीड प्रादुर्भावावर लक्ष ठेवा." 
  },
  "Mature bud stage - optimal time for nutrient boosting. Keep environment stable for blooming.": { 
    en: "Mature bud stage - optimal time for nutrient boosting. Keep environment stable for blooming.", 
    hi: "परिपक्व कली अवस्था - पोषक तत्वों को बढ़ाने के लिए इष्टतम समय। खिलने के लिए पर्यावरण को स्थिर रखें।", 
    mr: "पक्व कळीची अवस्था - पोषक द्रव्ये वाढवण्यासाठी ही योग्य वेळ आहे. फुलोऱ्यासाठी वातावरण स्थिर ठेवा." 
  },
  "Early bloom stage - protect from extreme temperatures. Soil should be consistently damp.": { 
    en: "Early bloom stage - protect from extreme temperatures. Soil should be consistently damp.", 
    hi: "शुरुआती खिलाव अवस्था - अत्यधिक तापमान से रक्षा करें। मिट्टी लगातार नम होनी चाहिए।", 
    mr: "सुरुवातीचा बहर - अति तापमानापासून संरक्षण करा. माती सतत ओलसर असली पाहिजे." 
  },
  "Full bloom stage - peak beauty and health. Ensure good ventilation and light.": { 
    en: "Full bloom stage - peak beauty and health. Ensure good ventilation and light.", 
    hi: "पूर्ण खिलाव अवस्था - चरम सौंदर्य और स्वास्थ्य। अच्छा वेंटिलेशन और प्रकाश सुनिश्चित करें।", 
    mr: "पूर्ण बहर - आरोग्य आणि सौंदर्याचा उच्चांक. खेळती हवा आणि सूर्यप्रकाश असल्याची खात्री करा." 
  },
  "Wilted stage - bloom cycle ending. Monitor for hydration levels and transition to standard care.": { 
    en: "Wilted stage - bloom cycle ending. Monitor for hydration levels and transition to standard care.", 
    hi: "मुरझाई हुई अवस्था - खिलाव चक्र समाप्त हो रहा है। हाइड्रेशन स्तर की निगरानी करें और मानक देखभाल पर जाएँ।", 
    mr: "कोमेजलेली अवस्था - फुलांचा हंगाम संपत आहे. आर्द्रतेची पातळी तपासा आणि नेहमीच्या देखभालीकडे वळा." 
  },
  "AI Disabled": { en: "AI Disabled", hi: "एआई अक्षम", mr: "AI बंद आहे" },
  "Analysis Complete": { en: "Analysis Complete", hi: "विश्लेषण पूर्ण हुआ", mr: "विश्लेषण पूर्ण झाले" },
  "Logic: Environmental Physics": { en: "Logic: Environmental Physics", hi: "तर्क: पर्यावरण भौतिकी", mr: "तर्क: पर्यावरण भौतिकी" },
  "Source: AI": { en: "Source: AI", hi: "स्रोत: एआई", mr: "स्रोत: AI" },
  "Source: Fallback": { en: "Source: Fallback", hi: "स्रोत: फॉलबैक", mr: "स्रोत: फॉलबैक" },
  "Ammonium Sulphate": { en: "Ammonium Sulphate", hi: "अमोनियम सल्फेट", mr: "अमोनियम सल्फेट" },
  "Liquid Humic Acid": { en: "Liquid Humic Acid", hi: "तरल ह्यूमिक एसिड", mr: "लिक्विड ह्युमिक ॲसिड" },
  "Iffco NPK 12-32-16": { en: "Iffco NPK 12-32-16", hi: "इफको एनपीके 12-32-16", mr: "इफ्को एनपीके १२-३२-१६" },
  "Seaweed Extract": { en: "Seaweed Extract", hi: "समुद्री शैवाल का अर्क", mr: "सीवीड अर्क" },
  "Coromandel Gromor 14-35-14": { en: "Coromandel Gromor 14-35-14", hi: "कोरोमंडल ग्रोमोर 14-35-14", mr: "कोरोमंडल ग्रोमोर १४-३५-१४" },
  "Organic Compost": { en: "Organic Compost", hi: "जैविक खाद", mr: "सेंद्रिय खत (कंपोस्ट)" },
  "DAP 18-46-0": { en: "DAP 18-46-0", hi: "डीएपी 18-46-0", mr: "डीएपी १८-४६-०" },
  "Muriate of Potash": { en: "Muriate of Potash", hi: "मुरिएट ऑफ पोटाश", mr: "म्युरिएट ऑफ पोटॅश" },
  "Urea 46-0-0": { en: "Urea 46-0-0", hi: "यूरिया 46-0-0", mr: "युरिया ४६-०-०" },
  "7-Hour AI Forecast": { en: "7-Hour AI Forecast", hi: "7-घंटे का एआई पूर्वानुमान", mr: "७-तासांचा AI अंदाज" },
  "7-Day Environment Trend": { en: "7-Day Environment Trend", hi: "7-दिवसीय पर्यावरण रुझान", mr: "७-दिवसांचा पर्यावरणीय कल" },
  "Current Soil NPK Levels": { en: "Current Soil NPK Levels", hi: "वर्तमान मिट्टी एनपीके स्तर", mr: "मातीतील सध्याची NPK पातळी" },
  "Foliar spray - 5g per liter of water. Best for vegetative growth stage.": { en: "Foliar spray - 5g per liter of water. Best for vegetative growth stage.", hi: "पर्णीय छिडकाव - 5 ग्राम प्रति लीटर पानी। वानस्पतिक विकास अवस्था के लिए सर्वोत्तम।", mr: "फवारणी - ५ ग्रॅम प्रति लिटर पाणी. शाकीय वाढीच्या अवस्थेसाठी सर्वोत्तम." },
  "Soil application - 3kg per acre. Ideal for pre-flowering stage.": { en: "Soil application - 3kg per acre. Ideal for pre-flowering stage.", hi: "मिट्टी के अनुप्रयोग - 3 किलोग्राम प्रति एकड़। पूर्व-पुष्पण अवस्था के लिए आदर्श।", mr: "मातीत वापर - ३ किलो प्रति एकर. फुले लागण्यापूर्वीच्या अवस्थेसाठी योग्य." },
  "Broadcast application - Use during early growth. Avoid direct contact with leaves.": { en: "Broadcast application - Use during early growth. Avoid direct contact with leaves.", hi: "ब्रॉडकास्ट अनुप्रयोग - जल्दी विकास के दौरान उपयोग करें। पत्तियों के साथ सीधे संपर्क से बचें।", mr: "फेकून देणे - सुरुवातीच्या वाढीच्या काळात वापरा. पानांशी थेट संपर्क टाळा." },
  "Drip irrigation - 2kg per acre/week. Enhances disease resistance.": { en: "Drip irrigation - 2kg per acre/week. Enhances disease resistance.", hi: "ड्रिप सिंचाई - 2 किलोग्राम प्रति एकड़/सप्ताह। रोग प्रतिरोधक क्षमता बढ़ाता है।", mr: "ठिबक सिंचन - २ किलो प्रति एकर/आठवडा. रोगप्रतिकारशक्ती वाढवते." },
  "Take Photo": { en: "Take Photo", hi: "फोटो लें", mr: "फोटो काढा" },
  "Upload an image to see AI analysis results here.": { en: "Upload an image to see AI analysis results here.", hi: "एआई विश्लेषण परिणाम यहां देखने के लिए एक छवि अपलोड करें।", mr: "येथे AI विश्लेषण परिणाम पाहण्यासाठी प्रतिमा अपलोड करा." },
  "Analyzing Image...": { en: "Analyzing Image...", hi: "छवि का विश्लेषण किया जा रहा है...", mr: "प्रतिमेचे विश्लेषण करत आहे..." },
  "Our AI is analyzing crop development patterns and flowering stages.": { en: "Our AI is analyzing crop development patterns and flowering stages.", hi: "हमारा एआई फसल विकास पैटर्न और फूलों के चरणों का विश्लेषण कर रहा है।", mr: "आमचे AI पिकाच्या वाढीचे नमुने आणि फुलोऱ्याच्या टप्प्यांचे विश्लेषण करत आहे." },
  "Growth Stage": { en: "Growth Stage", hi: "विकास चरण", mr: "वाढीची अवस्था" },
  "Low Confidence": { en: "Low Confidence", hi: "कम आत्मविश्वास", mr: "कमी आत्मविश्वास" },
  "Prediction is uncertain. Ensure the photo is clear and well-lit.": { en: "Prediction is uncertain. Ensure the photo is clear and well-lit.", hi: "भविष्यवाणी अनिश्चित है। सुनिश्चित करें कि फोटो साफ और अच्छी रोशनी वाली हो।", mr: "अंदाज अनिश्चित आहे. फोटो स्पष्ट आणि चांगल्या प्रकाशात असल्याची खात्री करा." },
};

export function useTranslation() {
  return function translate(key: string, lang: Language): string {
    // Check for exact match first
    const directMatch = (t as any)[key]?.[lang];
    if (directMatch) return directMatch;

    // Handle string with (ML Forecast...) suffix
    if (key.includes(" (ML Forecast:")) {
      const parts = key.split(" (ML Forecast:");
      const baseKey = parts[0];
      const translatedBase = (t as any)[baseKey]?.[lang];
      if (translatedBase) {
        let suffix = parts[1];
        if (lang === 'hi') {
          suffix = suffix.replace('moisture in next step', ' अगले चरण में नमी')
                        .replace('Predicted Trend', 'अनुमानित रुझान')
                        .replace('Soil Moisture', 'मिट्टी की नमी')
                        .replace('Temperature', 'तापमान')
                        .replace(')', '');
          return `${translatedBase} (एआई पूर्वानुमान: ${suffix.trim()})`;
        } else if (lang === 'mr') {
          suffix = suffix.replace('moisture in next step', ' पुढील चरणात ओलावा')
                        .replace('अंदाजित कल', 'अंदाजित कल')
                        .replace('मातीचा ओलावा', 'मातीचा ओलावा')
                        .replace('तापमान', 'तापमान')
                        .replace(')', '');
          return `${translatedBase} (एआय अंदाज: ${suffix.trim()})`;
        }
        return `${translatedBase} (ML Forecast:${suffix}`;
      }
    }

    return (t as any)[key]?.[lang] || key;
  };
}
