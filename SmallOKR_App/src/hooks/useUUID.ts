import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { useCallback } from 'react';

/**
 * 专门用于生成符合数据库主键要求的 UUID Hook
 * 特性：去掉横杠、保持原子性、高性能
 */
export const useUUID = () => {
  // 使用 useCallback 保证函数引用稳定
  const generateUUID = useCallback((): string => {
    // 1. 生成标准的 v4 UUID (例如: "550e8400-e29b-41d4-a716-446655440000")
    // 2. 使用正则去掉所有 "-"
    // 3. 返回 32 位纯十六进制字符串
    return uuidv4().replace(/-/g, '');
  }, []);

  return { generateUUID };
};
