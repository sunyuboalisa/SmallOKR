import { useRef, useCallback, useContext } from 'react';
import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosHeaders,
} from 'axios';
import { publishUserSessionExpired } from '../common/EventBusPubSub';
import { UserContext } from '../state/UserContext';
import { useLoadingActions } from './useLoadingLayer';

export const useAxios = () => {
  const { beginRequest, endRequest } = useLoadingActions();
  const { userInfo } = useContext(UserContext);
  const { namespaceUrl, token } = userInfo;
  const axiosRef = useRef<AxiosInstance | null>(null);
  const pending = useRef(new Map<string, Promise<AxiosResponse<any>>>());

  const axiosRequest = useCallback(
    <T = any>(
      config: AxiosRequestConfig & { requestKey?: string },
    ): Promise<AxiosResponse<T>> => {
      if (!axiosRef.current)
        axiosRef.current = axios.create({ timeout: 15000 });
      const headers = new AxiosHeaders(
        config.headers as ConstructorParameters<typeof AxiosHeaders>[0],
      );
      if (token) headers.set('Authorization', `Bearer ${token}`);
      else headers.delete('Authorization');

      // Share only identical concurrent reads. Mutations and independently cancellable
      // requests must retain their own lifecycle; completed responses are never cached.
      const shareRead =
        (config.method || 'GET').toUpperCase() === 'GET' &&
        !config.signal &&
        !config.cancelToken &&
        !config.adapter &&
        !config.transformResponse;
      const key = shareRead
        ? JSON.stringify({
            ...config,
            baseURL: config.baseURL ?? namespaceUrl,
            headers,
          })
        : undefined;
      if (key) {
        const existing = pending.current.get(key);
        if (existing) return existing;
      }

      if (config.showLoading !== false) beginRequest();
      const request = axiosRef.current
        .request<T>({ baseURL: namespaceUrl, ...config, headers })
        .catch(error => {
          // There is no refresh-token endpoint: replaying an unauthorized request
          // with the same token only doubles traffic and delays the login prompt.
          if (
            token &&
            error.response?.status === 401
          ) {
            publishUserSessionExpired();
          }
          throw error;
        })
        .finally(() => {
          if (key) pending.current.delete(key);
          if (config.showLoading !== false) endRequest();
        });
      if (key) pending.current.set(key, request);
      return request;
    },
    [namespaceUrl, token, beginRequest, endRequest],
  );
  return { axiosRequest };
};
