import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import MainAppScreen from '../screens/MainAppScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import ProfileScreen from '../screens/ProfileScreen';
import FavoritePromotions from '../screens/FavoritePromotions';
import AvailablePromotions from '../screens/Promotions';
import CustomHeader from '../components/CustomHeader';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store/store';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';

export type RootStackParamList = {
  MainAppScreen: undefined;
  Home: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  Profile: undefined;  // Añade el perfil aquí
  FavoritePromotions: undefined;
  AvailablePromotions: undefined;
  ResetPassword: undefined
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const isAuthenticated = useSelector((state: RootState) => !!state.user.accessToken);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={isAuthenticated ? "MainAppScreen" : "Home"} screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
          </>
        ) : (
          <>
            <Stack.Screen
              name="MainAppScreen"
              component={MainAppScreen}
              options={{
                headerShown: true,
                header: () => <CustomHeader />
              }}
            />
            <Stack.Screen
              name="Profile"
              component={ProfileScreen}
              options={{
                headerShown: true,
                headerTitle: 'Perfil',
                headerStyle: { backgroundColor: '#3179BB' },
                headerTintColor: '#fff',
              }}
            />
            <Stack.Screen
              name="FavoritePromotions"
              component={FavoritePromotions}
              options={{
                headerShown: true,
                headerTitle: 'Promociones Favoritas',
                headerStyle: { backgroundColor: '#3179BB' },
                headerTintColor: '#fff',
              }}
            />
            <Stack.Screen
              name="AvailablePromotions"
              component={AvailablePromotions}
              options={{
                headerShown: true,
                headerTitle: 'Promociones Disponibles',
                headerStyle: { backgroundColor: '#3179BB' },
                headerTintColor: '#fff',
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

