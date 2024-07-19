import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Platform, KeyboardAvoidingView, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { registerUser } from '../services/authService';
import RNPickerSelect from 'react-native-picker-select';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Checkbox from 'expo-checkbox';
import Modal from 'react-native-modal';

type RegisterScreenProp = StackNavigationProp<RootStackParamList, 'Register'>;

const categories = [
  { id: 1, name: 'Viajes de Aventura' },
  { id: 2, name: 'Turismo Cultural' },
  { id: 3, name: 'Playas' },
  { id: 4, name: 'Montañas' },
  { id: 5, name: 'Descuentos Exclusivos' },
];
const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<RegisterScreenProp>();



  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    country: '',
    city: '',
    phone_number: '',
    gender: '',
    other_gender: '',
    birth_date: '',
    password: '',
    confirmPassword: '',
    subscribed_to_newsletter: false,
    status: 'active',
    // categories: [] as number[],
  });
  const [showOtherGender, setShowOtherGender] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [isModalVisible, setModalVisible] = useState(false);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };
  // const handleCategoryChange = (categoryId: number) => {
  //   setFormData(prevData => {
  //     const updatedCategories = prevData.categories.includes(categoryId)
  //       ? prevData.categories.filter(id => id !== categoryId)
  //       : [...prevData.categories, categoryId];

  //     return { ...prevData, categories: updatedCategories };
  //   });
  // };

  console.log(formData);

  const handleRegister = async () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    const { confirmPassword, other_gender, ...dataToSend } = formData;
    if (other_gender) {
      dataToSend.gender = other_gender;
    }
    // const dataToSendWithCategories = {
    //   ...dataToSend,
    //   categories: selectedCategories,
    // };

    console.log(dataToSend);

    try {
      const response = await registerUser(dataToSend);
      if (response.status === 201) {
        setError(null);
        Alert.alert('Éxito', "Usuario registrado correctamente", [{ text: 'OK' }], { cancelable: true });
        setTimeout(() => {
          navigation.navigate('Login');
        }, 2000);
      } else {
        setError('Fallo en el registro');
      }
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleGenderChange = (value: string) => {
    setShowOtherGender(value === 'other');
    handleInputChange('gender', value);
  };
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
        <View style={styles.formGrid}>
          <TextInput
            style={styles.input}
            placeholder="* Nombre"
            placeholderTextColor="#aaa"
            value={formData.first_name}
            onChangeText={(value) => handleInputChange('first_name', value)}
          />
          <TextInput
            style={styles.input}
            placeholder="* Apellido"
            placeholderTextColor="#aaa"
            value={formData.last_name}
            onChangeText={(value) => handleInputChange('last_name', value)}
          />
          <TextInput
            style={styles.input}
            placeholder="* Correo electrónico"
            placeholderTextColor="#aaa"
            value={formData.email}
            onChangeText={(value) => handleInputChange('email', value)}
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="* País"
            placeholderTextColor="#aaa"
            value={formData.country}
            onChangeText={(value) => handleInputChange('country', value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Ciudad"
            placeholderTextColor="#aaa"
            value={formData.city}
            onChangeText={(value) => handleInputChange('city', value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Número de teléfono"
            placeholderTextColor="#aaa"
            value={formData.phone_number}
            onChangeText={(value) => handleInputChange('phone_number', value)}
            keyboardType="phone-pad"
          />
          <TextInput
            style={styles.input}
            placeholder="Fecha de nacimiento (YYYY-MM-DD)"
            placeholderTextColor="#aaa"
            value={formData.birth_date}
            onChangeText={(value) => handleInputChange('birth_date', value)}
          />
          <View style={styles.genderDivider}>
            <RNPickerSelect
              onValueChange={(value) => handleGenderChange(value)}
              items={[
                { label: 'Masculino', value: 'M' },
                { label: 'Femenino', value: 'F' },
                { label: 'Otro', value: 'other' },
              ]}
              placeholder={{ label: 'Seleccione Género', value: '' }}
              style={pickerSelectStyles}
            />
            {showOtherGender && (
              <TextInput
                style={styles.input}
                placeholder="Especificar género"
                placeholderTextColor="#aaa"
                value={formData.other_gender}
                onChangeText={(value) => handleInputChange('other_gender', value)}
              />
            )}
          </View>

          <TouchableOpacity style={styles.buttonModal} onPress={toggleModal}>
            <Ionicons name="add" size={24} color="#fff" style={styles.buttonModalIcon} />
            <Text style={styles.buttonModalText}>Preferencias</Text>
          </TouchableOpacity>
          <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Selecciona tus preferencias</Text>
              {categories.map(category => (
                <View key={category.id} style={styles.checkboxWrapper}>
                  <Checkbox
                    style={styles.checkbox}
                    // value={formData.categories.includes(category.id)}
                    // onValueChange={() => handleCategoryChange(category.id)}
                  />
                  <Text style={styles.checkboxLabel}>{category.name}</Text>
                </View>
              ))}
              <TouchableOpacity style={styles.modalButton} onPress={toggleModal}>
                <Text style={styles.modalButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </Modal>

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.inputPassword}
              placeholder="* Contraseña"
              placeholderTextColor="#aaa"
              value={formData.password}
              onChangeText={(value) => handleInputChange('password', value)}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color="#aaa" />
            </TouchableOpacity>
          </View>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.inputPassword}
              placeholder="* Confirmar Contraseña"
              placeholderTextColor="#aaa"
              value={formData.confirmPassword}
              onChangeText={(value) => handleInputChange('confirmPassword', value)}
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <Ionicons name={showConfirmPassword ? 'eye-off' : 'eye'} size={20} color="#aaa" />
            </TouchableOpacity>
          </View>
        </View>
        {error && <Text style={styles.error}>{error}</Text>}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Registrar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonSecondary} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.buttonSecondaryText}>Iniciar sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    height: 50,
    width: '100%',
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
    width: '100%',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  iconContainer: {
    top: 10,
    right: 12,
  },
  placeholder: {
    color: '#aaa',
  },
});

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f7f7f7',
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#3179BB',
  },
  formGrid: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  input: {
    height: 40,
    width: '100%',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
    elevation: 2,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    width: '100%',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
    elevation: 2,
  },
  inputPassword: {
    flex: 1,
    fontSize: 16,

  },
  passwordDivider: {
    width: '100%',
    marginTop: 10,
  },
  genderDivider: {
    width: '100%',
    marginTop: 1,

  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#F1AD3E',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
    width: '48%',
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
    backgroundColor: '#3179BB',
    paddingVertical: 15,
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

  checkboxWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    width: '100%',
  },
  checkbox: {
    borderRadius: 8,
    marginLeft: 15,
    marginRight: 10,
    color: '#64C9ED',
  },
  checkboxLabel: {
    fontSize: 16,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalButton: {
    backgroundColor: '#64C9ED',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 3,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonModal: {
    backgroundColor: 'rgba(100, 201, 237, 1)',
    borderRadius: 5,
    padding: 10,
    height: 40,
    width: '70%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginBottom: 10,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
    borderColor: 'rgb(84, 176, 206)',
    borderWidth: 0.5,
  },
  buttonModalText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,

  },
  buttonModalIcon: {
    marginRight: 5,
  },
});

export default RegisterScreen;

