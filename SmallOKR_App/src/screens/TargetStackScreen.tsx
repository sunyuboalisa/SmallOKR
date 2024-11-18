import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AddTarget from '../components/AddTarget';
import {Target, TargetHeaderRight} from '../components/Target';
import React from 'react';
import {TargetContextProvider} from '../state/TargetContext';

const TargetStack = createNativeStackNavigator();

const TargetStackScreen = () => {
  return (
    <TargetContextProvider>
      <TargetStack.Navigator
        screenOptions={{
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: 'transparent',
          },
          animation:'fade'
        }}>
        <TargetStack.Screen
          name="TargetStack"
          options={{
            headerRight: () => <TargetHeaderRight />,
            title: 'Target',
          }}
          initialParams={{reload: false}}
          component={Target}
        />
        <TargetStack.Screen
          name="AddTarget"
          initialParams={{targetId: ''}}
          component={AddTarget}
        />
      </TargetStack.Navigator>
    </TargetContextProvider>
  );
};

export default TargetStackScreen;
