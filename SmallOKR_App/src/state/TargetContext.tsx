import React, {createContext, Dispatch, useReducer} from 'react';
import {IResult, ITarget} from '../model/OKRModel';
import {TargetAction} from './Actions';

interface TargetState {
  targets: ITarget[];
  results: IResult[];
}

const initialTargetState: TargetState = {
  targets: [],
  results: [],
};
const initialDispatch: Dispatch<TargetAction> = (action: TargetAction) => {
  console.log(action);
};

const TargetContext = createContext(initialTargetState);
const TargetDispatchContext = createContext(initialDispatch);

const TargetContextProvider = (props: {children: React.ReactNode}) => {
  const TargetReducer = (state: TargetState, action: TargetAction) => {
    switch (action.type) {
      case 'Add':
        return {...state, targets: [...state.targets, action.newTarget]};
      case 'Load':
        return {...state, targets: action.targets};
      case 'AddResult':
        return {...state, results: [...state.results, action.newResult]};
      case 'LoadResult':
        return {...state, results: action.results};
    }

    return state;
  };

  const [state, dispatch] = useReducer(TargetReducer, initialTargetState);

  return (
    <TargetContext.Provider value={state}>
      <TargetDispatchContext.Provider value={dispatch}>
        {props.children}
      </TargetDispatchContext.Provider>
    </TargetContext.Provider>
  );
};

export {TargetContext, TargetDispatchContext, TargetContextProvider};
