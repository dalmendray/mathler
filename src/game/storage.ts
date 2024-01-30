import AsyncStorage from "@react-native-async-storage/async-storage";

export const getItem = async (key: string) => {
  return await AsyncStorage.getItem(key);
};

export const setItem = async (key: string, value: string) => {
  return await AsyncStorage.setItem(key, value);
};
