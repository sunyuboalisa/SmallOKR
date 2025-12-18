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
import React from 'react';

const useUserService = () => {
  const { get, sendRequest } = useApiService();
  const dispatch = useContext(UserDispatchContext);
  const userService = React.useMemo(() => {
    const send = (param: { email: string }) => {
      return sendRequest('post', '/api/v1/user/send', param);
    };

    const login = async (param: { username: string; password: string }) => {
      try {
        const response = await sendRequest(
          'post',
          '/api/v1/user/signin',
          param,
        );
        const token = response.data.data;
        if (!token) {
          console.log('用户名或者密码错误');
          return;
        }
        dispatch({
          type: 'Login',
          user: {
            username: param.username,
            password: param.password,
            token: token,
            namespaceUrl: '',
            status: 'online',
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
        const response = await sendRequest(
          'post',
          '/api/v1/user/signup',
          param,
        );
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

    const healthCheck = async (baseURL: string) => {
      try {
        // 显式拼接完整的 URL
        const fullUrl = `${baseURL}/api/v1/user/health`;
        const response = await get(
          fullUrl,
          {},
          { baseURL: '' }, // 这一行会覆盖掉实例中的任何默认 baseURL
        );
        if (response.status === 200) {
          console.log('Health check successful');
          return true;
        } else {
          console.log('Health check failed with status:', response.status);
          return false;
        }
      } catch (error) {
        console.log('Health check failed with error:', error);
        return false;
      }
    };
    return {
      send,
      login,
      logout,
      signup,
      changePassword,
      healthCheck,
    };
  }, [get, sendRequest, dispatch]);

  return userService;
};

export default useUserService;
