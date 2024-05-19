import React, {createContext, useReducer} from 'react';
import {Todo} from '../model/OKRModel';
import {TodoAction} from './Actions';
interface UITodo {
  dateTime: string;
  title: string;
}
interface PlanState {
  todos: Todo[];
  uiTodos: UITodo[];
}

const initialPlanStates: PlanState = {
  todos: [],
  uiTodos: [],
};
const initialDispatch = (action: TodoAction) => {
  console.log(action);
};

const TodoContext = createContext(initialPlanStates);
const TodoDispatchContext = createContext(initialDispatch);

const TodoContextProvider = ({children}: {children: React.ReactNode}) => {
  const TodoReducer = (state: PlanState, action: TodoAction) => {
    switch (action.type) {
      case 'Add':
        break;
      case 'Load':
        let temp = action.newTodos.map(x => ({
          dateTime: x.beginDate,
          title: x.name,
        }));
        return {todos: action.newTodos, uiTodos: temp};
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

export {TodoContext, TodoDispatchContext, TodoContextProvider};
