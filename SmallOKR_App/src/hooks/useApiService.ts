import { AxiosRequestConfig } from 'axios';
import { useAxios } from './useAxios';

export const useApiService = () => {
  const { axiosRequest } = useAxios();

  // 通用的请求方法
  const sendRequest = <T = any>(
    method: string,
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ) => {
    return axiosRequest<T>({ method, url, data, ...config });
  };

  // 简化后的 GET 请求
  const get = <T = any>(
    url: string,
    params?: Record<string, any>,
    config?: AxiosRequestConfig,
  ) => {
    return sendRequest<T>('GET', url, undefined, { params, ...config });
  };

  // 简化后的 POST 请求
  const post = <T = any>(
    url: string,
    data: any,
    config?: AxiosRequestConfig,
  ) => {
    return sendRequest<T>('POST', url, data, config);
  };

  // 简化后的 PUT 请求
  const put = <T = any>(
    url: string,
    data: any,
    config?: AxiosRequestConfig,
  ) => {
    return sendRequest<T>('PUT', url, data, config);
  };

  // 简化后的 DELETE 请求
  const deleteRequest = <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ) => {
    return sendRequest<T>('DELETE', url, data, config);
  };

  return {
    sendRequest,
    get,
    post,
    put,
    deleteRequest,
  };
};
