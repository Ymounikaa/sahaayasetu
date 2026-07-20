import React from 'react';
import {
  PhoneCall,
  Activity,
  MapPin,
  Calendar,
  HeartHandshake,
  FileText,
  FolderHeart,
  MessageSquareText,
  Globe,
  ChevronRight,
  AlertOctagon
} from 'lucide-react';
import { AppRoute, Language, WorkerFeature } from '../types';
import { WORKER_FEATURES, TRANSLATIONS } from '../data';
import AudioSpeaker from './AudioSpeaker';

const IconMap: Record<string, React.ComponentType<any>> = {
  PhoneCall,
  Activity,
  MapPin,
  Calendar,
  HeartHandshake,
  FileText,
  FolderHeart,
  MessageSquareText,
};

interface WorkerHomeViewProps {
  selectedLanguage: Language | null;
  phoneNumber: string;
  onFeatureSelect: (route: AppRoute) => void;
  onChangeLanguage: () => void;
}

export default function WorkerHomeView({
  selectedLanguage,
  phoneNumber,
  onFeatureSelect,
  onChangeLanguage,
}: WorkerHomeViewProps) {
  
  // Custom welcoming voice instruction based on selected language
  const getWelcomeAudio = () => {
    switch (selectedLanguage?.code) {
      case 'te':
        return 'సహಾಯ సేతు కి స్వాగతం. వైద్య సహాయం కోసం క్రింది కార్డులలో ఒకదానిని ఎంచుకోండి.';
      case 'hi':
        return 'सहाय सेतु में आपका स्वागत है। चिकित्सा सहायता के लिए नीचे दिए गए कार्डों में से किसी एक को चुनें।';
      case 'kn':
        return 'ಸಹಾಯ ಸೇತುಗೆ ಸುಸ್ವಾಗತ. ವೈದ್ಯಕೀಯ ಸಹಾಯಕ್ಕಾಗಿ ಕೆಳಗಿನ ಕಾರ್ಡ್‌ಗಳಲ್ಲಿ ಒಂದನ್ನು ಆಯ್ಕೆಮಾಡಿ.';
      case 'ta':
        return 'சஹாய சேதுவிற்கு உங்களை வரவேற்கிறோம். மருத்துவ உதவிக்கு கீழே உள்ள அட்டைகளில் ஒன்றை தேர்வு செய்யவும்.';
      case 'ml':
        return 'സഹായ സേതുവിലേക്ക് സ്വാഗതം. ആരോഗ്യ സഹായത്തിനായി താഴെയുള്ള കാർഡുകളിൽ ഒന്ന് തിരഞ്ഞെടുക്കുക.';
      case 'bn':
        return 'সহায় সেতুতে আপনাকে স্বাগতম। চিকিৎসা সহায়তার জন্য নিচের যেকোনো একটি কার্ড নির্বাচন করুন।';
      case 'mr':
        return 'सहाय सेतूमध्ये आपले स्वागत आहे. वैद्यकीय मदतीसाठी खालीलपैकी कोणतेही एक कार्ड निवडा.';
      case 'or':
        return 'ସହାୟ ସେତୁକୁ ଆପଣଙ୍କୁ ସ୍ୱାଗତ। ଚିକିତ୍ସା ସହାୟତା ପାଇଁ ତଳେ ଥିବା ଯେକୌଣସି କାର୍ଡ ବାଛନ୍ତୁ।';
      case 'pa':
        return 'ਸਹਾਇ ਸੇਤੂ ਵਿੱਚ ਤੁਹਾਡਾ ਸੁਆਗਤ ਹੈ। ਮੈਡੀਕਲ ਸਹਾਇਤਾ ਲਈ ਹੇਠਾਂ ਦਿੱਤੇ ਕਾਰਡਾਂ ਵਿੱਚੋਂ ਕੋਈ ਇੱਕ ਚੁਣੋ।';
      default:
        return 'Welcome to Sahaaya Setu. Please select any of the service cards below to get healthcare support.';
    }
  };

  const langCode = selectedLanguage?.code || 'en';

  const localTranslations = {
    en: {
      patient_dashboard: "Patient Dashboard",
      welcome_back: "Welcome Back, Patient",
      mobile_label: "Mobile:",
      emergency_access: "EMERGENCY ACCESS",
      change_language: "Change Language",
      healthcare_services: "Healthcare Services",
      select_service_guide: "Select a service to open",
      current_language: "Current Language:",
      change_language_btn: "Change Language / ഭാഷ മാറുക"
    },
    te: {
      patient_dashboard: "పేషెంట్ డ్యాష్‌బోర్డ్",
      welcome_back: "మళ్ళీ స్వాగతం, పేషెంట్",
      mobile_label: "మొబైల్:",
      emergency_access: "అత్యవసర సేవలు",
      change_language: "భాష మార్చండి",
      healthcare_services: "ఆరోగ్య సేవలు",
      select_service_guide: "ఓపెన్ చేయడానికి ఒక సేవను ఎంచుకోండి",
      current_language: "ప్రస్తుత భాష:",
      change_language_btn: "భాष మార్చండి / Change Language"
    },
    hi: {
      patient_dashboard: "मरीज डैशबोर्ड",
      welcome_back: "आपका स्वागत है, मरीज",
      mobile_label: "मोबाइल:",
      emergency_access: "आपातकालीन सेवाएं",
      change_language: "भाषा बदलें",
      healthcare_services: "स्वास्थ्य सेवाएं",
      select_service_guide: "खोलने के लिए एक सेवा चुनें",
      current_language: "वर्तमान भाषा:",
      change_language_btn: "भाषा बदलें / Change Language"
    },
    kn: {
      patient_dashboard: "ರೋಗಿ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
      welcome_back: "ಮರಳಿ ಸುಸ್ವಾಗತ, ರೋಗಿ",
      mobile_label: "ಮೊಬೈಲ್:",
      emergency_access: "ತುರ್ತು ಸೇವೆಗಳು",
      change_language: "ಭಾಷೆ ಬದಲಾಯಿಸಿ",
      healthcare_services: "ಆರೋಗ್ಯ ಸೇವೆಗಳು",
      select_service_guide: "ತೆರೆಯಲು ಸೇವೆಯನ್ನು ಆರಿಸಿ",
      current_language: "ಪ್ರಸ್ತುತ ಭಾಷೆ:",
      change_language_btn: "ಭಾಷೆ ಬದಲಾಯಿಸಿ / Change Language"
    },
    ta: {
      patient_dashboard: "நோயாளி டாஷ்போர்டு",
      welcome_back: "நல்வரவு, நோயாளி",
      mobile_label: "கைபேசி:",
      emergency_access: "அவசரகால உதவி",
      change_language: "மொழியை மாற்றவும்",
      healthcare_services: "சுகாதார சேவைகள்",
      select_service_guide: "திறக்க ஒரு சேவையைத் தேர்ந்தெடுக்கவும்",
      current_language: "தற்போதைய மொழி:",
      change_language_btn: "மொழியை மாற்றவும் / Change Language"
    },
    ml: {
      patient_dashboard: "രോഗി ഡാഷ്‌ബോർഡ്",
      welcome_back: "വീണ്ടും സ്വാഗതം, രോഗി",
      mobile_label: "മൊബൈൽ:",
      emergency_access: "അടിയന്തിര സഹായം",
      change_language: "ഭാഷ മാറ്റുക",
      healthcare_services: "ആരോഗ്യ സേവനങ്ങൾ",
      select_service_guide: "തുറക്കാൻ ഒരു സേവനം തിരഞ്ഞെടുക്കുക",
      current_language: "നിലവിലെ ഭാഷ:",
      change_language_btn: "ഭാഷ മാറ്റുക / Change Language"
    },
    bn: {
      patient_dashboard: "রোগী ড্যাশবোর্ড",
      welcome_back: "স্বাগত, রোগী",
      mobile_label: "মোবাইল:",
      emergency_access: "জরুরী অ্যাক্সেস",
      change_language: "ভাষা পরিবর্তন করুন",
      healthcare_services: "স্বাস্থ্যসেবা",
      select_service_guide: "খোলার জন্য একটি পরিষেবা নির্বাচন করুন",
      current_language: "বর্তমান ভাষা:",
      change_language_btn: "ভাষা পরিবর্তন / Change Language"
    },
    mr: {
      patient_dashboard: "रुग्ण डॅशबोर्ड",
      welcome_back: "पुन्हा स्वागत आहे, रुग्ण",
      mobile_label: "मोबाईल:",
      emergency_access: "आपातकालीन प्रवेश",
      change_language: "भाषा बदला",
      healthcare_services: "आरोग्य सेवा",
      select_service_guide: "उघडण्यासाठी सेवा निवडा",
      current_language: "सध्याची भाषा:",
      change_language_btn: "भाषा बदला / Change Language"
    },
    or: {
      patient_dashboard: "ରୋଗୀ ଡ୍ୟାସବୋର୍ଡ",
      welcome_back: "ସ୍ୱାଗତ, ରୋଗୀ",
      mobile_label: "ମୋବାଇଲ୍:",
      emergency_access: "ଆପାତକାଳୀନ ସେବା",
      change_language: "ଭାଷା ବଦଳାନ୍ତୁ",
      healthcare_services: "ସ୍ୱାସ୍ଥ୍ୟ ସେବା",
      select_service_guide: "ଖୋଲିବା ପାଇଁ ଏକ ସେବା ବାଛନ୍ତು",
      current_language: "ବର୍ତ୍ତମାନର ଭାଷା:",
      change_language_btn: "ଭାଷା ବଦଳାନ୍ତು / Change Language"
    },
    pa: {
      patient_dashboard: "ਮਰੀਜ਼ ਡੈਸ਼ਬੋਰਡ",
      welcome_back: "ਜੀ ਆਇਆਂ ਨੂੰ, ਮਰੀਜ਼",
      mobile_label: "ਮੋਬਾਈਲ:",
      emergency_access: "ਐਮਰਜੈਂਸੀ ਸੇਵਾਵਾਂ",
      change_language: "ਭਾਸ਼ਾ ਬਦਲੋ",
      healthcare_services: "ਸਿਹਤ ਸੇਵਾਵਾਂ",
      select_service_guide: "ਖੋਲ੍ਹਣ ਲਈ ਇੱਕ ਸੇਵਾ ਚੁਣੋ",
      current_language: "ਮੌਜੂਦਾ ਭਾਸ਼ਾ:",
      change_language_btn: "ਭਾਸ਼ਾ ਬਦਲੋ / Change Language"
    }
  };

  const getUiText = (key: keyof typeof localTranslations.en) => {
    const lang = (localTranslations[langCode as keyof typeof localTranslations] ? langCode : 'en') as keyof typeof localTranslations;
    return localTranslations[lang][key] || localTranslations['en'][key];
  };

  return (
    <div className="max-w-4xl mx-auto my-4 px-4" id="worker-home-container">
      
      {/* Polished Compact Welcome back Section */}
      <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-sm mb-6 relative overflow-hidden">
        {/* Decorative backdrop */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-2xl translate-x-12 -translate-y-12 pointer-events-none"></div>
        
        <div className="flex items-start justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-blue-100 text-xs font-bold uppercase tracking-widest block">
                {getUiText('patient_dashboard')}
              </span>
              <span className="bg-white/15 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white">
                {selectedLanguage?.nativeName || 'English'}
              </span>
            </div>
            
            <h2 className="font-sans font-extrabold text-xl sm:text-2xl tracking-tight mt-1">
              {getUiText('welcome_back')}
            </h2>
            
            <p className="text-blue-100 text-xs mt-1.5 font-medium flex items-center gap-1.5">
              <span>{getUiText('mobile_label')}</span>
              <span className="font-mono bg-white/10 px-2 py-0.5 rounded text-white">{phoneNumber || '9876543210'}</span>
            </p>
          </div>

          <div className="flex flex-col items-end gap-2">
            <AudioSpeaker text={getWelcomeAudio()} size={16} className="bg-white/10 text-white rounded-full" />
          </div>
        </div>

        {/* Quick actions row */}
        <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs text-blue-100">
          <button
            onClick={() => onFeatureSelect('emergency')}
            className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 active:scale-95 px-3 py-1.5 rounded-xl font-extrabold transition-all text-white shadow-xs"
            id="quick-emergency-btn"
          >
            <AlertOctagon size={14} />
            <span>{getUiText('emergency_access')}</span>
          </button>

          <button
            onClick={onChangeLanguage}
            className="bg-white/15 hover:bg-white/20 active:scale-95 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all text-white"
            id="change-lang-quick-btn"
          >
            <Globe size={13} />
            <span>{getUiText('change_language')}</span>
          </button>
        </div>
      </div>

      {/* Grid Header & Guide */}
      <div className="flex items-center justify-between mb-4 px-1">
        <h3 className="font-sans font-extrabold text-slate-800 text-lg sm:text-xl">
          {getUiText('healthcare_services')}
        </h3>
        <p className="text-xs text-slate-400 font-medium">
          {getUiText('select_service_guide')}
        </p>
      </div>

      {/* Grid of services without speaker icon on card titles/covers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="features-grid">
        {WORKER_FEATURES.map((feat) => {
          const IconComponent = IconMap[feat.icon] || Activity;
          const isEmergency = feat.id === 'emergency';

          const featKeyMap: Record<string, string> = {
            emergency: 'emergency_title',
            symptoms: 'symptoms_title',
            hospitals: 'hospitals_title',
            appointments: 'appointments_title',
            camps: 'camps_title',
            prescriptions: 'prescriptions_title',
            history: 'history_title',
            chat: 'chat_title'
          };
          const featDescKeyMap: Record<string, string> = {
            emergency: 'emergency_desc',
            symptoms: 'symptoms_desc',
            hospitals: 'hospitals_desc',
            appointments: 'appointments_desc',
            camps: 'camps_desc',
            prescriptions: 'prescriptions_desc',
            history: 'history_desc',
            chat: 'chat_desc'
          };

          // Resolve main card title and subtitle based on language selection
          const mainTitle = selectedLanguage && TRANSLATIONS[selectedLanguage.code]?.[featKeyMap[feat.id]]
            ? TRANSLATIONS[selectedLanguage.code][featKeyMap[feat.id]]
            : feat.englishName;

          const subtitleText = selectedLanguage && selectedLanguage.code !== 'en'
            ? feat.englishName
            : undefined;

          const mainDescription = selectedLanguage && TRANSLATIONS[selectedLanguage.code]?.[featDescKeyMap[feat.id]]
            ? TRANSLATIONS[selectedLanguage.code][featDescKeyMap[feat.id]]
            : feat.description;

          return (
            <div
              key={feat.id}
              onClick={() => onFeatureSelect(feat.id)}
              className={`p-5 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between gap-4 select-none group active:scale-98 ${
                isEmergency
                  ? 'bg-red-50 border-red-200 hover:border-red-400 shadow-xs'
                  : 'bg-white border-slate-150 hover:border-blue-600 shadow-xs'
              }`}
              id={`feature-card-${feat.id}`}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onFeatureSelect(feat.id);
                }
              }}
            >
              {/* Top Row: Icon */}
              <div className="flex items-start justify-between">
                <div className={`p-3 rounded-xl ${
                  isEmergency ? 'bg-red-100 text-red-600' : 'bg-blue-50 text-blue-600'
                }`}>
                  <IconComponent size={22} className="stroke-[2.5]" />
                </div>
              </div>

              {/* Text Description */}
              <div>
                <h4 className={`font-sans font-bold text-sm transition-colors flex items-center justify-between ${
                  isEmergency ? 'text-red-800' : 'text-slate-800 group-hover:text-blue-600'
                }`}>
                  <span>{mainTitle}</span>
                  <ChevronRight size={14} className={`transition-all ${
                    isEmergency ? 'text-red-400 group-hover:translate-x-0.5' : 'text-slate-300 group-hover:text-blue-500 group-hover:translate-x-0.5'
                  }`} />
                </h4>
                
                {/* Secondary translation display */}
                {subtitleText && (
                  <span className={`block text-[11px] font-semibold mt-0.5 font-sans ${isEmergency ? 'text-red-700/80' : 'text-slate-500'}`}>
                    {subtitleText}
                  </span>
                )}
                
                <p className={`text-[10px] leading-relaxed mt-2 line-clamp-2 ${isEmergency ? 'text-red-700/60' : 'text-slate-400'}`}>
                  {mainDescription}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Global persistent footer bar */}
      <div className="mt-8 p-4 bg-slate-100 rounded-xl border border-slate-200/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div className="flex items-center gap-2">
          <Globe size={16} className="text-slate-400" />
          <span className="text-xs text-slate-600 font-semibold">
            {getUiText('current_language')} <span className="text-blue-600 font-bold">{selectedLanguage?.nativeName || 'English'}</span>
          </span>
        </div>
        <button
          onClick={onChangeLanguage}
          className="text-xs bg-white text-blue-600 border border-slate-200 hover:bg-blue-50 active:scale-95 transition-all font-bold px-4 py-2 rounded-xl shadow-xs"
          id="change-language-footer-btn"
        >
          {getUiText('change_language_btn')}
        </button>
      </div>
    </div>
  );
}
