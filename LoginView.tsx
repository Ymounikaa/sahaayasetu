import React, { useState } from 'react';
import { Phone, Lock, Eye, EyeOff, User, Building, HeartPulse } from 'lucide-react';
import AudioSpeaker from './AudioSpeaker';

interface LoginViewProps {
  onLoginSuccess: (role: 'worker' | 'doctor' | 'ngo', phoneNumber?: string) => void;
  selectedLanguage: any;
}

const localUiTranslations = {
  en: {
    tagline: "Accessible Multilingual Healthcare",
    create_account: "Create Account",
    worker_login: "Worker Login",
    enter_details_signup: "Enter your details to sign up",
    signin_access: "Sign in to access medical portal",
    mobile_number: "Mobile Number",
    password: "Password",
    forgot_password: "Forgot Password?",
    register_continue: "Register & Continue",
    sign_in_btn: "Sign In",
    already_have_acc: "Already have an account?",
    sign_in_underlined: "Sign In",
    new_user: "New User?",
    create_account_underlined: "Create Account",
    prof_login: "Doctor / NGO Login",
    select_role_desc: "Select your role to sign in to the healthcare network portal.",
    doctor: "Doctor",
    ngo_org: "NGO / Organization",
    email_address: "Email Address",
    access_doctor: "Access Doctor Portal",
    access_ngo: "Access NGO Portal",
    go_back_login: "← Go back to Patient / Worker Login",
    doctor_ngo_staff_toggle: "Doctor or NGO staff? Click here to Login →",
    enter_valid_mobile: "Please enter a valid mobile number",
    mobile_length: "Mobile number should be at least 10 digits",
    enter_password: "Please enter a password",
    demo_pass_alert: "Demo account: You can sign in using any password!"
  },
  te: {
    tagline: "అందరికీ సులువైన బహుభాషా వైద్య సేవలు",
    create_account: "ఖాతాను సృష్టించండి",
    worker_login: "కార్యకర్త లాగిన్",
    enter_details_signup: "నమోదు చేసుకోవడానికి మీ వివరాలను నమోదు చేయండి",
    signin_access: "వైద్య సేవలను పొందడానికి లాగిన్ అవ్వండి",
    mobile_number: "మొబైల్ సంఖ్య",
    password: "పాస్‌వర్డ్",
    forgot_password: "పాస్‌వర్డ్ మర్చిపోయారా?",
    register_continue: "నమోదు చేసుకుని కొనసాగండి",
    sign_in_btn: "లాగిన్ అవ్వండి",
    already_have_acc: "ఇప్పటికే ఖాతా ఉందా?",
    sign_in_underlined: "లాగిన్ అవ్వండి",
    new_user: "కొత్త వినియోగదారులా?",
    create_account_underlined: "ఖాతాను సృష్టించండి",
    prof_login: "వైద్యులు / NGO లాగిన్",
    select_role_desc: "పోర్టల్‌లోకి లాగిన్ అవ్వడానికి మీ పాత్రను ఎంచుకోండి.",
    doctor: "వైద్యులు",
    ngo_org: "స్వచ్ఛంద సంస్థ (NGO)",
    email_address: "ఈమెయిల్ చిరునామా",
    access_doctor: "వైద్యుల పోర్టల్ లాగిన్",
    access_ngo: "NGO పోర్టల్ లాగిన్",
    go_back_login: "← వెనుకకు పేషెంట్ / కార్యకర్త లాగిన్‌కి వెళ్ళండి",
    doctor_ngo_staff_toggle: "వైద్యులా లేదా NGO సిబ్బందా? ఇక్కడ క్లిక్ చేయండి →",
    enter_valid_mobile: "ఆరోగ్య కార్యకర్త మొబైల్ సంఖ్యను నమోదు చేయండి",
    mobile_length: "మొబైల్ సంఖ్య కనీసం 10 అంకెలు ఉండాలి",
    enter_password: "దయచేసి పాస్‌వర్డ్ నమోదు చేయండి",
    demo_pass_alert: "డెమో ఖాతా: మీరు ఏదైనా పాస్‌వర్డ్ ఉపయోగించి లాగిన్ అవ్వవచ్చు!"
  },
  hi: {
    tagline: "सुलभ बहुभाषी स्वास्थ्य सेवा",
    create_account: "खाता बनाएं",
    worker_login: "कार्यकर्ता लॉगिन",
    enter_details_signup: "साइन अप करने के लिए अपना विवरण दर्ज करें",
    signin_access: "चिकित्सा पोर्टल तक पहुँचने के लिए साइन इन करें",
    mobile_number: "मोबाइल नंबर",
    password: "पासवर्ड",
    forgot_password: "पासवर्ड भूल गए?",
    register_continue: "पंजीकरण करें और जारी रखें",
    sign_in_btn: "साइन इन करें",
    already_have_acc: "क्या आपके पास पहले से एक खाता है?",
    sign_in_underlined: "साइन इन करें",
    new_user: "नए उपयोगकर्ता?",
    create_account_underlined: "खाता बनाएं",
    prof_login: "डॉक्टर / एनजीओ लॉगिन",
    select_role_desc: "स्वास्थ्य नेटवर्क पोर्टल में साइन इन करने के लिए अपनी भूमिका चुनें।",
    doctor: "डॉक्टर",
    ngo_org: "एनजीओ / संगठन",
    email_address: "ईमेल पता",
    access_doctor: "डॉक्टर पोर्टल लॉगिन",
    access_ngo: "एनजीओ पोर्टल लॉगिन",
    go_back_login: "← मरीज / कार्यकर्ता लॉगिन पर वापस जाएं",
    doctor_ngo_staff_toggle: "डॉक्टर या एनजीओ कर्मचारी? लॉगिन करने के लिए यहां क्लिक करें →",
    enter_valid_mobile: "कृपया एक वैध मोबाइल नंबर दर्ज करें",
    mobile_length: "मोबाइल नंबर कम से कम 10 अंकों का होना चाहिए",
    enter_password: "कृपया पासवर्ड दर्ज करें",
    demo_pass_alert: "डेमो खाता: आप किसी भी पासवर्ड का उपयोग करके साइन इन कर सकते हैं!"
  },
  kn: {
    tagline: "ಸುಲಭ ಬಹುಭಾಷಾ ಆರೋಗ್ಯ ಸೇವೆ",
    create_account: "ಖಾತೆಯನ್ನು ರಚಿಸಿ",
    worker_login: "ಕಾರ್ಯಕರ್ತರ ಲಾಗಿನ್",
    enter_details_signup: "ಸೈನ್ ಅಪ್ ಮಾಡಲು ನಿಮ್ಮ ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ",
    signin_access: "ವೈದ್ಯಕೀಯ ಪೋರ್ಟಲ್ ಪ್ರವೇಶಿಸಲು ಸೈನ್ ಇನ್ ಮಾಡಿ",
    mobile_number: "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ",
    password: "ಪಾಸ್‌ವರ್ಡ್",
    forgot_password: "ಪಾಸ್‌ವರ್ಡ್ ಮರೆತಿದ್ದೀರಾ?",
    register_continue: "ನೋಂದಾಯಿಸಿ ಮತ್ತು ಮುಂದುವರಿಯಿರಿ",
    sign_in_btn: "ಸೈನ್ ಇನ್ ಮಾಡಿ",
    already_have_acc: "ಈಗಾಗಲೇ ಖಾತೆ ಹೊಂದಿದ್ದೀರಾ?",
    sign_in_underlined: "ಸೈನ್ ಇನ್ ಮಾಡಿ",
    new_user: "ಹೊಸ ಬಳಕೆದಾರರೇ?",
    create_account_underlined: "ಖಾತೆಯನ್ನು ರಚಿಸಿ",
    prof_login: "ವೈದ್ಯರು / ಸ್ವಯಂಸೇವಾ ಸಂಸ್ಥೆ ಲಾಗಿನ್",
    select_role_desc: "ಆರೋಗ್ಯ ಜಾಲ ಪೋರ್ಟಲ್‌ಗೆ ಸೈನ್ ಇನ್ ಮಾಡಲು ನಿಮ್ಮ ಪಾತ್ರವನ್ನು ಆಯ್ಕೆಮಾಡಿ.",
    doctor: "ವೈದ್ಯರು",
    ngo_org: "ಸ್ವಯಂಸೇವಾ ಸಂಸ್ಥೆ (NGO)",
    email_address: "ಇಮೇಲ್ ವಿಳಾಸ",
    access_doctor: "ವೈದ್ಯರ ಪೋರ್ಟಲ್ ಪ್ರವೇಶಿಸಿ",
    access_ngo: "ಸ್ವಯಂಸೇವಾ ಸಂಸ್ಥೆ ಪೋರ್ಟಲ್ ಪ್ರವೇಶಿಸಿ",
    go_back_login: "← ರೋಗಿ / ಕಾರ್ಯಕರ್ತರ ಲಾಗಿನ್‌ಗೆ ಹಿಂತಿರುಗಿ",
    doctor_ngo_staff_toggle: "ವೈದ್ಯರು ಅಥವಾ ಸ್ವಯಂಸೇವಾ ಸಂಸ್ಥೆ ಸಿಬ್ಬಂದಿಯೇ? ಲಾಗಿನ್ ಮಾಡಲು ಇಲ್ಲಿ ಕ್ಲಿಕ್ ಮಾಡಿ →",
    enter_valid_mobile: "ದಯವಿಟ್ಟು ಮಾನ್ಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ",
    mobile_length: "ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯು ಕನಿಷ್ಠ 10 ಅಂಕಿಗಳಾಗಿರಬೇಕು",
    enter_password: "ದಯವಿಟ್ಟು ಪಾಸ್‌ವರ್ಡ್ ನಮೂದಿಸಿ",
    demo_pass_alert: "ಡೆಮೊ ಖಾತೆ: ನೀವು ಯಾವುದೇ ಪಾಸ್‌ವರ್ಡ್ ಬಳಸಿ ಸೈನ್ ಇನ್ ಮಾಡಬಹುದು!"
  },
  ta: {
    tagline: "அனைவருக்கும் எளிய பன்மொழி சுகாதார சேவை",
    create_account: "கணக்கை உருவாக்கு",
    worker_login: "பணியாளர் உள்நுழைவு",
    enter_details_signup: "பதிவு செய்ய உங்கள் விவரங்களை உள்ளிடவும்",
    signin_access: "மருத்துவ போர்ட்டலை அணுக உள்நுழையவும்",
    mobile_number: "கைபேசி எண்",
    password: "கடவுச்சொல்",
    forgot_password: "கடவுச்சொல் மறந்துவிட்டதா?",
    register_continue: "பதிவு செய்து தொடரவும்",
    sign_in_btn: "உள்நுழைக",
    already_have_acc: "ஏற்கனவே கணக்கு உள்ளதா?",
    sign_in_underlined: "உள்நுழைக",
    new_user: "புதிய பயனரா?",
    create_account_underlined: "கணக்கை உருவாக்கு",
    prof_login: "மருத்துவர் / என்ஜிஓ உள்நுழைவு",
    select_role_desc: "சுகாதார நெட்வொர்க் போர்ட்டலில் உள்நுழைய உங்கள் பாத்திரத்தைத் தேர்ந்தெடுக்கவும்.",
    doctor: "மருத்துவர்",
    ngo_org: "என்ஜிஓ / நிறுவனம்",
    email_address: "மின்னஞ்சல் முகவரி",
    access_doctor: "மருத்துவர் போர்ட்டலை அணுகவும்",
    access_ngo: "என்ஜிஓ போர்ட்டலை அணுகவும்",
    go_back_login: "← நோயாளி / பணியாளர் உள்நுழைவுக்குச் செல்லவும்",
    doctor_ngo_staff_toggle: "மருத்துவர் அல்லது என்ஜிஓ ஊழியரா? உள்நுழைய இங்கே கிளிக் செய்யவும் →",
    enter_valid_mobile: "தயவுசெய்து சரியான கைபேசி எண்ணை உள்ளிடவும்",
    mobile_length: "கைபேசி எண் குறைந்தது 10 இலக்கங்களாக இருக்க வேண்டும்",
    enter_password: "தயவுசெய்து கடவுச்சொல்லை உள்ளிடவும்",
    demo_pass_alert: "டெमो கணக்கு: நீங்கள் எந்த கடவுச்சொல்லையும் பயன்படுத்தி உள்நுழையலாம்!"
  },
  ml: {
    tagline: "ലളിതമായ ബഹുഭാഷാ ആരോഗ്യ സേവനം",
    create_account: "അക്കൗണ്ട് സൃഷ്ടിക്കുക",
    worker_login: "പ്രവർത്തക ലോഗിൻ",
    enter_details_signup: "സൈൻ അപ്പ് ചെയ്യുന്നതിനായി നിങ്ങളുടെ വിവരങ്ങൾ നൽകുക",
    signin_access: "മെഡിക്കൽ പോർട്ടൽ ഉപയോഗിക്കുന്നതിനായി ലോഗിൻ ചെയ്യുക",
    mobile_number: "മൊബൈൽ നമ്പർ",
    password: "പാസ്‌വേഡ്",
    forgot_password: "പാസ്‌വേഡ് മറന്നുപോയോ?",
    register_continue: "രജിസ്റ്റർ ചെയ്ത് തുടരുക",
    sign_in_btn: "ലോഗിൻ ചെയ്യുക",
    already_have_acc: "ഇതിനകം ഒരു അക്കൗണ്ട് ഉണ്ടോ?",
    sign_in_underlined: "ലോഗിൻ ചെയ്യുക",
    new_user: "പുതിയ ഉപയോക്താവാണോ?",
    create_account_underlined: "അക്കൗണ്ട് സൃഷ്ടിക്കുക",
    prof_login: "ഡോക്ടർ / എൻജിഒ ലോഗിൻ",
    select_role_desc: "ഹെൽത്ത് നെറ്റ്‌വർക്ക് പോർട്ടലിലേക്ക് പ്രവേശിക്കാൻ നിങ്ങളുടെ റോൾ തിരഞ്ഞെടുക്കുക.",
    doctor: "ഡോക്ടർ",
    ngo_org: "എൻജിഒ / സംഘടന",
    email_address: "इമെയിൽ വിലാസം",
    access_doctor: "ഡോക്ടർ പോർട്ടൽ പ്രവേശിക്കുക",
    access_ngo: "എൻജിഒ പോർട്ടൽ പ്രവേശിക്കുക",
    go_back_login: "← രോഗി / പ്രവർത്തക ലോഗിൻ വിഭാഗത്തിലേക്ക് മടങ്ങുക",
    doctor_ngo_staff_toggle: "ഡോക്ടർ അല്ലെങ്കിൽ എൻജിഒ ജീവനക്കാരനാണോ? ലോഗിൻ ചെയ്യാൻ ഇവിടെ ക്ലിക് ചെയ്യുക →",
    enter_valid_mobile: "ദയവായി ഒരു സാധുവായ മൊബൈൽ നമ്പർ നൽകുക",
    mobile_length: "മൊബൈൽ നമ്പറിൽ കുറഞ്ഞത് 10 അക്കങ്ങൾ ഉണ്ടായിരിക്കണം",
    enter_password: "ദയവായി പാസ്‌വേഡ് നൽകുക",
    demo_pass_alert: "ഡെമോ അക്കൗണ്ട്: ഏത് പാസ്‌വേഡ് ഉപയോഗിച്ചും നിങ്ങൾക്ക് ലോഗിൻ ചെയ്യാം!"
  },
  bn: {
    tagline: "সহজ বহুভাষিক স্বাস্থ্যসেবা",
    create_account: "অ্যাকাউন্ট তৈরি করুন",
    worker_login: "কর্মী লগইন",
    enter_details_signup: "সাইন আপ করতে আপনার বিবরণ লিখুন",
    signin_access: "মেডিকেল পোর্টাল অ্যাক্সেস করতে সাইন ইন করুন",
    mobile_number: "মোবাইল নম্বর",
    password: "পাসওয়ার্ড",
    forgot_password: "পাসওয়ার্ড ভুলে গেছেন?",
    register_continue: "নিবন্ধন করুন এবং এগিয়ে যান",
    sign_in_btn: "সাইন ইন করুন",
    already_have_acc: "ইতিমধ্যে একটি অ্যাকাউন্ট আছে?",
    sign_in_underlined: "সাইন ইন করুন",
    new_user: "নতুন ব্যবহারকারী?",
    create_account_underlined: "অ্যাকাউন্ট তৈরি করুন",
    prof_login: "ডাক্তার / এনজিও লগইন",
    select_role_desc: "হেলথ কেয়ার नेटवर्क পোর্টালে সাইন ইন করতে আপনার ভূমিকা নির্বাচন করুন।",
    doctor: "ডাক্তার",
    ngo_org: "এনজিও / সংস্থা",
    email_address: "ইমেল ঠিকানা",
    access_doctor: "ডাক্তার পোর্টাল অ্যাক্সেস করুন",
    access_ngo: "এনজিও পোর্টাল অ্যাক্সেস করুন",
    go_back_login: "← রোগী / কর্মী লগইন-এ ফিরে যান",
    doctor_ngo_staff_toggle: "ডাক্তার বা এনজিও কর্মী? লগইন করতে এখানে ক্লিক করুন →",
    enter_valid_mobile: "দয়া করে একটি সঠিক মোবাইল নম্বর লিখুন",
    mobile_length: "মোবাইল নম্বরটি কমপক্ষে ১০ সংখ্যার হতে হবে",
    enter_password: "দয়া করে পাসওয়ার্ড লিখুন",
    demo_pass_alert: "ডেমো অ্যাকাউন্ট: আপনি যেকোনো পাসওয়ার্ড দিয়ে সাইন ইন করতে পারেন!"
  },
  mr: {
    tagline: "सुलभ बहुभाषिक आरोग्य सेवा",
    create_account: "खाते तयार करा",
    worker_login: "कार्यकर्ता लॉगिन",
    enter_details_signup: "साइन अप करण्यासाठी आपले तपशील प्रविष्ट करा",
    signin_access: "वैद्यकीय पोर्टलवर प्रवेश करण्यासाठी साइन इन करा",
    mobile_number: "मोबाईल नंबर",
    password: "पासवर्ड",
    forgot_password: "पासवर्ड विसरलात?",
    register_continue: "नोंदणी करा आणि पुढे जा",
    sign_in_btn: "साइन इन करा",
    already_have_acc: "आधीच खाते आहे का?",
    sign_in_underlined: "साइन इन करा",
    new_user: "नवीन वापरकर्ता?",
    create_account_underlined: "खाते तयार करा",
    prof_login: "डॉक्टर / एनजीओ लॉगिन",
    select_role_desc: "आरोग्य नेटवर्क पोर्टलमध्ये प्रवेश करण्यासाठी आपली भूमिका निवडा.",
    doctor: "डॉक्टर",
    ngo_org: "एनजीओ / संस्था",
    email_address: "ईमेल पत्ता",
    access_doctor: "डॉक्टर पोर्टल उघडा",
    access_ngo: "एनजीओ पोर्टल उघडा",
    go_back_login: "← रुग्ण / कार्यकर्ता लॉगिनवर परत जा",
    doctor_ngo_staff_toggle: "डॉक्टर किंवा एनजीओ कर्मचारी? लॉगिन करण्यासाठी येथे क्लिक करा →",
    enter_valid_mobile: "कृपया एक वैध मोबाईल नंबर प्रविष्ट करा",
    mobile_length: "मोबाईल नंबर किमान १० अंकी असावा",
    enter_password: "कृपया पासवर्ड प्रविष्ट करा",
    demo_pass_alert: "डेमो खाते: आपण कोणत्याही पासवर्डचा वापर करून लॉगिन करू शकता!"
  },
  or: {
    tagline: "ସୁଲଭ ବହୁଭାଷୀ ସ୍ୱାସ୍ଥ୍ୟ ସେବା",
    create_account: "ଖାତା ସୃଷ୍ଟି କରନ୍ତୁ",
    worker_login: "କର୍ମୀ ଲଗଇନ୍",
    enter_details_signup: "ସାଇନ୍ ଅପ୍ କରିବା ପାଇଁ ନିଜର ବିବରଣୀ ପ୍ରଦାନ କରନ୍ତୁ",
    signin_access: "ଚିକିତ୍ସା ପୋର୍ଟାଲ୍ ବ୍ୟବହାର କରିବା ପାଇଁ ଲଗଇନ୍ କରନ୍ତୁ",
    mobile_number: "ମୋବାଇଲ୍ ନମ୍ବର",
    password: "ପାସୱାର୍ଡ",
    forgot_password: "ପାସୱାର୍ଡ ଭୁଲିଗଲେ କି?",
    register_continue: "ପଞ୍ଜୀକରଣ କରନ୍ତୁ ଏବଂ ଆଗକୁ ବଢନ୍ତୁ",
    sign_in_btn: "ଲଗଇନ୍ କରନ୍ତୁ",
    already_have_acc: "ପୂର୍ବରୁ ଖାତା ଅଛି କି?",
    sign_in_underlined: "ଲଗଇନ୍ କରନ୍ତୁ",
    new_user: "ନୂତନ ବ୍ୟବହାରକାରୀ କି?",
    create_account_underlined: "ଖାତା ସୃଷ୍ଟି କରନ୍ତୁ",
    prof_login: "ଡାକ୍ତର / ଏନଜିଓ ଲଗଇନ୍",
    select_role_desc: "ସ୍ୱାସ୍ଥ୍ୟ ନେଟୱର୍କ ପୋର୍ଟାଲରେ ସାଇନ୍ ଇନ୍ କରିବା ପାଇଁ ନିଜର ଭୂମିକା ବାଛନ୍ତୁ।",
    doctor: "ଡାକ୍ତର",
    ngo_org: "ଏନଜିଓ / ସଂଗଠନ",
    email_address: "ଇମେଲ୍ ଠିକଣା",
    access_doctor: "ଡାକ୍ତର ପୋର୍ଟାଲ୍ ପ୍ରବେଶ କରନ୍ତୁ",
    access_ngo: "ଏନଜିଓ ପୋର୍ଟାଲ୍ ପ୍ରବେଶ କରନ୍ତୁ",
    go_back_login: "← ରୋଗୀ / କର୍ମୀ ଲଗଇନ୍‌କୁ ଫେରିଯାଆନ୍ତୁ",
    doctor_ngo_staff_toggle: "ଡାକ୍ତର କିମ୍ବା ଏନଜିଓ କର୍ମଚାରୀ କି? ଲଗଇନ୍ ପାଇଁ ଏଠାରେ କ୍ଲିକ୍ କରନ୍ତୁ →",
    enter_valid_mobile: "ଦୟାକରି ଏକ ବୈଧ ମୋବାଇଲ୍ ନମ୍ବର ପ୍ରଦାନ କରନ୍ତୁ",
    mobile_length: "ମୋବାଇଲ୍ ନମ୍ବର ଅତିକମରେ ୧୦ ଅଙ୍କ ବିଶିଷ୍ଟ ହେବା ଆବଶ୍ୟક",
    enter_password: "ଦୟାକରି ପାସୱାର୍ଡ ପ୍ରଦାନ କରନ୍ତୁ",
    demo_pass_alert: "ଡେମୋ ଖାତା: ଆପଣ ଯେକୌଣସି ପାସୱାର୍ଡ ବ୍ୟବହାର କରି ଲଗଇନ୍ କରିପାରିବେ!"
  },
  pa: {
    tagline: "ਸੌਖੀ ਬਹੁ-ਭਾਸ਼ਾਈ ਸਿਹਤ ਸੇਵਾ",
    create_account: "ਖਾਤਾ ਬਣਾਓ",
    worker_login: "ਕਾਰਕਰਤਾ ਲੌਗਇਨ",
    enter_details_signup: "ਸਾਈਨ ਅੱਪ ਕਰਨ ਲਈ ਆਪਣਾ ਵੇਰਵਾ ਦਰਜ ਕਰੋ",
    signin_access: "ਮੈਡੀਕਲ ਪੋਰਟਲ ਦੀ ਵਰਤੋਂ ਕਰਨ ਲਈ ਲੌਗਇਨ ਕਰੋ",
    mobile_number: "ਮੋਬਾਈਲ ਨੰਬਰ",
    password: "ਪਾਸਵਰਡ",
    forgot_password: "ਪਾਸਵਰਡ ਭੁੱਲ ਗਏ?",
    register_continue: "ਰਜਿਸਟਰ ਕਰੋ ਅਤੇ ਅੱਗੇ ਵਧੋ",
    sign_in_btn: "ਲੌਗਇਨ ਕਰੋ",
    already_have_acc: "ਕੀ ਪਹਿਲਾਂ ਹੀ ਖਾਤਾ ਹੈ?",
    sign_in_underlined: "ਲੌਗਇਨ ਕਰੋ",
    new_user: "ਨਵੇਂ ਉਪਭੋਗਤਾ?",
    create_account_underlined: "ਖਾਤਾ ਬਣਾਓ",
    prof_login: "ਡਾਕਟਰ / ਐਨਜੀਓ ਲੌਗਇਨ",
    select_role_desc: "ਸਿਹਤ ਨੈੱਟਵਰਕ ਪੋਰਟਲ ਵਿੱਚ ਲੌਗਇਨ ਕਰਨ ਲਈ ਆਪਣ्या ਭੂਮਿਕਾ ਚੁਣੋ।",
    doctor: "ਡਾਕਟਰ",
    ngo_org: "ਐਨਜੀਓ / ਸੰਸਥਾ",
    email_address: "ਈਮੇਲ ਪਤਾ",
    access_doctor: "ਡਾਕਟਰ ਪੋਰਟਲ ਖੋਲ੍ਹੋ",
    access_ngo: "ਐਨਜੀਓ ਪੋਰਟਲ ਖੋਲ੍ਹੋ",
    go_back_login: "← ਮਰੀਜ਼ / ਕਾਰਕਰਤਾ ਲੌਗਇਨ ਤੇ ਵਾਪਸ ਜਾਓ",
    doctor_ngo_staff_toggle: "ਡਾਕਟਰ ਜਾਂ ਐਨਜੀਓ ਕਰਮਚਾਰੀ ਹੋ? ਲੌਗਇਨ ਕਰਨ ਲਈ ਇੱਥੇ ਕਲਿੱਕ ਕਰੋ →",
    enter_valid_mobile: "ਕਿਰਪਾ ਕਰਕੇ ਇੱਕ ਵੈਧ ਮੋਬਾਈਲ ਨੰਬਰ ਦਰਜ ਕਰੋ",
    mobile_length: "ਮੋਬਾਈਲ ਨੰਬਰ ਘੱਟੋ-ਘੱਟ 10 ਅੰਕਾਂ ਦਾ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ",
    enter_password: "ਕਿਰਪਾ ਕਰਕੇ ਪਾਸਵਰਡ ਦਰਜ ਕਰੋ",
    demo_pass_alert: "ਡੈਮो ਖਾਤਾ: ਤੁਸੀਂ ਕੋਈ ਵੀ ਪਾਸਵਰਡ ਵਰਤ ਕੇ ਲੌਗਇਨ ਕਰ ਸਕਦੇ ਹੋ!"
  }
};

