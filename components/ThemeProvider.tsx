import React, { ReactNode } from "react";
import { StatusBar } from "expo-status-bar";

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <>
      <StatusBar style="light" />
      {children}
    </>
  );
}
