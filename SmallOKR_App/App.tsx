import React from 'react';
import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import {AppStackNav} from './src/screens/AppStackNav';
import {UserContextProvider} from './src/state/UserContext';
import AxiosNavigation from './src/components/AxiosNavigation';

const App = () => {
  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: 'transparent',
      notification: 'rgb(255, 69, 58)',
    },
  };
  return (
    <UserContextProvider>
      <NavigationContainer theme={theme}>
        <AxiosNavigation />
        <AppStackNav />
      </NavigationContainer>
    </UserContextProvider>
  );
};

export default App;
