import { API_HOST, API_PORT, API_SCHEME } from '@env';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { useEffect, useRef, useContext, useCallback } from 'react';
import { UserContext } from '../state/UserContext';
import { USER_EVENTS } from '../common/EventType';
import { eventBus } from '../common/EventBus';

const API_BASE_URL = `${API_SCHEME}://${API_HOST}:${API_PORT}`;

export const useAxios = () => {
  const userContext = useContext(UserContext);
  const axiosInstanceRef = useRef<AxiosInstance>(
    axios.create({ baseURL: API_BASE_URL }),
  );

  useEffect(() => {
    const axiosInstance = axiosInstanceRef.current;

    const requestInterceptor = axiosInstance.interceptors.request.use(
      config => {
        if (userContext.userInfo?.token) {
          console.log('Setting token in header:', userContext.userInfo.token);
          config.headers.Authorization = `Bearer ${userContext.userInfo.token}`;
        }
        console.log(`Sending request to: ${config.baseURL}${config.url}`);
        return config;
      },
      error => Promise.reject(error),
    );

    // 设置响应拦截器
    const responseInterceptor = axiosInstance.interceptors.response.use(
      response => {
        console.log('Response body:', response.data);
        return response;
      },
      error => {
        if (error.response && error.response.status === 401) {
          console.info('Authentication failed. Logging out...');
          eventBus.emit(USER_EVENTS.USER_SESSION_EXPIRED);
        }
        return Promise.reject(error);
      },
    );

    // 清除拦截器
    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor);
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, [userContext.userInfo?.token]);

  // 发送请求
  const axiosRequest = useCallback(
    <T = any>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
      const axiosInstance = axiosInstanceRef.current;
      return axiosInstance(config);
    },
    [],
  );

  const updateBaseURL = (newBaseURL: string) => {
    axiosInstanceRef.current.defaults.baseURL = newBaseURL;
    console.log('Updated Axios baseURL to:', newBaseURL);
  };

  return { axiosRequest, updateBaseURL };
};
