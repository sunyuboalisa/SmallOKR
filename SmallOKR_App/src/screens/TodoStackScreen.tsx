import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AddTodo from '../components/EditTodo';
import { Todo, PlanHeaderRight } from '../components/Todo';
import { RepeatPage } from '../components/RepeatPage';
import React from 'react';
import { MyStackParamList } from '../common/NativeScreenTypes';
import { useTheme } from '../state/ThemeContext';

const TodoStack = createNativeStackNavigator<MyStackParamList>();

const TodoStackScreen = () => {
  const theme = useTheme();
  return (
    <TodoStack.Navigator
      screenOptions={{
        animation: 'fade',
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: theme.theme.colors.background,
        },
        headerTintColor: theme.theme.colors.text,
      }}
    >
      <TodoStack.Screen
        name="Todo"
        component={Todo}
        options={{
          headerRight: () => <PlanHeaderRight />,
          title: '待办',
        }}
      />
      <TodoStack.Screen
        name="EditTodo"
        component={AddTodo}
        options={{ title: '编辑待办' }}
      />
      <TodoStack.Screen name="RepeatPage" component={RepeatPage} />
    </TodoStack.Navigator>
  );
};

export default TodoStackScreen;
