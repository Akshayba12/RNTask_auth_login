import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface AuthState {
  token: string | null;
  isLoading: boolean;
}

const initialState: AuthState = {
  token: null,
  isLoading: true,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    clearToken: state => {
      state.token = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const {setToken, clearToken, setLoading} = authSlice.actions;
export default authSlice.reducer;
