import { Button } from './ui/button';
import { Globe, LogOut } from 'lucide-react';

interface SimpleHeaderProps {
  onLanguageToggle: () => void;
  currentLanguage: string;
  onLogout: () => void;
}

export function SimpleHeader({ onLanguageToggle, currentLanguage, onLogout }: SimpleHeaderProps) {
  return (
    <header className="bg-background border-b border-border px-6 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl text-primary">
          {currentLanguage === 'hi' ? 'भारतीय कृषि सलाहकार डैशबोर्ड' : 'Indian Agricultural Extension Dashboard'}
        </h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Globe className="h-4 w-4 text-muted-foreground" />
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onLanguageToggle}
            className="w-32"
          >
            {currentLanguage === 'hi' ? 'हिन्दी' : 'English'}
          </Button>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onLogout}
          className="flex items-center space-x-2"
        >
          <LogOut className="h-4 w-4" />
          <span>{currentLanguage === 'hi' ? 'लॉगआउट' : 'Logout'}</span>
        </Button>
      </div>
    </header>
  );
}