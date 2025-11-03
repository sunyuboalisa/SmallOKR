/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AppStackNav } from './src/screens/AppStackNav';
import { UserContextProvider } from './src/state/UserContext';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import { ThemeContext, ThemeProvider } from './src/state/ThemeContext';
import AxiosNavigation from './src/components/AxiosNavigation';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import { NewAppScreen } from '@react-native/new-app-screen';
import { enableScreens } from 'react-native-screens';
enableScreens(); // 启用屏幕优化

const App1 = () => {
  const themeContext = useContext(ThemeContext);
  return (
    <UserContextProvider>
      <NavigationContainer theme={themeContext?.theme}>
        <AxiosNavigation />
        <AppStackNav />
      </NavigationContainer>
    </UserContextProvider>
  );
};

// 使用 ThemeProvider 包裹整个应用
const WrappedApp = () => (
  <ThemeProvider>
    <App1 />
  </ThemeProvider>
);

// export default WrappedApp;

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      {/* <NewAppScreen
        templateFileName="App.tsx"
        safeAreaInsets={safeAreaInsets}
      /> */}
      <WrappedApp />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
