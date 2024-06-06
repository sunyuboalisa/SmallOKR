import React from 'react';
import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import {AppStackNav} from './src/screens/AppStackNav';
import {UserContextProvider} from './src/state/UserContext';

const App = () => {
  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: 'rgb(255, 255, 255)',
      notification: 'rgb(255, 69, 58)',
    },
  };
  return (
    <UserContextProvider>
      <NavigationContainer theme={theme}>
        <AppStackNav />
      </NavigationContainer>
    </UserContextProvider>
  );
};

export default App;
