import { useApiService } from '../hooks/useApiService';

const useTodoService = () => {
  const { get, post, deleteRequest } = useApiService();

  // 获取所有 Todos
  const getTodos = () => {
    return get('/api/v1/todo/get');
  };

  // 根据日期获取 Todos
  const getTodosByDate = (date: string) => {
    return get('/api/v1/todo/getTodoByWeekDay', { date });
  };

  // 添加或保存 Todo
  const addOrSaveTodo = (todo: any) => {
    return post('/api/v1/todo/add', todo);
  };

  // 删除 Todo
  const deleteTodo = (todoId: string) => {
    return deleteRequest('/api/v1/todo/delete', { todoId });
  };

  // 获取重复字典项
  const getRepeatDicEntrys = () => {
    return get('/api/v1/todo/dic/get', { dicName: 'repeat_dic' });
  };

  // 添加重复 Todo
  const addRepeat = (todoRepeat: { todoId: string; repeatId: string }) => {
    return post('/api/v1/todo/addRepeat', todoRepeat);
  };

  // 删除重复 Todo
  const deleteRepeat = (todoRepeat: { todoId: string; repeatId: string }) => {
    return deleteRequest('/api/v1/todo/deleteRepeat', todoRepeat);
  };

  // 获取重复 Todo
  const getRepeat = (todoId: string) => {
    return get('/api/v1/todo/getRepeat', { todoId });
  };

  return {
    getTodos,
    getTodosByDate,
    addOrSaveTodo,
    deleteTodo,
    getRepeatDicEntrys,
    addRepeat,
    deleteRepeat,
    getRepeat,
  };
};

export default useTodoService;
