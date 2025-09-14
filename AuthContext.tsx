import React, { createContext, useContext, useState, ReactNode } from "react";

type Credentials = {
  phone: string;     // 10-digit (India) stored as digits only
  aadhaar: string;   // 12-digit stored as digits only
  language: string;  // new field
};

type AuthContextType = {
  credentials: Credentials;
  updateCredentials: (partial: Partial<Credentials>) => void;
  login: () => void;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [credentials, setCredentials] = useState<Credentials>({
    phone: "",
    aadhaar: "",
    language: "",   // default empty
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const updateCredentials = (partial: Partial<Credentials>) =>
    setCredentials((prev) => ({ ...prev, ...partial }));

  const login = () => setIsAuthenticated(true);

  const logout = () => {
    setIsAuthenticated(false);
    setCredentials({ phone: "", aadhaar: "", language: "" });
  };

  return (
    <AuthContext.Provider
      value={{ credentials, updateCredentials, login, logout, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
