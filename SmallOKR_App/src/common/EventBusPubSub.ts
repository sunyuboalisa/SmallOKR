import { eventBus } from './EventBus';
import { USER_EVENTS } from './EventType';

// 发布用户登录事件
export const publishUserLogin = (userData: {
  username: string;
  token: string;
}) => {
  eventBus.emit(USER_EVENTS.USER_LOGIN, userData);
};

// 发布用户登出事件
export const publishUserLogout = () => {
  eventBus.emit(USER_EVENTS.USER_LOGOUT);
};

// 发布用户注册事件
export const publishUserRegister = (userData: {
  username: string;
  email: string;
}) => {
  eventBus.emit(USER_EVENTS.USER_REGISTER, userData);
};

// 发布用户登录失败事件
export const publishUserLoginFailed = (errorMessage: string) => {
  eventBus.emit(USER_EVENTS.USER_LOGIN_FAILED, errorMessage);
};

// 发布用户错误事件
export const publishUserError = (error: string) => {
  eventBus.emit(USER_EVENTS.USER_ERROR, error);
};

// 发布会话过期事件
export const publishUserSessionExpired = () => {
  eventBus.emit(USER_EVENTS.USER_SESSION_EXPIRED);
};
