import React from 'react';
import { HeartPulse, Globe, ArrowLeft, LogOut } from 'lucide-react';
import { AppRoute, Language } from '../types';
import { TRANSLATIONS } from '../data';

interface HeaderProps {
  currentRoute: AppRoute;
  selectedLanguage: Language | null;
  userRole: 'worker' | 'doctor' | 'ngo' | null;
  onNavigate: (route: AppRoute) => void;
  onBack?: () => void;
  onLogout: () => void;
  onChangeLanguage: () => void;
}

export default function Header({
  currentRoute,
  selectedLanguage,
  userRole,
  onNavigate,
  onBack,
  onLogout,
  onChangeLanguage,
}: HeaderProps) {
  const isWorkerDashboard = currentRoute === 'worker-home';
  const isLanguageSelection = currentRoute === 'languages';
  const isLogin = currentRoute === 'login';
  
  // Feature screens are sub-screens of worker-home
  const isFeatureScreen = [
    'emergency', 'symptoms', 'hospitals', 'appointments', 
    'camps', 'prescriptions', 'history', 'chat'
  ].includes(currentRoute);

  const getTitle = () => {
    const lang = selectedLanguage?.code || 'en';
    const titles: Record<string, Record<string, string>> = {
      doctor: {
        en: 'Doctor Portal',
        te: 'వైద్యుల పోర్టల్',
        hi: 'डॉक्टर पोर्टल',
        kn: 'ವೈದ್ಯರ ಪೋರ್ಟಲ್',
        ta: 'மருத்துவர் போர்டல்',
        ml: 'ഡോക്ടർ പോർട്ടൽ',
        bn: 'ডাক্তার পোর্টাল',
        mr: 'डॉक्टर पोर्टल',
        or: 'ଡାକ୍ତର ପୋର୍ଟାଲ୍',
        pa: 'ਡਾਕਟਰ ਪੋਰਟਲ',
      },
      ngo: {
        en: 'NGO Campaign Control',
        te: 'NGO ప్రచార నియంత్రణ',
        hi: 'एनजीओ अभियान नियंत्रण',
        kn: 'ಸ್ವಯಂಸೇವಾ ಸಂಸ್ಥೆ ನಿಯಂತ್ರಣ',
        ta: 'என்ஜிஓ பிரச்சாரக் கட்டுப்பாடு',
        ml: 'എൻ‌ജി‌ഒ കാമ്പെയ്‌ൻ നിയന്ത്രണം',
        bn: 'এনজিও প্রচার নিয়ন্ত্রণ',
        mr: 'एनजीओ मोहीम नियंत्रण',
        or: 'ଏନଜିଓ ଅଭିଯាន ନିୟନ୍ତ୍ରଣ',
        pa: 'ਐਨਜੀਓ ਮੁਹਿੰਮ ਨਿਯੰਤਰਣ',
      },
      patient: {
        en: 'Patient Portal',
        te: 'పేషెంట్ పోర్టల్',
        hi: 'मरीज पोर्टल',
        kn: 'ರೋಗಿ ಪೋರ್ಟಲ್',
        ta: 'நோயாளி போர்டல்',
        ml: 'രോഗി പോർട്ടൽ',
        bn: 'রোগী পোর্টাল',
        mr: 'रुग्ण पोर्टल',
        or: 'ରୋଗୀ ପୋର୍ଟାଲ୍',
        pa: 'ਮਰੀਜ਼ ਪੋਰਟଲ',
      },
    };
    const roleKey = userRole === 'doctor' ? 'doctor' : userRole === 'ngo' ? 'ngo' : 'patient';
    return titles[roleKey]?.[lang] || titles[roleKey]?.['en'];
  };

  const getTagline = () => {
    const lang = selectedLanguage?.code || 'en';
    const taglines: Record<string, string> = {
      en: 'Accessible Multilingual Healthcare',
      te: 'అందరికీ సులువైన బహుభాషా వైద్య సేవలు',
      hi: 'सुलभ बहुभाषी स्वास्थ्य सेवा',
      kn: 'ಸುಲಭ ಬಹುಭಾಷಾ ಆರೋಗ್ಯ ಸೇವೆ',
      ta: 'அனைவருக்கும் எளிய பன்மொழி சுகாதார சேவை',
      ml: 'ലളിതമായ ബഹുഭാഷാ ആരോഗ്യ സേവനം',
      bn: 'সহজ বহুভাষিক স্বাস্থ্যসেবা',
      mr: 'सुलभ बहुभाषिक आरोग्य सेवा',
      or: 'ସୁଲଭ ବହୁଭାଷୀ ସ୍ୱาସ୍ଥ୍ୟ ସେବା',
      pa: 'ਸੌਖੀ ਬਹੁ-ਭਾਸ਼ਾਈ ਸਿਹਤ ਸੇਵਾ',
    };
    return taglines[lang] || taglines['en'];
  };

  const backText = selectedLanguage ? (TRANSLATIONS[selectedLanguage.code]?.back || 'Back') : 'Back';

  return (
    <header className="bg-white border-b border-slate-150 sticky top-0 z-40 shadow-xs" id="app-header">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* Left section: Back button or Logo */}
        <div className="flex items-center gap-3">
          {onBack && !isLogin && (
            <button
              onClick={onBack}
              className="p-2 -ml-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors active:scale-95 flex items-center gap-1.5 font-medium text-sm"
              title="Go Back"
              id="back-button"
            >
              <ArrowLeft size={20} />
              <span className="hidden sm:inline">{backText}</span>
            </button>
          )}

          {!onBack && !isLogin && (
            <div className="flex items-center gap-2">
              <div className="bg-sky-50 p-1.5 rounded-lg border border-sky-100 text-sky-600">
                <HeartPulse size={20} className="stroke-[2.5]" />
              </div>
              <div>
                <span className="font-display font-bold text-slate-800 tracking-tight block text-sm leading-none sm:text-base">
                  SAHAAYA SETU
                </span>
                <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest block mt-0.5">
                  {getTitle()}
                </span>
              </div>
            </div>
          )}

          {isLogin && (
            <div className="flex items-center gap-2">
              <div className="bg-sky-50 p-2 rounded-xl border border-sky-100 text-sky-600 animate-pulse">
                <HeartPulse size={24} className="stroke-[2.5]" />
              </div>
              <div>
                <h1 className="font-display font-extrabold text-slate-900 tracking-tight text-lg leading-none">
                  SAHAAYA SETU
                </h1>
                <p className="text-xs font-medium text-sky-600/80 tracking-wide mt-0.5">
                  {getTagline()}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Center/Right section: Context Info / Global Options */}
        <div className="flex items-center gap-2">
          {/* Active Language Badge */}
          {selectedLanguage && !isLogin && !isLanguageSelection && (
            <button
              onClick={onChangeLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-semibold border border-sky-200/50 transition-all active:scale-95"
              title="Change Language"
              id="header-change-lang-btn"
            >
              <Globe size={14} className="animate-spin-slow text-sky-600" />
              <span>{selectedLanguage.nativeName}</span>
            </button>
          )}

          {/* Quick Logout if logged in */}
          {!isLogin && (
            <button
              onClick={onLogout}
              className="p-2 rounded-full hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors active:scale-95"
              title="Sign Out"
              aria-label="Sign Out"
              id="logout-button"
            >
              <LogOut size={18} />
            </button>
          )}
        </div>

      </div>
    </header>
  );
}
