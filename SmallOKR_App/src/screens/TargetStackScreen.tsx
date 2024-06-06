import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AddTarget from '../components/AddTarget';
import {Target, TargetHeaderRight} from '../components/Target';
import React from 'react';
import {TargetContextProvider} from '../state/TargetContext';

const TargetStack = createNativeStackNavigator();

const TargetStackScreen = () => {
  return (
    <TargetContextProvider>
      <TargetStack.Navigator>
        <TargetStack.Screen
          name="TargetStack"
          component={Target}
          options={{
            headerRight: () => <TargetHeaderRight />,
            title: 'Target',
          }}
        />
        <TargetStack.Screen
          name="AddTarget"
          component={AddTarget}
          initialParams={{targetId: ''}}
        />
      </TargetStack.Navigator>
    </TargetContextProvider>
  );
};

export default TargetStackScreen;
