import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import { useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';
import { userLogIn } from '../redux/actions/userActions';
import Loader from '../components/Loader';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

type LoginScreenProp = StackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen: React.FC = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<LoginScreenProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleLogin = async () => {
    if (email === '' || password === '') {
      Alert.alert('Error', 'Por favor ingresa tu correo electrónico y contraseña.');
      return;
    }

    try {
      setLoading(true);
      const response = await dispatch<any>(userLogIn(email, password));
      console.log("Respuesta en la función handleLogin", response);

      // Validación del estado del usuario
      if (response.user.status.name !== 'active') {
        Alert.alert('Asociado inactivo', 'Tu cuenta está inactiva. Contacta al soporte para más información.');
        return;
      }

      // Validación del rol del usuario
      const hasAssociatedRole = response.user.roles.some((role: { role_name: string }) => role.role_name === 'associated');
      if (!hasAssociatedRole) {

        Alert.alert('Acceso restringido', 'Solo se permite el ingreso a los asociados.');

        return;
      }

      // Si pasa todas las validaciones
      setError(null);
      setModalMessage('Bienvenido ' + response.user.first_name + '!');
      toggleModal();
      setEmail('');
      setPassword('');
      setTimeout(() => {
        setModalVisible(false);
        navigation.navigate('MainAppScreen');
      }, 1500);
    } catch (err: any) {
      setEmail('');
      setPassword('');
      setError(err.message);
      setModalMessage(err.message);
      toggleModal();
    } finally {

      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://res.cloudinary.com/dbwmesg3e/image/upload/v1724860673/TurismoApp/Puntos%20turisticos/AdobeStock_501242485_Preview_xfgtpa.jpg' }}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <Image source={require('../../assets/logo.png')} style={styles.logoLog} />
      <TextInput
        style={styles.input}
        placeholder="Correo Electrónico"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.inputPassword}
          placeholder="Contraseña"
          placeholderTextColor="#aaa"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Icon name={showPassword ? 'eye-off' : 'eye'} size={20} color="#aaa" />
        </TouchableOpacity>
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Ingresar</Text>
      </TouchableOpacity>
      {/* <TouchableOpacity style={styles.buttonSecondary} onPress={() => navigation.navigate('Register')}>
        <Text style={styles.buttonSecondaryText}>Registrarse</Text>
      </TouchableOpacity> */}
      <TouchableOpacity style={styles.forgotPasswordButton} onPress={() => navigation.navigate('ForgotPassword')}>
        <Text style={styles.forgotPasswordText}>Olvidaste tu contraseña?</Text>
      </TouchableOpacity>
      {loading && <Loader />}
      <Modal isVisible={isModalVisible}>
        <View style={styles.modalContent}>
          <Text style={styles.modalMessage}>{modalMessage}</Text>
          <TouchableOpacity style={styles.modalButton} onPress={toggleModal}>
            <Text style={styles.modalButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f7f7f7',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: screenWidth,
    height: screenHeight,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  logoLog: {
    height: 130,
    width: 130,
    marginBottom: 50
  },
  input: {
    height: 50,
    width: '80%',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: 'rgba(76, 76, 76,0.7)',
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
    elevation: 2,
    color: '#fff'
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    width: '80%',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: 'rgba(76, 76, 76,0.7)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
    elevation: 2,
  },
  inputPassword: {
    flex: 1,
    fontSize: 16,
    color: '#fff'
  },
  error: {
    color: '#F1AD3E',
    marginBottom: 15,
  },
  button: {
    backgroundColor: 'rgb(0, 122, 140)',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 10,
    width: '50%',
    alignItems: 'center',
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
    backgroundColor: '#ddd',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 10,
    width: '50%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  buttonSecondaryText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
  forgotPasswordButton: {
    marginTop: 20,
  },
  forgotPasswordText: {
    color: '#F1AD3E',
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalContent: {
    backgroundColor: 'rgba(49, 121, 187, 0.7)',
    color: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: "70%",
    alignSelf: 'center'
  },
  // modalBackdrop: {
  //   backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo negro con 50% de opacidad
  // },
  modalMessage: {
    fontSize: 18,
    marginBottom: 20,
    color: 'white',
  },
  modalButton: {
    backgroundColor: '#F1AD3E',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default LoginScreen;
