import axios, {AxiosInstance, AxiosRequestConfig, AxiosResponse} from 'axios';
import {useContext} from 'react';
import {Alert} from 'react-native';
import {UserDispatchContext} from '../state/UserContext';

class AxiosHelper {
  private token: string;
  private instance: AxiosInstance;

  constructor(serverIP: string) {
    this.instance = axios.create();
    this.token = '';
    // 设置默认的服务器 IP
    this.setServerIP(serverIP);

    // 添加请求拦截器
    this.instance.interceptors.request.use(
      config => {
        console.log(
          `发送${config.method?.toUpperCase()}请求:  ${config.baseURL}/${
            config.url
          }`,
        );
        console.log('请求体：', config.data);
        if (this.token !== '') {
          config.headers.Authorization = 'Bearer ' + this.token;
        }
        return config;
      },
      error => {
        console.error('请求拦截器发生错误:', error);
        return Promise.reject(error);
      },
    );

    //添加响应拦截器
    this.instance.interceptors.response.use(
      response => {
        console.log('响应数据:', response.data);
        return response;
      },
      error => {
        if (error.status === 401) {
          Alert.alert('用户登录过期');
          const dispatch = useContext(UserDispatchContext);
          dispatch({type: 'Logout'});
        }
        console.error('响应拦截器发生错误:', error);
        return Promise.reject(error);
      },
    );
  }

  public setServerIP(domain: string): void {
    this.instance.defaults.baseURL = `http://${domain}`;
  }

  public setToken(token: string) {
    this.token = token;
  }

  public get<T = any>(url: string, params?: any): Promise<AxiosResponse<T>> {
    try {
      return this.instance.get<T>(url, {params});
    } catch (error) {
      throw error;
    }
  }

  public post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.instance.post<T>(url, data, {
      ...config,
      headers: {'Content-Type': 'application/json'},
    });
  }

  public delete<T = any>(url: string, params?: any): Promise<AxiosResponse<T>> {
    return this.instance.delete<T>(url, {
      headers: {'Content-Type': 'application/json'},
      params: params,
    });
  }
}

export const axiosHelper = new AxiosHelper('47.94.97.3:8080');
