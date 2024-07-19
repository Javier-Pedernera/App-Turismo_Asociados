import React, { useEffect } from 'react';
import { View, Text, Button, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getUserData } from '../utils/storage';
import { RootStackParamList } from '../navigation/AppNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppDispatch, RootState } from '../redux/store/store';
import { useDispatch, useSelector } from 'react-redux';
import { UserData } from '../redux/types/types';
import { setUser } from '../redux/reducers/userReducer';

type homeScreenProp = StackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<homeScreenProp>();
  const userData = useSelector((state: RootState) => state.user.userData) as UserData;
  const isLoggedIn = userData?.email;

  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  const checkUserLoggedIn = async () => {
    const storedUserData = await getUserData();
    if (storedUserData) {
      dispatch(setUser(storedUserData));
      navigation.navigate('MainAppScreen');
    }
  };

  return (
    <View style={styles.container}>
        {isLoggedIn ? (
        <View style={styles.container}>
          <Text>Bienvenido de nuevo!</Text>
          <Image source={require('../../assets/images/logo.png')} style={styles.logoHome} />
          <Button title="Ir a la aplicación principal" onPress={() => navigation.navigate('MainAppScreen')} />
        </View>
      ) : (
        <View style={styles.container}>
          <Image source={require('../../assets/images/logo.png')} style={styles.logoHome1} />
          <Image source={require('../../assets/images/logo2.png')} style={styles.logoHome2} />
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.buttonText}>Ingresar</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonSecondary} onPress={() => navigation.navigate('Register')}>
        <Text style={styles.buttonSecondaryText}>Registrarse</Text>
      </TouchableOpacity>
          {/* <Button title="Iniciar Sesión" onPress={() => navigation.navigate('Login')} />
          <Button title="Registrarse" onPress={() => navigation.navigate('Register')} /> */}
        </View>
      )}
      
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      display:'flex',
      justifyContent:'center',
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
    logoHome:{
      width: 150,
      height: 150

    },
    logoHome1:{
      width: 100,
      height: 100,
      marginBottom:20
    },
    logoHome2:{
      width: 210,
      height: 65,
      marginBottom:20
    },
    text:{
        marginBottom: 5,
        fontWeight:"700"
    },
    button: {
      backgroundColor: '#3179BB',
      paddingVertical: 10,
      paddingHorizontal: 30,
      borderRadius: 8,
      alignItems: 'center',
      width: '48%',
      marginBottom:10,
      shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    buttonSecondary: {
      backgroundColor: '#64C9ED',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 8,
      alignItems: 'center',
      width: '48%',
      shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    },
    buttonSecondaryText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });

export default HomeScreen;
