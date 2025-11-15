import { API_HOST, API_PORT, API_SCHEME } from '@env';
import { useState, useRef, useCallback, useEffect, useContext } from 'react';
import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosHeaders,
} from 'axios';
import { publishUserSessionExpired } from '../common/EventBusPubSub';
import { UserContext } from '../state/UserContext';
import { useLoadingLayer } from './useLoadingLayer';

// 初始化 baseURL
const getInitialBaseURL = () =>
  `${API_SCHEME || 'https'}://${API_HOST || 'test.alisacloud.com'}:${
    API_PORT || '443'
  }`;

// 你需要自己实现刷新 token 的逻辑
const refreshToken = async (): Promise<string> => {
  // 这里放你的刷新 token 接口
  // return newToken
  throw new Error('refreshToken function not implemented');
};

export const useAxios = () => {
  const loading = useLoadingLayer();
  const user = useContext(UserContext);
  const [baseURL, setBaseURL] = useState<string>(getInitialBaseURL());
  const [token, setToken] = useState<string>(user.userInfo?.token || '');

  const axiosRef = useRef<AxiosInstance | null>(null);
  const requestInterceptorId = useRef<number | null>(null);
  const responseInterceptorId = useRef<number | null>(null);

  // 获取或创建单例 axios 实例
  const getAxios = useCallback((): AxiosInstance => {
    if (!axiosRef.current) {
      axiosRef.current = axios.create({ baseURL });
    } else {
      axiosRef.current.defaults.baseURL = baseURL;
    }
    return axiosRef.current!;
  }, [baseURL]);

  useEffect(() => {
    const instance = getAxios();
    console.log('token value:', token);
    // 移除旧拦截器
    if (requestInterceptorId.current !== null) {
      instance.interceptors.request.eject(requestInterceptorId.current);
    }
    if (responseInterceptorId.current !== null) {
      instance.interceptors.response.eject(responseInterceptorId.current);
    }

    // 请求拦截器，动态注入 token
    requestInterceptorId.current = instance.interceptors.request.use(config => {
      if (!(config.headers instanceof AxiosHeaders)) {
        config.headers = new AxiosHeaders(config.headers);
      }
      if (token) {
        config.headers.set('Authorization', `Bearer ${token}`);
      } else {
        config.headers.delete('Authorization');
      }
      return config;
    });

    responseInterceptorId.current = instance.interceptors.response.use(
      res => {
        console.log('response interceptor', res);
        return res;
      },
      async error => {
        const originalRequest = error.config;
        if (
          (error.response?.status === 401 || error.response?.status === 403) &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true;
          try {
            // const newToken = await refreshToken();
            // setToken(newToken); // 更新状态
            // instance.defaults.headers.common[
            //   'Authorization'
            // ] = `Bearer ${newToken}`;
            return instance(originalRequest);
          } catch {
            publishUserSessionExpired();
          }
        }
        return Promise.reject(error);
      },
    );

    return () => {
      if (requestInterceptorId.current !== null) {
        instance.interceptors.request.eject(requestInterceptorId.current);
      }
      if (responseInterceptorId.current !== null) {
        instance.interceptors.response.eject(responseInterceptorId.current);
      }
    };
  }, [token, getAxios]);

  // 单请求防重复
  const requestedRef = useRef<Set<string>>(new Set());

  const axiosRequest = useCallback(
    async <T = any>(config: AxiosRequestConfig & { requestKey?: string }) => {
      const key = config.requestKey || JSON.stringify(config);
      if (requestedRef.current.has(key)) {
        return Promise.reject(new Error('Request already sent'));
      }

      requestedRef.current.add(key);
      try {
        const instance = getAxios();
        loading.setLoading(true);
        const response = await instance(config);
        return response as AxiosResponse<T>;
      } finally {
        requestedRef.current.delete(key);
        loading.setLoading(false);
      }
    },
    [getAxios],
  );

  const updateToken = useCallback(
    (newToken: string) => {
      setToken(newToken);
    },
    [token],
  );

  const updateBaseURL = useCallback(
    (newBaseURL: string) => setBaseURL(newBaseURL),
    [baseURL],
  );

  return {
    axiosRequest,
    updateToken,
    updateBaseURL,
    token,
    baseURL,
  };
};
