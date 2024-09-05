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
      <TodoStack.Navigator>
        <TodoStack.Screen
          name="Todo"
          component={Todo}
          options={{
            headerRight: () => <PlanHeaderRight />,
          }}
        />
        <TodoStack.Screen name="AddTodo" component={AddTodo} />
        <TodoStack.Screen name="RepeatPage" component={RepeatPage} />
      </TodoStack.Navigator>
    </TodoContextProvider>
  );
};

export default TodoStackScreen;
