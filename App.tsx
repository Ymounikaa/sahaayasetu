/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Globe, Check } from 'lucide-react';
import { AppRoute, Language } from './types';
import { LANGUAGES } from './data';
import Header from './components/Header';
import LoginView from './components/LoginView';
import LanguageSelectionView from './components/LanguageSelectionView';
import WorkerHomeView from './components/WorkerHomeView';
import FeaturePlaceholderView from './components/FeaturePlaceholderView';
import DoctorDashboardView from './components/DoctorDashboardView';
import NgoDashboardView from './components/NgoDashboardView';
import AudioSpeaker from './components/AudioSpeaker';

export default function App() {
  // Navigation stack state
  const [currentRoute, setCurrentRoute] = useState<AppRoute>('login');
  const [routeHistory, setRouteHistory] = useState<AppRoute[]>(['login']);
  
  // App context state
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const [userRole, setUserRole] = useState<'worker' | 'doctor' | 'ngo' | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);

  // Persist selected language and session on local storage to survive simple updates
  useEffect(() => {
    const savedLangCode = localStorage.getItem('hb_selected_language');
    if (savedLangCode) {
      const lang = LANGUAGES.find(l => l.code === savedLangCode);
      if (lang) {
        setSelectedLanguage(lang);
      }
    }

    const savedPhone = localStorage.getItem('hb_phone_number');
    if (savedPhone) {
      setPhoneNumber(savedPhone);
    }
    
    const savedRole = localStorage.getItem('hb_user_role');
    if (savedRole) {
      const role = savedRole as 'worker' | 'doctor' | 'ngo';
      setUserRole(role);
      
      const savedRoute = localStorage.getItem('hb_current_route');
      if (savedRoute) {
        setCurrentRoute(savedRoute as AppRoute);
        setRouteHistory([savedRoute as AppRoute]);
      }
    }
  }, []);

  // Safe router navigation pusher
  const navigateTo = (route: AppRoute) => {
    setCurrentRoute(route);
    setRouteHistory(prev => [...prev, route]);
    localStorage.setItem('hb_current_route', route);
  };

  // Safe router back button popper
  const handleBack = () => {
    if (routeHistory.length <= 1) {
      // Fallback if history list is broken
      if (userRole === 'worker') {
        navigateTo('worker-home');
      } else {
        navigateTo('login');
      }
      return;
    }

    const newHistory = [...routeHistory];
    newHistory.pop(); // Remove current route
    const prevRoute = newHistory[newHistory.length - 1];
    
    setCurrentRoute(prevRoute);
    setRouteHistory(newHistory);
    localStorage.setItem('hb_current_route', prevRoute);
  };

  // Handle Login Event dispatch
  const handleLoginSuccess = (role: 'worker' | 'doctor' | 'ngo', phone?: string) => {
    setUserRole(role);
    localStorage.setItem('hb_user_role', role);

    if (role === 'worker') {
      const workerPhone = phone || '9876543210';
      setPhoneNumber(workerPhone);
      localStorage.setItem('hb_phone_number', workerPhone);
      
      // If language is already chosen, skip selection and go to home
      if (selectedLanguage) {
        navigateTo('worker-home');
      } else {
        navigateTo('languages');
      }
    } else if (role === 'doctor') {
      navigateTo('doctor-dashboard');
    } else if (role === 'ngo') {
      navigateTo('ngo-dashboard');
    }
  };

  // Handle Language Selection Event dispatch
  const handleLanguageSelect = (lang: Language) => {
    setSelectedLanguage(lang);
    localStorage.setItem('hb_selected_language', lang.code);
    navigateTo('worker-home');
  };

  // Sign out / Reset session
  const handleLogout = () => {
    setUserRole(null);
    setPhoneNumber('');
    // We can keep the selectedLanguage for better UX, but we clean routing memory
    localStorage.removeItem('hb_user_role');
    localStorage.removeItem('hb_phone_number');
    localStorage.removeItem('hb_current_route');
    
    setCurrentRoute('login');
    setRouteHistory(['login']);
  };

  // Visual fade animation parameters
  const pageVariants = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } },
    exit: { opacity: 0, y: -8, transition: { duration: 0.15, ease: 'easeIn' } }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-sky-100 selection:text-sky-900" id="app-root">
      {/* Global Header */}
      <Header
        currentRoute={currentRoute}
        selectedLanguage={selectedLanguage}
        userRole={userRole}
        onNavigate={navigateTo}
        onBack={routeHistory.length > 1 && currentRoute !== 'login' ? handleBack : undefined}
        onLogout={handleLogout}
        onChangeLanguage={() => setIsLanguageModalOpen(true)}
      />

      {/* Main Workspace Frame */}
      <main className="flex-1 py-4 sm:py-6" id="main-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentRoute}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            className="w-full h-full"
          >
            {currentRoute === 'login' && (
              <LoginView onLoginSuccess={handleLoginSuccess} selectedLanguage={selectedLanguage} />
            )}

            {currentRoute === 'languages' && (
              <LanguageSelectionView
                onLanguageSelect={handleLanguageSelect}
                selectedLanguage={selectedLanguage}
              />
            )}

            {currentRoute === 'worker-home' && (
              <WorkerHomeView
                selectedLanguage={selectedLanguage}
                phoneNumber={phoneNumber}
                onFeatureSelect={navigateTo}
                onChangeLanguage={() => setIsLanguageModalOpen(true)}
              />
            )}

            {/* Feature Dashboard Placeholders */}
            {[
              'emergency', 'symptoms', 'hospitals', 'appointments',
              'camps', 'prescriptions', 'history', 'chat'
            ].includes(currentRoute) && (
              <FeaturePlaceholderView
                featureId={currentRoute}
                selectedLanguage={selectedLanguage}
                onBack={handleBack}
                onNavigate={navigateTo}
                phoneNumber={phoneNumber}
              />
            )}

            {currentRoute === 'doctor-dashboard' && (
              <DoctorDashboardView onLogout={handleLogout} />
            )}

            {currentRoute === 'ngo-dashboard' && (
              <NgoDashboardView onLogout={handleLogout} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Global Language Selector Modal */}
      {isLanguageModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in animate-duration-150" id="language-modal-backdrop">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] flex flex-col shadow-xl border border-slate-150 overflow-hidden" id="language-modal-container">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-150 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Globe size={18} className="text-blue-600 animate-spin-slow" />
                <h3 className="font-sans font-bold text-slate-800 text-sm">
                  Change Language / భాష ఎంచుకోండి
                </h3>
              </div>
              <button
                onClick={() => setIsLanguageModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
                id="close-language-modal-btn"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Content - Language List */}
            <div className="p-4 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-2" id="language-modal-list">
              {LANGUAGES.map((lang) => {
                const isSelected = selectedLanguage?.code === lang.code;
                return (
                  <div
                    key={lang.code}
                    onClick={() => {
                      setSelectedLanguage(lang);
                      localStorage.setItem('hb_selected_language', lang.code);
                      setIsLanguageModalOpen(false);
                    }}
                    className={`group relative p-3 rounded-xl border-2 text-left cursor-pointer transition-all flex items-center justify-between gap-3 select-none ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/40 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-blue-500 hover:shadow-xs active:scale-98'
                    }`}
                    id={`modal-lang-card-${lang.code}`}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        setSelectedLanguage(lang);
                        localStorage.setItem('hb_selected_language', lang.code);
                        setIsLanguageModalOpen(false);
                      }
                    }}
                  >
                    <div className="flex-1 min-w-0">
                      <span className="block font-sans font-bold text-slate-800 text-sm group-hover:text-blue-700 transition-colors">
                        {lang.nativeName}
                      </span>
                      <span className="block text-[10px] font-semibold text-slate-400 mt-0.5 uppercase tracking-wider">
                        {lang.englishName}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <AudioSpeaker text={lang.audioPrompt} size={13} className="bg-slate-50 text-slate-600 rounded-full" />
                      {isSelected && (
                        <div className="bg-blue-600 text-white p-0.5 rounded-full border border-blue-700 flex items-center justify-center">
                          <Check size={10} className="stroke-[3]" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Modal Footer / Tip */}
            <div className="p-3 bg-amber-50 border-t border-slate-150 text-[10px] text-amber-800 flex gap-2 items-start font-medium">
              <span>💡</span>
              <p>
                Change language directly without losing your progress on the current page. Click 🔊 to hear the language name.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Minimal Footer */}
      <footer className="py-4 border-t border-slate-200 bg-white text-center text-[11px] text-slate-400 font-medium">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>HealthBridge AI • Phase 1 Foundation</span>
          <span className="text-slate-300 hidden sm:inline">|</span>
          <span className="tracking-wide">Designed for Accessibility & Language Equity</span>
        </div>
      </footer>
    </div>
  );
}
