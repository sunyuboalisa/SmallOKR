import React from 'react';
import Renderer, { act } from 'react-test-renderer';
import App from '../App';
import { NavigationContainer } from '@react-navigation/native';
import LoadingLayer from '../src/components/LoadingLayer';

let mockNavigationRenders = 0;
let mockActions: { beginRequest: () => void; endRequest: () => void };
jest.mock('react-native', () => ({
  View: 'View',
  Text: 'Text',
  StatusBar: 'StatusBar',
  ActivityIndicator: 'ActivityIndicator',
  StyleSheet: { create: (styles: any) => styles, absoluteFill: {} },
  useColorScheme: () => 'light',
}));
jest.mock('@react-navigation/native', () => ({
  NavigationContainer: jest.fn(({ children }) => children),
}));
jest.mock('react-native-screens', () => ({ enableScreens: jest.fn() }));
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }: any) => children,
}));
jest.mock('../src/state/AppConfigContext', () => ({
  AppConfigProvider: ({ children }: any) => children,
}));
jest.mock('../src/state/UserContext', () => ({
  UserContextProvider: ({ children }: any) => children,
}));
jest.mock('../src/state/ThemeContext', () => {
  const R = require('react');
  const ThemeContext = R.createContext(undefined);
  const value = { theme: { dark: false, colors: { background: '#fff' } } };
  return {
    ThemeContext,
    ThemeProvider: ({ children }: any) =>
      R.createElement(ThemeContext.Provider, { value }, children),
  };
});
jest.mock('../src/navigators/AppStackNav', () => ({
  AppStackNav: () => {
    mockNavigationRenders++;
    mockActions = require('../src/hooks/useLoadingLayer').useLoadingActions();
    return null;
  },
}));

test('supplies the active theme and updates loading without rendering navigation again', async () => {
  mockNavigationRenders = 0;
  let tree!: Renderer.ReactTestRenderer;
  await act(async () => {
    tree = Renderer.create(<App />);
  });
  expect((NavigationContainer as jest.Mock).mock.calls[0][0].theme).toEqual({
    dark: false,
    colors: { background: '#fff' },
  });
  expect(mockNavigationRenders).toBe(1);
  await act(async () => {
    mockActions.beginRequest();
  });
  expect(tree.root.findByType(LoadingLayer).props.visible).toBe(true);
  expect(mockNavigationRenders).toBe(1);
  await act(async () => {
    mockActions.endRequest();
  });
  expect(tree.root.findByType(LoadingLayer).props.visible).toBe(false);
  expect(mockNavigationRenders).toBe(1);
  await act(async () => tree.unmount());
});
