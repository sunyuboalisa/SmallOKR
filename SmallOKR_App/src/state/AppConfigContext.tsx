import React, { createContext, useReducer, useEffect, Dispatch } from 'react';
import { StorageService, storageKeys } from '../service/StorageService';

export type AppConfigState = {
  rememberMe: boolean;
  theme: 'light' | 'dark';
  language: string;
};

type Action =
  | { type: 'SetRememberMe'; value: boolean }
  | { type: 'SetTheme'; value: 'light' | 'dark' }
  | { type: 'SetLanguage'; value: string }
  | { type: 'LoadConfig'; value: AppConfigState }; // 新增：用于加载整个配置

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
    case 'LoadConfig':
      return {
        ...state,
        ...action.value,
      };
    default:
      return state;
  }
}

export function AppConfigProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // 1. 初始加载 useEffect
  useEffect(() => {
    const loadConfig = async () => {
      // 使用 StorageService.getAppConf() 读取完整的配置对象
      const storedConf = await StorageService.getAppConf();

      if (storedConf) {
        // 如果读取成功，派发 LoadConfig action 覆盖 state
        dispatch({
          type: 'LoadConfig',
          value: storedConf,
        });
        dispatch({ type: 'SetTheme', value: storedConf.theme });
      }
    };
    loadConfig();
  }, []);

  // 2. 状态持久化 useEffect
  useEffect(() => {
    // 将整个 state 对象保存到 AsyncStorage
    // 确保仅在 state 变化后才保存 (避免初始加载时重复保存)
    if (state !== initialState) {
      StorageService.saveAppConf(state);
    }
  }, [state]); // 监听整个 state 变化

  return (
    <AppConfigContext.Provider value={state}>
      <AppConfigDispatchContext.Provider value={dispatch}>
        {children}
      </AppConfigDispatchContext.Provider>
    </AppConfigContext.Provider>
  );
}

export { AppConfigContext, AppConfigDispatchContext };
