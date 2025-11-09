import React, { Dispatch, createContext, useEffect, useReducer } from 'react';
import { UserAction } from './Actions';
import { User } from '../model/User';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAxios } from '../hooks/useAxios';
import { eventBus } from '../common/EventBus';

export type UserState = {
  userInfo: User | null;
  status: 'online' | 'offline';
  isloading: boolean;
};

export const UserContext = createContext<UserState>({
  userInfo: null,
  status: 'offline',
  isloading: false,
});
export const UserDispatchContext = createContext({} as Dispatch<UserAction>);

// 存储用户信息
const storeUser = async (user: User) => {
  try {
    await AsyncStorage.setItem('userInfo', JSON.stringify(user));
  } catch (error) {
    console.error('存储用户信息失败:', error);
  }
};

export function UserContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userState, dispatch] = useReducer(UserReducer, {
    userInfo: null,
    status: 'offline',
    isloading: false,
  });
  const axios = useAxios();
  // 初始化时从存储中加载用户信息
  useEffect(() => {
    const loadUser = async () => {
      try {
        dispatch({ type: 'Loading' });
        const storedUser = await AsyncStorage.getItem('userInfo');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          dispatch({ type: 'Login', user });
        }
      } catch (error) {
        console.error('加载用户信息失败', error);
      } finally {
        dispatch({ type: 'Loaded' });
      }
    };
    loadUser();
  }, []);

  return (
    <UserContext.Provider value={userState}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserContext.Provider>
  );
}
const clearUserStorage = async () => {
  try {
    await AsyncStorage.removeItem('userInfo');
  } catch (error) {
    console.error('清除用户存储失败:', error);
  }
};
const UserReducer = function (state: UserState, action: UserAction): UserState {
  switch (action.type) {
    case 'Loading':
      return { ...state, isloading: true };
    case 'Loaded':
      return { ...state, isloading: false };
    case 'Login':
      storeUser(action.user);
      return {
        userInfo: action.user,
        status: 'online',
        isloading: false,
      };
    case 'Logout':
      clearUserStorage();
      eventBus.emit('USER_LOGOUT');
      return {
        userInfo: { ...state.userInfo, token: '' } as User,
        status: 'offline',
        isloading: false,
      };
    default:
      return state;
  }
};

export { UserReducer };
