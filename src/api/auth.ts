import api from './client';
import * as SecureStore from 'expo-secure-store';

export const login = async (email: string, password: string) => {
  const res = await api.post('/auth/login', {email, password});
  const {accessToken} = res.data;
  await SecureStore.setItemAsync('accessToken', accessToken);
  return accessToken;
};

export const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const refreshToken = await SecureStore.getItemAsync('refreshToken');
    if (!refreshToken) {
      return null;
    }
    const res = await api.post('/auth/refresh', {refreshToken});
    const {accessToken} = res.data;
    await SecureStore.setItemAsync('accessToken', accessToken);
    return accessToken;
  } catch {
    return null;
  }
};
