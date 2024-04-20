import axios, {AxiosInstance, AxiosRequestConfig, AxiosResponse} from 'axios';

class AxiosHelper {
  private instance: AxiosInstance;

  constructor(serverIP: string) {
    this.instance = axios.create();

    // 设置默认的服务器 IP
    this.setServerIP(serverIP);

    // 添加请求拦截器
    this.instance.interceptors.request.use(
      config => {
        console.log(`发送请求: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      error => {
        console.error('请求拦截器发生错误:', error);
        return Promise.reject(error);
      },
    );

    // 添加响应拦截器
    this.instance.interceptors.response.use(
      response => {
        console.log('响应数据:', response.data);
        return response;
      },
      error => {
        console.error('响应拦截器发生错误:', error);
        return Promise.reject(error);
      },
    );
  }

  public setServerIP(serverIP: string): void {
    this.instance.defaults.baseURL = `http://${serverIP}`;
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
    return this.instance.post<T>(url, data, config);
  }

  // 其他 HTTP 方法的封装方法类似，如 put、delete 等
}

export default AxiosHelper;
