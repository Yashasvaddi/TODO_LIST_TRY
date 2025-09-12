import React from 'react';
import { Button } from './ui/button';
import { useAuth } from './auth-provider';
import { LogOut, Sprout } from 'lucide-react';
import { cn } from './ui/utils';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface SidebarProps {
  navigation: NavigationItem[];
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Sidebar({ navigation, currentPage, onNavigate }: SidebarProps) {
  const { logout, user } = useAuth();

  return (
    <div className="flex flex-col w-64 bg-card border-r border-border">
      <div className="flex items-center gap-2 p-6 border-b border-border">
        <Sprout className="h-8 w-8 text-primary" />
        <div>
          <h1 className="font-medium">किसान मित्र</h1>
          <p className="text-sm text-muted-foreground">भारत सरकार - कृषि विभाग</p>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => (
          <Button
            key={item.href}
            variant={currentPage === item.href ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start gap-2",
              currentPage === item.href && "bg-secondary"
            )}
            onClick={() => onNavigate(item.href)}
          >
            <item.icon className="h-4 w-4" />
            {item.name}
          </Button>
        ))}
      </nav>
      
      <div className="p-4 border-t border-border">
        <div className="text-sm text-muted-foreground mb-3">
          <p>Welcome, {user?.name}</p>
          <p className="text-xs">{user?.role}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full gap-2"
          onClick={logout}
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}