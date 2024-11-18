import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Me from '../components/Me';
import React from 'react';

const MeStack = createNativeStackNavigator<MyReactNavigation.ParamList>();

const MeStackScreen = () => {
  return (
    <MeStack.Navigator
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: '#9175be',
        },
      }}>
      <MeStack.Screen name="Me" component={Me} />
    </MeStack.Navigator>
  );
};

export default MeStackScreen;
