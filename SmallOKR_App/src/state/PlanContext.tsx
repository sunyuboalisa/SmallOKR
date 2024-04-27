import React, {createContext, Dispatch, useReducer} from 'react';
import {Todo} from '../model/OKRModel';
import {TodoAction} from './Actions';
interface UITodo {
  dateTime: string;
  title: string;
}
export interface PlanState {
  todos: Todo[];
  uiTodos: UITodo[];
}
const initialPlanStates: PlanState = {
  todos: [
    {
      name: 'String',
      description: 'String',
      beginDate: 'String',
      endDate: 'String',
      repeat: 1,
    },
  ],
  uiTodos: [{dateTime: '2024-04-27T18:30:00', title: 'test'}],
};

export const PlanContext = createContext<PlanState>(initialPlanStates);
export const PlanDispatchContext = createContext({} as Dispatch<TodoAction>);

export function PlanContextProvider({children}: {children: React.ReactNode}) {
  const [planState, dispatch] = useReducer(PlanReducer, initialPlanStates);

  return (
    <PlanContext.Provider value={planState}>
      <PlanDispatchContext.Provider value={dispatch}>
        {children}
      </PlanDispatchContext.Provider>
    </PlanContext.Provider>
  );
}

const PlanReducer = function (state: PlanState, action: TodoAction): PlanState {
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

export {PlanReducer};
