import {useEffect} from 'react';
import {getToken} from '../services/tokenService';
import {useAppDispatch} from '../store/store';
import {setToken, setLoading} from '../features/auth/authSlice';
import { ActivityIndicator } from 'react-native';

const SplashScreen = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      const token = await getToken();
      if (token) {
        dispatch(setToken(token));
      }
      dispatch(setLoading(false));
    };
    checkAuth();
  }, []);

  return <ActivityIndicator />;
};

export default SplashScreen;
