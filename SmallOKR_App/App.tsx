import React, {useContext} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {AppStackNav} from './src/screens/AppStackNav';
import {UserContextProvider} from './src/state/UserContext';
import AxiosNavigation from './src/components/AxiosNavigation';
import {ThemeContext, ThemeProvider} from './src/state/ThemeContext';

const App = () => {
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
    <App />
  </ThemeProvider>
);

export default WrappedApp;
