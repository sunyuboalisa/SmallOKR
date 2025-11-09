import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AddTarget from '../components/EditTarget';
import { Target, TargetHeaderRight } from '../components/Target';
import React from 'react';

const TargetStack = createNativeStackNavigator();

const TargetStackScreen = () => {
  return (
    <TargetStack.Navigator
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: 'transparent',
        },
        animation: 'fade',
      }}
    >
      <TargetStack.Screen
        name="TargetStack"
        options={{
          headerRight: () => <TargetHeaderRight />,
          title: '目标',
        }}
        initialParams={{ reload: false }}
        component={Target}
      />
      <TargetStack.Screen
        name="EditTarget"
        options={{ title: '编辑目标' }}
        initialParams={{ targetId: '' }}
        component={AddTarget}
      />
    </TargetStack.Navigator>
  );
};

export default TargetStackScreen;
