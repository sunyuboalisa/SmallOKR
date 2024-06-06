import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TargetStackScreen from './TargetStackScreen';
import TodoStackScreen from './TodoStackScreen';
import MeStackScreen from './MeStackScreen';
import React from 'react';
import Dashboard from '../components/Dashboard';

const Tab = createBottomTabNavigator();

export const AppTabNav = () => {
  return (
    <Tab.Navigator
      screenOptions={() => ({
        tabBarActiveTintColor: 'red',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}>
      <Tab.Screen
        name="Dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({color, size}) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
        component={Dashboard}
      />
      <Tab.Screen
        name="TargetTab"
        options={{
          title: 'Target',
          tabBarIcon: ({color, size}) => (
            <Ionicons name="man" color={color} size={size} />
          ),
        }}
        component={TargetStackScreen}
      />
      <Tab.Screen
        name="TodoTab"
        options={{
          title: 'Todo',
          tabBarIcon: ({color, size}) => (
            <Ionicons name="chatbox" color={color} size={size} />
          ),
        }}
        component={TodoStackScreen}
      />
      <Tab.Screen
        name="MeTab"
        options={{
          title: 'Me',
          tabBarIcon: ({color, size}) => (
            <Ionicons name="settings" color={color} size={size} />
          ),
        }}
        component={MeStackScreen}
      />
    </Tab.Navigator>
  );
};
