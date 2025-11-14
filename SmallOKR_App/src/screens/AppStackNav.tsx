import { createStackNavigator } from '@react-navigation/stack';
import { AppTabNav } from './AppTabNav';
import LoginScreen from './LoginScreen';
import React, { useContext } from 'react';
import { UserContext } from '../state/UserContext';
import RegisterScreen from './RegisterScreen';
import ForgotPasswordScreen from './ForgotPasswordScreen';

const Stack = createStackNavigator<MyReactNavigation.ParamList>();
export const AppStackNav = () => {
  const userContext = useContext(UserContext);

  return (
    <Stack.Navigator
      screenOptions={{
        gestureEnabled: false,
        headerShown: false,
      }}
      UNSTABLE_routeNamesChangeBehavior="lastUnhandled"
    >
      {userContext.userInfo.status === 'offline' ? (
        <Stack.Screen name="Login" component={LoginScreen} />
      ) : (
        <Stack.Screen name="MainApp" component={AppTabNav} />
      )}

      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
};
