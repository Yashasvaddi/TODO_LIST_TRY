import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  user: { name: string; email: string; role: string } | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock JWT validation - always succeeds for MVP
const mockValidateJWT = async (email: string, password: string): Promise<boolean> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In real implementation, this would call:
  // const response = await fetch('/api/v1/auth/login', { ... });
  // return response.ok;
  
  return true; // Always succeed for MVP
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    const success = await mockValidateJWT(email, password);
    
    if (success) {
      // Mock user data
      setUser({
        name: 'Admin User',
        email: email,
        role: 'admin'
      });
      setIsAuthenticated(true);
      
      // In real implementation, store JWT token:
      // localStorage.setItem('auth_token', response.token);
    }
    
    return success;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    // localStorage.removeItem('auth_token');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}