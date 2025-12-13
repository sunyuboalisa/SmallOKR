import React, {
  createContext,
  useEffect,
  useReducer,
  Dispatch,
  useContext,
} from 'react';
import { User } from '../model/User';
import { UserAction } from './Actions';
import { StorageService } from '../service/StorageService';
import { useAxios } from '../hooks/useAxios';
import { AppConfigContext } from '../state/AppConfigContext';

export type UserState = {
  userInfo: User;
  isLoading: boolean;
};

const initialState: UserState = {
  userInfo: {
    username: '',
    password: '',
    token: '',
    namespaceUrl: '',
    status: 'offline',
  },
  isLoading: true,
};

export const UserContext = createContext<UserState>(initialState);
export const UserDispatchContext = createContext<Dispatch<UserAction>>(
  (() => {}) as Dispatch<UserAction>,
);

// reducer 是纯函数：只管状态，不管副作用
function userReducer(state: UserState, action: UserAction): UserState {
  switch (action.type) {
    case 'Loading':
      return { ...state, isLoading: true };
    case 'Loaded':
      return { ...state, isLoading: false };
    case 'Login':
      console.log('login');
      return {
        userInfo: { ...action.user, status: 'online' },
        isLoading: false,
      };
    case 'Logout':
      console.log('logout');
      return {
        userInfo: { ...state.userInfo, status: 'offline' },
        isLoading: false,
      };
    default:
      return state;
  }
}

export function UserContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { updateToken } = useAxios();
  const appConfig = useContext(AppConfigContext);
  const [state, dispatch] = useReducer(userReducer, initialState);
  // 初始化加载
  useEffect(() => {
    const loadUser = async () => {
      dispatch({ type: 'Loading' });
      const storedUser = await StorageService.getUser();
      if (storedUser) dispatch({ type: 'Login', user: storedUser });
    };
    loadUser();
  }, []);

  useEffect(() => {
    switch (state.userInfo?.status) {
      case 'online':
        updateToken(state.userInfo?.token || '');
        StorageService.saveUser(state.userInfo);
        break;
      case 'offline':
        updateToken('');
        if (appConfig.rememberMe) {
          const userToStore: User = {
            username: state.userInfo?.username || '',
            password: '',
            token: '',
            namespaceUrl: state.userInfo?.namespaceUrl || '',
            status: 'online',
          };
          StorageService.saveUser(userToStore);
        } else {
          StorageService.clearUser();
        }
        break;
      default:
        break;
    }
  }, [
    appConfig.rememberMe,
    state.userInfo,
    state.userInfo?.status,
    updateToken,
  ]);

  return (
    <UserContext.Provider value={state}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserContext.Provider>
  );
}
