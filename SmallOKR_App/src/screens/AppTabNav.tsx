import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DashboardStackScreen from './DashboardStackScreen';
import TargetStackScreen from './TargetStackScreen';
import TodoStackScreen from './TodoStackScreen';
import MeStackScreen from './MeStackScreen';
import React from 'react';

const Tab = createBottomTabNavigator();

export const AppTabNav = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({color, size}) => {
          let iconName;
          if (route.name === 'Dashboard') {
            iconName = 'home';
          } else if (route.name === 'Target') {
            iconName = 'man';
          } else if (route.name === 'Todo') {
            iconName = 'chatbox';
          } else {
            iconName = 'settings';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'red',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}>
      <Tab.Screen name="Dashboard" component={DashboardStackScreen} />
      <Tab.Screen name="Target" component={TargetStackScreen} />
      <Tab.Screen name="Todo" component={TodoStackScreen} />
      <Tab.Screen name="Me" component={MeStackScreen} />
    </Tab.Navigator>
  );
};
