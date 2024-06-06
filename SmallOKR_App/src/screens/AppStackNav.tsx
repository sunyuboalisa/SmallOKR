import {createStackNavigator} from '@react-navigation/stack';
import {AppTabNav} from './AppTabNav';
import LoginScreen from './LoginScreen';
import React, {useContext, useEffect} from 'react';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {UserContext} from '../state/UserContext';
import {UserService} from '../service/BusiService';

// 创建堆栈导航器
const Stack = createStackNavigator<MyReactNavigation.ParamList>();
export const AppStackNav = () => {
  const userContext = useContext(UserContext);
  const navigation =
    useNavigation<NavigationProp<MyReactNavigation.ParamList>>();

  useEffect(() => {
    UserService.getToken().then(() => {
      if (userContext?.userInfo) {
        navigation.navigate('MainApp');
      } else {
        navigation.navigate('Login');
      }
    });
  }, [navigation, userContext]);
  return (
    <Stack.Navigator screenOptions={{gestureEnabled: false}}>
      <Stack.Screen
        options={{headerShown: false}}
        name="Login"
        component={LoginScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="MainApp"
        component={AppTabNav}
      />
    </Stack.Navigator>
  );
};
