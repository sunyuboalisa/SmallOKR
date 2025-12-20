import { useApiService } from '../hooks/useApiService';
import {
  publishUserRegister,
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
        } else {
          console.log('Login successful, token:', token);
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
        return response;
      } catch (error) {
        throw error;
      }
    };

    const logout = async () => {
      try {
        const response = await sendRequest('post', '/api/v1/user/logout');
        if (response.status === 200) {
          console.log('Logout successful');
          dispatch({ type: 'Logout' });
        } else {
          console.log('Logout failed with status:', response.status);
        }
        return response;
      } catch (error) {
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
        const response = await get(fullUrl, {}, { baseURL: '' });
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
