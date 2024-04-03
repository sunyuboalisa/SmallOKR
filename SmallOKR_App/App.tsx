import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DashboardStackScreen from './src/screens/DashboardStackScreen';
import TargetStackScreen from './src/screens/TargetStackScreen';
import PlanStackScreen from './src/screens/PlanStackScreen';
import MeStackScreen from './src/screens/MeStackScreen';

const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarIcon: ({color, size}) => {
            let iconName;
            if (route.name === 'Dashboard') {
              iconName = 'home';
            } else if (route.name === 'Target') {
              iconName = 'man';
            } else if (route.name === 'Plan') {
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
        <Tab.Screen name="Plan" component={PlanStackScreen} />
        <Tab.Screen name="Me" component={MeStackScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
