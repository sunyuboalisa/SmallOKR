import { useApiService } from '../hooks/useApiService';
import React from 'react'; // 👈 必须导入 React 来使用 useMemo
interface TodoRepeat {
  todoRepeatId?: string; // ID通常可选，因为新增时前端可能不传
  todoId: string;
  repeatId: string;
}

const useTodoService = () => {
  const { get, post, deleteRequest } = useApiService();

  const todoService = React.useMemo(() => {
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
    const addRepeat = (todoRepeatList: TodoRepeat[]) => {
      return post('/api/v1/todo/addRepeat', todoRepeatList);
    };

    // 删除重复 Todo
    const deleteRepeat = (todoRepeatIds: string[]) => {
      return deleteRequest('/api/v1/todo/deleteRepeat', undefined, {
        data: todoRepeatIds,
      });
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
  }, [get, post, deleteRequest]); // 依赖 useApiService 返回的稳定引用

  return todoService;
};

export default useTodoService;
