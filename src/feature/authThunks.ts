import {createAsyncThunk} from '@reduxjs/toolkit';
import {setToken} from './authSlice';
import {login} from '../api/auth';

interface LoginPayload {
  email: string;
  password: string;
}

export const loginThunk = createAsyncThunk(
  'auth/login',
  async ({email, password}: LoginPayload, {dispatch}) => {
    const token = await login(email, password);
    dispatch(setToken(token));
    return token;
  },
);
