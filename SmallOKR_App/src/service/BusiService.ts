import AsyncStorage from '@react-native-async-storage/async-storage';
import {axiosHelper} from '../util/AxiosHelper';
import {User} from '../model/User';
import {ITarget} from '../model/OKRModel';

interface ResultFilter {
  targetId: string;
  name: string;
  value: string;
}

const UserService = {
  login: (param: {username: String; password: String}) => {
    return axiosHelper.post('/api/v1/user/signin', param);
  },
  logout: () => {
    return axiosHelper.post('');
  },
  getToken: async () => {
    //   try {
    //     let userInfo = await AsyncStorage.getItem('userInfo');
    //     if (userInfo !== null) {
    //       // let data = JSON.parse(userInfo);
    //     }
    //     console.log('从本地获取用户信息：', userInfo);
    //   } catch (error) {
    //     console.log('从本地获取用户信息时出错：', error);
    //   }
  },
  storeToken: async (user: User) => {
    try {
      //await AsyncStorage.setItem('userInfo', JSON.stringify(user));
      //console.log('保存用户信息到本地时：', user);
    } catch (error) {
      //console.log('保存用户信息到本地时出错：', error);
    }
  },
};

const TargetService = {
  getTargets: () => {
    return axiosHelper.get('target-service/api/v1/target/get');
  },
  addTarget: (target: ITarget) => {
    return axiosHelper.post('target-service/api/v1/target/save', target);
  },
  deleteTarget: (targetId: String) => {
    return axiosHelper.delete('target-service/api/v1/target/delete', targetId);
  },
  getResults: (param?: any) => {
    return axiosHelper.get('target-service/api/v1/result/getAll', param);
  },
  addResult: (results: ResultFilter[]) => {
    return axiosHelper.post('target-service/api/v1/result/save', results);
  },
  deleteResult: (targetId: String) => {
    return axiosHelper.post('target-service/api/v1/result/delete', targetId);
  },
};

const TodoService = {
  getTodos: () => {
    return axiosHelper.get('/api/v1/todo/get');
  },
  AddOrSaveTodo: (todo: any) => {
    return axiosHelper.post('/api/v1/todo/add', todo);
  },
  deleteTodo: (todoId: String) => {
    return axiosHelper.post('/api/v1/todo/delete', todoId);
  },
};

export {UserService, TargetService, TodoService};
