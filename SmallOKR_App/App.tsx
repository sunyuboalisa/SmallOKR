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
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeContext, ThemeProvider } from './src/state/ThemeContext';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import { enableScreens } from 'react-native-screens';
import { AppConfigProvider } from './src/state/AppConfigContext';
enableScreens();

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
  const themeContext = useContext(ThemeContext);
  return (
    <View style={styles.container}>
      <AppConfigProvider>
        <ThemeProvider>
          <UserContextProvider>
            <NavigationContainer theme={themeContext?.theme}>
              <AppStackNav />
            </NavigationContainer>
          </UserContextProvider>
        </ThemeProvider>
      </AppConfigProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
