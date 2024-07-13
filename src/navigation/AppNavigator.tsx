import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import MainAppScreen from '../screens/MainAppScreen';

export type RootStackParamList = {
    MainAppScreen: undefined;
    Home: undefined;
    Login: undefined;
    Register: undefined;
  };
const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="MainAppScreen" component={MainAppScreen} />
        {/* Agrega más pantallas según sea necesario */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;