import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AddTodo from '../components/AddTodo';
import {Todo, PlanHeaderRight} from '../components/Todo';
import {RepeatPage} from '../components/RepeatPage';
import React from 'react';
import {TodoContextProvider} from '../state/TodoContext';

const TodoStack = createNativeStackNavigator<MyReactNavigation.ParamList>();

const TodoStackScreen = () => {
  return (
    <TodoContextProvider>
      <TodoStack.Navigator
        screenOptions={{
          animation: 'fade',
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: 'transparent',
          },
        }}>
        <TodoStack.Screen
          name="Todo"
          component={Todo}
          options={{
            headerRight: () => <PlanHeaderRight />,
            title: '待办',
          }}
        />
        <TodoStack.Screen
          name="AddTodo"
          component={AddTodo}
          options={{title: '添加待办'}}
        />
        <TodoStack.Screen name="RepeatPage" component={RepeatPage} />
      </TodoStack.Navigator>
    </TodoContextProvider>
  );
};

export default TodoStackScreen;
