export type AppRoute =
  | 'login'
  | 'languages'
  | 'worker-home'
  | 'emergency'
  | 'symptoms'
  | 'hospitals'
  | 'appointments'
  | 'camps'
  | 'prescriptions'
  | 'history'
  | 'chat'
  | 'doctor-dashboard'
  | 'ngo-dashboard';

export interface Language {
  code: string;
  nativeName: string;
  englishName: string;
  audioPrompt: string; // The audio/spoken instruction text placeholder
}

export interface WorkerFeature {
  id: AppRoute;
  nameKey: string;
  englishName: string;
  nativeName?: string;
  icon: string; // Name of Lucide icon
  color: string; // Tailwind color class for bg/text
  description: string;
}

export interface AppState {
  currentRoute: AppRoute;
  history: AppRoute[];
  selectedLanguage: string | null;
  userRole: 'worker' | 'doctor' | 'ngo' | null;
  phoneNumber: string;
  isLoggedIn: boolean;
}
