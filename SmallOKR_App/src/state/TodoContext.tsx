import React, {createContext, useReducer} from 'react';
import {Todo} from '../model/OKRModel';
import {TodoAction} from './Actions';
interface UITodo {
  id: string;
  dateTime: string;
  title: string;
}
interface PlanState {
  todos: Todo[];
  uiTodos: UITodo[];
  reload: boolean;
}

const initialPlanStates: PlanState = {
  todos: [],
  uiTodos: [],
  reload: false,
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
          id: x.id,
          dateTime: x.beginDate,
          title: x.name,
        }));
        return {todos: action.newTodos, uiTodos: temp};
      case 'Reload':
        return {...state, reload: action.reload};
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
