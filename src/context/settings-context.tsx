'use client';

import type { ReactNode } from 'react';
import { createContext, useContext } from 'react';
import { useLocalStorage } from '@/lib/hooks/use-local-storage';

interface Settings {
  apiKey: string;
  modelName: string;
}

interface SettingsContextType extends Settings {
  setApiKey: (key: string) => void;
  setModelName: (name: string) => void;
  isConfigured: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [apiKey, setApiKey] = useLocalStorage<string>('openrouter-api-key', '');
  const [modelName, setModelName] = useLocalStorage<string>('openrouter-model-name', 'openai/gpt-4o');

  const isConfigured = !!apiKey && !!modelName;

  const value = {
    apiKey,
    modelName,
    setApiKey,
    setModelName,
    isConfigured,
  };

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
