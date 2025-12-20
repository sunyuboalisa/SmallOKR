import { DefaultTheme, Theme } from '@react-navigation/native';
import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import { AppConfigContext, AppConfigDispatchContext } from './AppConfigContext';

// 定义主题常量 (使用外部定义，保持 Provider 简洁)
const LightTheme: Theme = {
  ...DefaultTheme,
  colors: {
    primary: '#2196F3',
    background: '#ffffff',
    card: '#F5F5F5',
    text: 'rgb(28, 28, 30)',
    border: 'transparent',
    notification: 'rgb(255, 59, 48)',
    placeholder: 'gray',
    error: 'red',
  },
};

const DarkTheme: Theme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    primary: 'gold',
    background: '#000000',
    card: '#333333',
    text: '#ffffff',
    border: 'transparent',
    notification: 'rgb(255, 59, 48)',
    placeholder: 'gray',
    error: 'red',
  },
};

// 定义 ThemeContext 的类型
interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

// 创建 ThemeContext
export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined,
);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const appConfig = useContext(AppConfigContext);
  const dispatch = useContext(AppConfigDispatchContext);

  const currentTheme: Theme = useMemo(() => {
    return appConfig.theme === 'dark' ? DarkTheme : LightTheme;
  }, [appConfig.theme]);

  const toggleTheme = () => {
    const newTheme = appConfig.theme === 'light' ? 'dark' : 'light';

    dispatch({ type: 'SetTheme', value: newTheme });
  };

  return (
    <ThemeContext.Provider value={{ theme: currentTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// 自定义 Hook，保持不变
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
