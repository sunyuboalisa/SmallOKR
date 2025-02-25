import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TargetStackScreen from './TargetStackScreen';
import TodoStackScreen from './TodoStackScreen';
import MeStackScreen from './MeStackScreen';
import React from 'react';
import Dashboard from '../components/Dashboard';
import BackgroundImage from '../components/BackgroundImage';

const Tab = createBottomTabNavigator();

export const AppTabNav = () => {
  return (
    <BackgroundImage>
      <Tab.Navigator
        screenOptions={() => ({
          tabBarActiveTintColor: 'gold',
          tabBarInactiveTintColor: 'white',
          headerShown: false,
          tabBarStyle: {
            // backgroundColor: '#b576be',
            backgroundColor: '#000000',
          },
        })}>
        <Tab.Screen
          name="Dashboard"
          options={{
            title: '面板',
            tabBarIcon: ({color, size}) => (
              <Ionicons name="home" color={color} size={size} />
            ),
          }}
          component={Dashboard}
        />
        <Tab.Screen
          name="TargetTab"
          options={{
            title: '目标',
            tabBarIcon: ({color, size}) => (
              <Ionicons name="boat" color={color} size={size} />
            ),
          }}
          component={TargetStackScreen}
        />
        <Tab.Screen
          name="TodoTab"
          options={{
            title: '待办',
            tabBarIcon: ({color, size}) => (
              <Ionicons name="chatbox" color={color} size={size} />
            ),
          }}
          component={TodoStackScreen}
        />
        <Tab.Screen
          name="MeTab"
          options={{
            title: '我',
            tabBarIcon: ({color, size}) => (
              <Ionicons name="settings" color={color} size={size} />
            ),
          }}
          component={MeStackScreen}
        />
      </Tab.Navigator>
    </BackgroundImage>
  );
};
