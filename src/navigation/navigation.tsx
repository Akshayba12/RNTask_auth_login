import {NavigationContainer} from '@react-navigation/native';
import {useAppSelector} from '../store/store';
import AppStack from './AppStack';
import AuthStack from './AuthStack';
import SplashScreen from '../screens/SplashScreen';

const Navigation = () => {
  const {token, isLoading} = useAppSelector(state => state.auth);
  if (isLoading) {
    return <SplashScreen />;
  }
  return (
    <NavigationContainer>
      {token ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default Navigation;
