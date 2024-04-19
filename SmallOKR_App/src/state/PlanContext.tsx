import React, {createContext, Dispatch, useReducer} from 'react';
import {Todo} from '../model/OKRModel';
import {Action} from './Actions';

interface PlanState {
  plans: Todo[];
}
const initialPlanStates: PlanState = {
  plans: [
    {
      Title: 'String',
      Description: 'String',
      StartTime: 'String',
      EndTime: 'String',
      Repeat: 1,
    },
  ],
};

export const PlanContext = createContext<PlanState>(initialPlanStates);
export const PlanDispatchContext = createContext({} as Dispatch<Action>);

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

const PlanReducer = function (state: PlanState, action: Action): PlanState {
  switch (action.type) {
    case 'Add':
      return {
        plans: [
          ...state.plans,
          {
            Title: 'String',
            Description: 'String',
            StartTime: 'String',
            EndTime: 'String',
            Repeat: 1,
          },
        ],
      };
    default:
      break;
  }
  return state;
};

export {PlanReducer};
