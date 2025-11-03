import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TargetStackScreen from './TargetStackScreen';
import TodoStackScreen from './TodoStackScreen';
import MeStackScreen from './MeStackScreen';
import React, { useContext } from 'react';
import Dashboard from '../components/Dashboard';
import { ThemeContext } from '../state/ThemeContext';
import { TargetContextProvider } from '../state/TargetContext';
import { TodoContextProvider } from '../state/TodoContext';

const Tab = createBottomTabNavigator();

export const AppTabNav = () => {
  const themeContext = useContext(ThemeContext);
  return (
    <TargetContextProvider>
      <TodoContextProvider>
        <Tab.Navigator
          screenOptions={() => ({
            tabBarActiveTintColor: themeContext?.theme.colors.primary,
            tabBarInactiveTintColor: themeContext?.theme.colors.text,
            headerShown: false,
            tabBarStyle: {
              backgroundColor: themeContext?.theme.colors.background,
            },
          })}
        >
          <Tab.Screen
            name="Dashboard"
            options={{
              title: '面板',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="home" color={color} size={size} />
              ),
            }}
            component={Dashboard}
          />
          <Tab.Screen
            name="TargetTab"
            options={{
              title: '目标',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="boat" color={color} size={size} />
              ),
            }}
            component={TargetStackScreen}
          />
          <Tab.Screen
            name="TodoTab"
            options={{
              title: '待办',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="chatbox" color={color} size={size} />
              ),
            }}
            component={TodoStackScreen}
          />
          <Tab.Screen
            name="MeTab"
            options={{
              title: '我',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="settings" color={color} size={size} />
              ),
            }}
            component={MeStackScreen}
          />
        </Tab.Navigator>
      </TodoContextProvider>
    </TargetContextProvider>
  );
};
