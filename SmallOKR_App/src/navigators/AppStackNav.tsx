import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppTabNav } from './AppTabNav';
import LoginScreen from '../screens/LoginScreen';
import React, { useContext } from 'react';
import { UserContext } from '../state/UserContext';
import RegisterScreen from '../screens/RegisterScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import TenantGate from '../components/TenantGate';
const TenantApp = () => {
  const {userInfo} = useContext(UserContext);
  return <TenantGate><AppTabNav key={userInfo.tenantId || 'legacy'}/></TenantGate>;
};

// 这里是程序主组件入口
const Stack = createNativeStackNavigator<MyReactNavigation.ParamList>();
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
        <Stack.Screen name="MainApp" component={TenantApp} />
      )}

      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
};
