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
import { defaultBusinessUrl, restoredBusinessUrl } from '../common/ApiConfig';
import useUserService from '../service/UserService';
import { eventBus } from '../common/EventBus';
import { USER_EVENTS } from '../common/EventType';

export type UserState = {
  userInfo: User;
  isLoading: boolean;
};
const getInitialBaseURL = () => defaultBusinessUrl;

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
      return { ...state, isLoading: true };
    case 'Loaded':
      return { ...state, isLoading: false, userInfo: action.user };
    case 'Login':
      return {
        userInfo: {
          ...action.user,
          namespaceUrl:
            action.user.namespaceUrl ||
            state.userInfo.namespaceUrl ||
            getInitialBaseURL(),
          status: action.user.token ? 'online' : 'offline',
        },
        isLoading: false,
      };
    case 'Logout':
      return {
        userInfo: {
          ...state.userInfo,
          token: '',
          password: '',
          status: 'offline',
          tenantId: undefined,
          tenantName: undefined,
        },
        isLoading: false,
      };
    case 'UpdateNamespaceUrl':
      return {
        userInfo: { ...state.userInfo, namespaceUrl: action.namespaceUrl },
        isLoading: state.isLoading,
      };
    case 'UpdateToken':
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
  useEffect(() => {
    const expireSession = () => dispatch({ type: 'Logout' });
    eventBus.on(USER_EVENTS.USER_SESSION_EXPIRED, expireSession);
    return () => eventBus.off(USER_EVENTS.USER_SESSION_EXPIRED, expireSession);
  }, []);
  // 初始化加载用户信息
  useEffect(() => {
    // 初始化加载，尝试从存储中获取用户信息，配置信息
    const loadUser = async () => {
      dispatch({ type: 'Loading' });
      const storedUser = await StorageService.getUser();
      if (storedUser) {
        const restoredUser = {
          ...storedUser,
          namespaceUrl: restoredBusinessUrl(storedUser.namespaceUrl),
        };
        // Remembered account details are not an authenticated session.
        if (!restoredUser.token) {
          isInitialized.current = true;
          dispatch({
            type: 'Loaded',
            user: { ...restoredUser, password: '', status: 'offline' },
          });
          return;
        }

        dispatch({
          type: 'UpdateNamespaceUrl',
          namespaceUrl: restoredUser.namespaceUrl,
        });
        const resCheck = await userService.healthCheck(
          restoredUser.namespaceUrl,
        );

        if (!resCheck) {
          dispatch({
            type: 'Loaded',
            user: { ...restoredUser, status: 'offline' },
          });
          return;
        }
        isInitialized.current = true;
        dispatch({ type: 'Login', user: restoredUser });
      } else {
        dispatch({ type: 'Loaded', user: initialState.userInfo });
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
            status: 'offline',
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
