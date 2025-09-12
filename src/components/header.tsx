import React from 'react';
import { Button } from './ui/button';
import { Globe, LogOut } from 'lucide-react';
import { useLanguage, Language } from './language-provider';
import { useAuth } from './auth-provider';

export function Header() {
  const { language, setLanguage, t } = useLanguage();
  const { logout } = useAuth();



  return (
    <header className="bg-background border-b border-border px-6 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl text-primary">
          {t.appTitle}
        </h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Globe className="h-4 w-4 text-muted-foreground" />
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setLanguage(language === 'hi' ? 'en' : 'hi')}
            className="w-32"
          >
            {language === 'hi' ? 'हिन्दी' : 'English'}
          </Button>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={logout}
          className="flex items-center space-x-2"
        >
          <LogOut className="h-4 w-4" />
          <span>{t.logout}</span>
        </Button>
      </div>
    </header>
  );
}