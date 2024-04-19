import {createContext, Dispatch, useReducer} from 'react';
import {ITarget} from '../model/OKRModel';
import {TargetAction} from './Actions';
import AxiosHelper from '../util/AxiosHelper';

const axiosHelper = new AxiosHelper('127.0.0.1:8080');
let data = [
  {
    id: 12,
    name: '111',
    description: '222222',
  },
];

axiosHelper.get<TargetState>('api/target/getAllTargetWithGroup').then(x => {});

type TargetState = ITarget[];

const initialTargetState = data;
export const TargetContext = createContext<TargetState>(initialTargetState);
export const TargetDispatchContext = createContext(
  {} as Dispatch<TargetAction>,
);

const TargetReducer = (state: TargetState, action: TargetAction) => {
  switch (action.type) {
    case 'Add':
      axiosHelper.post('api/target/add', action.newTarget);
      const newGroup = state.map(val => {
        return val;
      });

      return newGroup;
    default:
      break;
  }

  return state;
};
export function TargetContextProvide(props: {children: React.ReactNode}) {
  const [state, dispatch] = useReducer(TargetReducer, initialTargetState);

  return (
    <TargetContext.Provider value={state}>
      <TargetDispatchContext.Provider value={dispatch}>
        {props.children}
      </TargetDispatchContext.Provider>
    </TargetContext.Provider>
  );
}
