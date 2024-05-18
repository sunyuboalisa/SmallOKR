import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {AppStackNav} from './src/screens/AppStackNav';
import {UserContextProvider} from './src/state/UserContext';

const App = () => {
  return (
    <UserContextProvider>
      <NavigationContainer>
        <AppStackNav />
      </NavigationContainer>
    </UserContextProvider>
  );
};

export default App;
