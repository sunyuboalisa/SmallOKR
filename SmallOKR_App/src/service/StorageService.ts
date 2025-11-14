import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../model/User';
import { AppConfigState } from '../state/AppConfigContext';

export const storageKeys = {
  userInfo: 'userInfo',
  appConfig: 'appConfig',
};

export const StorageService = {
  async saveUser(user: User) {
    try {
      await AsyncStorage.setItem(storageKeys.userInfo, JSON.stringify(user));
    } catch (e) {
      console.error('保存用户失败:', e);
    }
  },

  async getUser(): Promise<User | null> {
    try {
      const json = await AsyncStorage.getItem(storageKeys.userInfo);
      return json ? (JSON.parse(json) as User) : null;
    } catch (e) {
      console.error('读取用户失败:', e);
      return null;
    }
  },

  async clearUser() {
    try {
      await AsyncStorage.removeItem(storageKeys.userInfo);
    } catch (e) {
      console.error('清除用户失败:', e);
    }
  },

  async saveAppConf(conf: AppConfigState) {
    try {
      await AsyncStorage.setItem(storageKeys.appConfig, JSON.stringify(conf));
    } catch (e) {
      console.error('保存配置失败:', e);
    }
  },
  async getAppConf(): Promise<AppConfigState | null> {
    try {
      const json = await AsyncStorage.getItem(storageKeys.appConfig);
      return json ? (JSON.parse(json) as AppConfigState) : null;
    } catch (e) {
      console.error('读取配置失败:', e);
      return null;
    }
  },
};
