import { createStackNavigator } from '@react-navigation/stack';
import { AppTabNav } from './AppTabNav';
import LoginScreen from './LoginScreen';
import React, { useContext, useEffect, useState } from 'react';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { UserContext } from '../state/UserContext';
import RegisterScreen from './RegisterScreen';
import ForgotPasswordScreen from './ForgotPasswordScreen';
import { SplashScreen } from './SplashScreen';
import { eventBus } from '../common/EventBus';
import { USER_EVENTS } from '../common/EventType';

const Stack = createStackNavigator<MyReactNavigation.ParamList>();
export const AppStackNav = () => {
  const userContext = useContext(UserContext);
  const navigation =
    useNavigation<NavigationProp<MyReactNavigation.ParamList>>();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // 只有初始化完成后才执行导航
    if (!userContext.isloading && isReady) {
      if (userContext?.userInfo) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'MainApp' }],
        });
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      }
    }
  }, [userContext, navigation, isReady]);

  useEffect(() => {
    // 添加短暂延迟确保所有初始化完成
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // 订阅会话过期事件
    const handleSessionExpired = () => {
      console.log('Session expired. Redirecting to Login...');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    };

    const handleUserLogin = () => {
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainApp' }],
      });
    };

    // 订阅会话过期事件
    eventBus.on(USER_EVENTS.USER_SESSION_EXPIRED, handleSessionExpired);
    eventBus.on(USER_EVENTS.USER_LOGIN, handleUserLogin);
    eventBus.on(USER_EVENTS.USER_LOGOUT, handleSessionExpired);
    // 清理事件监听器
    return () => {
      eventBus.off(USER_EVENTS.USER_SESSION_EXPIRED, handleSessionExpired);
      eventBus.off(USER_EVENTS.USER_LOGIN, handleUserLogin);
    };
  }, [navigation]);

  if (userContext.isloading || !isReady) {
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        gestureEnabled: false,
        headerShown: false,
      }}
      initialRouteName={userContext?.userInfo ? 'MainApp' : 'Login'}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="MainApp" component={AppTabNav} />
    </Stack.Navigator>
  );
};
