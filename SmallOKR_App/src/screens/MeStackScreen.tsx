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
          headerShown: true, // Show header for this screen
          title: '个人信息', // Set a title
        }}
      />
      <MeStack.Screen
        name="BehaviorAnalysis"
        component={BehaviorAnalysis}
        options={{
          headerShown: true, // Show header for this screen
          title: '行为分析报告', // Set a title
        }}
      />
      <MeStack.Screen
        name="ChangePassword"
        component={ChangePasswordScreen}
        options={{
          headerShown: true, // Show header for this screen
          title: '修改密码', // Set a title
        }}
      />
    </MeStack.Navigator>
  );
};

export default MeStackScreen;
