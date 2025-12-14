import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AddTarget from '../components/EditTarget';
import { Target, TargetHeaderRight } from '../components/Target';
import React from 'react';
import { MyStackParamList } from '../common/NativeScreenTypes';
import { useTheme } from '../state/ThemeContext';

const TargetStack = createNativeStackNavigator<MyStackParamList>();

const TargetStackScreen = () => {
  const theme = useTheme();
  return (
    <TargetStack.Navigator
      initialRouteName="Target"
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: theme.theme.colors.background,
        },
        headerTintColor: theme.theme.colors.text,
        animation: 'fade',
      }}
    >
      <TargetStack.Screen
        name="Target"
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
        initialParams={{
          target: { description: '', name: '', id: '', status: 0 },
        }}
        component={AddTarget}
      />
    </TargetStack.Navigator>
  );
};

export default TargetStackScreen;
