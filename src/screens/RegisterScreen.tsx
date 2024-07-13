import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Platform} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { register } from '../services/authService';
import { Picker } from '@react-native-picker/picker';
import RNPickerSelect from 'react-native-picker-select';

type RegisterScreenProp = StackNavigationProp<RootStackParamList, 'Register'>;

const RegisterScreen: React.FC = () => {
    console.log("dispositivo actual",Platform);
    
  const navigation = useNavigation<RegisterScreenProp>();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    gender: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleRegister = async () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
        const response = await register(formData); // Suponiendo que formData contiene los datos del usuario
        if (response.success) {
          // Registro exitoso
          setError(null);
          Alert.alert('Success', response.message, [{ text: 'OK' }], { cancelable: true });
          setTimeout(() => {
            navigation.navigate('Login');
          }, 2000);
        } else {
          // Registro fallido
          setError('Registration failed');
        }
      } catch (error:any) {
        // Manejar errores de la función register
        setError(error.message);
      }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <TextInput
        style={styles.input}
        placeholder="First Name"
        placeholderTextColor="#aaa"
        value={formData.firstName}
        onChangeText={(value) => handleInputChange('firstName', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        placeholderTextColor="#aaa"
        value={formData.lastName}
        onChangeText={(value) => handleInputChange('lastName', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        value={formData.email}
        onChangeText={(value) => handleInputChange('email', value)}
        keyboardType="email-address"
      />
       {Platform.OS === 'web' ? (
        <select
          style={styles.select}
          value={formData.gender}
          onChange={(e) => handleInputChange('gender', e.target.value)}
        >
          <option value="" disabled>Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      ) : (
          <RNPickerSelect
            onValueChange={(value: any) => handleInputChange('gender', value)}
            items={[
              { label: 'Male', value: 'male' },
              { label: 'Female', value: 'female' },
              { label: 'Other', value: 'other' },
            ]}
            placeholder={{ label: 'Select Gender', value: '' }}
            style={pickerSelectStyles}
          />
      )}
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#aaa"
        value={formData.password}
        onChangeText={(value) => handleInputChange('password', value)}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        placeholderTextColor="#aaa"
        value={formData.confirmPassword}
        onChangeText={(value) => handleInputChange('confirmPassword', value)}
        secureTextEntry
      />
      {error && <Text style={styles.error}>{error}</Text>}
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonSecondary} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.buttonSecondaryText}>Go to Login</Text>
      </TouchableOpacity>
    </View>
  );
};
const pickerSelectStyles = StyleSheet.create({
    
    inputIOS: {
      height: 50,
      width: Platform.OS === 'web' ? '50%' : '100%',
      maxWidth: Platform.OS === 'web' ? 400 : '100%',
      borderColor: '#ddd',
      borderWidth: 1,
      borderRadius: 8,
      marginBottom: 15,
      paddingHorizontal: 15,
      backgroundColor: '#fff',
      fontSize: 16,
    },
    inputAndroid: {
      height: 50,
      width: Platform.OS === 'web' ? '50%' : '100%',
      maxWidth: Platform.OS === 'web' ? '30%' : '100%',
      borderColor: '#ddd',
      borderWidth: 1,
      borderRadius: 8,
      marginBottom: 15,
      paddingHorizontal: 15,
      backgroundColor: '#fff',
      fontSize: 16,
    },
  });
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f7f7f7',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    height: 50,
    width: Platform.OS === 'web' ? '30%' : '100%',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  select: {
    height: 50,
    width: Platform.OS === 'web' ? '30%' : '100%',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    fontSize: 16,
    color:'#595959'
  },
  error: {
    color: 'red',
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#1e90ff',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 10,
    width: Platform.OS === 'web' ? '30%' : '60%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonSecondary: {
    backgroundColor: '#ddd',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 10,
    width: Platform.OS === 'web' ? '30%' : '60%',
    alignItems: 'center',
  },
  buttonSecondaryText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RegisterScreen;
