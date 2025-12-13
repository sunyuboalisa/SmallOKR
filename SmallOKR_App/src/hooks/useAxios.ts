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

// 待实现的 Token 刷新函数
const refreshToken = async (): Promise<string> => {
  // 假设这个函数会调用刷新 API 并返回一个新的 Token
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

  // 1. 优化：getAxios 只依赖 baseURL
  const getAxios = useCallback((): AxiosInstance => {
    if (!axiosRef.current) {
      axiosRef.current = axios.create({ baseURL });
    } else {
      // 保持实例的 baseURL 是最新的
      axiosRef.current.defaults.baseURL = baseURL;
    }
    return axiosRef.current!;
  }, [baseURL]);

  useEffect(() => {
    const instance = getAxios();

    // 移除旧拦截器
    if (requestInterceptorId.current !== null) {
      instance.interceptors.request.eject(requestInterceptorId.current);
    }
    if (responseInterceptorId.current !== null) {
      instance.interceptors.response.eject(responseInterceptorId.current);
    }

    // 2. 请求拦截器：动态注入 token 和控制加载状态
    requestInterceptorId.current = instance.interceptors.request.use(config => {
      // 保证 Headers 是 AxiosHeaders 类型
      if (!(config.headers instanceof AxiosHeaders)) {
        config.headers = new AxiosHeaders(config.headers);
      }

      // 注入 Token（这里使用闭包中的最新 token 值）
      if (token) {
        config.headers.set('Authorization', `Bearer ${token}`);
      } else {
        config.headers.delete('Authorization');
      }

      // 开启加载层
      loading.setLoading(true);
      return config;
    });

    // 3. 响应拦截器：处理错误、Token 刷新和关闭加载状态
    responseInterceptorId.current = instance.interceptors.response.use(
      res => {
        // 成功响应时关闭加载层
        loading.setLoading(false);
        return res;
      },
      async error => {
        // 错误响应时关闭加载层
        loading.setLoading(false);

        const originalRequest = error.config;
        if (
          (error.response?.status === 401 || error.response?.status === 403) &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true;
          try {
            // Token 刷新逻辑（需要启用）
            // const newToken = await refreshToken();
            // setToken(newToken);
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
  }, [token, getAxios, loading]);

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
        const response = await instance(config);
        return response as AxiosResponse<T>;
      } finally {
        requestedRef.current.delete(key);
      }
    },
    [getAxios],
  );

  const updateToken = useCallback((newToken: string) => {
    setToken(newToken);
  }, []);

  const updateBaseURL = useCallback(
    (newBaseURL: string) => setBaseURL(newBaseURL),
    [],
  );

  return {
    axiosRequest,
    updateToken,
    updateBaseURL,
    token,
    baseURL,
  };
};
