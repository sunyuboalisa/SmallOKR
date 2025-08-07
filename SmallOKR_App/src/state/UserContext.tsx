import React, {Dispatch, createContext, useEffect, useReducer} from 'react';
import {UserAction} from './Actions';
import {User} from '../model/User';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {axiosHelper} from '../util/AxiosHelper';

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

// 清除用户存储信息
const clearUserStorage = async () => {
  try {
    await AsyncStorage.removeItem('userInfo');
    axiosHelper.clearToken();
  } catch (error) {
    console.error('清除用户存储失败:', error);
  }
};

export function UserContextProvider({children}: {children: React.ReactNode}) {
  const [userState, dispatch] = useReducer(UserReducer, {
    userInfo: null,
    status: 'offline',
    isloading: false,
  });

  // 初始化时从存储中加载用户信息
  useEffect(() => {
    const loadUser = async () => {
      try {
        dispatch({type: 'Loading'});
        const storedUser = await AsyncStorage.getItem('userInfo');
        if (storedUser) {
          dispatch({type: 'Login', user: JSON.parse(storedUser)});
        }
      } catch (error) {
        console.error('加载用户信息失败', error);
      } finally {
        dispatch({type: 'Loaded'});
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

const UserReducer = function (state: UserState, action: UserAction): UserState {
  switch (action.type) {
    case 'Loading':
      return {...state, isloading: true};
    case 'Loaded':
      return {...state, isloading: false};
    case 'Login':
      storeUser(action.user);
      axiosHelper.setToken(action.user.token);
      return {
        userInfo: action.user,
        status: 'online',
        isloading: false,
      };
    case 'Logout':
      clearUserStorage();
      return {
        userInfo: null,
        status: 'offline',
        isloading: false,
      };
    default:
      return state;
  }
};

export {UserReducer};