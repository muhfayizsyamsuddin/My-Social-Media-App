import { getItemAsync, setItemAsync, deleteItemAsync } from "expo-secure-store";

export const getSecure = async (key) => {
  return await getItemAsync(key);
};

export const setSecure = async (key, value) => {
  return await setItemAsync(key, value);
};

export const deleteSecure = async (key) => {
  return await deleteItemAsync(key);
};
