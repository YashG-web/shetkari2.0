import { useAppStore, Language } from '../store/use-app-store';

type TranslationMap = Record<string, Record<Language, string>>;

export const t: TranslationMap = {
  // Navigation
  "nav.dashboard": { en: "Dashboard", hi: "डैशबोर्ड", mr: "डॅशबोर्ड" },
  "nav.live_data": { en: "Live Data", hi: "लाइव डेटा", mr: "थेट डेटा" },
  "nav.recommendation": { en: "Recommendation", hi: "सिफारिश", mr: "शिफारस" },
  "nav.fertilizers": { en: "Fertilizers", hi: "उर्वरक", mr: "खते" },
  "nav.crop_analysis": { en: "Crop Analysis", hi: "फसल विश्लेषण", mr: "पीक विश्लेषण" },
  "nav.precision_farming": { en: "Precision Farming", hi: "सटीक खेती", mr: "अचूक शेती" },
  "nav.simulator": { en: "Simulator", hi: "सिम्युलेटर", mr: "सिम्युलेटर" },
  "nav.support": { en: "Help & Support", hi: "सहायता और समर्थन", mr: "मदत आणि समर्थन" },
  "nav.live_mode": { en: "Live IoT Mode", hi: "लाइव IoT मोड", mr: "थेट IoT मोड" },
  "nav.sim_on": { en: "Simulator Active", hi: "सिम्युलेटर सक्रिय", mr: "सिम्युलेटर सक्रिय" },

  // Dashboard & Hero
  "app.title": { en: "SHETKARI Intelligence", hi: "शेतकरी इंटेलिजेंस", mr: "शेतकरी बुद्धिमत्ता" },
  "app.subtitle": { en: "Real-time insights and AI recommendations for optimal crop health and yield.", hi: "इष्टतम फसल स्वास्थ्य और उपज के लिए वास्तविक समय की अंतर्दृष्टि और एआई सिफारिशें।", mr: "इष्टतम पीक आरोग्य आणि उत्पन्नासाठी रिअल-टाइम इनसाइट्स आणि एआय शिफारसी." },
  "dash.title": { en: "SHETKARI Intelligence", hi: "शेतकरी इंटेलिजेंस", mr: "शेतकरी इंटेलिजेंस" },
  "dash.subtitle": { en: "Real-time insights and AI recommendations for optimal crop health and yield.", hi: "इष्टतम फसल स्वास्थ्य और उपज के लिए रीयल-टाइम अंतर्दृष्टि और एआई सिफारिशें।", mr: "इष्टतम पीक आरोग्य आणि उत्पन्नासाठी रिअल-टाइम इनसाइट्स आणि AI शिफारसी." },
  "dash.esp_offline": { en: "ESP32 Offline", hi: "ESP32 ऑफ़लाइन", mr: "ESP32 ऑफलाइन" },
  "dash.live_data": { en: "Live Mode", hi: "लाइव मोड", mr: "लाइव्ह मोड" },
  "dash.sim_mode": { en: "Sim Mode", hi: "सिम मोड", mr: "सिम मोड" },
  "dash.ai_fert_rec": { en: "AI Fertilizer Recommendation", hi: "एआई उर्वरक सिफारिश", mr: "एआय खत शिफारस" },

  
  // Status & Sensors
  "sensor.soil_moisture": { en: "Soil Moisture", hi: "मिट्टी की नमी", mr: "मातीची आर्द्रता" },
  "sensor.temperature": { en: "Temperature", hi: "तापमान", mr: "तापमान" },
  "sensor.humidity": { en: "Humidity", hi: "नमी", mr: "आर्द्रता" },
  "sensor.pump_status": { en: "Water Pump", hi: "पानी का पंप", mr: "पाण्याचा पंप" },
  "sensor.connected": { en: "System Connected", hi: "सिस्टम कनेक्टेड है", mr: "सिस्टम कनेक्टेड आहे" },
  "sensor.last_updated": { en: "Last Updated", hi: "अंतिम अद्यतन", mr: "शेवटचे अपडेट" },
  "sensor.crop_condition": { en: "Crop Condition", hi: "फसल की स्थिति", mr: "पिकाची स्थिती" },
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
  "sensor.ph": { en: "Soil pH", hi: "मिट्टी pH", mr: "मातीचा pH" },
  
  "status.disconnected": { en: "DISCONNECTED", hi: "डिस्कनेक्ट", mr: "डिस्कनेक्ट" },
  "status.stable": { en: "STABLE SIGNAL", hi: "स्थिर सिग्नल", mr: "स्थिर सिग्नल" },
  "status.loading": { en: "Loading data...", hi: "डेटा लोड हो रहा है...", mr: "डेटा लोड होत आहे..." },
  "status.error": { en: "Failed to load data", hi: "डेटा लोड करने में विफल", mr: "डेटा लोड करण्यात अयशस्वी" },
  "status.on": { en: "ON", hi: "चालू", mr: "चालू" },
  "status.off": { en: "OFF", hi: "बंद", mr: "बंद" },
  "status.awaiting_ai": { en: "Awaiting AI Analysis...", hi: "एआई विश्लेषण की प्रतीक्षा है...", mr: "AI विश्लेषणाची प्रतीक्षा आहे..." },
  "status.source": { en: "Source", hi: "स्रोत", mr: "स्रोत" },
  "status.optimized": { en: "OPTIMIZED", hi: "अनुकूलित", mr: "ऑप्टिमाइझ केलेले" },
  "status.stable_tag": { en: "STABLE", hi: "स्थिर", mr: "स्थिर" },
  "status.raining": { en: "RAINING", hi: "बारिश हो रही है", mr: "पाऊस पडत आहे" },
  "status.no_rain": { en: "NO RAIN", hi: "बारिश नहीं", mr: "पाऊस नाही" },
  "status.ai_active": { en: "AI ACTIVE", hi: "एआई सक्रिय", mr: "AI सक्रिय" },
  "AI": { en: "AI", hi: "एआई", mr: "AI" },
  "Fallback": { en: "Fallback", hi: "फ़ॉलबैक", mr: "फॉलबॅक" },
  "status.logic": { en: "Logic", hi: "तर्क", mr: "तर्क" },
  "Environmental Physics": { en: "Environmental Physics", hi: "पर्यावरण भौतिकी", mr: "पर्यावरण भौतिकशास्त्र" },
  "status.predicted_trend": { en: "Predicted Trend", hi: "अनुमानित रुझान", mr: "अंदाज कल" },



  // Live Data Page
  "live.esp_offline": { en: "Hardware Offline", hi: "हार्डवेयर ऑफ़लाइन", mr: "हार्डवेअर ऑफलाइन" },
  "live.sim_active": { en: "Simulation Mode", hi: "सिमुलेशन मोड", mr: "सिमुलेशन मोड" },
  "live.sensor_online": { en: "Sensors Online", hi: "सेंसर ऑनलाइन", mr: "सेन्सर ऑनलाइन" },
  "live.disconnected": { en: "DISCONNECTED", hi: "डिस्कनेक्ट", mr: "डिस्कनेक्ट" },
  "live.stable_signal": { en: "STABLE SIGNAL", hi: "स्थिर सिग्नल", mr: "स्थिर सिग्नल" },
  "live.env_metrics": { en: "Environment Metrics", hi: "पर्यावरण मेट्रिक्स", mr: "पर्यावरण मेट्रिक्स" },
  "live.soil_nutrients": { en: "Soil Nutrients", hi: "मिट्टी के पोषक तत्व", mr: "मातीतील पोषक तत्वे" },
  "live.nitrogen": { en: "Nitrogen (N)", hi: "नाइट्रोजन (N)", mr: "नायट्रोजन (N)" },
  "live.phosphorus": { en: "Phosphorus (P)", hi: "फास्फोरस (P)", mr: "फॉस्फरस (P)" },
  "live.potassium": { en: "Potassium (K)", hi: "पोटेशियम (K)", mr: "पोटॅशियम (K)" },
  "live.analyzing_env": { en: "Analyzing environment...", hi: "पर्यावरण का विश्लेषण...", mr: "वातावरणाचे विश्लेषण..." },
  "live.analyzing_nutrients": { en: "Analyzing nutrients...", hi: "पोषक तत्वों का विश्लेषण...", mr: "पोषक तत्वांचे विश्लेषण..." },
  "live.fert_rec": { en: "Fertilizer Recommendation", hi: "उर्वरक सिफारिश", mr: "खत शिफारस" },

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
  "section.fertilizer_forecast": { en: "AI Fertilizer Forecast", hi: "एआई उर्वरक पूर्वानुमान", mr: "एआय खत अंदाज" },
  "section.rule_engine": { en: "Rule Engine Logic", hi: "नियम इंजन तर्क", mr: "रूल इंजिन लॉजिक" },

  // Actions
  "fert.subtitle": { en: "Expert-recommended nutrients for your specific soil profile.", hi: "आपकी विशिष्ट मिट्टी के प्रोफाइल के लिए विशेषज्ञ-अनुशंसित पोषक तत्व।", mr: "तुमच्या मातीच्या विशिष्ट प्रोफाइलसाठी तज्ज्ञांनी सुचवलेली पोषक तत्वे." },
  "action.get_recommendation": { en: "Get Recommendation", hi: "सिफारिश प्राप्त करें", mr: "शिफारस मिळवा" },
  "action.analyze": { en: "Analyze Now", hi: "विश्लेषण करें", mr: "विश्लेषण करा" },
  "action.buy": { en: "Buy", hi: "अभी खरीदें", mr: "खरेदी करा" },
  "action.buy_now": { en: "Buy Now", hi: "अभी खरीदें", mr: "आता खरेदी करा" },
  "action.upload_photo": { en: "Upload Photo", hi: "फोटो अपलोड करें", mr: "फोटो अपलोड करा" },
  "action.take_photo": { en: "Take Photo", hi: "फोटो खींचे", mr: "फोटो काढा" },
  "action.listen": { en: "Listen", hi: "सुनें", mr: "ऐका" },
  "action.browse_files": { en: "Browse Files", hi: "फाइलें ब्राउज़ करें", mr: "फाईल्स ब्राउझ करा" },
  "action.change_photo": { en: "Change Photo", hi: "फोटो बदलें", mr: "फोटो बदला" },

  // Recommendation Labels
  "rec.subtitle": { en: "AI-driven agronomy based on real-time sensor streams.", hi: "वास्तविक समय सेंसर स्ट्रीम पर आधारित एआई-संचालित कृषि विज्ञान।", mr: "रिअल-टाइम सेन्सर प्रवाहावर आधारित एआय-चालित कृषिशास्त्र." },
  "rec.risk_level": { en: "Risk Level", hi: "जोखिम स्तर", mr: "धोका पातळी" },
  "rec.identified_issue": { en: "Identified Issue", hi: "पहचानी गई समस्या", mr: "ओळखलेली समस्या" },
  "rec.suggested_actions": { en: "Suggested Actions", hi: "सुझाए गए कार्य", mr: "सुचवलेली कृती" },
  "rec.recommended_product": { en: "Recommended Product", hi: "अनुशंसित उत्पाद", mr: "शिफारस केलेले उत्पादन" },
  "rec.buy_on": { en: "Buy on", hi: "पर खरीदें", mr: "वर खरेदी करा" },
  "rec.low": { en: "LOW", hi: "कम", mr: "कमी" },
  "rec.medium": { en: "MEDIUM", hi: "मध्यम", mr: "मध्यम" },
  "rec.high": { en: "HIGH", hi: "उच्च", mr: "उच्च" },
  "rec.env_analysis": { en: "Environmental & Irrigation Analysis", hi: "पर्यावरण और सिंचाई विश्लेषण", mr: "पर्यावरण आणि सिंचन विश्लेषण" },
  "rec.system_status": { en: "SYSTEM STATUS: ", hi: "सिस्टम स्थिति: ", mr: "सिस्टम स्थिती: " },
  "rec.temp_stable": { en: "TEMP: STABLE", hi: "तापमान: स्थिर", mr: "तापमान: स्थिर" },
  "rec.humid_optimal": { en: "HUMID: OPTIMAL", hi: "नमी: इष्टतम", mr: "आर्द्रता: इष्टतम" },
  "rec.irrigation_advisory": { en: "Irrigation Advisory", hi: "सिंचाई सलाह", mr: "सिंचन सल्ला" },
  "rec.soil_analysis": { en: "Soil Nutrient & NPK Analysis", hi: "मृदा पोषक तत्व और एनपीके विश्लेषण", mr: "मातीतील पोषक तत्व आणि NPK विश्लेषण" },
  "rec.recommended_actions": { en: "Recommended Actions", hi: "अनुशंसित कार्य", mr: "शिफारस केलेले उपाय" },

  // Fertilizer Catalog entries
  "Liquid Humic Acid": { en: "Liquid Humic Acid", hi: "तरल ह्यूमिक एसिड", mr: "लिक्विड ह्युमिक ॲसिड" },
  "Iffco NPK 12-32-16": { en: "Iffco NPK 12-32-16", hi: "इफको एनपीके 12-32-16", mr: "इफ्को एनपीके १२-३२-१६" },
  "Seaweed Extract": { en: "Seaweed Extract", hi: "समुद्री शैवाल का अर्क", mr: "सीवीड अर्क" },
  "Coromandel Gromor 14-35-14": { en: "Coromandel Gromor 14-35-14", hi: "कोरोमंडल ग्रोमोर 14-35-14", mr: "कोरोमंडल ग्रोमोर १४-३५-१४" },
  "Organic Compost": { en: "Organic Compost", hi: "जैविक खाद", mr: "सेंद्रिय खत (कंपोस्ट)" },
  "DAP 18-46-0": { en: "DAP 18-46-0", hi: "डीएपी 18-46-0", mr: "डीएपी १८-४६-०" },
  "Muriate of Potash": { en: "Muriate of Potash", hi: "मुरिएट ऑफ पोटाश", mr: "म्युरिएट ऑफ पोटॅश" },
  "Urea 46-0-0": { en: "Urea 46-0-0", hi: "यूरिया 46-0-0", mr: "युरिया ४६-०-०" },
  "Ammonium Sulphate": { en: "Ammonium Sulphate", hi: "अमोनियम सल्फेट", mr: "अमोनियम सल्फेट" },
  "GroPlus Premium Mix": { en: "GroPlus Premium Mix", hi: "ग्रोप्लस प्रीमियम मिक्स", mr: "ग्रोप्लस प्रीमियम मिक्स" },
  "BloomBoost P-K": { en: "BloomBoost P-K", hi: "ब्लूमबूस्ट पी-के", mr: "ब्लूमबूस्ट पी-के" },
  "Urea Fast N": { en: "Urea Fast N", hi: "यूरिया फास्ट एन", mr: "युरिया फास्ट एन" },
  "RootBuilder K-Mag": { en: "RootBuilder K-Mag", hi: "रूटबिल्डर के-मैग", mr: "रूटबिल्डर के-मॅग" },

  // Usage Info
  "Apply 50 kg per hectare. Suitable for all field crops during vegetative stage.": { en: "Apply 50 kg per hectare. Suitable for all field crops during vegetative stage.", hi: "प्रति हेक्टेयर 50 किलोग्राम लगाएं। वानस्पतिक अवस्था के दौरान सभी क्षेत्रीय फसलों के लिए उपयुक्त।", mr: "प्रति हेक्टर ५० किलोचा वापर करा. शाकीय वाढीच्या अवस्थेत सर्व पिकांसाठी उपयुक्त." },
  "Spray 2ml per Liter of water as foliar spray to help plants cope with abiotic stress.": { en: "Spray 2ml per Liter of water as foliar spray to help plants cope with abiotic stress.", hi: "अजैविक तनाव से निपटने में पौधों की मदद करने के लिए पर्णीय स्प्रे के रूप में प्रति लीटर पानी में 2 मिलीलीटर स्प्रे करें।", mr: "अजैविक ताणाशी लढण्यासाठी पानांवर २ मिली प्रति लिटर या प्रमाणात फवारणी करा." },
  "Periodic application as per crop cycle. No urgent requirement.": { en: "Periodic application as per crop cycle. No urgent requirement.", hi: "फसल चक्र के अनुसार समय-समय पर आवेदन। कोई तत्काल आवश्यकता नहीं है।", mr: "पीक चक्रानुसार वेळोवेळी वापर करा. कोणतीही तातडीची गरज नाही." },
  "Apply 1-2 tons per hectare and mix into topsoil before irrigation.": { en: "Apply 1-2 tons per hectare and mix into topsoil before irrigation.", hi: "प्रति हेक्टेयर 1-2 टन लगाएं और सिंचाई से पहले ऊपरी मिट्टी में मिला दें।", mr: "प्रति हेक्टर १-२ टन वापरा आणि सिंचनापूर्वी मातीत मिसळून द्या." },
  "Apply at sowing stage as per crop advisory, avoid direct root contact.": { en: "Apply at sowing stage as per crop advisory, avoid direct root contact.", hi: "फसल सलाह के अनुसार बुआई के चरण में आवेदन करें, सीधे जड़ संपर्क से बचें।", mr: "पीक सल्ल्यानुसार पेरणीच्या वेळी वापरा, मुळांशी थेट संपर्क टाळा." },
  "Apply 20-40 kg per acre based on soil test for potassium correction.": { en: "Apply 20-40 kg per acre based on soil test for potassium correction.", hi: "पोटेशियम सुधार के लिए मिट्टी परीक्षण के आधार पर 20-40 किलोग्राम प्रति एकड़ लगाएं।", mr: "पोटॅशियमच्या कमतरतेसाठी माती परीक्षणाद्वारे प्रति एकर २०-४० किलो वापरा." },
  "Split apply during vegetative stage and irrigate immediately after application.": { en: "Split apply during vegetative stage and irrigate immediately after application.", hi: "वानस्पतिक अवस्था के दौरान टुकड़ों में लगाएं और लगाने के तुरंत बाद सिंचाई करें।", mr: "शाकीय वाढीच्या काळात विभागून द्या आणि खत दिल्यावर लगेच पाणी द्या." },
  "Follow agronomist guidance and soil test recommendations before application.": { en: "Follow agronomist guidance and soil test recommendations before application.", hi: "आवेदन से पहले कृषिविज्ञानी के मार्गदर्शन और मिट्टी परीक्षण सिफारिशों का पालन करें।", mr: "वापरण्यापूर्वी कृषी तज्ज्ञांचे मार्गदर्शन आणि माती परीक्षणाचा सल्ला घ्या." },
  "Foliar spray - 5g per liter of water. Best for vegetative growth stage.": { en: "Foliar spray - 5g per liter of water. Best for vegetative growth stage.", hi: "पर्णीय छिडकाव - 5 ग्राम प्रति लीटर पानी। वानस्पतिक विकास अवस्था के लिए सर्वोत्तम।", mr: "फवारणी - ५ ग्रॅम प्रति लिटर पाणी. शाकीय वाढीच्या अवस्थेसाठी सर्वोत्तम." },
  "Soil application - 3kg per acre. Ideal for pre-flowering stage.": { en: "Soil application - 3kg per acre. Ideal for pre-flowering stage.", hi: "मिट्टी के अनुप्रयोग - 3 किलोग्राम प्रति एकड़। पूर्व-पुष्पण अवस्था के लिए आदर्श।", mr: "मातीत वापर - ३ किलो प्रति एकर. फुले लागण्यापूर्वीच्या अवस्थेसाठी योग्य." },
  "Broadcast application - Use during early growth. Avoid direct contact with leaves.": { en: "Broadcast application - Use during early growth. Avoid direct contact with leaves.", hi: "ब्रॉडकास्ट अनुप्रयोग - जल्दी विकास के दौरान उपयोग करें। पत्तियों के साथ सीधे संपर्क से बचें।", mr: "फेकून देणे - सुरुवातीच्या वाढीच्या काळात वापरा. पानांशी थेट संपर्क टाळा." },
  "Drip irrigation - 2kg per acre/week. Enhances disease resistance.": { en: "Drip irrigation - 2kg per acre/week. Enhances disease resistance.", hi: "ड्रिप सिंचाई - 2 किलोग्राम प्रति एकड़/सप्ताह। रोग प्रतिरोधक क्षमता बढ़ाता है।", mr: "ठिबक सिंचन - २ किलो प्रति एकर/आठवडा. रोगप्रतिकारशक्ती वाढवते." },

  // Application Strategies & Descriptions
  "Soil Drenching": { en: "Soil Drenching", hi: "मिट्टी भिगोना", mr: "माती भिजवणे (ड्रेंचिंग)" },
  "Basal Application": { en: "Basal Application", hi: "आधार अनुप्रयोग", mr: "पायाभूत खत डोस" },
  "Foliar Spray": { en: "Foliar Spray", hi: "पर्णीय स्प्रे", mr: "पानांवरील फवारणी" },
  "Top Dressing": { en: "Top Dressing", hi: "उपरी ड्रेसिंग", mr: "वरखत देणे" },
  "Soil Incorporation": { en: "Soil Incorporation", hi: "मिट्टी में समावेशन", mr: "मातीत मिसळणे" },
  "Band Placement": { en: "Band Placement", hi: "बैंड प्लेसमेंट", mr: "पट्ट्यात खत टाकणे" },
  "Split Application": { en: "Split Application", hi: "विभाजित अनुप्रयोग", mr: "विभाजित खत मात्रा" },
  "Broadcast & Irrigate": { en: "Broadcast & Irrigate", hi: "ब्रॉडकास्ट और सिंचाई", mr: "फेकून देणे आणि पाणी देणे" },
  "General Application": { en: "General Application", hi: "सामान्य अनुप्रयोग", mr: "सामान्य वापर" },
  "Mix with irrigation water for deep soil penetration.": { en: "Mix with irrigation water for deep soil penetration.", hi: "गहरी मिट्टी में प्रवेश के लिए सिंचाई के पानी के साथ मिलाएं।", mr: "मातीत खोलवर जाण्यासाठी सिंचनाच्या पाण्यासोबत मिसळा." },
  "Apply near the root zone during sowing or early growth.": { en: "Apply near the root zone during sowing or early growth.", hi: "बुआई या शुरुआती विकास के दौरान जड़ क्षेत्र के पास लगाएं।", mr: "पेरणीच्या वेळी किंवा सुरुवातीच्या वाढीच्या काळात मुळांच्या जवळ वापरा." },
  "Spray directly on leaves during early morning or late evening.": { en: "Spray directly on leaves during early morning or late evening.", hi: "सुबह जल्दी या शाम को सीधे पत्तियों पर स्प्रे करें।", mr: "सकाळी लवकर किंवा संध्याकाळी उशिरा थेट पानांवर फवारणी करा." },
  "Spread evenly on the soil surface around the plants.": { en: "Spread evenly on the soil surface around the plants.", hi: "पौधों के चारों ओर मिट्टी की सतह पर समान रूप से फैलाएं।", mr: "झाडांच्या भोवती मातीच्या पृष्ठभागावर समप्रमाणात पसरवा." },
  "Thoroughly mix into the top 6 inches of soil.": { en: "Thoroughly mix into the top 6 inches of soil.", hi: "मिट्टी के ऊपरी 6 इंच में अच्छी तरह मिलाएं।", mr: "मातीच्या वरच्या ६ इंचांमध्ये व्यवस्थित मिसळा." },
  "Place in bands 5cm away from the seed row.": { en: "Place in bands 5cm away from the seed row.", hi: "बीज की कतार से 5 सेमी दूर बैंड में रखें।", mr: "बियाणांच्या ओळीपासून ५ सेंमी लांब पट्ट्यात खत टाका." },
  "Apply in two stages to prevent leaching in sandy soils.": { en: "Apply in two stages to prevent leaching in sandy soils.", hi: "रेतीली मिट्टी में लीचिंग को रोकने के लिए दो चरणों में लगाएं।", mr: "वाळूमय मातीत खत वाहून जाण्यापासून वाचवण्यासाठी दोन टप्प्यात वापरा." },
  "Spread on soil and water immediately to prevent nitrogen loss.": { en: "Spread on soil and water immediately to prevent nitrogen loss.", hi: "मिट्टी पर फैलाएं और नाइट्रोजन की हानि को रोकने के लिए तुरंत पानी दें।", mr: "मातीवर पसरवा आणि नायट्रोजनचा ऱ्हास टाळण्यासाठी लगेच पाणी द्या." },
  "Consult a local agricultural expert for specific application methods.": { en: "Consult a local agricultural expert for specific application methods.", hi: "विशिष्ट अनुप्रयोग विधियों के लिए स्थानीय कृषि विशेषज्ञ से परामर्श करें।", mr: "विशिष्ट वापर पद्धतींसाठी स्थानिक कृषी तज्ज्ञांचा सल्ला घ्या." },
  "Not Available": { en: "Not Available", hi: "उपलब्ध नहीं है", mr: "उपलब्ध नाही" },
  "rec.app_strategy": { en: "Application Strategy", hi: "उपयोग रणनीति", mr: "वापरण्याची रणनीती" },
  "rec.app_desc": { en: "Application Description", hi: "उपयोग विवरण", mr: "वापराचे वर्णन" },
  "rec.chemical_comp": { en: "Chemical Composition: ", hi: "रासायनिक संरचना: ", mr: "रासायनिक रचना: " },
  "rec.why_product": { en: "Why this product?", hi: "यही उत्पाद क्यों?", mr: "हे उत्पादन का?" },


  // Risk & Issues
  "Poor - Crop shows signs of severe water stress": { en: "Poor - Crop shows signs of severe water stress", hi: "खराब - फसल गंभीर पानी के तनाव के लक्षण दिखाती है", mr: "खराब - पिकामध्ये पाण्याचे तीव्र ताण दिसून येत आहे" },
  "Moderate - Potential nutrient deficiency detected": { en: "Moderate - Potential nutrient deficiency detected", hi: "मध्यम - संभावित पोषक तत्वों की कमी का पता चला है", mr: "मध्यम - संभाव्य पोषक तत्वांची कमतरता आढळली आहे" },
  "Moderate - Heat stress warning": { en: "Moderate - Heat stress warning", hi: "मध्यम - गर्मी के तनाव की चेतावनी", mr: "मध्यम - उष्णतेच्या ताणाची चेतावणी" },
  "Good - Optimal growing conditions": { en: "Good - Optimal growing conditions", hi: "अच्छा - इष्टतम बढ़ती स्थितियाँ", mr: "चांगले - वाढीसाठी अनुकूल स्थिती" },
  "Critically low soil moisture detected": { en: "Critically low soil moisture detected", hi: "मिट्टी की नमी में गंभीर कमी का पता चला है", mr: "मातीतील ओलावा अत्यंत कमी असल्याचे आढळले आहे" },
  "Low NPK levels causing stunted growth or leaf discoloration": { en: "Low NPK levels causing stunted growth or leaf discoloration", hi: "कम NPK स्तर के कारण विकास रुक रहा है या पत्तियों का रंग बदल रहा है", mr: "कमी NPK पातळीमुळे वाढ खुंटणे किंवा पानांचा रंग बदलणे" },
  "High ambient temperature causing transpiration stress": { en: "High ambient temperature causing transpiration stress", hi: "उच्च तापमान के कारण वाष्पोत्सर्जन तनाव", mr: "उच्च तापमानामुळे बाष्पोत्सर्जन ताण" },
  "No significant issues detected": { en: "No significant issues detected", hi: "कोई महत्वपूर्ण समस्या नहीं पाई गई", mr: "कोणतीही विशेष समस्या आढळली नाही" },

  // Actions detail
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

  // Advisory strings
  "Rain detected. Natural irrigation sufficient. Keep pumps off.": { en: "Rain detected. Natural irrigation sufficient. Keep pumps off.", hi: "बारिश का पता चला। प्राकृतिक सिंचाई पर्याप्त है। पंप बंद रखें।", mr: "पाऊस आढळला. नैसर्गिक सिंचन पुरेसे आहे. पंप बंद ठेवा." },
  "Critical: Soil is too dry. Immediate irrigation required.": { en: "Critical: Soil is too dry. Immediate irrigation required.", hi: "गंभीर: मिट्टी बहुत सूखी है। तत्काल सिंचाई आवश्यक है।", mr: "गंभीर: माती खूप कोरडी आहे. त्वरित सिंचन आवश्यक आहे." },
  "High evaporation alert. Supplemental irrigation recommended.": { en: "High evaporation alert. Supplemental irrigation recommended.", hi: "उच्च वाष्पीकरण अलर्ट। पूरक सिंचाई की सिफारिश की गई।", mr: "उच्च बाष्पीभवन अलर्ट. पूरक सिंचनाची शिफारस केली जाते." },
  "High humidity. Reduced transpiration. Water sparingly to avoid fungal risk.": { en: "High humidity. Reduced transpiration. Water sparingly to avoid fungal risk.", hi: "उच्च आर्द्रता। कम वाष्पोत्सर्जन। कवक जोखिम से बचने के लिए कम पानी दें।", mr: "उच्च आर्द्रता. कमी बाष्पोत्सर्जन. बुरशीचा धोका टाळण्यासाठी कमी पाणी द्या." },
  "Soil is well-saturated. Irrigation not required.": { en: "Soil is well-saturated. Irrigation not required.", hi: "मिट्टी अच्छी तरह से संतृप्त है। सिंचाई की आवश्यकता नहीं है।", mr: "माती चांगली ओलावलेली आहे. सिंचनाची गरज नाही." },
  "Soil moisture is stable. No immediate irrigation needed.": { en: "Soil moisture is stable. No immediate irrigation needed.", hi: "मिट्टी की नमी स्थिर है। तत्काल सिंचाई की आवश्यकता नहीं है।", mr: "मातीची आर्द्रता स्थिर आहे. त्वरित सिंचनाची गरज नाही." },

  // Crop Analysis Stages & Rec
  "Young Bud": { en: "Young Bud", hi: "कली (शुरुआती)", mr: "सुरुवातीची कळी" },
  "Mature Bud": { en: "Mature Bud", hi: "परिपक्व कली", mr: "परिपक्व कळी" },
  "Early Bloom": { en: "Early Bloom", hi: "शुरुआती फूल", mr: "सुरुवातीचे फूल" },
  "Full Bloom": { en: "Full Bloom", hi: "पूर्ण फूल", mr: "पूर्ण उमललेले फूल" },
  "Wilted": { en: "Wilted", hi: "मुरझाया हुआ", mr: "सुकलेले" },
  
  "Young bud stage - ensure adequate soil moisture and avoid water stress. Monitor for early pests.": { en: "Young bud stage - ensure adequate soil moisture and avoid water stress. Monitor for early pests.", hi: "कली की शुरुआती अवस्था - मिट्टी में पर्याप्त नमी सुनिश्चित करें और पानी की कमी से बचें। शुरुआती कीटों की निगरानी करें।", mr: "सुरुवातीची कळी अवस्था - मातीत पुरेसा ओलावा असल्याची खात्री करा आणि पाण्याचा ताण टाळा. सुरुवातीच्या किडींवर लक्ष ठेवा." },
  "Mature bud stage - optimal time for nutrient boosting. Keep environment stable for blooming.": { en: "Mature bud stage - optimal time for nutrient boosting. Keep environment stable for blooming.", hi: "परिपक्व कली अवस्था - पोषक तत्वों को बढ़ाने के लिए इष्टतम समय। फूलों के खिलने के लिए सुरक्षित वातावरण बनाए रखें।", mr: "परिपक्व कळी अवस्था - पोषक तत्वे वाढवण्यासाठी उत्तम वेळ. फुले उमलण्यासाठी वातावरण स्थिर ठेवा." },
  "Early bloom stage - protect from extreme temperatures. Soil should be consistently damp.": { en: "Early bloom stage - protect from extreme temperatures. Soil should be consistently damp.", hi: "फूलों के खिलने की शुरुआती अवस्था - अत्यधिक तापमान से बचाएं। मिट्टी लगातार नम होनी चाहिए।", mr: "सुरुवातीची फुलण्याची अवस्था - अति तापमानापासून संरक्षण करा. माती सतत ओलसर असावी." },
  "Full bloom stage - peak beauty and health. Ensure good ventilation and light.": { en: "Full bloom stage - peak beauty and health. Ensure good ventilation and light.", hi: "पूर्ण फूल अवस्था - स्वास्थ्य और सुंदरता का चरम स्तर। अच्छी हवा और रोशनी सुनिश्चित करें।", mr: "पूर्ण उमललेले फूल - पीक उत्तम आरोग्य आणि सौंदर्याच्या शिखरावर आहे. हवा खेळती आणि पुरेसा प्रकाश असल्याची खात्री करा." },
  "Wilted stage - bloom cycle ending. Monitor for hydration levels and transition to standard care.": { en: "Wilted stage - bloom cycle ending. Monitor for hydration levels and transition to standard care.", hi: "मुरझाई हुई अवस्था - फूलों का चक्र समाप्त हो रहा है। नमी के स्तर की निगरानी करें और सामान्य देखभाल शुरू करें।", mr: "सुकलेली अवस्था - फुलण्याचे चक्र संपत आहे. आर्द्रतेच्या पातळीवर लक्ष ठेवा आणि सामान्य काळजी घेण्यास सुरुवात करा." },

  "analysis.complete_title": { en: "Analysis Complete", hi: "विश्लेषण पूरा हुआ", mr: "विश्लेषण पूर्ण झाले" },
  "analysis.subtitle": { en: "AI-powered vision for real-time crop stage detection.", hi: "वास्तविक समय फसल चरण का पता लगाने के लिए एआई-पावर्ड विजन।", mr: "रिअल-टाइम पीक स्टेज शोधण्यासाठी एआय-पॉवर्ड व्हिजन." },
  "analysis.upload_title": { en: "Upload Crop Photo", hi: "फसल फोटो अपलोड करें", mr: "पिकाचा फोटो अपलोड करा" },
  "analysis.upload_desc": { en: "Submit a clear photo of your crop or buds to analyze development.", hi: "विकास का विश्लेषण करने के लिए अपनी फसल या कलियों की एक स्पष्ट फोटो भेजें।", mr: "वाढीचे विश्लेषण करण्यासाठी तुमच्या पिकाचा किंवा कळ्यांचा स्पष्ट फोटो सबमिट करा." },
  "Our AI is analyzing crop development patterns and flowering stages.": { en: "Our AI is analyzing crop development patterns and flowering stages.", hi: "हमारा एआई फसल के विकास के पैटर्न और फूलों के चरणों का विश्लेषण कर रहा है।", mr: "आमचे AI पीक वाढीचे नमुने आणि फुलण्याच्या टप्प्यांचे विश्लेषण करत आहे." },
  "Upload an image to see AI analysis results here.": { en: "Upload an image to see AI analysis results here.", hi: "एआई विश्लेषण परिणाम देखने के लिए यहां एक छवि अपलोड करें।", mr: "येथे AI विश्लेषण निकाल पाहण्यासाठी इमेज अपलोड करा." },
  "Analysis Failed": { en: "Analysis Failed", hi: "विश्लेषण विफल", mr: "विश्लेषण अयशस्वी" },
  "Take Photo": { en: "Take Photo", hi: "फोटो खींचें", mr: "फोटो काढा" },
  "Analysis Complete": { en: "Analysis Complete", hi: "विश्लेषण पूरा हुआ", mr: "विश्लेषण पूर्ण झाले" },
  "Analyzing Image...": { en: "Analyzing Image...", hi: "छवि का विश्लेषण किया जा रहा है...", mr: "प्रतिमेचे विश्लेषण केले जात आहे..." },
  "Growth Stage": { en: "Growth Stage", hi: "विकास चरण", mr: "वाढीची अवस्था" },
  "Low Confidence": { en: "Low Confidence", hi: "कम आत्मविश्वास", mr: "कमी आत्मविश्वास" },
  "Prediction is uncertain. Ensure the photo is clear and well-lit.": { en: "Prediction is uncertain. Ensure the photo is clear and well-lit.", hi: "भविष्यवाणी अनिश्चित है। सुनिश्चित करें कि फोटो साफ़ और अच्छी रोशनी वाली हो।", mr: "अंदाज अनिश्चित आहे. फोटो स्पष्ट आणि चांगल्या प्रकाशात असल्याची खात्री करा." },

  // Forecast & Suffixes
  "ML Forecast": { en: "ML Forecast", hi: "एमएल पूर्वानुमान", mr: "ML अंदाज" },
  "moisture in next step": { en: "moisture in next step", hi: "अगले चरण में नमी", mr: "पुढील टप्प्यातील ओलावा" },

  // Audio Feedback
  "audio.recommendation_intro": { en: "Here is your farm recommendation.", hi: "यहाँ आपकी खेत की सिफारिश है।", mr: "येथे तुमच्या शेतीसाठी शिफारस आहे." },
  "audio.crop_condition": { en: "Crop Condition is", hi: "फसल की स्थिति है", mr: "पिकाची स्थिती आहे" },
  "audio.main_issue": { en: "The main issue identified is", hi: "मुख्य समस्या की पहचान की गई है", mr: "ओळखलेली मुख्य समस्या आहे" },
  "audio.suggested_actions": { en: "Here are the suggested actions", hi: "यहाँ सुझाए गए कार्य हैं", mr: "येथे सुचवलेले उपाय आहेत" },
  "audio.recommended_fertilizer": { en: "Recommended fertilizer is", hi: "अनुशंसित उर्वरक है", mr: "शिफारस केलेले खत आहे" },
  "audio.npk_ratio": { en: "with NPK ratio", hi: "NPK अनुपात के साथ", mr: "NPK गुणोत्तरासह" },

  // Support Card Purposes
  "For crop advice": { en: "For crop advice", hi: "फसल सलाह के लिए", mr: "पीक सल्ल्यासाठी" },
  "For device problems": { en: "For device problems", hi: "डिवाइस समस्याओं के लिए", mr: "डिव्हाइसच्या समस्यांसाठी" },
  "For emergencies": { en: "For emergencies", hi: "आपातकालीन स्थिति के लिए", mr: "आणीबाणीसाठी" },

  // Help & Support Page
  "support.title": { en: "Help & Support", hi: "सहायता और समर्थन", mr: "मदत आणि समर्थन" },
  "support.subtitle": { en: "Connect with agriculture experts and technical support 24/7.", hi: "कृषि विशेषज्ञों और तकनीकी सहायता से 24/7 जुड़ें।", mr: "कृषी तज्ज्ञ आणि तांत्रिक समर्थनाशी २४/७ संपर्क साधा." },
  "support.expert": { en: "Crop Expert (Govt)", hi: "फसल विशेषज्ञ (सरकारी)", mr: "पीक तज्ज्ञ (शासकीय)" },
  "support.expert_desc": { en: "Expert guidance for diseases and fertilizers.", hi: "रोगों और उर्वरकों के लिए विशेषज्ञ मार्गदर्शन।", mr: "रोग आणि खतांसाठी तज्ज्ञ मार्गदर्शन." },
  "support.hardware": { en: "Hardware Support", hi: "हार्डवेयर सहायता", mr: "हार्डवेअर मदत" },
  "support.hardware_desc": { en: "Technical help for IoT sensors and ESP32.", hi: "IoT सेंसर और ESP32 के लिए तकनीकी सहायता।", mr: "IoT सेन्सर आणि ESP32 साठी तांत्रिक मदत." },
  "support.emergency": { en: "Emergency Help", hi: "आपातकालीन सहायता", mr: "आणीबाणीची मदत" },
  "support.emergency_desc": { en: "Urgent agriculture and emergency support.", hi: "तत्काल कृषि और आपातकालीन सहायता।", mr: "तातडीची कृषी आणि आणीबाणीची मदत." },
  "support.call_now": { en: "Call Now", hi: "अभी कॉल करें", mr: "आता कॉल करा" },
  "support.why_call": { en: "Why call support?", hi: "सपोर्ट को कॉल क्यों करें?", mr: "समर्थन टीमला कॉल का करावा?" },
  "support.why_call_desc": { 
    en: "While SHETKARI AI helps with automation, human experts can provide deep context about your specific field conditions. Don't hesitate to call if the sensor data looks unexpected or if your crops show unusual signs.", 
    hi: "जबकि शेतकरी एआई ऑटोमेशन में मदद करता है, मानव विशेषज्ञ आपके विशिष्ट क्षेत्र की स्थितियों के बारे में गहरी जानकारी प्रदान कर सकते हैं। यदि सेंसर डेटा अप्रत्याशित लगता है या यदि आपकी फसलें असामान्य लक्षण दिखाती हैं तो कॉल करने में संकोच न करें।", 
    mr: "शेतकरी AI जरी ऑटोमेशनमध्ये मदत करत असले, तरी मानवी तज्ज्ञ तुमच्या शेतातील विशिष्ट परिस्थितीबद्दल सखोल माहिती देऊ शकतात. सेन्सर डेटा अनपेक्षित वाटल्यास किंवा तुमच्या पिकांमध्ये असामान्य लक्षणे दिसल्यास कॉल करण्यास संकोच करू नका." 
  },

  // Simulator Page
  "sim.title": { en: "Farm Simulator", hi: "फार्म सिम्युलेटर", mr: "फार्म सिम्युलेटर" },
  "sim.subtitle": { en: "Generate datasets and validate ML models in a controlled environment.", hi: "नियंत्रित वातावरण में डेटासेट तैयार करें और एमएल मॉडल को सत्यापित करें।", mr: "नियंत्रित वातावरणात डेटासेट तयार करा आणि ML मॉडेल्सची पडताळणी करा." },
  "sim.reset": { en: "Reset Simulation", hi: "सिमुलेशन रीसेट करें", mr: "सिमुलेशन रीसेट करा" },
  "sim.start": { en: "Start Stream", hi: "स्ट्रीम शुरू करें", mr: "स्ट्रीम सुरू करा" },
  "sim.stop": { en: "Stop Stream", hi: "स्ट्रीम रोकें", mr: "स्ट्रीम थांबवा" },
  "sim.ml_models": { en: "AI-ML Model Integrity", hi: "AI-ML मॉडल अखंडता", mr: "AI-ML मॉडेल अखंडता" },
  "sim.ml_models_desc": { en: "Toggle models to test individual predictive accuracy.", hi: "व्यक्तिगत भविष्य कहनेवाला सटीकता का परीक्षण करने के लिए मॉडल स्विच करें।", mr: "वैयक्तिक अंदाज अचूकतेची चाचणी घेण्यासाठी मॉडेल्स टॉगल करा." },
  "sim.env": { en: "Environmental Controls", hi: "पर्यावरण नियंत्रण", mr: "पर्यावरण नियंत्रण" },
  "sim.apply": { en: "Apply Constraints", hi: "बाधाएं लागू करें", mr: "मर्यादा लागू करा" },
  "sim.rain_condition": { en: "Rain Condition", hi: "बारिश की स्थिति", mr: "पावसाची स्थिती" },
  "sim.dataset_factory": { en: "Dataset Factory", hi: "डेटासेट फैक्ट्री", mr: "डेटासेट फॅक्टरी" },
  "sim.dataset_desc": { en: "Generate bulk CSV data based on current simulation parameters.", hi: "वर्तमान सिमुलेशन मापदंडों के आधार पर बल्क CSV डेटा तैयार करें।", mr: "वर्तमान सिमुलेशन पॅरामीटर्सवर आधारित मोठ्या प्रमाणात CSV डेटा तयार करा." },
  "sim.duration": { en: "Time Span", hi: "समय अवधि", mr: "कालावधी" },
  "sim.generate_csv": { en: "Generate CSV", hi: "CSV तैयार करें", mr: "CSV तयार करा" },
  "sim.live_stream": { en: "In-Memory Live Stream", hi: "इन-मेमोरी लाइव स्ट्रीम", mr: "इन-मेमरी लाइव्ह स्ट्रीम" },
  "sim.live_stream_desc": { en: "Real-time buffer of simulated sensor events.", hi: "सिम्युलेटेड सेंसर घटनाओं का वास्तविक समय बफर।", mr: "सिम्युलेटेड सेन्सर घटनांचा रिअल-टाइम बफर." },
  "sim.stream_active": { en: "STREAM ACTIVE", hi: "स्ट्रीम सक्रिय", mr: "स्ट्रीम सक्रिय" },
  "sim.stream_paused": { en: "STREAM PAUSED", hi: "स्ट्रीम रुकी हुई है", mr: "स्ट्रीम थांबली आहे" },
  "sim.no_data": { en: "No records found in current buffer.", hi: "वर्तमान बफर में कोई रिकॉर्ड नहीं मिला।", mr: "वर्तमान बफरमध्ये कोणतेही रेकॉर्ड सापडले नाहीत." },
  "sim.hint_title": { en: "Pro-Tip: Syncing to Hardware", hi: "प्रो-टिप: हार्डवेयर के साथ सिंक करना", mr: "प्रो-टिप: हार्डवेअरसह सिंक करणे" },
  "sim.hint_desc": { en: "The simulator pushes data to the local API which merges it with live IoT inputs. Use 'STABLE' mode for production testing.", hi: "सिम्युलेटर लोकल एपीआई को डेटा भेजता है जो इसे लाइव IoT इनपुट के साथ जोड़ता है। उत्पादन परीक्षण के लिए 'STABLE' मोड का उपयोग करें।", mr: "सिम्युलेटर स्थानिक API कडे डेटा पाठवतो जो त्यास थेट IoT इनपुटसह एकत्रित करतो. उत्पादन चाचणीसाठी 'STABLE' मोड वापरा." },
  
  "table.timestamp": { en: "Timestamp", hi: "समय", mr: "वेळ" },
  "table.soil": { en: "Soil (%)", hi: "मिट्टी (%)", mr: "माती (%)" },
  "table.temp": { en: "Temp (°C)", hi: "तापमान (°C)", mr: "तापमान (°C)" },
  "table.rain": { en: "Rain", hi: "बारिश", mr: "पाऊस" },
  "table.growth": { en: "Growth", hi: "विकास", mr: "वाढ" },
  "table.ai_analytics": { en: "AI Analytics", hi: "AI एनालिटिक्स", mr: "AI विश्लेषण" },
  "table.active": { en: "ACTIVE", hi: "सक्रिय", mr: "सक्रिय" },
  "table.yes": { en: "YES", hi: "हाँ", mr: "हो" },
  "table.no": { en: "NO", hi: "नहीं", mr: "नाही" },

  // General helpers
  "Establishing initial baseline...": { en: "Establishing initial baseline...", hi: "प्रारंभिक आधार रेखा स्थापित की जा रही है...", mr: "सुरुवातीची आधारभूत माहिती गोळा करत आहे..." },
  "estable": { en: "STABLE", hi: "स्थिर", mr: "स्थिर" },
};

export function useTranslation() {
  const { language } = useAppStore();
  
  return function translate(key: string, lang?: Language): string {
    const activeLang = lang || language;
    const directMatch = (t as any)[key]?.[activeLang];
    
    if (directMatch) return directMatch;

    if (key.includes(" (ML Forecast:")) {
      const parts = key.split(" (ML Forecast:");
      const baseKey = parts[0];
      const translatedBase = (t as any)[baseKey]?.[activeLang];
      if (translatedBase) {
        let suffix = parts[1];
        if (activeLang === 'hi') {
          suffix = suffix.replace('moisture in next step', ' अगले चरण में नमी')
                        .replace('Predicted Trend', 'अनुमानित रुझान')
                        .replace('Soil Moisture', 'मिट्टी की नमी')
                        .replace('Temperature', 'तापमान')
                        .replace(')', '');
          return `${translatedBase} (एआई पूर्वानुमान: ${suffix.trim()})`;
        } else if (activeLang === 'mr') {
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

    return (t as any)[key]?.[activeLang] || key;
  };
}
