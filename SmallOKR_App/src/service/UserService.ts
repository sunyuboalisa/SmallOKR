import { useApiService } from '../hooks/useApiService';
import {
  publishUserLogin,
  publishUserLogout,
  publishUserRegister,
  publishUserLoginFailed,
  publishUserError,
} from '../common/EventBusPubSub';
import { useContext } from 'react';
import { UserDispatchContext } from '../state/UserContext';

const useUserService = () => {
  const { get, sendRequest } = useApiService();
  const dispatch = useContext(UserDispatchContext);
  const send = (param: { email: string }) => {
    return sendRequest('post', '/api/v1/user/send', param);
  };

  const login = async (param: { username: string; password: string }) => {
    try {
      const response = await sendRequest('post', '/api/v1/user/signin', param);
      const token = response.data.data;
      dispatch({
        type: 'Login',
        user: {
          username: param.username,
          password: param.password,
          token: token,
          namespaceUrl: '',
        },
      });
      publishUserLogin({ username: param.username, token }); // 发布用户登录事件
      return response;
    } catch (error) {
      publishUserLoginFailed('Invalid username or password'); // 登录失败，发布登录失败事件
      throw error;
    }
  };

  const logout = async () => {
    try {
      const response = await sendRequest('post', '/api/v1/user/logout');
      dispatch({ type: 'Logout' });
      publishUserLogout(); // 发布用户登出事件
      return response;
    } catch (error) {
      publishUserError('Logout failed'); // 发布用户错误事件
      throw error;
    }
  };

  const signup = async (param: {
    username: string;
    password: string;
    email: string;
  }) => {
    try {
      const response = await sendRequest('post', '/api/v1/user/signup', param);
      publishUserRegister(param); // 注册成功，发布用户注册事件
      return response;
    } catch (error) {
      publishUserError('Signup failed'); // 发布用户错误事件
      throw error;
    }
  };

  const changePassword = async (param: {
    newPassword: string;
    username?: string;
    currentPassword?: string;
    code?: string;
    email?: string;
  }) => {
    try {
      const response = await sendRequest(
        'post',
        '/api/v1/user/change-password',
        param,
      );
      return response;
    } catch (error) {
      publishUserError('Password change failed'); // 发布用户错误事件
      throw error;
    }
  };

  const helthCheck = async () => {
    try {
      const response = await get('/api/v1/user/health');
      return response;
    } catch (error) {
      publishUserError('Health check failed'); // 发布用户错误事件
      throw error;
    }
  };
  return {
    send,
    login,
    logout,
    signup,
    changePassword,
    helthCheck,
  };
};

export default useUserService;
