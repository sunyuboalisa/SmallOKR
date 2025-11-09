import { DefaultTheme, Theme } from '@react-navigation/native';
import React, { createContext, useState, useContext, ReactNode } from 'react';

// 定义主题
const themes = {
  light: {
    ...DefaultTheme,
    colors: {
      primary: '#2196F3',
      background: '#ffffff',
      card: '#F5F5F5',
      text: 'rgb(28, 28, 30)',
      border: 'transparent',
      notification: 'rgb(255, 59, 48)',
      placeholder: 'gray',
    },
  },
  dark: {
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
    },
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

// ThemeProvider 组件，接收子组件作为参数
interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setTheme] = useState<Theme>(themes.light); // 默认是 light 主题

  const toggleTheme = () => {
    setTheme(prevTheme =>
      prevTheme === themes.light ? themes.dark : themes.light,
    );
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// 自定义 Hook，便于在其他组件中使用主题信息
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
