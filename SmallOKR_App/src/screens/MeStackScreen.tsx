import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Me from '../components/Me';
import React from 'react';
import PersonalInfo from '../components/PersonalInfo';
import BehaviorAnalysis from '../components/BehaviorAnalysis';
import ChangePasswordScreen from '../components/ChangePassword';

const MeStack = createNativeStackNavigator<MyReactNavigation.ParamList>();

const MeStackScreen = () => {
  return (
    <MeStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <MeStack.Screen name="Me" component={Me} />
      <MeStack.Screen
        name="PersonalInfo"
        component={PersonalInfo}
        options={{
          headerShown: true,
          title: '个人信息',
        }}
      />
      <MeStack.Screen
        name="BehaviorAnalysis"
        component={BehaviorAnalysis}
        options={{
          headerShown: true,
          title: '行为分析报告',
        }}
      />
      <MeStack.Screen
        name="ChangePassword"
        component={ChangePasswordScreen}
        options={{
          headerShown: true,
          title: '修改密码',
        }}
      />
    </MeStack.Navigator>
  );
};

export default MeStackScreen;
