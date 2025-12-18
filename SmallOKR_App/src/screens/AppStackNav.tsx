import { createStackNavigator } from '@react-navigation/stack';
import { AppTabNav } from './AppTabNav';
import LoginScreen from './LoginScreen';
import React, { useContext, useEffect } from 'react';
import { UserContext, UserDispatchContext } from '../state/UserContext';
import RegisterScreen from './RegisterScreen';
import ForgotPasswordScreen from './ForgotPasswordScreen';
import { StorageService } from '../service/StorageService';
import useUserService from '../service/UserService';

const Stack = createStackNavigator<MyReactNavigation.ParamList>();
export const AppStackNav = () => {
  const userContext = useContext(UserContext);
  const userService = useUserService();
  const dispatch = useContext(UserDispatchContext);
  // 初始化加载
  useEffect(() => {
    const loadUser = async () => {
      dispatch({ type: 'Loading' });
      const storedUser = await StorageService.getUser();
      if (storedUser) {
        console.log('Loaded stored user:', storedUser);
        dispatch({
          type: 'UpdateNamespaceUrl',
          namespaceUrl: storedUser.namespaceUrl,
        });
        const resCheck = await userService.healthCheck(storedUser.namespaceUrl);
        console.log('Health check result:', resCheck);
        if (!resCheck) {
          return;
        }
        dispatch({ type: 'Login', user: storedUser });
      }
    };
    loadUser();
  }, [dispatch]);
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
