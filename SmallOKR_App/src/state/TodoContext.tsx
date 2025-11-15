import React, { createContext, useReducer } from 'react';
import { ITodo, IUITodo } from '../model/OKRModel';
import { TodoAction } from './Actions';

interface TodoState {
  todos: ITodo[];
  uiTodos: IUITodo[];
  reload: boolean;
}

const initialPlanStates: TodoState = {
  todos: [],
  uiTodos: [],
  reload: false,
};
const initialDispatch = (action: TodoAction) => {
  console.log(action);
};

const TodoContext = createContext(initialPlanStates);
const TodoDispatchContext = createContext(initialDispatch);

const TodoContextProvider = ({ children }: { children: React.ReactNode }) => {
  const TodoReducer = (state: TodoState, action: TodoAction) => {
    switch (action.type) {
      case 'Add':
        let newTodo = {
          id: action.newTodo.id,
          dateTime: action.newTodo.beginDate,
          endTime: action.newTodo.endDate,
          title: action.newTodo.name,
          status: action.newTodo.status,
        };
        console.log('添加待办列表', newTodo);

        return {
          ...state,
          todos: [...state.todos, action.newTodo],
          uiTodos: [...state.uiTodos, newTodo],
        };
      case 'Load':
        let temp = action.newTodos.map(x => ({
          id: x.id,
          dateTime: x.beginDate,
          endTime: x.endDate,
          title: x.name,
        }));
        console.log('加载待办列表', temp);

        return { ...state, todos: action.newTodos, uiTodos: temp };
      default:
        break;
    }
    return state;
  };

  const [planState, dispatch] = useReducer(TodoReducer, initialPlanStates);

  return (
    <TodoContext.Provider value={planState}>
      <TodoDispatchContext.Provider value={dispatch}>
        {children}
      </TodoDispatchContext.Provider>
    </TodoContext.Provider>
  );
};

export { TodoContext, TodoDispatchContext, TodoContextProvider };
