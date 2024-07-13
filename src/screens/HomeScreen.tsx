import React, { useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getUserData } from '../utils/storage';
import { RootStackParamList } from '../navigation/AppNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootState } from '../redux/store/store';
import { useDispatch, useSelector } from 'react-redux';

type homeScreenProp = StackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen = () => {

  const dispatch = useDispatch();
  const navigation = useNavigation<homeScreenProp>();
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
  const userData = useSelector((state: RootState) => state.user.userData);
  userData

  useEffect(() => {
    checkUserLoggedIn();
    console.log("isLoggedIn", isLoggedIn);
    console.log("userData", userData);
  }, []);

  const checkUserLoggedIn = async () => {
    const userData = await getUserData();
    if (userData && userData.email && userData.password) {
      // El usuario está autenticado, navegar a la pantalla principal de la aplicación
      navigation.navigate('MainAppScreen'); 
    }
  };

  return (
    <View style={styles.container}>
        {isLoggedIn ? (
        <View>
          <Text>Bienvenido de nuevo!</Text>
          <Button title="Ir a la aplicación principal" onPress={() => navigation.navigate('MainAppScreen')} />
        </View>
      ) : (
        <View>
          <Button title="Iniciar Sesión" onPress={() => navigation.navigate('Login')} />
          <Button title="Registrarse" onPress={() => navigation.navigate('Register')} />
        </View>
      )}
      
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      display:'flex',
      justifyContent:"space-around",
      alignItems: 'center',
      flexDirection:'column',
      height:"100%"
    },
    buttonContainer: {
      marginBottom: 10,
    //   width: '100%',
      borderStyle:'solid',
      borderWidth:1,
      borderColor:"#1976D2",
      color:"#1976D2",
      borderRadius:5
    },
    text:{
        marginBottom: 5,
        fontWeight:"700"
    }
  });

export default HomeScreen;
