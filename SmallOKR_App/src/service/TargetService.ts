import { useApiService } from '../hooks/useApiService';
import { ITarget } from '../model/OKRModel';

interface ResultFilter {
  targetId: string;
  name: string;
  value: string;
}

const useTargetService = () => {
  const { get, post, deleteRequest } = useApiService();

  // 获取所有目标
  const getTargets = () => {
    return get('/target-service/api/v1/target/get');
  };

  // 保存目标
  const saveTarget = (target: ITarget) => {
    return post('/target-service/api/v1/target/save', target);
  };

  // 删除目标
  const deleteTarget = (targetId: string) => {
    return deleteRequest('/target-service/api/v1/target/delete', { targetId });
  };

  // 获取结果列表
  const getResults = (param?: any) => {
    return get('/target-service/api/v1/result/getAll', param);
  };

  // 保存结果
  const saveResult = (results: ResultFilter[]) => {
    return post('/target-service/api/v1/result/save', results);
  };

  // 删除结果
  const deleteResult = (targetId: string) => {
    return post('/target-service/api/v1/result/delete', { targetId });
  };

  return {
    getTargets,
    saveTarget,
    deleteTarget,
    getResults,
    saveResult,
    deleteResult,
  };
};

export default useTargetService;
