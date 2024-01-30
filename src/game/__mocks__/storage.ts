const storage = {};

export const getItem = async (key: string) => {
  return storage[key];
};

export const setItem = async (key: string, value: string) => {
  storage[key] = value;
};
