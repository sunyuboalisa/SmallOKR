import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AddTarget from '../components/AddTarget';
import {Target, TargetHeaderRight} from '../components/Target';
import {TargetContextProvide} from '../state/TargetContext';
import React from 'react';

const TargetStack = createNativeStackNavigator();

const TargetStackScreen = () => {
  return (
    <TargetContextProvide>
      <TargetStack.Navigator>
        <TargetStack.Screen
          name="Target"
          component={Target}
          options={{
            headerRight: () => <TargetHeaderRight />,
          }}
        />
        <TargetStack.Screen name="AddTarget" component={AddTarget} />
      </TargetStack.Navigator>
    </TargetContextProvide>
  );
};

export default TargetStackScreen;
