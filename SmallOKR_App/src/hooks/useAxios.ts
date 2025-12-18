import { useRef, useCallback, useEffect, useContext } from 'react';
import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosHeaders,
} from 'axios';
import { publishUserSessionExpired } from '../common/EventBusPubSub';
import { UserContext } from '../state/UserContext';
import { useLoadingLayer } from './useLoadingLayer';

export const useAxios = () => {
  const loading = useLoadingLayer();
  const user = useContext(UserContext);

  const axiosRef = useRef<AxiosInstance | null>(null);
  const requestInterceptorId = useRef<number | null>(null);
  const responseInterceptorId = useRef<number | null>(null);

  const getAxios = useCallback((): AxiosInstance => {
    if (!axiosRef.current) {
      axiosRef.current = axios.create({ baseURL: user.userInfo?.namespaceUrl });
    } else {
      // 保持实例的 baseURL 是最新的
      axiosRef.current.defaults.baseURL = user.userInfo?.namespaceUrl;
    }
    console.log('Axios baseURL:', axiosRef.current.defaults.baseURL);
    return axiosRef.current!;
  }, [user.userInfo?.namespaceUrl]);

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
      if (user.userInfo?.token) {
        config.headers.set('Authorization', `Bearer ${user.userInfo.token}`);
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
  }, [getAxios, loading, user.userInfo.token]);

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

  return {
    axiosRequest,
  };
};
