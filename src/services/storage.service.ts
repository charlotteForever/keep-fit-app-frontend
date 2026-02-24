import AsyncStorage from '@react-native-async-storage/async-storage';

export const storageService = {
  setItem: async (key: string, value: string) => {
    await AsyncStorage.setItem(key, value);
  },

  getItem: async (key: string): Promise<string | null> => {
    return await AsyncStorage.getItem(key);
  },

  setObject: async (key: string, value: any) => {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  },

  getObject: async (key: string): Promise<any> => {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  },

  removeItem: async (key: string) => {
    await AsyncStorage.removeItem(key);
  },

  clear: async () => {
    await AsyncStorage.clear();
  },
};
