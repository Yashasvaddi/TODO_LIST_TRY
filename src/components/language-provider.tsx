import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'hi' | 'en';

interface Translations {
  // Navigation
  dashboard: string;
  map: string;
  data: string;
  reports: string;
  alerts: string;
  soil: string;
  chatbot: string;
  calculator: string;
  community: string;
  
  // Common UI
  login: string;
  logout: string;
  search: string;
  settings: string;
  profile: string;
  
  // Dashboard specific
  welcomeTitle: string;
  totalFarmers: string;
  activeAdvisories: string;
  soilHealthIndex: string;
  cropYield: string;
  
  // Header
  appTitle: string;
  selectLanguage: string;
}

const translations: Record<Language, Translations> = {
  hi: {
    // Navigation
    dashboard: 'डैशबोर्ड',
    map: 'राज्य मैप',
    data: 'किसान डेटा',
    reports: 'एनालिटिक्स',
    alerts: 'अलर्ट्स',
    soil: 'सॉइल हेल्थ',
    chatbot: 'चैटबॉट',
    calculator: 'कैलकुलेटर',
    community: 'किसान समुदाय',
    
    // Common UI
    login: 'लॉगिन',
    logout: 'लॉगआउट',
    search: 'खोजें',
    settings: 'सेटिंग्स',
    profile: 'प्रोफाइल',
    
    // Dashboard specific
    welcomeTitle: 'कृषि सलाहकार डैशबोर्ड',
    totalFarmers: 'कुल किसान',
    activeAdvisories: 'सक्रिय सलाह',
    soilHealthIndex: 'मिट्टी स्वास्थ्य सूचकांक',
    cropYield: 'फसल उत्पादन',
    
    // Header
    appTitle: 'भारतीय कृषि सलाहकार डैशबोर्ड',
    selectLanguage: 'भाषा चुनें',
  },
  en: {
    // Navigation
    dashboard: 'Dashboard',
    map: 'State Map',
    data: 'Farmer Data',
    reports: 'Analytics',
    alerts: 'Alerts',
    soil: 'Soil Health',
    chatbot: 'Chatbot',
    calculator: 'Calculator',
    community: 'Farmer Community',
    
    // Common UI
    login: 'Login',
    logout: 'Logout',
    search: 'Search',
    settings: 'Settings',
    profile: 'Profile',
    
    // Dashboard specific
    welcomeTitle: 'Agricultural Advisory Dashboard',
    totalFarmers: 'Total Farmers',
    activeAdvisories: 'Active Advisories',
    soilHealthIndex: 'Soil Health Index',
    cropYield: 'Crop Yield',
    
    // Header
    appTitle: 'Indian Agricultural Extension Dashboard',
    selectLanguage: 'Select Language',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>('en');

  const contextValue: LanguageContextType = {
    language,
    setLanguage,
    t: translations[language],
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}