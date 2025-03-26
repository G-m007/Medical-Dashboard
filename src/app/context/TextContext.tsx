"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

interface TextContextType {
  extractedText: string;
  setExtractedText: (text: string) => void;
}

const TextContext = createContext<TextContextType | undefined>(undefined);

export function TextProvider({ children }: { children: ReactNode }) {
  const [extractedText, setExtractedText] = useState<string>('');

  const setTextWithLog = (text: string) => {
    console.log("Setting context:", text); // Debug log
    setExtractedText(text);
  };

  return (
    <TextContext.Provider value={{ extractedText, setExtractedText: setTextWithLog }}>
      {children}
    </TextContext.Provider>
  );
}

export function useText() {
  const context = useContext(TextContext);
  if (context === undefined) {
    throw new Error('useText must be used within a TextProvider');
  }
  return context;
} 