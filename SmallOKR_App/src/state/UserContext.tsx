import React, {Dispatch, createContext, useReducer} from 'react';
import {UserAction} from './Actions';
import {User} from '../model/User';
import { UserService } from '../service/BusiService';

export type UserState = {
  userInfo: User | null;
  status: 'online' | 'offline';
} | null;

export const UserContext = createContext<UserState>(null);
export const UserDispatchContext = createContext({} as Dispatch<UserAction>);

export function UserContextProvider({children}: {children: React.ReactNode}) {
  const [userState, dispatch] = useReducer(UserReducer, null);

  return (
    <UserContext.Provider value={userState}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserContext.Provider>
  );
}

const UserReducer = function (state: UserState, action: UserAction): UserState {
  switch (action.type) {
    case 'Login':
      UserService.storeToken(action.user);
      return {
        userInfo: action.user,
        status: 'online',
      };
    case 'Logout':
      return {
        userInfo: null,
        status: 'offline',
      };
    default:
      break;
  }
  return state;
};

export {UserReducer};
