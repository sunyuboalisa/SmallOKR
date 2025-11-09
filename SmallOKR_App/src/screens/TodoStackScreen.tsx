import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AddTodo from '../components/EditTodo';
import { Todo, PlanHeaderRight } from '../components/Todo';
import { RepeatPage } from '../components/RepeatPage';
import React from 'react';
import { MyStackParamList } from '../common/NativeScreenTypes';

const TodoStack = createNativeStackNavigator<MyStackParamList>();

const TodoStackScreen = () => {
  return (
    <TodoStack.Navigator
      screenOptions={{
        animation: 'fade',
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: 'transparent',
        },
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
