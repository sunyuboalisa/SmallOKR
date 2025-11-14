import React, { createContext, useReducer, useEffect, Dispatch } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type AppConfigState = {
  rememberMe: boolean;
  theme: 'light' | 'dark';
  language: string;
};

type Action =
  | { type: 'SetRememberMe'; value: boolean }
  | { type: 'SetTheme'; value: 'light' | 'dark' }
  | { type: 'SetLanguage'; value: string };

const initialState: AppConfigState = {
  rememberMe: true,
  theme: 'light',
  language: 'zh-CN',
};

const AppConfigContext = createContext<AppConfigState>(initialState);
const AppConfigDispatchContext = createContext({} as Dispatch<Action>);

function reducer(state: AppConfigState, action: Action): AppConfigState {
  switch (action.type) {
    case 'SetRememberMe':
      return { ...state, rememberMe: action.value };
    case 'SetTheme':
      return { ...state, theme: action.value };
    case 'SetLanguage':
      return { ...state, language: action.value };
    default:
      return state;
  }
}

export function AppConfigProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const load = async () => {
      const storedRemember = await AsyncStorage.getItem('rememberMe');
      if (storedRemember) {
        dispatch({
          type: 'SetRememberMe',
          value: JSON.parse(storedRemember),
        });
      }
    };
    load();
  }, []);
  useEffect(() => {}, [state.rememberMe]);

  return (
    <AppConfigContext.Provider value={state}>
      <AppConfigDispatchContext.Provider value={dispatch}>
        {children}
      </AppConfigDispatchContext.Provider>
    </AppConfigContext.Provider>
  );
}

export { AppConfigContext, AppConfigDispatchContext };