export default function LoginView({ onLoginSuccess, selectedLanguage }: LoginViewProps) {
  const [isProfessionalMode, setIsProfessionalMode] = useState(false);
  const [profRole, setProfRole] = useState<'doctor' | 'ngo'>('doctor');

  // Input states
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // Simulation controls
  const [isRegistering, setIsRegistering] = useState(false);

  const langCode = selectedLanguage?.code || 'en';

  const getUiText = (key: keyof typeof localUiTranslations.en) => {
    const lang = (localUiTranslations[langCode as keyof typeof localUiTranslations] ? langCode : 'en') as keyof typeof localUiTranslations;
    return localUiTranslations[lang][key] || localUiTranslations['en'][key];
  };

  const handleWorkerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) {
      setError(getUiText('enter_valid_mobile'));
      return;
    }
    if (phoneNumber.length < 10) {
      setError(getUiText('mobile_length'));
      return;
    }
    if (!password) {
      setError(getUiText('enter_password'));
      return;
    }
    setError('');
    onLoginSuccess('worker', phoneNumber);
  };

  const handleProfessionalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess(profRole);
  };

  return (
    <div className="max-w-md mx-auto my-6 px-4" id="login-container">
      {/* Brand Hero - Simplified & Polished */}
      <div className="text-center mb-6">
        <div className="bg-blue-600 text-white p-3.5 rounded-full w-14 h-14 mx-auto flex items-center justify-center shadow-md shadow-blue-100 mb-4">
          <HeartPulse size={30} className="stroke-[2.5]" />
        </div>
        <h1 className="font-sans font-extrabold text-slate-900 tracking-tight text-2xl leading-none">
          SAHAAYA SETU
        </h1>
        <p className="text-xs font-semibold text-blue-600 tracking-wide mt-2">
          {getUiText('tagline')}
        </p>
      </div>

      {!isProfessionalMode ? (
        /* ==========================================
           W O R K E R   /   P A T I E N T   L O G I N
           ========================================== */
        <div className="bg-white rounded-2xl shadow-sm border border-slate-150 p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-sans font-bold text-slate-800 text-lg">
                {isRegistering ? getUiText('create_account') : getUiText('worker_login')}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {isRegistering ? getUiText('enter_details_signup') : getUiText('signin_access')}
              </p>
            </div>
            {/* Single small speaker for instructions, no extra icons */}
            <AudioSpeaker
              text={
                isRegistering
                  ? (langCode === 'te' 
                      ? "రిజిస్టర్ పేజీ. దయచేసి మీ పది అంకెల మొబైల్ నంబర్ మరియు పాస్‌వర్డ్ టైప్ చేసి సైన్ అప్ చేయండి."
                      : "Register page. Please type your ten digit mobile number and write a password to sign up.")
                  : (langCode === 'te'
                      ? "లాగిన్ పేజీ. దయచేసి మీ మొబైల్ నంబర్ మరియు పాస్‌వర్డ్ టైప్ చేసి సైన్ ఇన్ క్లిక్ చేయండి."
                      : "Login page. Please write your mobile number and your password, then click Sign In.")
              }
              size={15}
              className="bg-blue-50 text-blue-600 rounded-full"
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-medium rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleWorkerSubmit} className="space-y-4">
            <div>
              <label htmlFor="phone" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                {getUiText('mobile_number')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Phone size={16} />
                </div>
                <input
                  id="phone"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 9876543210"
                  className="w-full pl-11 pr-4 py-2.5 border border-slate-200 rounded-xl text-base focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all font-sans font-medium"
                  autoComplete="tel"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label htmlFor="pass" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {getUiText('password')}
                </label>
                <button
                  type="button"
                  onClick={() => alert(getUiText('demo_pass_alert'))}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium hover:underline"
                >
                  {getUiText('forgot_password')}
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock size={16} />
                </div>
                <input
                  id="pass"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-11 py-2.5 border border-slate-200 rounded-xl text-base focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all font-mono"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  title={showPassword ? "Hide password" : "Show password"}
                  id="show-password-toggle"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs transition-all text-sm flex items-center justify-center gap-2"
              id="worker-login-submit"
            >
              <span>{isRegistering ? getUiText('register_continue') : getUiText('sign_in_btn')}</span>
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-slate-100 text-center">
            <button
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError('');
              }}
              className="text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
              id="toggle-register-btn"
            >
              {isRegistering ? (
                <span>{getUiText('already_have_acc')} <span className="text-blue-600 underline">{getUiText('sign_in_underlined')}</span></span>
              ) : (
                <span>{getUiText('new_user')} <span className="text-blue-600 underline">{getUiText('create_account_underlined')}</span></span>
              )}
            </button>
          </div>
        </div>
      ) : (
        /* ==========================================
           P R O F E S S I O N A L   L O G I N
           ========================================== */
        <div className="bg-white rounded-2xl shadow-sm border border-slate-150 p-6">
          <div className="mb-4">
            <h3 className="font-sans font-bold text-slate-800 text-lg">
              {getUiText('prof_login')}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {getUiText('select_role_desc')}
            </p>
          </div>

          {/* Tab Selection */}
          <div className="grid grid-cols-2 gap-2 mb-4 p-1 bg-slate-50 rounded-xl">
            <button
              type="button"
              onClick={() => setProfRole('doctor')}
              className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                profRole === 'doctor'
                  ? 'bg-white text-blue-700 shadow-xs border border-slate-150'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              id="role-select-doctor"
            >
              <User size={14} />
              <span>{getUiText('doctor')}</span>
            </button>

            <button
              type="button"
              onClick={() => setProfRole('ngo')}
              className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                profRole === 'ngo'
                  ? 'bg-white text-blue-700 shadow-xs border border-slate-150'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              id="role-select-ngo"
            >
              <Building size={14} />
              <span>{getUiText('ngo_org')}</span>
            </button>
          </div>

          <form onSubmit={handleProfessionalSubmit} className="space-y-4">
            <div>
              <label htmlFor="prof-email" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                {getUiText('email_address')}
              </label>
              <input
                id="prof-email"
                type="email"
                placeholder={profRole === 'doctor' ? 'doctor@sahaayasetu.org' : 'ngo@sahaayasetu.org'}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:border-blue-600 outline-none transition-all font-sans"
                required
              />
            </div>

            <div>
              <label htmlFor="prof-pass" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                {getUiText('password')}
              </label>
              <input
                id="prof-pass"
                type="password"
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:border-blue-600 outline-none transition-all font-mono"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs transition-all text-sm flex items-center justify-center gap-2"
              id="prof-login-submit"
            >
              <span>{profRole === 'doctor' ? getUiText('access_doctor') : getUiText('access_ngo')}</span>
            </button>
          </form>
        </div>
      )}

      {/* Visually separated, less prominent Toggle link */}
      <div className="mt-8 text-center" id="separated-professional-toggle">
        <button
          onClick={() => {
            setIsProfessionalMode(!isProfessionalMode);
            setError('');
          }}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors"
          id="professional-login-toggle"
        >
          {isProfessionalMode ? (
            <span>{getUiText('go_back_login')}</span>
          ) : (
            <span>{getUiText('doctor_ngo_staff_toggle')}</span>
          )}
        </button>
      </div>
    </div>
  );
}
