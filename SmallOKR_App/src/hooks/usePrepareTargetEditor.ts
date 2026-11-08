import { useCallback, useEffect, useRef } from 'react';
import { Alert } from 'react-native';
import { ITarget } from '../model/OKRModel';
import useTargetService from '../service/TargetService';

export function usePrepareTargetEditor() {
  const service = useTargetService();
  const opening = useRef(false);
  const active = useRef(true);

  useEffect(() => {
    active.current = true;
    return () => {
      active.current = false;
    };
  }, []);

  return useCallback(
    async (target: ITarget, isNew = false) => {
      if (opening.current) return;
      opening.current = true;
      try {
        const response = isNew
          ? undefined
          : await service.getResults({ targetId: target.id });
        if (!active.current) return;
        const results = isNew ? [] : response?.data.data;
        if (
          (!isNew && String(response?.data.code) !== '200') ||
          !Array.isArray(results)
        ) {
          throw new Error('Unable to load stage results');
        }
        return { target, initialResults: results };
      } catch {
        if (active.current)
          Alert.alert('无法打开目标', '阶段成果加载失败，请重试');
      } finally {
        opening.current = false;
      }
    },
    [service],
  );
}
