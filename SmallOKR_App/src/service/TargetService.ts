import { useApiService } from '../hooks/useApiService';
import { ITarget } from '../model/OKRModel';
import React from 'react';

interface ResultFilter {
  targetId: string;
  name: string;
  value: string;
}

const useTargetService = () => {
  const { get, post, deleteRequest } = useApiService();

  // 1. 使用 useMemo 确保返回的服务对象是稳定的
  const targetService = React.useMemo(() => {
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
      return deleteRequest('/target-service/api/v1/target/delete', {
        targetId,
      });
    };

    // 获取结果列表
    const getResults = (param?: any) => {
      console.log(param);
      return get('/target-service/api/v1/result/getAll', param);
    };

    // 保存结果
    const saveResult = (results: ResultFilter[]) => {
      return post('/target-service/api/v1/result/save', results);
    };

    // 删除结果
    const deleteResult = (resultId: string) => {
      return deleteRequest('/target-service/api/v1/result/delete', {
        resultId,
      });
    };

    return {
      getTargets,
      saveTarget,
      deleteTarget,
      getResults,
      saveResult,
      deleteResult,
    };
  }, [get, post, deleteRequest]); // 依赖数组：只有当 get/post/deleteRequest 引用变化时，才重新创建服务对象

  return targetService;
};

export default useTargetService;
