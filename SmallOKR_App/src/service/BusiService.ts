import {axiosHelper} from '../util/AxiosHelper';
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
};

const TargetService = {
  getTargets: () => {
    return axiosHelper.get('target-service/api/v1/target/get');
  },
  addTarget: (target: ITarget) => {
    return axiosHelper.post('target-service/api/v1/target/save', target);
  },
  deleteTarget: (targetId: String) => {
    return axiosHelper.delete('target-service/api/v1/target/delete', {
      targetId: targetId,
    });
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
  getTodosByDate: (date: string) => {
    return axiosHelper.get('/api/v1/todo/getTodoByWeekDay', {date: date});
  },
  AddOrSaveTodo: (todo: any) => {
    return axiosHelper.post('/api/v1/todo/add', todo);
  },
  deleteTodo: (todoId: String) => {
    return axiosHelper.delete('/api/v1/todo/delete', {todoId: todoId});
  },
  getRepeatDicEntrys: () => {
    return axiosHelper.get('/api/v1/todo/dic/get', {dicName: 'repeat_dic'});
  },
  addRepeat: (todoRepeat: {todoId: string; repeatId: string}) => {
    return axiosHelper.post('/api/v1/todo/addRepeat', todoRepeat);
  },
  deleteRepeat: (todoRepeat: {todoId: string; repeatId: string}) => {
    return axiosHelper.delete('/api/v1/todo/deleteRepeat', todoRepeat);
  },
  getRepeat: (todoId: string) => {
    return axiosHelper.get('/api/v1/todo/getRepeat', {todoId: todoId});
  },
};

export {UserService, TargetService, TodoService};
