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
import { AppConfigContext } from '../state/AppConfigContext';
import { API_HOST, API_PORT, API_SCHEME } from '@env';
import useUserService from '../service/UserService';

export type UserState = {
  userInfo: User;
  isLoading: boolean;
};
const getInitialBaseURL = () => `${API_SCHEME}://${API_HOST}:${API_PORT}`;

const initialState: UserState = {
  userInfo: {
    username: '',
    password: '',
    token: '',
    namespaceUrl: getInitialBaseURL(),
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
      console.log('loading');
      return { ...state, isLoading: true };
    case 'Loaded':
      console.log('loaded');
      return { ...state, isLoading: false, userInfo: action.user };
    case 'Login':
      console.log('login', action.user);
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
    case 'UpdateNamespaceUrl':
      console.log('update namespaceUrl: ', action.namespaceUrl);
      return {
        userInfo: { ...state.userInfo, namespaceUrl: action.namespaceUrl },
        isLoading: state.isLoading,
      };
    case 'UpdateToken':
      console.log('update token: ', action.token);
      return {
        userInfo: { ...state.userInfo, token: action.token },
        isLoading: state.isLoading,
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
  const appConfig = useContext(AppConfigContext);
  const userService = useUserService();
  const [state, dispatch] = useReducer(userReducer, initialState);
  const isInitialized = React.useRef(false);
  // 初始化加载用户信息
  useEffect(() => {
    // 初始化加载，尝试从存储中获取用户信息，配置信息
    const loadUser = async () => {
      dispatch({ type: 'Loading' });
      const storedUser = await StorageService.getUser();
      if (storedUser) {
        console.log('Loaded stored user:', storedUser);
        dispatch({
          type: 'UpdateNamespaceUrl',
          namespaceUrl: storedUser.namespaceUrl,
        });
        const resCheck = await userService.healthCheck(storedUser.namespaceUrl);
        console.log('Health check result:', resCheck);
        if (!resCheck) {
          return;
        }
        dispatch({ type: 'Login', user: storedUser });
      }
      isInitialized.current = true;
    };
    loadUser();
  }, [userService]);

  // 同步用户状态到存储
  useEffect(() => {
    if (!isInitialized.current) return;
    switch (state.userInfo?.status) {
      case 'online':
        StorageService.saveUser(state.userInfo);
        break;
      case 'offline':
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
  }, [appConfig.rememberMe, state.userInfo, state.userInfo?.status]);

  return (
    <UserContext.Provider value={state}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserContext.Provider>
  );
}
