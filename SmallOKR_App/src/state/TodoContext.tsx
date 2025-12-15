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
        const newTodo = action.newTodo;
        const uiTodo = action.uiTodo;

        // 1. 检查 Todo 是否已存在 (通过 ID)
        const todoExists = state.todos.some(todo => todo.id === newTodo.id);

        let updatedTodos;
        let updatedUiTodos;

        if (todoExists) {
          // --- 存在：执行更新逻辑 (Map/遍历替换) ---
          updatedTodos = state.todos.map(todo =>
            todo.id === newTodo.id ? newTodo : todo,
          );
          updatedUiTodos = state.uiTodos.map(item =>
            item.id === uiTodo.id ? uiTodo : item,
          );

          console.log('待办已更新:', newTodo.id);
        } else {
          // --- 不存在：执行添加逻辑 (Push) ---
          updatedTodos = [...state.todos, newTodo];
          updatedUiTodos = [...state.uiTodos, uiTodo];

          console.log('待办已添加:', newTodo.id);
        }

        return {
          ...state,
          todos: updatedTodos,
          uiTodos: updatedUiTodos,
        };
      case 'Delete':
        let tempDelete = state.todos.filter(x => x.id !== action.id);
        let tempUIDelete = state.uiTodos.filter(x => x.id !== action.id);
        return { ...state, todos: tempDelete, uiTodos: tempUIDelete };
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
