import React, {createContext, Dispatch, useReducer} from 'react';
import {ITarget} from '../model/OKRModel';
import {TargetAction} from './Actions';
import AxiosHelper from '../util/AxiosHelper';

const axiosHelper = new AxiosHelper('127.0.0.1:8080');
let data = [
  {
    id: 1,
    name: 'Spring 全家桶',
    description: 'Spring Boot，Spring Cloud',
  },
  {
    id: 2,
    name: '数据库',
    description: 'MySQL',
  },
  {
    id: 3,
    name: '中间件',
    description: 'Redis、Kafka、ElasticSearch',
  },
];

axiosHelper.get<TargetState>('api/target/getAllTargetWithGroup').then(x => {
  data = [...data, ...x.data];
});

type TargetState = ITarget[];

const initialTargetState = data;
export const TargetContext = createContext<TargetState>(initialTargetState);
export const TargetDispatchContext = createContext(
  {} as Dispatch<TargetAction>,
);

const TargetReducer = (state: TargetState, action: TargetAction) => {
  switch (action.type) {
    case 'Add':
      axiosHelper.post('api/target/add', action.newTarget).then(res => {
        console.log(res.status);
      });
      break;
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
