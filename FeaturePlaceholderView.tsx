import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, PhoneCall, AlertTriangle, Activity, Check, 
  MapPin, Phone, Eye, Calendar, Clock, HeartHandshake,
  FileText, Play, Plus, Upload, Heart, Send, Mic, Volume2,
  ExternalLink, Sparkles, AlertCircle, Info, CheckCircle2, Trash, Search
} from 'lucide-react';
import { AppRoute, Language } from '../types';
import { TRANSLATIONS, getLocalizedProperNoun } from '../data';
import AudioSpeaker from './AudioSpeaker';

interface FeaturePlaceholderViewProps {
  featureId: AppRoute;
  selectedLanguage: Language | null;
  onBack: () => void;
  onNavigate?: (route: AppRoute) => void;
  phoneNumber?: string;
}

export default function FeaturePlaceholderView({
  featureId,
  selectedLanguage,
  onBack,
  onNavigate,
  phoneNumber,
}: FeaturePlaceholderViewProps) {
  
  const langCode = selectedLanguage?.code || 'en';
  const text = {
    ...TRANSLATIONS['en'],
    ...(TRANSLATIONS[langCode] || {})
  };

  // Global state loaded from local storage to connect Worker Flow with Doctor & NGO Dashboards
  const [appointmentsList, setAppointmentsList] = useState<any[]>([]);
  const [campRegistrations, setCampRegistrations] = useState<any[]>([]);
  const [prescriptionsList, setPrescriptionsList] = useState<any[]>([]);

  // Load cohesive local storage data
  useEffect(() => {
    // 1. Appointments
    const savedAppts = localStorage.getItem('hb_appointments');
    if (savedAppts) {
      setAppointmentsList(JSON.parse(savedAppts));
    } else {
      const defaultAppts = [
        { id: '1', doctor: 'Dr. Ramesh Kumar', department: 'General Medicine', hospital: 'City Civil Government Hospital', date: '2026-07-22', time: '10:30 AM', reason: 'Fever and Body pain', status: 'Confirmed' },
        { id: '2', doctor: 'Dr. Anita Desai', department: 'Pediatrician', hospital: 'Red Cross Community Clinic', date: '2026-07-25', time: '02:15 PM', reason: 'Child vaccine check', status: 'Pending NGO Approval' }
      ];
      setAppointmentsList(defaultAppts);
      localStorage.setItem('hb_appointments', JSON.stringify(defaultAppts));
    }

    // 2. NGO Camp Registrations
    const savedRegs = localStorage.getItem('hb_camp_registrations');
    if (savedRegs) {
      setCampRegistrations(JSON.parse(savedRegs));
    }

    // 3. Prescriptions (loaded from local storage, updated by doctor)
    const savedPrescs = localStorage.getItem('hb_prescriptions');
    if (savedPrescs) {
      setPrescriptionsList(JSON.parse(savedPrescs));
    } else {
      const defaultPrescs = [
        { id: '1', medicine: 'Paracetamol (500mg)', dosage: '1 tablet', frequency: 'Morning & Night', foodRelation: 'After Food', duration: '5 Days', instruction: 'Take one tablet in the morning and one at night after eating for fever relief.' },
        { id: '2', medicine: 'Amoxicillin (250mg)', dosage: '1 capsule', frequency: 'Morning, Afternoon & Night', foodRelation: 'After Food', duration: '7 Days', instruction: 'Take one capsule three times a day after meals to treat infection.' }
      ];
      setPrescriptionsList(defaultPrescs);
      localStorage.setItem('hb_prescriptions', JSON.stringify(defaultPrescs));
    }

    // Check for hospital/doctor prefill from Nearby Hospitals page
    const prefillHosp = localStorage.getItem('hb_prefill_hospital');
    const prefillDoc = localStorage.getItem('hb_prefill_doctor');
    if (prefillHosp) {
      setBookingHospital(prefillHosp);
      localStorage.removeItem('hb_prefill_hospital');
    }
    if (prefillDoc) {
      setBookingDoctor(prefillDoc);
      localStorage.removeItem('hb_prefill_doctor');
    }
  }, [featureId]);

  // Sync preferred registration language with selected global language
  useEffect(() => {
    if (selectedLanguage) {
      setRegLang(selectedLanguage.englishName);
    }
  }, [selectedLanguage]);

  // -------------------------------------------------------------
  // 1. EMERGENCY HELP STATE & SUB-HANDLERS
  // -------------------------------------------------------------
  const [emergencyText, setEmergencyText] = useState('');
  const [emergencySpeechActive, setEmergencySpeechActive] = useState(false);
  const [sosSent, setSosSent] = useState(false);
  
  const emergencyPhrases = [
    { eng: "I cannot breathe", native: { te: "నాకు ఊపిరి ఆడడం లేదు", hi: "मुझे सांस लेने में तकलीफ हो रही है", kn: "ನನಗೆ ಉಸಿರಾಡಲು ಸಾಧ್ಯವಾಗುತ್ತಿಲ್ಲ", ta: "என்னால் சுவாசிக்க முடியவில்லை", ml: "എനിക്ക് ശ്വാസമെടുക്കാൻ കഴിയുന്നില്ല", bn: "আমি শ্বাস নিতে পারছি না", mr: "मला श्वास घेता येत नाही", or: "ମୁଁ ନିଶ୍ୱାସ ନେଇପାରୁନି", pa: "ਮੈਨੂੰ ਸਾਹ ਲੈਣ ਵਿੱਚ ਤਕਲੀਫ਼ ਹੋ ਰਹੀ ਹੈ" } },
    { eng: "I have severe chest pain", native: { te: "నాకు గుండెలో తీవ్రమైన నొప్పి ఉంది", hi: "मेरे सीने में तेज दर्द हो रहा है", kn: "ನನ್ನ ಎದೆಯಲ್ಲಿ ತೀವ್ರವಾದ ನೋವು ಇದೆ", ta: "எனக்கு நெஞ்சு வலி கடுமையாக உள்ளது", ml: "എനിക്ക് കഠിനമായ നെഞ്ചുവേദനയുണ്ട്", bn: "আমার বুকে খুব ব্যথা হচ্ছে", mr: "माझ्या छातीत खूप दुखत आहे", or: "ମୋ ଛାତିରେ ପ୍ରବଳ ଯନ୍ତ୍ରଣା ହେଉଛି", pa: "ਮੇਰੀ ਛਾਤੀ ਵਿੱਚ ਬਹੁਤ ਤੇਜ਼ ਦਰਦ ਹੈ" } },
    { eng: "I am bleeding", native: { te: "నాకు రక్తం కారుతోంది", hi: "मेरा खून बह रहा है", kn: "ನನಗೆ ರಕ್ತಸ್ರಾವವಾಗುತ್ತಿದೆ", ta: "எனக்கு ரத்தம் வடிகிறது", ml: "എനിക്ക് രക്തസ്രാവമുണ്ട്", bn: "আমার রক্তপাত হচ্ছে", mr: "माझा रक्तस्त्राव होत आहे", or: "ମୋର ରକ୍ତସ୍ରାବ ହେଉଛି", pa: "ਮੇਰਾ ਖੂਨ ਵਹਿ ਰਿਹਾ ਹੈ" } },
    { eng: "I had an accident", native: { te: "నాకు ప్రమాదం జరిగింది", hi: "मेरा एक्सीडेंट हो गया है", kn: "ನನಗೆ ಅಪಘಾತವಾಗಿದೆ", ta: "எனக்கு விபத்து ஏற்பட்டுள்ளது", ml: "എനിക്ക് ഒരു അപകടം സംഭവിച്ചു", bn: "আমার দুর্ঘটনা ঘটেছে", mr: "माझा अपघात झाला आहे", or: "ମୋର ଦୁର୍ଘଟଣା ଘଟିଛି", pa: "ਮੇਰਾ ਐਕਸੀਡੈਂਟ ਹੋ ਗਿਆ ਹੈ" } },
    { eng: "I have a severe allergic reaction", native: { te: "నాకు తీవ్రమైన అలర్జీ వచ్చింది", hi: "मुझे गंभीर एलर्जी हो गई है", kn: "ನನಗೆ ತೀವ್ರವಾದ ಅಲರ್ಜಿ ಪ್ರತಿಕ್ರಿಯೆ ಉಂಟಾಗಿದೆ", ta: "எனக்கு கடுமையான ஒவ்வாமை ஏற்பட்டுள்ளது", ml: "എനിക്ക് കഠിനമായ അലർജിയുണ്ട്", bn: "আমার মারাত্মক অ্যালার্জি প্রতিক্রিয়া হচ্ছে", mr: "मला गंभीर ॲलर्जी झाली आहे", or: "ମୋତେ ଭୟଙ୍କର ଆଲର୍ଜି ହୋଇଛି", pa: "ਮੈਨੂੰ ਗੰਭੀਰ ਐਲਰਜੀ ਪ੍ਰਤੀਕਿਰਿਆ ਹੋਈ ਹੈ" } },
    { eng: "Please call an ambulance", native: { te: "దయచేసి అంబులెన్స్ పిలవండి", hi: "कृपया एम्बुलेंस बुलाएं", kn: "ದಯವಿಟ್ಟು ಅಂಬ್ಯುಲೆನ್ಸ್ ಕರೆಯಿರಿ", ta: "தயவுசெய்து ஆம்புலன்ஸ் அழைக்கவும்", ml: "ദയവായി ഒരു ആംബുലൻസ് വിളിക്കുക", bn: "দয়া করে অ্যাম্বুলেন্স ডাকুন", mr: "कृपया रुग्णवाहिका बोलवा", or: "ଦୟାକରି ଆମ୍ବୁଲାନ୍ସ ଡାକନ୍ତୁ", pa: "ਕਿਰਪਾ ਕਰਕੇ ਐਂਬੂਲੈਂਸ ਬੁਲਾਓ" } }
  ];

  const handleSpeakEmergency = () => {
    setEmergencySpeechActive(true);
    setTimeout(() => {
      setEmergencySpeechActive(false);
      const spoken = "Help me, I fell down at the work site and injured my hand";
      setEmergencyText(spoken);
    }, 2500);
  };

  const handleSendSOS = () => {
    setSosSent(true);
    setTimeout(() => setSosSent(false), 8000);
  };

  // -------------------------------------------------------------
  // 2. SYMPTOM CHECKER STATE & SUB-HANDLERS
  // -------------------------------------------------------------
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [typedSymptom, setTypedSymptom] = useState('');
  const [symptomVoiceActive, setSymptomVoiceActive] = useState(false);
  const [symptomGuidance, setSymptomGuidance] = useState<any | null>(null);

  const symptomOptions = [
    { id: 'fever', label: 'Fever', native: { te: 'జ్వరం', hi: 'बुखार', kn: 'ಜ್ವರ', ta: 'காய்ச்சல்', ml: 'പനി', bn: 'জ্বর', mr: 'ताप', or: 'ଜ୍ୱର', pa: 'ਬੁਖਾਰ' }, icon: '🌡️' },
    { id: 'headache', label: 'Headache', native: { te: 'తలనొప్పి', hi: 'सिरदर्द', kn: 'ತಲೆನೋವು', ta: 'தலைவலி', ml: 'തലവേദന', bn: 'মাথাব্যথা', mr: 'डोकेदुखी', or: 'ମୁଣ୍ଡବିନ୍ଧା', pa: 'ਸਿਰ ਦਰਦ' }, icon: '🤕' },
    { id: 'cough', label: 'Cough', native: { te: 'దగ్గు', hi: 'खांसी', kn: 'ಕೆಮ್ಮು', ta: 'இருமல்', ml: 'ചുമ', bn: 'কাশি', mr: 'खोकला', or: 'କାଶ', pa: 'ਖੰਘ' }, icon: '💨' },
    { id: 'cold', label: 'Cold', native: { te: 'జలుబు', hi: 'सर्दी', kn: 'ನೆಗಡಿ', ta: 'சளி', ml: 'ജലദോഷം', bn: 'সর্দি', mr: 'सर्दी', or: 'ଥଣ୍ଡା', pa: 'ਜ਼ੁਕਾਮ' }, icon: '🤧' },
    { id: 'vomiting', label: 'Vomiting', native: { te: 'వాంతులు', hi: 'उल्टी', kn: 'ವಾಂತಿ', ta: 'வாந்தி', ml: 'ഛർദ്ദി', bn: 'বমি', mr: 'उलटी', or: 'ବାନ୍ତି', pa: 'ਉਲਟੀ' }, icon: '🤮' },
    { id: 'stomach_pain', label: 'Stomach Pain', native: { te: 'కడుపు నొప్పి', hi: 'पेट दर्द', kn: 'ಹೊಟ್ಟೆ ನೋವು', ta: 'வயிற்று வலி', ml: 'വയറുവേദന', bn: 'পেটে ব্যথা', mr: 'पोटदुखी', or: 'ପେଟ ବ୍ୟଥା', pa: 'ਪੇਟ ਦਰਦ' }, icon: '🤢' },
    { id: 'body_pain', label: 'Body Pain', native: { te: 'ఒళ్లు నొప్పులు', hi: 'बदन दर्द', kn: 'ಮೈ ಕೈ ನೋವು', ta: 'உடல் வலி', ml: 'ശരീരവേദന', bn: 'গায়ে ব্যথা', mr: 'अंगदुखी', or: 'ଦେହ ବିନ୍ଧା', pa: 'ਸ਼ਰੀਰ ਦਰਦ' }, icon: '💪' },
    { id: 'dizziness', label: 'Dizziness', native: { te: 'కళ్ళు తిరగడం', hi: 'चक्कर आना', kn: 'ತಲೆಸುತ್ತು', ta: 'தலைச்சுற்றல்', ml: 'തലകറക്കം', bn: 'মাথা ঘোরা', mr: 'चक्कर येणे', or: 'ମୁଣ୍ଡ ବୁଲାଇବା', pa: 'ਚੱਕਰ ਆਉਣਾ' }, icon: '🌀' },
    { id: 'diarrhea', label: 'Diarrhea', native: { te: 'విరేచనాలు', hi: 'दस्त', kn: 'ಭೇದಿ', ta: 'வயிற்றுப்போக்கு', ml: 'വയറിളക്കം', bn: 'ডায়রিয়া', mr: 'जुलाब', or: 'ଝାଡ଼ା', pa: 'ਦਸਤ' }, icon: '🧻' },
    { id: 'sore_throat', label: 'Sore Throat', native: { te: 'గొంతు నొప్పి', hi: 'गले में खराश', kn: 'ಗಂಟಲು ನೋವು', ta: 'தொண்டை வலி', ml: 'തൊണ്ടവേദന', bn: 'গলা ব্যথা', mr: 'घसा दुखणे', or: 'ଗଳା ବ୍ୟଥା', pa: 'ਗਲੇ ਵਿੱਚ ਖਰਾਸ਼' }, icon: '🗣️' },
    { id: 'breathing_difficulty', label: 'Breathing Difficulty', native: { te: 'ఊపిరి ఆడకపోవడం', hi: 'सांस लेने में कठिनाई', kn: 'ಉಸಿರಾಟದ ತೊಂದರೆ', ta: 'மூச்சுத் திணறல்', ml: 'ശ്വാസതടസ്സം', bn: 'শ্বাসকষ্ট', mr: 'श्वास घेण्यास त्रास', or: 'ଶ୍ୱାସକ୍ରିୟାରେ କଷ୍ଟ', pa: 'ਸਾਹ ਲੈਣ ਵਿੱਚ ਤਕਲੀਫ਼' }, icon: '🫁' },
    { id: 'chest_pain', label: 'Chest Pain', native: { te: 'ఛాతీ నొప్పి', hi: 'सीने में दर्द', kn: 'ಎದೆ ನೋವು', ta: 'நெஞ்சு வலி', ml: 'നെഞ്ചുവേദന', bn: 'বুকে ব্যথা', mr: 'छातीत दुखणे', or: 'ଛାତି ଯନ୍ତ୍ରଣା', pa: 'ਛਾਤੀ ਵਿੱਚ ਦਰਦ' }, icon: '❤️' },
    { id: 'weakness', label: 'Weakness', native: { te: 'నీరసం', hi: 'कमजोरी', kn: 'ದೌರ್ಬಲ್ಯ', ta: 'சோர்வு', ml: 'ക്ഷീണം', bn: 'দুর্বলতা', mr: 'अशक्तपणा', or: 'ଦୁର୍ବଳତା', pa: 'ਕਮਜ਼ੋਰੀ' }, icon: '🔋' }
  ];

  const handleToggleSymptom = (label: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(label) ? prev.filter(s => s !== label) : [...prev, label]
    );
  };

  const handleSpeakSymptom = () => {
    setSymptomVoiceActive(true);
    setTimeout(() => {
      setSymptomVoiceActive(false);
      setTypedSymptom("Severe stomach ache after drinking water.");
    }, 2500);
  };

  const checkSymptoms = () => {
    const list = [...selectedSymptoms];
    if (typedSymptom.trim()) list.push(typedSymptom);

    if (list.length === 0) {
      alert(langCode === 'te' ? "దయచేసి కనీసం ఒక లక్షణాన్ని ఎంచుకోండి!" : langCode === 'hi' ? "कृपया पहले कम से कम एक लक्षण चुनें!" : "Please select or write at least one symptom first!");
      return;
    }

    // Prepare soft guideline recommendation without final clinical diagnosis
    const hasSevere = list.some(s => s.toLowerCase().includes('breathe') || s.toLowerCase().includes('chest') || s.toLowerCase().includes('difficulty') || s.toLowerCase().includes('pain') || s.toLowerCase().includes('ఊపిరి') || s.toLowerCase().includes('ఛాతీ') || s.toLowerCase().includes('నొప్పి'));
    
    const guidanceMessages = {
      en: {
        severe: "Warning: Your reported symptoms indicate a potential high-priority condition. Please consider seeking emergency response or finding a nearby critical hospital immediately.",
        normal: "Your health report has been drafted. We recommend finding a nearby partner clinic to schedule a routine consultation soon."
      },
      te: {
        severe: "హెచ్చరిక: మీ లక్షణాలు అత్యవసర చికిత్స అవసరమని సూచిస్తున్నాయి. దయచేసి వెంటనే అంబులెన్స్ లేదా సమీపంలోని ఆసుపత్రిని సంప్రदించండి.",
        normal: "మీ ఆరోగ్య నివేదిక సిద్ధమైంది. సాధారణ పరీక్షల కోసం సమీపంలోని క్లినిక్‌ని సందర్శించాల్సిందిగా సిఫార్సు చేస్తున్నాము."
      },
      hi: {
        severe: "चेतावनी: आपके लक्षण गंभीर स्थिति का संकेत देते हैं। कृपया तुरंत आपातकालीन सहायता लें या किसी नजदीकी अस्पताल जाएं।",
        normal: "आपकी स्वास्थ्य रिपोर्ट तैयार है। हम आपको सामान्य जांच के लिए नजदीकी डॉक्टर से मिलने की सलाह देते हैं।"
      }
    };

    const currentLangKey = (guidanceMessages[langCode as keyof typeof guidanceMessages] ? langCode : 'en') as keyof typeof guidanceMessages;
    const msg = hasSevere ? guidanceMessages[currentLangKey].severe : guidanceMessages[currentLangKey].normal;

    setSymptomGuidance({
      symptoms: list,
      isSevere: hasSevere,
      message: msg
    });
  };

  // -------------------------------------------------------------
  // 3. NEARBY HOSPITALS STATE & DATA
  // -------------------------------------------------------------
  const hospitalsData = [
    { 
      name: 'Athreya Hospital', 
      phone: '+91 93792 62265', 
      category: 'Private Hospital', 
      address: 'No. 6/2, Hosur Main Road, Chandapura, Anekal Taluk, Bengaluru, Karnataka 560099', 
      distance: '1.8 km', 
      rating: '4.6', 
      doctors: ['Demo Doctor Ramesh Kumar (Cardiology)', 'Demo Doctor Anita Desai (Pediatrics)'],
      mapsUrl: 'https://maps.google.com/?q=Athreya+Hospital+Chandapura'
    },
    { 
      name: 'Aditi Hospital', 
      phone: '+91 7947143627', 
      category: 'Private Hospital', 
      address: 'Anekal Main Road, Near Anekal Bus Stand, Anekal, Bengaluru, Karnataka 562106', 
      distance: '3.2 km', 
      rating: '4.5', 
      doctors: ['Demo Doctor Susan Varghese (General Medicine)', 'Demo Doctor Rajesh Patil (Orthopedics)'],
      mapsUrl: 'https://maps.google.com/?q=Aditi+Hospital+Anekal'
    },
    { 
      name: 'Government Hospital Anekal', 
      phone: '+91 81237 55180', 
      category: 'Government Hospital', 
      address: 'Government Hospital Campus, Hosur Road, Anekal, Bengaluru Rural, Karnataka 562106', 
      distance: '4.5 km', 
      rating: '4.2', 
      doctors: ['Demo Doctor Rajeev Sethi (General Medicine)', 'Demo Doctor Maya Rao (Obstetrics & Gynecology)'],
      mapsUrl: 'https://maps.google.com/?q=Government+Hospital+Anekal'
    },
    { 
      name: 'Raghu Hospital', 
      phone: '+91 7947427580', 
      category: 'Private Hospital', 
      address: 'No. 23, Hosur Main Road, Chandapura Circle, Bengaluru, Karnataka 560099', 
      distance: '5.1 km', 
      rating: '4.4', 
      doctors: ['Demo Doctor Suresh Kumar (Dentistry)', 'Demo Doctor Vivek Sharma (Dermatology)'],
      mapsUrl: 'https://maps.google.com/?q=Raghu+Hospital+Bangalore'
    }
  ];

  const [hospitalSearch, setHospitalSearch] = useState('');
  const [activeHospitalModal, setActiveHospitalModal] = useState<any | null>(null);

  // -------------------------------------------------------------
  // Localized UI helper for elements not present in data.ts translations map
  // -------------------------------------------------------------
  const localUiTranslations = {
    en: {
      safety_guidance: "Safety Response Guidance",
      selected_summary: "Selected Health Summary",
      back_dashboard: "Back to Dashboard",
      find_clinics: "Find Clinics & Book",
      emergency_sos: "Emergency SOS Help",
      camp_registered_title: "Your Registered NGO Campaigns",
      reg_successful: "Registration Successful!",
      reg_dispatch_info: "Your details have been recorded and sent to NGO partner.",
      upcoming_bookings_title: "Your Upcoming Bookings",
      medical_ticket: "Medical Ticket",
      search_hospitals: "Search Partner Hospitals",
      search_placeholder: "Search by name, category, or address...",
      available_doctors: "Available Doctors for",
      schedule_title: "Schedule Appointment",
      connected_flow: "Connected Flow",
      choose_hospital: "-- Choose Partner Hospital --",
      assigned_doctor: "Assigned Doctor",
      preferred_date: "Preferred Date",
      available_time_slot: "-- Choose Slot --",
      visit_reason: "Reason for Visit",
      visit_reason_placeholder: "e.g. Cough and cold",
      booking_success_title: "Booking Confirmed Successfully!",
      booking_success_desc: "This appointment is dispatched and will show in the Doctor Dashboard.",
      step1: "Step 1: Hospital & Doctor",
      step2: "Step 2: Date & Time",
      step3: "Step 3: Details & Confirm",
      next: "Next Step",
      previous: "Previous Step",
      confirm_booking: "Confirm Appointment",
      free_camp_notice: "All medical camps listed below are 100% free of charge. No payment required.",
      register_form_title: "Registration Form",
      registering_for: "Registering for",
      full_name: "Full Name",
      age: "Age",
      gender: "Gender",
      phone_number: "Phone Number",
      pref_lang: "Preferred Translation Language",
      enter_name: "Enter your name",
      enter_age: "e.g. 28",
      enter_phone: "e.g. 9876543210",
      method1: "Method 1",
      select_symptoms: "Select symptoms that you feel:",
      method2: "Method 2",
      describe_other_problems: "Describe other health problems:",
      describe_other_placeholder: "Describe any other symptoms...",
      method3: "Method 3",
      talk_verbally: "Talk / Speak verbally:",
      describe_mic: "Describe what you feel using your phone microphone.",
      listening: "Listening...",
      tap_to_record: "Tap to start recording",
      analyze_symptoms: "Analyze Symptoms",
      nearest_clinics: "Nearest Clinics & Emergency Partners:",
      google_maps_locator: "Google Maps Locator Active",
      gps_ingress_node: "GPS: Anekal Taluk Ingress Node",
      date_label: "Date",
      time_slot: "Time Slot",
      time_label: "Time",
      hospital_label: "Hospital",
      doctor_label: "Doctor",
      select_doctor: "-- Select Doctor --",
      confirm_medical_summary: "Confirm Medical Ticket Summary:",
      free_camp_tag: "Free Camp",
      campaign_details: "Campaign details",
      by: "By",
      date_time_label: "Date & Time",
      venue_label: "Venue",
      benefits_label: "benefits",
      listen_dose: "Listen Dose",
      prescribed_drug: "Prescribed Drug",
      dosage: "Dosage",
      schedule_label: "Schedule",
      food_relation: "Food Relation",
      duration_label: "Duration",
      patient_instruction: "Patient Instruction",
      communicating_in: "Communicating in",
      ai_assistant_live: "AI Assistant Live",
      type_message_placeholder: "Type your message in any language...",
      digital_health_identifier: "Digital Healthcare Identifier",
      hb_wallet: "SAHAAYA SETU WALLET",
      verified_patient: "VERIFIED PATIENT",
      registered_phone: "Registered Patient Phone",
      blood_group: "Blood Group",
      vaccine_slip: "Vaccine Slip",
      fully_vaccinated: "Fully Vaccinated (3 Doses)",
      uploaded_docs: "Uploaded medical documents:",
      delete_btn: "Delete",
      click_upload: "Click to upload report photos",
      upload_support: "Supports JPG, PNG, PDF up to 5MB",
      hb_service: "SAHAAYA SETU Service",
      workspace_under_dev: "Workspace details under development.",
      emergency_warning_sub: "Your coordinates and medical profile will be dispatched to nearest government response units.",
      alert_live: "ALERT LIVE",
      tap_sos: "TAP SOS",
      sos_success_msg: "SUCCESS: Assistance dispatch sent to NGO & Government Ambulance Corps! Emergency dispatch ID:",
      tap_speaker_play: "Tap speaker to play in your language",
      speak_or_type_details: "Speak or Type details:",
      tell_us_what_is_wrong: "Tell us what is wrong...",
      helpline_dialers: "Helpline Dialers",
      ambulance_label: "Ambulance",
      health_info_label: "Health Info",
      ngo_desk_label: "NGO Desk",
      rating_label: "Rating",
      doctors_available_label: "Doctors Available",
      phone_label: "Phone",
      no_hospitals_match: "No hospitals match your search.",
      male_option: "Male",
      female_option: "Female",
      other_option: "Other",
      blood_group_o_pos: "O Positive (O+)",
      prescription_notice: "Click the 🔊 Speaker icon next to any medicine to listen to doses spoken aloud in your language.",
      registered: "Registered",
      morning: "Morning",
      afternoon: "Afternoon",
      night: "Night",
      morning_night: "Morning & Night",
      morning_afternoon_night: "Morning, Afternoon & Night",
      after_food: "After Food",
      days: "Days",
      day: "Day"
    },
    te: {
      safety_guidance: "భద్రతా మార్గదర్శకత్వం",
      selected_summary: "ఎంపిక చేసిన ఆరోగ్య సారాంశం",
      back_dashboard: "డాష్‌బోర్డ్‌కు తిరిగి వెళ్ళు",
      find_clinics: "క్లినిక్‌లను కనుగొనండి & బుక్ చేయండి",
      emergency_sos: "అత్యవసర SOS సహాయం",
      camp_registered_title: "మీరు నమోదు చేసుకున్న ఉచిత శిబిరాలు",
      reg_successful: "నమోదు విజయవంతమైంది!",
      reg_dispatch_info: "మీ వివరాలు నమోదయ్యాయి మరియు ఎన్జీఓ భాగస్వామికి పంపబద్ధాయి.",
      upcoming_bookings_title: "మీ రాబోయే బుకింగ్‌లు",
      medical_ticket: "వైద్య టికెట్",
      search_hospitals: "ఆసుపత్రులను శోధించండి",
      search_placeholder: "పేరు, వర్గం లేదా చిరునామా ద్వారా శోధించండి...",
      available_doctors: "అందుబాటులో ఉన్న వైద్యులు -",
      schedule_title: "అపాయింట్‌మెంట్ షెడ్యూల్ చేయండి",
      connected_flow: "కనెక్ట్ చేయబడిన ఫ్లో",
      choose_hospital: "-- భాగస్వామ్య ఆసుపత్రిని ఎంచుకోండి --",
      assigned_doctor: "కేటాయించిన వైద్యుడు",
      preferred_date: "ప్రాధాన్య తేదీ",
      available_time_slot: "-- స్లాట్ ఎంచుకోండి --",
      visit_reason: "సందర్శనకు కారణం",
      visit_reason_placeholder: "ఉదా. జలుబు మరియు దగ్గు",
      booking_success_title: "బుకింగ్ విజయవంతంగా నిర్ధారించబడింది!",
      booking_success_desc: "ఈ అపాయింట్‌మెంట్ పంపబడింది మరియు డాక్టర్ డాష్‌బోర్డ్‌లో కనిపిస్తుంది.",
      step1: "దశ 1: ఆసుపత్రి & వైద్యుడు",
      step2: "దశ 2: తేదీ & సమయం",
      step3: "దశ 3: వివరాలు & ధృవీకరణ",
      next: "తదుపరి దశ",
      previous: "మునుపటి దశ",
      confirm_booking: "అపాయింట్‌మెంట్ ధృవీకరించండి",
      free_camp_notice: "క్రింద ఇవ్వబడిన అన్ని వైద్య శిబిరాలు 100% ఉచితం. ఎటువంటి రుసుము చెల్లించవలసిన అవసరం లేదు.",
      register_form_title: "నమోదు పత్రం",
      registering_for: "నమోదు చేయబడుతోంది",
      full_name: "పూర్తి పేరు",
      age: "వయస్సు",
      gender: "లింగం",
      phone_number: "ఫోన్ నంబర్",
      pref_lang: "ప్రాధాన్య అనువాద భాష",
      enter_name: "మీ పేరు రాయండి",
      enter_age: "ఉదా. 28",
      enter_phone: "ఉదా. 9876543210",
      method1: "విధానం 1",
      select_symptoms: "మీరు అనుభవిస్తున్న లక్షణాలను ఎంచుకోండి:",
      method2: "విధానం 2",
      describe_other_problems: "ఇతర ఆరోగ్య సమస్యలను వివరించండి:",
      describe_other_placeholder: "మరేదైనా లక్షణాలను వివరించండి...",
      method3: "విధానం 3",
      talk_verbally: "నోటితో మాట్లాడండి:",
      describe_mic: "ఫోన్ మైక్రోఫోన్ ఉపయోగించి మీ సమస్యను చెప్పండి.",
      listening: "వింటున్నాము...",
      tap_to_record: "రికార్డింగ్ ప్రారంభించడానికి నొక్కండి",
      analyze_symptoms: "లక్షణాలను విశ్లేషించండి",
      nearest_clinics: "సమీప క్లినిక్‌లు & అత్యవసర భాగస్వాములు:",
      google_maps_locator: "గూగుల్ మ్యాప్స్ లొకేటర్ పనిచేస్తోంది",
      gps_ingress_node: "GPS: అనేకల్ తాలూకా నోడ్",
      date_label: "తేదీ",
      time_slot: "సమయం స్లాట్",
      time_label: "సమయం",
      hospital_label: "ఆసుపత్రి",
      doctor_label: "వైద్యుడు",
      select_doctor: "-- వైద్యుడిని ఎంచుకోండి --",
      confirm_medical_summary: "వైద్య టికెట్ సారాంశాన్ని ధృవీకరించండి:",
      free_camp_tag: "ఉచిత శిబిరం",
      campaign_details: "శిబిర వివరాలు",
      by: "ద్వారా",
      date_time_label: "తేదీ & సమయం",
      venue_label: "వేదిక",
      benefits_label: "ప్రయోజనాలు",
      listen_dose: "మోతాదు వినండి",
      prescribed_drug: "సూచించిన మందు",
      dosage: "మోతాదు",
      schedule_label: "షెడ్యూల్",
      food_relation: "ఆహార సంబంధం",
      duration_label: "వ్యవధి",
      patient_instruction: "రోగికి సూచనలు",
      communicating_in: "సంభాషణ భాష",
      ai_assistant_live: "AI అసిస్టెంట్ ప్రత్యక్ష ప్రసారం",
      type_message_placeholder: "ఏ భాషలోనైనా మీ సందేశాన్ని టైప్ చేయండి...",
      digital_health_identifier: "డిజిటల్ ఆరోగ్య గుర్తింపు కార్డు",
      hb_wallet: "సహాయ సేతు వాలెట్",
      verified_patient: "ధృవీకరించబడిన రోగి",
      registered_phone: "నమోదిత రోగి ఫోన్",
      blood_group: "రక్త గ్రూపు",
      vaccine_slip: "టీకా రసీదు",
      fully_vaccinated: "పూర్తిగా టీకా తీసుకున్నారు (3 డోసులు)",
      uploaded_docs: "అప్‌లోడ్ చేసిన వైద్య పత్రాలు:",
      delete_btn: "తొలగించు",
      click_upload: "నివేదిక ఫోటోలను అప్‌లోడ్ చేయడానికి నొక్కండి",
      upload_support: "JPG, PNG, PDF 5MB వరకు సపోర్ట్ చేస్తుంది",
      hb_service: "సహాయ సేతు సేవ",
      workspace_under_dev: "పని ప్రదేశ వివరాలు నిర్మాణంలో ఉన్నాయి.",
      emergency_warning_sub: "మీ కోఆర్డినేట్లు మరియు వైద్య ప్రొఫైల్ సమీప ప్రభుత్వ రెస్పాన్స్ విభాగాలకు పంపబడతాయి.",
      alert_live: "సహాయం పంపబడింది",
      tap_sos: "SOS నొక్కండి",
      sos_success_msg: "విజయం: స్వచ్ఛంద సంస్థ మరియు ప్రభుత్వ అంబులెన్స్ విభాగానికి సహాయ అభ్యర్థన పంపబడింది! ఐడి:",
      tap_speaker_play: "మీ భాషలో వినడానికి స్పీకర్‌ను నొక్కండి",
      speak_or_type_details: "వివరాలను మాట్లాడండి లేదా టైప్ చేయండి:",
      tell_us_what_is_wrong: "ఏమి జరిగిందో మాకు చెప్పండి...",
      helpline_dialers: "సహాయ కేంద్రాలు",
      ambulance_label: "అంబులెన్స్",
      health_info_label: "ఆరోగ్య సమాచారం",
      ngo_desk_label: "స్వచ్ఛంద సంస్థ డెస్క్",
      rating_label: "రేటింగ్",
      doctors_available_label: "వైద్యులు అందుబాటులో ఉన్నారు",
      phone_label: "ఫోన్",
      no_hospitals_match: "మీ శోధనకు సరిపోయే ఆసుపత్రులు లేవు.",
      male_option: "పురుషుడు",
      female_option: "స్త్రీ",
      other_option: "ఇతర",
      blood_group_o_pos: "O పాజిటివ్ (O+)",
      prescription_notice: "మందుల వాడకం వివరాలను మీ స్వంత భాషలో వినడానికి మందు పక్కన ఉన్న 🔊 స్పీకర్ ఐకాన్ పై క్లిక్ చేయండి.",
      registered: "నమోదు చేయబడింది",
      morning: "ఉదయం",
      afternoon: "మధ్యాహ్నం",
      night: "రాత్రి",
      morning_night: "ఉదయం & రాత్రి",
      morning_afternoon_night: "ఉదయం, మధ్యాహ్నం & రాత్రి",
      after_food: "భోజనం తర్వాత",
      days: "రోజులు",
      day: "రోజు"
    },
    hi: {
      safety_guidance: "सुरक्षा मार्गदर्शन",
      selected_summary: "चयनित स्वास्थ्य सारांश",
      back_dashboard: "डैशबोर्ड पर वापस जाएं",
      find_clinics: "क्लीनिक खोजें और बुक करें",
      emergency_sos: "आपातकालीन एसओएस सहायता",
      camp_registered_title: "आपके पंजीकृत एनजीओ अभियान",
      reg_successful: "पंजीकरण सफल रहा!",
      reg_dispatch_info: "आपके विवरण दर्ज कर एनजीओ पार्टनर को भेज दिए गए हैं।",
      upcoming_bookings_title: "आपकी आगामी बुकिंग",
      medical_ticket: "मेडिकल टिकट",
      search_hospitals: "अस्पताल खोजें",
      search_placeholder: "नाम, श्रेणी या पते से खोजें...",
      available_doctors: "उपलब्ध डॉक्टर -",
      schedule_title: "अपॉइंटमेंट शेड्यूल करें",
      connected_flow: "कनेक्टेड फ्लो",
      choose_hospital: "-- भागीदार अस्पताल चुनें --",
      assigned_doctor: "सौंपे गए डॉक्टर",
      preferred_date: "पसंद की तारीख",
      available_time_slot: "-- स्लॉट चुनें --",
      visit_reason: "यात्रा का कारण",
      visit_reason_placeholder: "जैसे: सर्दी और खांसी",
      booking_success_title: "बुकिंग सफलतापूर्वक सुनिश्चित हो गई!",
      booking_success_desc: "यह अपॉइंटमेंट भेज दिया गया है और डॉक्टर डैशबोर्ड पर दिखाई देगा।",
      step1: "चरण 1: अस्पताल और डॉक्टर",
      step2: "चरण 2: तिथि और समय",
      step3: "चरण 3: विवरण और पुष्टि",
      next: "अगला चरण",
      previous: "पिछला चरण",
      confirm_booking: "अपॉइंटमेंट की पुष्टि करें",
      free_camp_notice: "नीचे सूचीबद्ध सभी स्वास्थ्य शिविर 100% मुफ़्त हैं। किसी शुल्क की आवश्यकता नहीं है।",
      register_form_title: "पंजीकरण फॉर्म",
      registering_for: "पंजीकरण के लिए",
      full_name: "पूरा नाम",
      age: "आयु",
      gender: "लिंग",
      phone_number: "फ़ोन नंबर",
      pref_lang: "पसंदीदा अनुवाद भाषा",
      enter_name: "अपना नाम दर्ज करें",
      enter_age: "जैसे: 28",
      enter_phone: "जैसे: 9876543210"
    },
    ta: {
      safety_guidance: "பாதுகாப்பு வழிகாட்டுதல்",
      selected_summary: "தேர்ந்தெடுக்கப்பட்ட சுகாதார சுருக்கம்",
      back_dashboard: "டாஷ்போர்டிற்கு திரும்பு",
      find_clinics: "கிளினிக்குகளைக் கண்டறிந்து முன்பதிவு செய்",
      emergency_sos: "அவசர SOS உதவி",
      camp_registered_title: "உங்கள் பதிவு செய்யப்பட்ட முகாம்கள்",
      reg_successful: "பதிவு வெற்றிகரமாக முடிந்தது!",
      reg_dispatch_info: "உங்கள் விவரங்கள் பதிவு செய்யப்பட்டு என்ஜிஓ கூட்டாளருக்கு அனுப்பப்பட்டுள்ளன.",
      upcoming_bookings_title: "உங்கள் வரவிருக்கும் முன்பதிவுகள்",
      medical_ticket: "மருத்துவ டிக்கெட்",
      search_hospitals: "மருத்துவமனைகளைத் தேடு",
      search_placeholder: "பெயர், வகை அல்லது முகவரி மூலம் தேடு...",
      available_doctors: "கிடைக்கும் மருத்துவர்கள் -",
      schedule_title: "அப்பாயிண்ட்மெண்ட் அட்டவணைப்படுத்து",
      connected_flow: "இணைக்கப்பட்ட ஓட்டம்",
      choose_hospital: "-- மருத்துவமனையைத் தேர்ந்தெடு --",
      assigned_doctor: "ஒதுக்கப்பட்ட மருத்துவர்",
      preferred_date: "விருப்பமான தேதி",
      available_time_slot: "-- நேரத்தைத் தேர்ந்தெடு --",
      visit_reason: "வருகைக்கான காரணம்",
      visit_reason_placeholder: "உதாரணம்: இருமல் மற்றும் சளி",
      booking_success_title: "முன்பதிவு வெற்றிகரமாக முடிந்தது!",
      booking_success_desc: "இந்த அப்பாயிண்ட்மெண்ட் அனுப்பப்பட்டு டாக்டரின் டாஷ்போர்டில் காண்பிக்கப்படும்.",
      step1: "படி 1: மருத்துவமனை & மருத்துவர்",
      step2: "படி 2: தேதி & நேரம்",
      step3: "படி 3: விவரங்கள் & உறுதிப்படுத்தல்",
      next: "அடுத்த படி",
      previous: "முந்தைய படி",
      confirm_booking: "முன்பதிவை உறுதிப்படுத்து",
      free_camp_notice: "கீழே பட்டியலிடப்பட்டுள்ள அனைத்து மருத்துவ முகாம்களும் 100% இலவசம். கட்டணம் தேவையில்லை.",
      register_form_title: "பதிவு படிவம்",
      registering_for: "பதிவு செய்யப்படுகிறது",
      full_name: "முழு பெயர்",
      age: "வயது",
      gender: "பாலினம்",
      phone_number: "தொலைபேசி எண்",
      pref_lang: "விருப்பமான மொழிபெயர்ப்பு மொழி",
      enter_name: "உங்கள் பெயரை உள்ளிடவும்",
      enter_age: "உதாரணம்: 28",
      enter_phone: "உதாரணம்: 9876543210"
    },
    ml: {
      safety_guidance: "സുരക്ഷാ മാർഗ്ഗനിർദ്ദേശം",
      selected_summary: "തിരഞ്ഞെടുത്ത ആരോഗ്യ സംഗ്രഹം",
      back_dashboard: "ഡാഷ്‌ബോർഡിലേക്ക് മടങ്ങുക",
      find_clinics: "ക്ലിനിക്കുകൾ കണ്ടെത്തി ബുക്ക് ചെയ്യുക",
      emergency_sos: "അടിയന്തര SOS സഹായം",
      camp_registered_title: "നിങ്ങൾ രജിസ്റ്റർ ചെയ്ത സൗജന്യ ക്യാമ്പുകൾ",
      reg_successful: "രജിസ്ട്രേഷൻ വിജയകരം!",
      reg_dispatch_info: "നിങ്ങളുടെ വിവരങ്ങൾ രേഖപ്പെടുത്തി എൻജിഒ പങ്കാളിക്ക് അയച്ചിട്ടുണ്ട്.",
      upcoming_bookings_title: "നിങ്ങളുടെ വരാനിരിക്കുന്ന ബുക്കിംഗുകൾ",
      medical_ticket: "മെഡിക്കൽ ടിക്കറ്റ്",
      search_hospitals: "പങ്കാളിത്ത ആശുപത്രികൾ തിരയുക",
      search_placeholder: "പേര്, വിഭാഗം അല്ലെങ്കിൽ വിലാസം വഴി തിരയുക...",
      available_doctors: "ലഭ്യമായ ഡോക്ടർമാർ -",
      schedule_title: "അപ്പോയിന്റ്മെന്റ് ഷെਡ്യൂൾ ചെയ്യുക",
      connected_flow: "കണക്റ്റുചെയ്‌ത ഫ്ലോ",
      choose_hospital: "-- പങ്കാളിത്ത ആശുപത്രി തിരഞ്ഞെടുക്കുക --",
      assigned_doctor: "നിയോഗിക്കപ്പെട്ട ഡോക്ടർ",
      preferred_date: "താൽപ്പര്യമുള്ള തീയതി",
      available_time_slot: "-- സ്ലോട്ട് തിരഞ്ഞെടുക്കുക --",
      visit_reason: "സന്ദർശനത്തിനുള്ള കാരണം",
      visit_reason_placeholder: "ഉദാ. ചുമയും ജലദോഷവും",
      booking_success_title: "ബുക്കിംഗ് വിജയകരമായി സ്ഥിരീകരിച്ചു!",
      booking_success_desc: "ഈ അപ്പോയിന്റ്മെന്റ് അയച്ചിട്ടുണ്ട്, ഡോക്ടറുടെ ഡാഷ്‌ബോർഡിൽ കാണിക്കും.",
      step1: "ഘട്ടം 1: ആശുപത്രിയും ഡോക്ടറും",
      step2: "ഘട്ടം 2: തീയതിയും സമയവും",
      step3: "ഘട്ടം 3: വിവരങ്ങളും സ്ഥിരീകരണവും",
      next: "അടുത്ത ഘട്ടം",
      previous: "മുമ്പത്തെ ഘട്ടം",
      confirm_booking: "അപ്പോയിന്റ്മെന്റ് സ്ഥിരീകരിക്കുക",
      free_camp_notice: "താഴെ നൽകിയിരിക്കുന്ന എല്ലാ മെഡിക്കൽ ക്യാമ്പുകളും 100% സൗജന്യമാണ്. പണമടയ്ക്കേണ്ടതില്ല.",
      register_form_title: "രജിസ്ട്രേഷൻ ഫോം",
      registering_for: "രജിസ്റ്റർ ചെയ്യുന്നത്",
      full_name: "പൂർണ്ണ നാമം",
      age: "വയസ്സ്",
      gender: "ലിംഗം",
      phone_number: "ഫോൺ നമ്പർ",
      pref_lang: "തിരഞ്ഞെടുത്ത ഭാഷാ വിവർത്തനം",
      enter_name: "നിങ്ങളുടെ പേര് നൽകുക",
      enter_age: "ഉദാ. 28",
      enter_phone: "ഉദാ. 9876543210"
    },
    bn: {
      safety_guidance: "सुरक्षा निर्देशिका",
      selected_summary: "নির্বাচিত স্বাস্থ্য সারাংশ",
      back_dashboard: "ড্যাশবোর্ডে ফিরে যান",
      find_clinics: "ক্লিনিক খুঁজুন এবং বুক করুন",
      emergency_sos: "জরুরী এসওএস সহায়তা",
      camp_registered_title: "আপনার নিবন্ধিত এনজিও ক্যাম্প",
      reg_successful: "নিবন্ধন সফল হয়েছে!",
      reg_dispatch_info: "আপনার তথ্য রেকর্ড করা হয়েছে এবং এনজিও অংশীদারের কাছে পাঠানো হয়েছে।",
      upcoming_bookings_title: "আপনার আসন্ন বুকিং সমূহ",
      medical_ticket: "মেডিকেল টিকিট",
      search_hospitals: "অংশীদার হাসপাতাল খুঁজুন",
      search_placeholder: "নাম, বিভাগ বা ঠিকানা দিয়ে খুঁজুন...",
      available_doctors: "উপলব্ধ ডাক্তার -",
      schedule_title: "অ্যাপয়েন্টমেন্ট নির্ধারণ করুন",
      connected_flow: "সংযুক্ত প্রবাহ",
      choose_hospital: "-- অংশীদার হাসপাতাল নির্বাচন করুন --",
      assigned_doctor: "বরাদ্দকৃত ডাক্তার",
      preferred_date: "পছন্দের তারিখ",
      available_time_slot: "-- সময় নির্বাচন করুন --",
      visit_reason: "সাক্ষাতের কারণ",
      visit_reason_placeholder: "যেমন: সর্দি ও কাশি",
      booking_success_title: "বুকিং সফলভাবে নিশ্চিত করা হয়েছে!",
      booking_success_desc: "এই অ্যাপয়েন্টমেন্ট পাঠানো হয়েছে এবং ডাক্তারের ড্যাশবোর্ডে প্রদর্শিত হবে।",
      step1: "ধাপ ১: হাসপাতাল ও ডাক্তার",
      step2: "ধাপ ২: তারিখ ও সময়",
      step3: "ধাপ ৩: বিবরণ ও নিশ্চিতকরণ",
      next: "পরবর্তী ধাপ",
      previous: "পূর্ববর্তী ধাপ",
      confirm_booking: "অ্যাপয়েন্টমেন্ট নিশ্চিত করুন",
      free_camp_notice: "নিচে তালিকাভুক্ত সমস্ত মেডিকেল ক্যাম্প ১০০% বিনামূল্যে। কোনো অর্থ প্রদানের প্রয়োজন নেই।",
      register_form_title: "নিবন্ধন ফর্ম",
      registering_for: "নিবন্ধিত হচ্ছে",
      full_name: "সম্পূর্ণ নাম",
      age: "বয়স",
      gender: "লিঙ্গ",
      phone_number: "ফোন নম্বর",
      pref_lang: "পছন্দের অনুবাদ ভাষা",
      enter_name: "আপনার নাম লিখুন",
      enter_age: "যেমন: ২৮",
      enter_phone: "যেমন: ৯৮৭৬৫৪৩২১০"
    },
    mr: {
      safety_guidance: "सुरक्षा मार्गदर्शन",
      selected_summary: "निवडलेला आरोग्य सारांश",
      back_dashboard: "डॅशबोर्डवर परत जा",
      find_clinics: "क्लिनिक शोधा आणि बुक करा",
      emergency_sos: "आपातकालीन एसओएस मदत",
      camp_registered_title: "तुमची नोंदणीकृत एनजीओ शिबिरे",
      reg_successful: "नोंदणी यशस्वी झाली!",
      reg_dispatch_info: "तुमची माहिती जतन केली गेली आहे आणि ती एनजीओ भागीदाराकडे पाठविली गेली आहे.",
      upcoming_bookings_title: "तुमच्या आगामी बुकिंग्स",
      medical_ticket: "वैद्यकीय तिकीट",
      search_hospitals: "भागीदार रुग्णालये शोधा",
      search_placeholder: "नाव, वर्ग किंवा पत्त्याद्वारे शोधा...",
      available_doctors: "उपलब्ध डॉक्टर -",
      schedule_title: "अपॉइंटमेंट शेड्युल करा",
      connected_flow: "कनेक्टेड फ्लो",
      choose_hospital: "-- भागीदार रुग्णालय निवडा --",
      assigned_doctor: "नियुक्त डॉक्टर",
      preferred_date: "पसंतीची तारीख",
      available_time_slot: "-- वेळ निवडा --",
      visit_reason: "भेटीचे कारण",
      visit_reason_placeholder: "उदा. सर्दी आणि खोकला",
      booking_success_title: "बुकिंग यशस्वीरित्या पुष्टी झाली!",
      booking_success_desc: "ही अपॉइंटमेंट पाठवली गेली आहे आणि ती डॉक्टर डॅशबोर्डवर दिसेल.",
      step1: "पायरी १: रुग्णालय आणि डॉक्टर",
      step2: "पायरी २: तारीख आणि वेळ",
      step3: "पायरी ३: तपशील आणि पुष्टी",
      next: "पुढील पाऊल",
      previous: "मागील पाऊल",
      confirm_booking: "अपॉइंटमेंटची पुष्टी करा",
      free_camp_notice: "खाली सूचीबद्ध केलेले सर्व वैद्यकीय शिबिर १००% विनामूल्य आहेत. कोणत्याही शुल्काची आवश्यकता नाही.",
      register_form_title: "नोंदणी फॉर्म",
      registering_for: "नोंदणी केली जात आहे",
      full_name: "पूर्ण नाव",
      age: "वय",
      gender: "लिंग",
      phone_number: "फोन नंबर",
      pref_lang: "पसंतीची भाषा",
      enter_name: "तुमचे नाव प्रविष्ट करा",
      enter_age: "उदा. २८",
      enter_phone: "उदा. ९८७६५४३२१०"
    },
    pa: {
      safety_guidance: "ਸੁਰੱਖਿਆ ਮਾਰਗਦਰਸ਼ਨ",
      selected_summary: "ਚੁਣਿਆ ਗਿਆ ਸਿਹਤ ਸਾਰਾਂਸ਼",
      back_dashboard: "ਡੈਸ਼ਬੋਰਡ 'ਤੇ ਵਾਪਸ ਜਾਓ",
      find_clinics: "ਕਲੀਨਿਕ ਲੱਭੋ ਅਤੇ ਬੁੱਕ ਕਰੋ",
      emergency_sos: "ਐਮਰਜੈਂਸੀ ਐਸਓਐਸ ਸਹਾਇਤਾ",
      camp_registered_title: "ਤੁਹਾਡੇ ਰਜਿਸਟਰਡ ਐਨਜੀਓ ਕੈਂਪ",
      reg_successful: "ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਸਫਲ ਰਹੀ!",
      reg_dispatch_info: "ਤੁਹਾਡਾ ਵੇਰਵਾ ਦਰਜ ਕਰ ਲਿਆ ਗਿਆ ਹੈ ਅਤੇ ਐਨਜੀਓ ਪਾਰਟਨਰ ਨੂੰ ਭੇਜ ਦਿੱਤਾ ਗਿਆ ਹੈ।",
      upcoming_bookings_title: "ਤੁਹਾਡੀਆਂ ਆਉਣ ਵਾਲੀਆਂ ਬੁਕਿੰਗਾਂ",
      medical_ticket: "ਮੈਡੀਕਲ ਟਿਕਟ",
      search_hospitals: "ਭਾਈਵਾਲ ਹਸਪਤਾਲ ਲੱਭੋ",
      search_placeholder: "ਨਾਮ, ਸ਼੍ਰੇਣੀ ਜਾਂ ਪਤੇ ਨਾਲ ਲੱਭੋ...",
      available_doctors: "ਉਪਲਬਧ ਡਾਕਟਰ -",
      schedule_title: "ਮੁਲਾਕਾਤ ਤੈਅ ਕਰੋ",
      connected_flow: "ਕਨੈਕਟਡ ਫਲੋ",
      choose_hospital: "-- ਭਾਈਵਾਲ ਹਸਪਤਾਲ ਚੁਣੋ --",
      assigned_doctor: "ਨਿਯੁਕਤ ਡਾਕਟਰ",
      preferred_date: "ਪਸੰਦੀਦਾ ਤਾਰੀਖ",
      available_time_slot: "-- ਸਮਾਂ ਚੁਣੋ --",
      visit_reason: "ਮੁਲਾਕਾਤ ਦਾ ਕਾਰਨ",
      visit_reason_placeholder: "ਜਿਵੇਂ: ਖੰਘ ਅਤੇ ਜ਼ੁਕਾਮ",
      booking_success_title: "ਬੁਕਿੰਗ ਸਫਲਤਾਪੂਰਵਕ ਪੱਕੀ ਹੋ ਗਈ ਹੈ!",
      booking_success_desc: "ਇਹ ਮੁਲਾਕਾਤ ਭੇਜ ਦਿੱਤੀ ਗਈ ਹੈ ਅਤੇ ਡਾਕਟਰ ਦੇ ਡੈਸ਼ਬੋਰਡ 'ਤੇ ਦਿਖਾਈ ਦੇਵੇਗੀ।",
      step1: "ਪੜਾਅ 1: ਹਸਪਤාල ਅਤੇ ਡਾਕਟਰ",
      step2: "ਪੜาਅ 2: ਤਾਰੀਖ ਅਤੇ ਸਮਾਂ",
      step3: "ਪੜਾਅ 3: ਵੇਰਵੇ ਅਤੇ ਪੁਸ਼ਟੀ",
      next: "ਅਗਲਾ ਪੜਾਅ",
      previous: "ਪਿਛਲਾ ਪੜਾਅ",
      confirm_booking: "ਮੁਲਾਕਾਤ ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ",
      free_camp_notice: "ਹੇਠਾਂ ਦਿੱਤੇ ਗਏ ਸਾਰੇ ਮੈਡੀਕਲ ਕੈਂਪ 100% ਮੁਫ਼ਤ ਹਨ। ਕੋਈ ਭੁਗਤਾਨ ਕਰਨ ਦੀ ਲੋੜ ਨਹੀਂ ਹੈ।",
      register_form_title: "ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਫਾਰਮ",
      registering_for: "ਰਜਿਸਟਰ ਹੋ ਰਿਹਾ ਹੈ",
      full_name: "ਪੂਰਾ ਨਾਮ",
      age: "ਉਮਰ",
      gender: "ਲਿੰਗ",
      phone_number: "ਫ਼ੋਨ ਨੰਬਰ",
      pref_lang: "ਪਸੰਦੀਦਾ ਅਨੁਵਾਦ ਭਾਸ਼ਾ",
      enter_name: "ਆਪਣਾ ਨਾਮ ਲਿਖੋ",
      enter_age: "ਜਿਵੇਂ: 28",
      enter_phone: "ਜਿਵੇਂ: 9876543210"
    }
  };

  const getUiText = (key: string) => {
    const lang = (localUiTranslations[langCode as keyof typeof localUiTranslations] ? langCode : 'en') as keyof typeof localUiTranslations;
    const translationSet = localUiTranslations[lang] || localUiTranslations['en'];
    return translationSet[key as keyof typeof translationSet] || localUiTranslations['en'][key as keyof typeof localUiTranslations['en']];
  };

  // -------------------------------------------------------------
  // 4. APPOINTMENT BOOKING WORKFLOW STATE
  // -------------------------------------------------------------
  const [bookingStep, setBookingStep] = useState(1);
  const [bookingHospital, setBookingHospital] = useState('');
  const [bookingDoctor, setBookingDoctor] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [bookingReason, setBookingReason] = useState('');
  const [bookingSuccessMsg, setBookingSuccessMsg] = useState(false);

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const newBooking = {
      id: Math.random().toString(),
      doctor: bookingDoctor || 'Demo Doctor Ramesh Kumar',
      department: 'General Checkup',
      hospital: bookingHospital || 'Athreya Hospital',
      date: bookingDate || '2026-07-23',
      time: bookingTime || '11:00 AM',
      reason: bookingReason || 'General consultation',
      status: 'Confirmed'
    };

    const updated = [newBooking, ...appointmentsList];
    setAppointmentsList(updated);
    localStorage.setItem('hb_appointments', JSON.stringify(updated));

    setBookingSuccessMsg(true);
    setTimeout(() => {
      setBookingSuccessMsg(false);
      setBookingStep(1);
      // Reset fields
      setBookingHospital('');
      setBookingDoctor('');
      setBookingDate('');
      setBookingTime('');
      setBookingReason('');
    }, 4000);
  };

  // -------------------------------------------------------------
  // 5. MEDICAL NGO CAMPS REGISTRATION WORKFLOW STATE
  // -------------------------------------------------------------
  const campsData = [
    { id: 'camp1', title: 'Free Diabetic & Eye Checkup', organizer: 'Lions Club & SAHAAYA SETU', date: 'Sunday, July 26', venue: 'Community Hall, Sector 4 Labour Colony', time: '9:00 AM - 4:00 PM', benefits: 'Free medicines & reading glasses distribution', contact: '1800-456-1111' },
    { id: 'camp2', title: 'Migrant Workers General Health Camp', organizer: 'Asha Workers & Red Cross', date: 'August 02, 2026', venue: 'Nirmal Construction Site, Hub C', time: '10:00 AM - 5:00 PM', benefits: 'Vaccination drive & free iron supplements', contact: '1800-456-2222' },
  ];

  const [registeringCamp, setRegisteringCamp] = useState<any | null>(null);
  const [regName, setRegName] = useState('');
  const [regAge, setRegAge] = useState('');
  const [regGender, setRegGender] = useState('Male');
  const [regPhone, setRegPhone] = useState('');
  const [regLang, setRegLang] = useState(selectedLanguage?.englishName || 'English');
  const [regSuccess, setRegSuccess] = useState(false);

  const handleConfirmCampRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regAge || !regPhone) {
      alert("Please fill all worker details");
      return;
    }

    const registrationRecord = {
      campId: registeringCamp.id,
      campTitle: registeringCamp.title,
      venue: registeringCamp.venue,
      date: registeringCamp.date,
      workerName: regName,
      workerAge: regAge,
      workerGender: regGender,
      workerPhone: regPhone,
      preferredLanguage: regLang
    };

    const existingRegs = JSON.parse(localStorage.getItem('hb_camp_registrations') || '[]');
    const updated = [registrationRecord, ...existingRegs];
    setCampRegistrations(updated);
    localStorage.setItem('hb_camp_registrations', JSON.stringify(updated));

    setRegSuccess(true);
    setTimeout(() => {
      setRegSuccess(false);
      setRegisteringCamp(null);
      // reset registration fields
      setRegName('');
      setRegAge('');
      setRegPhone('');
    }, 4000);
  };

  // -------------------------------------------------------------
  // 6. MULTILINGUAL HEALTH ASSISTANT STATE & CHAT ENGINE
  // -------------------------------------------------------------
  const [chatFeed, setChatFeed] = useState<Array<{ sender: 'user' | 'bot'; text: string; time: string; translated?: string }>>([
    { 
      sender: 'bot', 
      text: 'Namaste! I am your SAHAAYA SETU Multilingual Assistant. You can ask me medical questions by typing or speaking in your language.', 
      translated: langCode === 'hi' 
        ? 'नमस्ते! मैं आपका सहाय सेतु बहुभाषी सहायक हूँ। आप अपनी भाषा में टाइप करके या बोलकर मुझसे चिकित्सा संबंधी प्रश्न पूछ सकते हैं।'
        : langCode === 'te'
        ? 'నమస్తే! నేను మీ సహాయ సేతు మల్టీలింగ్వల్ అసిస్టెంట్. మీరు మీ భాషలో టైప్ చేయడం ద్వారా లేదా మాట్లాడటం ద్వారా నన్ను ఆరోగ్య ప్రశ్నలు అడగవచ్చు.'
        : undefined,
      time: '12:00 PM' 
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatMicActive, setChatMicActive] = useState(false);

  const handleSendChatMsg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setChatFeed(prev => [...prev, { sender: 'user', text: userMsg, time: timeNow }]);
    setChatInput('');

    // Multilingual Response Engine
    setTimeout(() => {
      let botText = "Thank you for sharing your concerns. Based on your symptoms, we highly recommend scheduling an appointment at the nearest governmental clinic.";
      let localized = "";

      // Match simple keywords for high-fidelity responses in local language
      const query = userMsg.toLowerCase();
      if (query.includes('fever') || query.includes('ज्वर') || query.includes('జ్వరం') || query.includes('ताप')) {
        botText = "Keep yourself hydrated and rest. For mild viral fever, paracetamol 500mg may be used, but please visit our clinic if temperature exceeds 101F.";
        localized = langCode === 'te' 
          ? "మిమ్మల్ని మీరు హైడ్రేట్ గా ఉంచుకోండి మరియు విశ్రాంతి తీసుకోండి. తేలికపాటి వైరల్ జ్వరం కోసం పారాసిటమాల్ 500mg వాడవచ్చు, కానీ ఉష్ణోగ్రత 101F కంటే ఎక్కువగా ఉంటే దయచేసి మా క్లినిక్‌ని సందర్శించండి."
          : langCode === 'hi'
          ? "खुद को हाइड्रेटेड रखें और आराम करें। हल्के वायरल बुखार के लिए, पैरासिटामोल 500mg का उपयोग किया जा सकता है, लेकिन यदि तापमान 101F से अधिक हो जाता है तो कृपया हमारे क्लिनिक पर जाएँ।"
          : "";
      } else if (query.includes('pain') || query.includes('दर्द') || query.includes('నొప్పి')) {
        botText = "Localized pain might occur due to labor exhaustions. Take warm compression rest, or meet Dr. Ramesh in Room 104.";
        localized = langCode === 'te'
          ? "శారీరక శ్రమ కారణంగా నొప్పులు రావచ్చు. గోరువెచ్చని నీటి కాపడం పెట్టండి లేదా గది నంబర్ 104 లో డాక్టర్ రమేష్‌ను కలవండి."
          : langCode === 'hi'
          ? "शारीरिक श्रम के कारण दर्द हो सकता है। गर्म पानी से सिकाई करें या कमरा नंबर 104 में डॉ. रमेश से मिलें।"
          : "";
      }

      setChatFeed(prev => [...prev, { 
        sender: 'bot', 
        text: botText, 
        translated: localized || undefined, 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      }]);
    }, 1200);
  };

  const handleSpeakChat = () => {
    setChatMicActive(true);
    setTimeout(() => {
      setChatMicActive(false);
      setChatInput("I have cold and throat pain");
    }, 2500);
  };

  // -------------------------------------------------------------
  // 7. MEDICAL RECORDS UPLOADER
  // -------------------------------------------------------------
  const [medicalDocs, setMedicalDocs] = useState<string[]>(['VoterCard_ID.jpg', 'CovidVaccineSlip.pdf']);
  const handleDocUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const name = e.target.files[0].name;
      setMedicalDocs(prev => [...prev, name]);
    }
  };

  // -------------------------------------------------------------
  // CORE RENDER FLOWS
  // -------------------------------------------------------------
  const renderWorkspace = () => {
    switch (featureId) {
      
      case 'emergency':
        return (
          <div className="space-y-6" id="emergency-workspace">
            {/* Warning banner */}
            <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex items-start gap-3">
              <AlertCircle size={20} className="text-red-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-red-800 text-xs sm:text-sm font-bold">
                  {text.emergency_desc}
                </p>
                <p className="text-[10px] text-red-600 font-medium mt-1">
                  {getUiText('emergency_warning_sub')}
                </p>
              </div>
            </div>

            {/* Huge Panic Trigger */}
            <div className="text-center py-6 bg-white border border-slate-150 rounded-2xl shadow-xs">
              <button
                onClick={handleSendSOS}
                className={`w-36 h-36 rounded-full border-4 mx-auto flex flex-col items-center justify-center transition-all duration-300 ${
                  sosSent 
                    ? 'bg-red-600 border-red-300 text-white animate-pulse scale-105 shadow-lg shadow-red-200' 
                    : 'bg-white border-red-500 text-red-600 hover:bg-red-50 active:scale-95 shadow-md shadow-red-100'
                }`}
                id="emergency-trigger-btn"
              >
                <PhoneCall size={36} className={sosSent ? 'animate-bounce' : ''} />
                <span className="text-xs font-black mt-2 tracking-wider">
                  {sosSent ? getUiText('alert_live') : getUiText('tap_sos')}
                </span>
              </button>

              {sosSent && (
                <div className="mt-5 max-w-sm mx-auto p-3 bg-green-50 border border-green-200 text-green-800 text-xs font-bold rounded-xl animate-fade-in">
                  🚨 {getUiText('sos_success_msg')} HB-{Math.floor(Math.random() * 9000 + 1000)}
                </div>
              )}
            </div>

            {/* Quick emergency phrase helper with Audio Player in selected language */}
            <div className="bg-white border border-slate-150 rounded-2xl p-5">
              <h4 className="font-sans font-bold text-slate-800 text-sm mb-3 flex items-center gap-1.5">
                <span>{text.emergency_phrases || 'Emergency Phrases'}</span>
                <span className="text-[10px] text-slate-400 font-normal">({getUiText('tap_speaker_play')})</span>
              </h4>

              <div className="space-y-2">
                {emergencyPhrases.map((phrase, idx) => {
                  const localizedSpeech = phrase.native[langCode as keyof typeof phrase.native] || phrase.eng;
                  return (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                      <div className="flex-1 min-w-0 pr-2">
                        <span className="block text-xs font-bold text-slate-800">{phrase.eng}</span>
                        {langCode !== 'en' && (
                          <span className="block text-xs text-slate-500 mt-0.5">{localizedSpeech}</span>
                        )}
                      </div>
                      <AudioSpeaker text={localizedSpeech} size={15} className="bg-white text-blue-600 border rounded-full p-0.5 shadow-xs" />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Speak or Type Additional Emergency */}
            <div className="bg-white border border-slate-150 rounded-2xl p-5">
              <h4 className="font-sans font-bold text-slate-800 text-sm mb-2">{getUiText('speak_or_type_details')}</h4>
              <div className="flex gap-2">
                <button
                  onClick={handleSpeakEmergency}
                  className={`p-2.5 rounded-xl border transition-all ${
                    emergencySpeechActive 
                      ? 'bg-red-500 text-white animate-pulse ring-4 ring-red-100' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                  title="Speak"
                >
                  <Mic size={18} />
                </button>
                <input
                  type="text"
                  value={emergencyText}
                  onChange={(e) => setEmergencyText(e.target.value)}
                  placeholder={getUiText('tell_us_what_is_wrong')}
                  className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:border-red-500 outline-none"
                />
                <button
                  onClick={() => {
                    if (!emergencyText.trim()) return;
                    alert("Emergency message dispatched: " + emergencyText);
                    setEmergencyText('');
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700"
                >
                  {getUiText('submit') || 'Send'}
                </button>
              </div>
            </div>

            {/* Helpline Phone logs */}
            <div className="bg-white border border-slate-150 rounded-2xl p-5">
              <h4 className="font-sans font-bold text-slate-800 text-sm mb-3">{getUiText('helpline_dialers')}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <a href="tel:102" className="p-3 bg-red-50 border border-red-100 hover:border-red-200 rounded-xl text-center text-red-800 font-bold block">
                  📞 {getUiText('ambulance_label')}: 102
                </a>
                <a href="tel:104" className="p-3 bg-blue-50 border border-blue-100 hover:border-blue-200 rounded-xl text-center text-blue-800 font-bold block">
                  📞 {getUiText('health_info_label')}: 104
                </a>
                <a href="tel:18001234567" className="p-3 bg-slate-50 border border-slate-100 hover:border-slate-200 rounded-xl text-center text-slate-700 font-bold block col-span-1 sm:col-span-1">
                  📞 {getUiText('ngo_desk_label')}: 1800-123
                </a>
              </div>
            </div>
          </div>
        );

      case 'symptoms':
        return (
          <div className="space-y-6" id="symptoms-workspace">
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl text-xs sm:text-sm text-blue-800 leading-relaxed font-medium">
              {text.symptoms_desc}
            </div>

            {/* SELECT SYMPTOMS */}
            <div className="bg-white border border-slate-150 rounded-2xl p-5">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">{getUiText('method1')}</span>
              <h4 className="font-sans font-bold text-slate-800 text-sm mb-3">{getUiText('select_symptoms')}</h4>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {symptomOptions.map((sympt) => {
                  const isChecked = selectedSymptoms.includes(sympt.label);
                  const localizedLabel = sympt.native[langCode as keyof typeof sympt.native] || sympt.label;
                  return (
                    <button
                      key={sympt.id}
                      onClick={() => handleToggleSymptom(sympt.label)}
                      className={`p-3 rounded-xl border-2 text-left transition-all flex items-center justify-between gap-2 select-none ${
                        isChecked 
                          ? 'border-blue-600 bg-blue-50/50 text-blue-900 font-bold' 
                          : 'border-slate-150 bg-white text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <div className="min-w-0">
                        <span className="text-xs block truncate">{localizedLabel}</span>
                        {langCode !== 'en' && (
                          <span className="text-[9px] text-slate-400 block truncate">{sympt.label}</span>
                        )}
                      </div>
                      <span className="text-lg shrink-0">{sympt.icon}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* TYPE AND SPEAK SYMPTOMS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* TYPE */}
              <div className="bg-white border border-slate-150 rounded-2xl p-5">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">{getUiText('method2')}</span>
                <h4 className="font-sans font-bold text-slate-800 text-sm mb-2">{getUiText('describe_other_problems')}</h4>
                <textarea
                  value={typedSymptom}
                  onChange={(e) => setTypedSymptom(e.target.value)}
                  placeholder={getUiText('describe_other_placeholder')}
                  rows={3}
                  className="w-full border border-slate-200 rounded-xl p-3 text-xs focus:border-blue-500 outline-none resize-none font-sans"
                />
              </div>

              {/* SPEAK */}
              <div className="bg-white border border-slate-150 rounded-2xl p-5 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">{getUiText('method3')}</span>
                  <h4 className="font-sans font-bold text-slate-800 text-sm mb-1">{getUiText('talk_verbally')}</h4>
                  <p className="text-[10px] text-slate-400">{getUiText('describe_mic')}</p>
                </div>

                <div className="flex items-center gap-3 mt-4">
                  <button
                    type="button"
                    onClick={handleSpeakSymptom}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      symptomVoiceActive 
                        ? 'bg-red-500 text-white animate-pulse ring-4 ring-red-100' 
                        : 'bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100'
                    }`}
                  >
                    <Mic size={20} />
                  </button>
                  <span className="text-xs font-semibold text-slate-600">
                    {symptomVoiceActive ? getUiText('listening') : getUiText('tap_to_record')}
                  </span>
                </div>
              </div>
            </div>

            {/* ACTION TRIGGERS */}
            <div className="text-center pt-2">
              <button
                onClick={checkSymptoms}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-all shadow-xs"
              >
                {getUiText('analyze_symptoms')}
              </button>
            </div>

            {/* GUIDANCE BOX */}
            {symptomGuidance && (
              <div className="p-5 bg-white border border-slate-150 rounded-2xl shadow-xs animate-fade-in">
                <div className="flex items-start gap-2.5">
                  <Info size={16} className="text-blue-500 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-xs uppercase tracking-wide text-slate-500 mb-1">{getUiText('safety_guidance')}</h5>
                    <p className="text-xs text-slate-700 leading-relaxed font-medium mb-3">
                      {symptomGuidance.message}
                    </p>
                    
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-[11px] mb-4">
                      <span className="font-bold text-slate-700">{getUiText('selected_summary')}:</span>
                      <p className="text-slate-600 mt-0.5">{symptomGuidance.symptoms.join(', ')}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => onBack()} // back to dashboard
                        className="py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-all text-center"
                      >
                        {getUiText('back_dashboard')}
                      </button>
                      <a
                        href={symptomGuidance.isSevere ? "#emergency" : "#hospitals"}
                        onClick={(e) => {
                          e.preventDefault();
                          // Simulating path rerouting to corresponding feature
                          alert("Navigating to appropriate service based on triage guidance.");
                        }}
                        className="py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold text-center transition-all"
                      >
                        {symptomGuidance.isSevere ? getUiText('emergency_sos') : getUiText('find_clinics')}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 'hospitals':
        {
          const filteredHospitals = hospitalsData.filter(hosp => {
            const term = hospitalSearch.toLowerCase();
            const localizedName = getLocalizedProperNoun(hosp.name, langCode).toLowerCase();
            return (
              hosp.name.toLowerCase().includes(term) ||
              localizedName.includes(term) ||
              hosp.category.toLowerCase().includes(term) ||
              hosp.address.toLowerCase().includes(term)
            );
          });

          return (
            <div className="space-y-6" id="hospitals-workspace">
              {/* Search Input Bar */}
              <div className="bg-white border border-slate-150 p-4 rounded-xl shadow-xs">
                <label className="block text-slate-700 font-bold mb-2 text-xs uppercase tracking-wide">
                  {getUiText('search_hospitals')}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={hospitalSearch}
                    onChange={(e) => setHospitalSearch(e.target.value)}
                    placeholder={getUiText('search_placeholder')}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold text-slate-800 focus:bg-white focus:border-blue-500 outline-none transition-all"
                    id="hospital-search-input"
                  />
                  <Search size={16} className="text-slate-400 absolute left-3.5 top-3" />
                </div>
              </div>

              <div className="bg-white border border-slate-150 rounded-2xl overflow-hidden shadow-xs">
                {/* Maps simulator */}
                <div className="bg-slate-100 h-40 flex flex-col items-center justify-center text-slate-400 relative border-b">
                  <MapPin size={28} className="text-red-500 animate-bounce" />
                  <span className="text-xs font-semibold text-slate-700 mt-1">{getUiText('google_maps_locator')}</span>
                  <span className="text-[10px] text-slate-400 font-mono mt-0.5">{getUiText('gps_ingress_node')}</span>
                </div>

                {/* Nearest Hospitals */}
                <div className="p-5">
                  <h4 className="font-sans font-bold text-slate-800 text-sm mb-4">{getUiText('nearest_clinics')}</h4>
                  <div className="space-y-4">
                    {filteredHospitals.map((hosp, idx) => {
                      const localizedName = getLocalizedProperNoun(hosp.name, langCode);
                      return (
                        <div key={idx} className="p-4 rounded-xl border border-slate-150 bg-slate-50/50 flex flex-col justify-between gap-3">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h5 className="font-sans font-bold text-slate-800 text-sm">{localizedName}</h5>
                              <span className="text-[9px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded border border-blue-200">{hosp.category}</span>
                            </div>
                            <p className="text-xs text-slate-500 mt-1">📍 {hosp.address} • <span className="font-bold">{hosp.distance}</span></p>
                            <p className="text-[11px] text-slate-500 mt-1.5 font-semibold">📞 {getUiText('phone_label')}: <span className="text-slate-800 font-bold">{hosp.phone}</span></p>
                            <div className="text-[11px] text-slate-400 mt-1.5">{getUiText('rating_label')}: ⭐ {hosp.rating} | 🟢 {getUiText('doctors_available_label')}</div>
                          </div>

                          {/* Interactive hospital actions */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 border-t pt-3">
                            <a
                              href={`tel:${hosp.phone}`}
                              className="p-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-center text-xs font-bold transition-all flex items-center justify-center gap-1 active:scale-95"
                            >
                              <Phone size={12} className="text-blue-600" />
                              <span>{text.call || 'Call'}</span>
                            </a>

                            <a
                              href={hosp.mapsUrl}
                              target="_blank"
                              referrerPolicy="no-referrer"
                              className="p-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-center text-xs font-bold transition-all flex items-center justify-center gap-1 active:scale-95"
                            >
                              <ExternalLink size={12} className="text-slate-400" />
                              <span>{text.directions || 'Directions'}</span>
                            </a>

                            <button
                              onClick={() => {
                                setBookingHospital(hosp.name);
                                setBookingDoctor(hosp.doctors[0] || '');
                                setBookingStep(1); // Reset to first booking step
                                if (onNavigate) {
                                  onNavigate('appointments');
                                }
                              }}
                              className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-center text-xs font-bold transition-all active:scale-95 cursor-pointer"
                            >
                              <span>{text.book || 'BOOK APPOINTMENT'}</span>
                            </button>

                            <button
                              onClick={() => setActiveHospitalModal(hosp)}
                              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-center text-xs font-bold transition-all active:scale-95 cursor-pointer"
                            >
                              <span>{text.view_docs || 'VIEW DOCTORS'}</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}

                    {filteredHospitals.length === 0 && (
                      <div className="py-6 text-center text-slate-400 text-xs font-semibold">
                        {getUiText('no_hospitals_match')}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Doctors list popup panel */}
              {activeHospitalModal && (
                <div className="p-5 bg-blue-50 border border-blue-200 rounded-2xl shadow-xs relative animate-fade-in">
                  <button 
                    onClick={() => setActiveHospitalModal(null)}
                    className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 font-bold"
                  >
                    ✕
                  </button>
                  <h5 className="font-bold text-xs uppercase tracking-wide text-slate-500 mb-2">
                    {getUiText('available_doctors')} {activeHospitalModal.name}
                  </h5>
                  <ul className="space-y-1.5 text-xs text-slate-700 font-semibold">
                    {activeHospitalModal.doctors.map((doc: string, dIdx: number) => {
                      const localizedDocName = getLocalizedProperNoun(doc.split(' (')[0], langCode);
                      const specialization = doc.includes(' (') ? ` (${doc.split(' (')[1]}` : '';
                      return (
                        <li key={dIdx} className="flex items-center gap-2 bg-white p-2.5 rounded-lg border border-slate-200">
                          <span className="text-emerald-500">🟢</span>
                          <span>{localizedDocName}{specialization}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          );
        }

      case 'appointments':
        return (
          <div className="space-y-6" id="appointments-workspace">
            {/* Interactive 3-Step Wizard booking card */}
            <div className="bg-white border border-slate-150 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3 border-b pb-2">
                <h4 className="font-sans font-bold text-slate-800 text-sm">{getUiText('schedule_title')}</h4>
                <span className="text-[10px] uppercase font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{getUiText('connected_flow')}</span>
              </div>

              {bookingSuccessMsg ? (
                <div className="py-6 text-center animate-fade-in">
                  <CheckCircle2 size={32} className="text-green-500 mx-auto mb-2 animate-bounce" />
                  <p className="text-xs font-bold text-slate-800">{getUiText('booking_success_title')}</p>
                  <p className="text-[10px] text-slate-400 mt-1">{getUiText('booking_success_desc')}</p>
                </div>
              ) : (
                <form onSubmit={handleConfirmBooking} className="space-y-3 text-xs">
                  {/* STEP 1 */}
                  {bookingStep === 1 && (
                    <div className="space-y-4 animate-fade-in">
                      <div className="p-3 bg-blue-50 border border-blue-150 rounded-xl mb-1 text-[11px] text-blue-700 font-semibold">
                        {getUiText('step1')}
                      </div>

                      <div>
                        <label className="block text-slate-700 font-bold mb-1">{getUiText('choose_hospital')}</label>
                        <select
                          value={bookingHospital}
                          onChange={(e) => {
                            setBookingHospital(e.target.value);
                            const match = hospitalsData.find(h => h.name === e.target.value);
                            if (match && match.doctors.length > 0) {
                              setBookingDoctor(match.doctors[0]);
                            } else {
                              setBookingDoctor('');
                            }
                          }}
                          className="w-full bg-slate-50 border rounded-lg p-2.5 focus:border-blue-500 outline-none font-semibold text-slate-800"
                          required
                        >
                          <option value="">{getUiText('choose_hospital')}</option>
                          {hospitalsData.map((h, i) => (
                            <option key={i} value={h.name}>{getLocalizedProperNoun(h.name, langCode)}</option>
                          ))}
                        </select>
                      </div>

                      {bookingHospital && (
                        <div className="animate-fade-in">
                          <label className="block text-slate-700 font-bold mb-1">{getUiText('assigned_doctor')}</label>
                          <select
                            value={bookingDoctor}
                            onChange={(e) => setBookingDoctor(e.target.value)}
                            className="w-full bg-slate-50 border rounded-lg p-2.5 focus:border-blue-500 outline-none font-semibold text-slate-800"
                            required
                          >
                            <option value="">-- Select Doctor --</option>
                            {hospitalsData.find(h => h.name === bookingHospital)?.doctors.map((doc, idx) => (
                              <option key={idx} value={doc}>{getLocalizedProperNoun(doc.split(' (')[0], langCode)} ({doc.split(' (')[1] || ''}</option>
                            ))}
                          </select>
                        </div>
                      )}

                      <div className="flex justify-end pt-2">
                        <button
                          type="button"
                          disabled={!bookingHospital || !bookingDoctor}
                          onClick={() => setBookingStep(2)}
                          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold rounded-xl transition-all text-xs active:scale-95 cursor-pointer disabled:cursor-not-allowed flex items-center gap-1.5"
                        >
                          <span>{getUiText('next')}</span>
                          <span>→</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 2 */}
                  {bookingStep === 2 && (
                    <div className="space-y-4 animate-fade-in">
                      <div className="p-3 bg-blue-50 border border-blue-150 rounded-xl mb-1 text-[11px] text-blue-700 font-semibold">
                        {getUiText('step2')}
                      </div>

                      <div>
                        <label className="block text-slate-700 font-bold mb-1">{getUiText('preferred_date')}</label>
                        <input
                          type="date"
                          value={bookingDate}
                          onChange={(e) => setBookingDate(e.target.value)}
                          className="w-full bg-slate-50 border rounded-lg p-2.5 focus:border-blue-500 outline-none font-semibold text-slate-800"
                          required
                        />
                      </div>

                      {bookingDate && (
                        <div className="animate-fade-in">
                          <label className="block text-slate-700 font-bold mb-2">{getUiText('available_time_slot')}</label>
                          <div className="grid grid-cols-3 gap-2">
                            {["09:00 AM", "10:30 AM", "11:30 AM", "02:00 PM", "03:30 PM", "04:30 PM"].map((slot) => {
                              const isSelected = bookingTime === slot;
                              return (
                                <button
                                  type="button"
                                  key={slot}
                                  onClick={() => setBookingTime(slot)}
                                  className={`p-2.5 rounded-lg border text-center transition-all text-xs font-bold cursor-pointer ${
                                    isSelected 
                                      ? 'bg-blue-600 border-blue-600 text-white shadow-xs' 
                                      : 'bg-white border-slate-200 hover:border-blue-500 text-slate-700'
                                  }`}
                                >
                                  {slot}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      <div className="flex justify-between pt-2">
                        <button
                          type="button"
                          onClick={() => setBookingStep(1)}
                          className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all text-xs cursor-pointer"
                        >
                          <span>← {getUiText('previous')}</span>
                        </button>

                        <button
                          type="button"
                          disabled={!bookingDate || !bookingTime}
                          onClick={() => setBookingStep(3)}
                          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold rounded-xl transition-all text-xs active:scale-95 cursor-pointer disabled:cursor-not-allowed flex items-center gap-1.5"
                        >
                          <span>{getUiText('next')}</span>
                          <span>→</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 3 */}
                  {bookingStep === 3 && (
                    <div className="space-y-4 animate-fade-in">
                      <div className="p-3 bg-blue-50 border border-blue-150 rounded-xl mb-1 text-[11px] text-blue-700 font-semibold">
                        {getUiText('step3')}
                      </div>

                      <div>
                        <label className="block text-slate-700 font-bold mb-1">{getUiText('visit_reason')}</label>
                        <input
                          type="text"
                          value={bookingReason}
                          onChange={(e) => setBookingReason(e.target.value)}
                          placeholder={getUiText('visit_reason_placeholder')}
                          className="w-full bg-slate-50 border rounded-lg p-2.5 focus:border-blue-500 outline-none font-semibold text-slate-800"
                          required
                        />
                      </div>

                      {/* Ticket Summary visual */}
                      <div className="p-4 bg-slate-50 border border-slate-150 rounded-xl text-xs space-y-2">
                        <h5 className="font-sans font-bold text-slate-800 text-xs border-b pb-1.5 uppercase tracking-wider text-slate-400">
                          {getUiText('confirm_medical_summary')}
                        </h5>
                        <div className="grid grid-cols-2 gap-2 text-slate-700">
                          <div>
                            <span className="block font-medium text-[10px] text-slate-400 uppercase">{getUiText('hospital_label')}:</span>
                            <span className="font-bold text-slate-800">{getLocalizedProperNoun(bookingHospital, langCode)}</span>
                          </div>
                          <div>
                            <span className="block font-medium text-[10px] text-slate-400 uppercase">{getUiText('doctor_label')}:</span>
                            <span className="font-bold text-slate-800">{getLocalizedProperNoun(bookingDoctor.split(' (')[0], langCode)}</span>
                          </div>
                          <div>
                            <span className="block font-medium text-[10px] text-slate-400 uppercase">{getUiText('date_label')}:</span>
                            <span className="font-bold text-slate-800">{bookingDate}</span>
                          </div>
                          <div>
                            <span className="block font-medium text-[10px] text-slate-400 uppercase">{getUiText('time_slot')}:</span>
                            <span className="font-bold text-slate-800">{bookingTime}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between pt-2">
                        <button
                          type="button"
                          onClick={() => setBookingStep(2)}
                          className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all text-xs cursor-pointer"
                        >
                          <span>← {getUiText('previous')}</span>
                        </button>

                        <button
                          type="submit"
                          disabled={!bookingReason}
                          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold rounded-xl transition-all text-xs active:scale-95 cursor-pointer disabled:cursor-not-allowed"
                        >
                          {getUiText('confirm_booking')}
                        </button>
                      </div>
                    </div>
                  )}
                </form>
              )}
            </div>

            {/* Display upcoming appointment cards */}
            <div className="space-y-4">
              <h4 className="font-sans font-bold text-slate-800 text-sm">{getUiText('upcoming_bookings_title')}</h4>
              {appointmentsList.map((appt) => {
                const localizedHosp = getLocalizedProperNoun(appt.hospital, langCode);
                const localizedDoc = getLocalizedProperNoun(appt.doctor, langCode);
                const isConfirmed = appt.status === 'Confirmed';
                const audioGuide = `Appointment with ${appt.doctor} at ${appt.hospital} on ${appt.date}. Status is ${appt.status}.`;
                
                return (
                  <div key={appt.id} className="bg-white border border-slate-150 rounded-xl p-4 shadow-xs relative" id={`ticket-${appt.id}`}>
                    <div className="flex justify-between items-start gap-3">
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">{getUiText('medical_ticket')}</span>
                        <h5 className="font-sans font-extrabold text-slate-800 text-sm mt-0.5">{localizedDoc}</h5>
                        <p className="text-xs text-slate-500 mt-1">🏥 {localizedHosp}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Audio speaker for instructions, satisfying prompt */}
                        <AudioSpeaker text={audioGuide} size={14} className="bg-slate-50 text-slate-500 rounded-full" />
                        
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                          isConfirmed 
                            ? 'bg-green-50 border-green-200 text-green-700' 
                            : 'bg-amber-50 border-amber-200 text-amber-700'
                        }`}>
                          {appt.status}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 border-t border-dashed pt-3 mt-3 text-[11px] text-slate-600 font-semibold">
                      <div className="flex items-center gap-1">
                        <Calendar size={12} className="text-slate-400" />
                        <span>{getUiText('date_label')}: <span className="text-slate-800 font-bold">{appt.date}</span></span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={12} className="text-slate-400" />
                        <span>{getUiText('time_label')}: <span className="text-slate-800 font-bold">{appt.time}</span></span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 'camps':
        return (
          <div className="space-y-6" id="camps-workspace">
            <div className="bg-sky-50 border border-sky-100 p-4 rounded-xl flex gap-3 text-xs text-sky-800 leading-relaxed font-semibold">
              <span>📢</span>
              <p>
                {getUiText('free_camp_notice')}
              </p>
            </div>

            {/* Campaign lists */}
            <div className="space-y-4">
              {campsData.map((camp) => {
                const localizedTitle = getLocalizedProperNoun(camp.title, langCode);
                const localizedOrg = getLocalizedProperNoun(camp.organizer, langCode);
                const localizedVenue = getLocalizedProperNoun(camp.venue, langCode);
                const campAudio = `Free health camp: ${camp.title}, organized by ${camp.organizer} on ${camp.date} at ${camp.venue}.`;

                return (
                  <div key={camp.id} className="bg-white border border-slate-150 rounded-2xl p-5 shadow-xs relative">
                    <div className="absolute top-0 right-0 bg-blue-600 text-white text-[9px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                      {getUiText('free_camp_tag')}
                    </div>

                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold block mb-0.5">{getUiText('campaign_details')}</span>
                        <h5 className="font-sans font-bold text-slate-800 text-base">{localizedTitle}</h5>
                        <p className="text-xs text-blue-600 font-semibold mt-0.5">{getUiText('by') || 'By'} {localizedOrg}</p>
                      </div>

                      {/* Camp voice instruction */}
                      <AudioSpeaker text={campAudio} size={14} className="bg-slate-50 text-slate-500 rounded-full" />
                    </div>

                    <div className="space-y-2 border-t border-slate-100 pt-3 mt-3 text-xs">
                      <p className="text-slate-500 flex items-center gap-2">
                        <Calendar size={13} className="text-slate-400 shrink-0" />
                        <span>{getUiText('date_time_label')}: <span className="font-bold text-slate-700">{camp.date} | {camp.time}</span></span>
                      </p>
                      <p className="text-slate-500 flex items-start gap-2">
                        <MapPin size={13} className="text-red-500 mt-0.5 shrink-0" />
                        <span>{getUiText('venue_label')}: <span className="font-bold text-slate-700">{localizedVenue}</span></span>
                      </p>
                      <p className="text-emerald-700 font-medium flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-100 w-fit">
                        ✨ {getUiText('benefits_label')}: {camp.benefits}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-4">
                      <a
                        href={`tel:${camp.contact}`}
                        className="py-2.5 bg-slate-100 hover:bg-slate-200 border text-slate-700 font-bold rounded-xl text-xs transition-all text-center flex items-center justify-center gap-1"
                      >
                        <Phone size={12} className="text-slate-500" />
                        <span>{getUiText('call') || text.call || 'Call'}</span>
                      </a>

                      <button
                        onClick={() => setRegisteringCamp(camp)}
                        className="py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5"
                      >
                        <HeartHandshake size={14} />
                        <span>{getUiText('register') || text.register || 'Register'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Camp Registration popup modal */}
            {registeringCamp && (
              <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-md animate-fade-in space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider font-extrabold text-blue-600">{getUiText('register_form_title')}</span>
                    <h5 className="font-bold text-slate-800 text-sm">{getUiText('registering_for')}: {getLocalizedProperNoun(registeringCamp.title, langCode)}</h5>
                  </div>
                  <button 
                    onClick={() => setRegisteringCamp(null)}
                    className="text-slate-400 hover:text-slate-600 text-base font-bold"
                  >
                    ✕
                  </button>
                </div>

                {regSuccess ? (
                  <div className="py-4 text-center">
                    <CheckCircle2 size={32} className="text-green-500 mx-auto mb-2" />
                    <p className="text-xs font-bold text-slate-800">{getUiText('reg_successful')}</p>
                    <p className="text-[10px] text-slate-400 mt-1">{getUiText('reg_dispatch_info')} {registeringCamp.organizer}.</p>
                  </div>
                ) : (
                  <form onSubmit={handleConfirmCampRegistration} className="space-y-3 text-xs">
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">{getUiText('full_name')}</label>
                      <input
                        type="text"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder={getUiText('enter_name')}
                        className="w-full bg-slate-50 border rounded-lg p-2 focus:border-blue-500 outline-none"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-400 font-bold mb-1">{getUiText('age')}</label>
                        <input
                          type="number"
                          value={regAge}
                          onChange={(e) => setRegAge(e.target.value)}
                          placeholder={getUiText('enter_age')}
                          className="w-full bg-slate-50 border rounded-lg p-2 focus:border-blue-500 outline-none"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-slate-400 font-bold mb-1">{getUiText('gender')}</label>
                        <select
                          value={regGender}
                          onChange={(e) => setRegGender(e.target.value)}
                          className="w-full bg-slate-50 border rounded-lg p-2 focus:border-blue-500 outline-none"
                        >
                          <option value="Male">{getUiText('male_option')}</option>
                          <option value="Female">{getUiText('female_option')}</option>
                          <option value="Other">{getUiText('other_option')}</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-400 font-bold mb-1">{getUiText('phone_number')}</label>
                        <input
                          type="tel"
                          value={regPhone}
                          onChange={(e) => setRegPhone(e.target.value)}
                          placeholder={getUiText('enter_phone')}
                          className="w-full bg-slate-50 border rounded-lg p-2 focus:border-blue-500 outline-none"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-slate-400 font-bold mb-1">{getUiText('pref_lang')}</label>
                        <input
                          type="text"
                          value={regLang}
                          onChange={(e) => setRegLang(e.target.value)}
                          className="w-full bg-slate-100 border rounded-lg p-2 text-slate-500 outline-none"
                          readOnly
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all"
                    >
                      {getUiText('confirm') || text.confirm || 'Confirm'}
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* Display registered camps in this browser session */}
            {campRegistrations.length > 0 && (
              <div className="space-y-3 bg-white p-4 border border-slate-150 rounded-2xl">
                <h4 className="font-sans font-bold text-slate-800 text-xs uppercase tracking-wide">{getUiText('camp_registered_title')}</h4>
                <div className="space-y-2">
                  {campRegistrations.map((reg, rIdx) => (
                    <div key={rIdx} className="p-3 bg-green-50 border border-green-100 rounded-xl text-xs flex justify-between items-center">
                      <div>
                        <span className="font-bold text-green-900 block">{reg.campTitle}</span>
                        <span className="text-[10px] text-green-700 block mt-0.5">📍 {getUiText('venue_label')}: {reg.venue}</span>
                      </div>
                      <span className="text-[10px] bg-green-600 text-white font-bold px-2 py-0.5 rounded-full">
                        {getUiText('registered')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 'prescriptions':
        return (
          <div className="space-y-6" id="prescriptions-workspace">
            <div className="bg-purple-50 border border-purple-150 p-4 rounded-xl text-xs sm:text-sm text-purple-800 leading-relaxed font-medium">
              {getUiText('prescription_notice')}
            </div>

            {/* List of prescriptions with per-medicine audio support */}
            <div className="space-y-4">
              {prescriptionsList.map((presc) => {
                // translate instructions only
                let translatedInstruction = presc.instruction;
                if (langCode === 'te') {
                  translatedInstruction = "జ్వరం తగ్గడానికి ఉదయం ఒకటి మరియు రాత్రి ఒకటి చొప్పున తిన్న తర్వాత తీసుకోండి.";
                } else if (langCode === 'hi') {
                  translatedInstruction = "बुखार से राहत के लिए सुबह एक और रात को एक गोली खाने के बाद लें।";
                }

                // Helper to translate frequency, food relation, and duration values
                const translatePrescVal = (val: string) => {
                  if (!val) return '';
                  const trimmed = val.trim();
                  
                  // exact matches
                  if (trimmed.toLowerCase() === 'morning') return getUiText('morning') || trimmed;
                  if (trimmed.toLowerCase() === 'afternoon') return getUiText('afternoon') || trimmed;
                  if (trimmed.toLowerCase() === 'night') return getUiText('night') || trimmed;
                  if (trimmed.toLowerCase() === 'morning & night') return getUiText('morning_night') || trimmed;
                  if (trimmed.toLowerCase() === 'morning, afternoon & night') return getUiText('morning_afternoon_night') || trimmed;
                  if (trimmed.toLowerCase() === 'after food') return getUiText('after_food') || trimmed;

                  // regex match for durations (e.g. "5 Days", "7 Days", "1 Day")
                  if (/^\d+\s+days$/i.test(trimmed)) {
                    const numberPart = trimmed.replace(/days/i, '').trim();
                    return `${numberPart} ${getUiText('days') || 'Days'}`;
                  }
                  if (/^\d+\s+day$/i.test(trimmed)) {
                    const numberPart = trimmed.replace(/day/i, '').trim();
                    return `${numberPart} ${getUiText('day') || 'Day'}`;
                  }

                  return trimmed;
                };

                const translatedFrequency = translatePrescVal(presc.frequency);
                const translatedFoodRelation = translatePrescVal(presc.foodRelation || 'After Food');
                const translatedDuration = translatePrescVal(presc.duration);

                const speechText = `${presc.medicine}. Dosage: ${presc.dosage}. Schedule: ${translatedFrequency}. Instruction: ${translatedInstruction}`;

                return (
                  <div key={presc.id} className="bg-white border border-slate-150 rounded-2xl p-5 shadow-xs relative">
                    <div className="flex justify-between items-start gap-4 mb-3">
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">{getUiText('prescribed_drug')}</span>
                        <h5 className="font-sans font-extrabold text-slate-800 text-base mt-0.5">{presc.medicine}</h5>
                        <p className="text-xs text-purple-600 font-bold mt-1">{getUiText('dosage')}: {presc.dosage}</p>
                      </div>

                      {/* Small speaker icon ONLY beside individual prescriptions */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[10px] text-slate-400">{getUiText('listen_dose')}</span>
                        <AudioSpeaker text={speechText} size={15} className="bg-purple-50 text-purple-600 rounded-full" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 border-t pt-3 mt-3 text-xs text-slate-600 font-medium">
                      <div>
                        <span className="text-slate-400 block text-[10px]">{getUiText('schedule_label')}</span>
                        <span className="text-slate-800 font-bold block mt-0.5">{translatedFrequency}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">{getUiText('food_relation')}</span>
                        <span className="text-slate-800 font-bold block mt-0.5">{translatedFoodRelation}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">{getUiText('duration_label')}</span>
                        <span className="text-slate-800 font-bold block mt-0.5">{translatedDuration}</span>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[11px] mt-4">
                      <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px] block mb-0.5">{getUiText('patient_instruction')}:</span>
                      <p className="text-slate-700 leading-relaxed font-semibold">{translatedInstruction}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 'chat':
        return (
          <div className="bg-white border border-slate-150 rounded-2xl overflow-hidden shadow-xs flex flex-col h-[420px]" id="chat-workspace">
            {/* Header / Top Info block */}
            <div className="bg-slate-50 border-b border-slate-150 p-4 flex justify-between items-center">
              <div>
                <h4 className="font-sans font-extrabold text-slate-800 text-sm">{text.chat_title || 'SAHAAYA SETU Multilingual Assistant'}</h4>
                <p className="text-[10px] text-slate-400">{getUiText('communicating_in')} {selectedLanguage?.englishName || 'English'}</p>
              </div>

              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-[9px] text-green-600 font-extrabold uppercase">{getUiText('ai_assistant_live')}</span>
              </div>
            </div>

            {/* Chat message logs */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3" id="chat-feed">
              {chatFeed.map((msg, idx) => {
                const isUser = msg.sender === 'user';
                const hasTranslation = !isUser && msg.translated;
                const activeSpeech = hasTranslation ? msg.translated : msg.text;

                return (
                  <div key={idx} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs ${
                      isUser 
                        ? 'bg-blue-600 text-white rounded-br-none shadow-xs' 
                        : 'bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200/50'
                    }`}>
                      <p className="leading-relaxed font-semibold">{msg.text}</p>
                      
                      {hasTranslation && (
                        <p className="text-blue-700 font-bold border-t border-slate-200/50 pt-1 mt-1 leading-relaxed">
                          {msg.translated}
                        </p>
                      )}

                      <div className="flex items-center justify-between mt-1 pt-1 gap-4">
                        <span className={`text-[9px] font-mono ${isUser ? 'text-blue-200' : 'text-slate-400'}`}>
                          {msg.time}
                        </span>

                        {/* Speaker icon ONLY beside AI assistant responses */}
                        {!isUser && (
                          <AudioSpeaker text={activeSpeech || ''} size={13} className="bg-white text-blue-600 border rounded-full p-0.5 shadow-xs shrink-0" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input area */}
            <form onSubmit={handleSendChatMsg} className="border-t border-slate-150 p-3 bg-slate-50 flex gap-2 items-center">
              <button
                type="button"
                onClick={handleSpeakChat}
                className={`p-2.5 rounded-xl transition-all ${
                  chatMicActive 
                    ? 'bg-red-500 text-white animate-pulse ring-4 ring-red-100' 
                    : 'bg-white text-slate-500 border hover:bg-slate-100 active:scale-95'
                }`}
                title="Speak"
              >
                <Mic size={18} />
              </button>

              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder={getUiText('type_message_placeholder')}
                className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:border-blue-500 outline-none"
              />

              <button
                type="submit"
                className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs active:scale-95 transition-all shrink-0"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        );

      case 'history':
        return (
          <div className="space-y-6" id="history-workspace">
            {/* Citizen Digital Health Wallet Card */}
            <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-xs relative overflow-hidden font-mono">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-2xl translate-x-12 -translate-y-12"></div>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-[9px] uppercase text-slate-400 block tracking-widest">{getUiText('digital_health_identifier')}</span>
                  <span className="font-extrabold tracking-widest text-xs text-blue-400">{getUiText('hb_wallet')}</span>
                </div>
                <span className="text-[9px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-md border border-green-500/30">
                  {getUiText('verified_patient')}
                </span>
              </div>

              <div className="space-y-4 text-xs font-semibold">
                <div>
                  <span className="text-slate-500 block">{getUiText('registered_phone')}</span>
                  <span className="text-sm font-extrabold tracking-wider">{phoneNumber || '98765-43210'}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-slate-800 pt-3">
                  <div>
                    <span className="text-slate-500 block">{getUiText('blood_group')}</span>
                    <span className="font-bold text-slate-200">{getUiText('blood_group_o_pos')}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">{getUiText('vaccine_slip')}</span>
                    <span className="font-bold text-green-400">{getUiText('fully_vaccinated')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Document upload block */}
            <div className="bg-white border border-slate-150 rounded-2xl p-5">
              <h4 className="font-sans font-bold text-slate-800 text-sm mb-3">{getUiText('uploaded_docs')}</h4>
              
              <div className="space-y-2 mb-4">
                {medicalDocs.map((doc, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs font-mono">
                    <span className="text-slate-700">📄 {doc}</span>
                    <button 
                      onClick={() => setMedicalDocs(prev => prev.filter((_, i) => i !== idx))}
                      className="text-red-500 hover:text-red-700 text-[10px] font-bold"
                    >
                      {getUiText('delete_btn')}
                    </button>
                  </div>
                ))}
              </div>

              {/* Drag Drop or Select Trigger */}
              <label className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-xl p-6 text-center block cursor-pointer bg-slate-50 transition-all">
                <input 
                  type="file" 
                  className="hidden" 
                  onChange={handleDocUpload}
                  accept=".jpg,.jpeg,.png,.pdf"
                />
                <Upload size={24} className="text-slate-400 mx-auto mb-2" />
                <span className="block text-xs font-bold text-slate-700">{getUiText('click_upload')}</span>
                <span className="block text-[10px] text-slate-400 mt-1">{getUiText('upload_support')}</span>
              </label>
            </div>
          </div>
        );

      default:
        return (
          <div className="p-8 text-center bg-white border border-slate-150 rounded-2xl">
            <p className="text-slate-400 text-sm font-medium">{getUiText('workspace_under_dev')}</p>
          </div>
        );
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-6 px-4" id="feature-container">
      {/* Back button header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-800 text-xs font-bold transition-all active:scale-95"
          id="feature-back-btn"
        >
          <ArrowLeft size={14} />
          <span>{text.back || 'Back'}</span>
        </button>

        <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest bg-slate-100 px-2.5 py-1 rounded-lg border">
          {featureId}
        </span>
      </div>

      {/* Feature Header Branding without speaker icon near headings */}
      <div className="bg-white border border-slate-150 rounded-2xl p-5 mb-5 shadow-xs">
        <span className="text-[10px] uppercase tracking-widest text-blue-600 font-extrabold block mb-0.5">{getUiText('hb_service')}</span>
        <h2 className="font-sans font-extrabold text-xl text-slate-800 tracking-tight">
          {text[`${featureId}_title`] || featureId.toUpperCase()}
        </h2>
      </div>

      {/* Render selected workflow workspace */}
      {renderWorkspace()}
    </div>
  );
}
