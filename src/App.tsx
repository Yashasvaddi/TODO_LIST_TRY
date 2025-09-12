import React, { useState } from 'react';
import { Sidebar } from './components/sidebar';
import { Dashboard } from './components/dashboard';
import { MapViewer } from './components/map-viewer';
import { DataExplorer } from './components/data-explorer';
import { PowerBIReports } from './components/powerbi-reports';
import { AlertManager } from './components/alert-manager';
import { SoilHealthMonitor } from './components/soil-health-monitor';
import { ChatbotMonitor } from './components/chatbot-monitor';
import { FinancialCalculator } from './components/financial-calculator';
import { FarmerCommunity } from './components/farmer-community';
import { AuthProvider, useAuth } from './components/auth-provider';
import { FilterProvider } from './components/filter-provider';
import { LoginForm } from './components/login-form';
import { SimpleHeader } from './components/simple-header';
import { comprehensiveTranslations } from './components/comprehensive-translations';
import { MapPin, Database, PieChart, AlertTriangle, Home, Users, Leaf, MessageSquare, Calculator } from 'lucide-react';

function AppContent() {
  const { isAuthenticated, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [language, setLanguage] = useState<'hi' | 'en'>('en');

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  const t = comprehensiveTranslations[language];

  const navigation = [
    { name: t.dashboard, href: 'dashboard', icon: Home },
    { name: t.map, href: 'map', icon: MapPin },
    { name: t.data, href: 'data', icon: Database },
    { name: t.reports, href: 'reports', icon: PieChart },
    { name: t.alerts, href: 'alerts', icon: AlertTriangle },
    { name: t.soil, href: 'soil', icon: Leaf },
    { name: t.chatbot, href: 'chatbot', icon: MessageSquare },
    { name: t.calculator, href: 'calculator', icon: Calculator },
    { name: t.community, href: 'community', icon: Users },
  ];

  const handleLanguageToggle = () => {
    setLanguage(prev => prev === 'hi' ? 'en' : 'hi');
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard language={language} />;
      case 'map':
        return <MapViewer language={language} />;
      case 'data':
        return <DataExplorer language={language} />;
      case 'reports':
        return <PowerBIReports language={language} />;
      case 'alerts':
        return <AlertManager language={language} />;
      case 'soil':
        return <SoilHealthMonitor language={language} />;
      case 'chatbot':
        return <ChatbotMonitor language={language} />;
      case 'calculator':
        return <FinancialCalculator language={language} />;
      case 'community':
        return <FarmerCommunity language={language} />;
      default:
        return <Dashboard language={language} />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <SimpleHeader 
        onLanguageToggle={handleLanguageToggle}
        currentLanguage={language}
        onLogout={logout}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          navigation={navigation} 
          currentPage={currentPage} 
          onNavigate={setCurrentPage} 
        />
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <FilterProvider>
        <AppContent />
      </FilterProvider>
    </AuthProvider>
  );
}