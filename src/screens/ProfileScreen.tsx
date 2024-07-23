import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Platform, ScrollView, Modal } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';
import { AppDispatch, RootState } from '../redux/store/store';
import RNPickerSelect from 'react-native-picker-select';
import { UserData } from '../redux/types/types';
import { updateUserAction } from '../redux/actions/userActions';
import Icon from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { fetchUserCategories, fetchAllCategories } from '../redux/actions/categoryActions';
import Checkbox from 'expo-checkbox';
import { updateTourist } from '../services/touristService';

const ProfileScreen: React.FC = () => {
  const user = useSelector((state: RootState) => state.user.userData) as UserData;
  const categories = useSelector((state: RootState) => state.categories.userCategories);
  const allCategories = useSelector((state: RootState) => state.categories.allCategories);
  const dispatch: AppDispatch = useDispatch();
  // console.log("categorias de usuario",categories);
  // console.log("usuario",user);
  const [selectedCategories, setSelectedCategories] = useState<number[]>(
    categories.map(cat => cat.id) // Usa 'id' en lugar de 'category_id'
  );
  // console.log("categorias seleccionadas",selectedCategories);
  // console.log("allCategories",allCategories);
  useEffect(() => {
    if (user?.user_id) {
      dispatch(fetchUserCategories(user.user_id));
    }
    dispatch(fetchAllCategories());
  }, [dispatch, user?.user_id]);

  useEffect(() => {
    setSelectedCategories(categories.map(cat => cat.id)); // Usa 'id' en lugar de 'category_id'
  }, [categories]);

  const [formData, setFormData] = useState({
    user_id: user?.user_id || 0,
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    country: user?.country || '',
    city: user?.city || '',
    phone_number: user?.phone_number || '',
    gender: user?.gender || '',
    birth_date: user?.birth_date || '',
    image_url: user?.image_url || '',
    subscribed_to_newsletter: user?.subscribed_to_newsletter || false,
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalError, setModalError] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isCategoriesModalVisible, setCategoriesModalVisible] = useState(false);

  console.log(formData);
  

  const handleInputChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const formatDateToYYYYMMDD = (dateString: string): string => {
    const [day, month, year] = dateString.split('-');
    return `${year}-${month}-${day}`;
  };
  
  

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS !== 'ios') {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      const formattedDate = formatDateToYYYYMMDD(
        `${selectedDate.getDate()}-${selectedDate.getMonth() + 1}-${selectedDate.getFullYear()}`
      );
      handleInputChange('birth_date', formattedDate);
    }
  };
  
  const confirmDate = () => {
    if (selectedDate) {
      const formattedDate = formatDateToYYYYMMDD(
        `${selectedDate.getDate()}-${selectedDate.getMonth() + 1}-${selectedDate.getFullYear()}`
      );
      handleInputChange('birth_date', formattedDate);
    }
    setShowDatePicker(false);
  };

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      handleInputChange('image_url', result.assets[0].uri);
    }
  };

  const handleUpdate = async () => {
    try {
      const { user_id, ...dataToSend } = formData;
      const response = await dispatch<any>(updateUserAction({ ...dataToSend, user_id }));
      // console.log("resouesta de la actualizacion del usuario", response);
      // console.log("resouesta de la actualizacion del usuario ver status", response.status);
      if (response.status == 200) {
        const categoriesResponse = await
          updateTourist(user_id, {
            origin: formData.country,
            birthday: formData.birth_date,
            gender: formData.gender,
            category_ids: selectedCategories,
          })
// console.log("categoriesResponse",categoriesResponse);
// console.log("categoriesResponse ver status",categoriesResponse.status);
        if (categoriesResponse.status == 200) {
          // dispatch(fetchUserCategories())
          setModalMessage('Datos y categorías actualizados con éxito');
          setModalError(false);
        } else {
          setModalMessage('Error al actualizar las categorías');
          setModalError(true);
        }
      } else {
        setModalMessage('Error al actualizar los datos');
        setModalError(true);
      }
    } catch (error) {
      setModalMessage('Error al actualizar los datos');
      setModalError(true);
    } finally {
      setModalVisible(true);
    }
  };

  const handleCategoryChange = (categoryId: number) => {
    setSelectedCategories(prevState => {
      if (prevState.includes(categoryId)) {
        return prevState.filter(id => id !== categoryId);
      } else {
        return [...prevState, categoryId];
      }
    });
  };
  const handleSaveCategories = () => {
    setCategoriesModalVisible(false);
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={handleImagePick}>
        <Image source={{ uri: formData.image_url || 'https://via.placeholder.com/150' }} style={styles.image} />
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={formData.first_name}
        onChangeText={(value) => handleInputChange('first_name', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Apellido"
        value={formData.last_name}
        onChangeText={(value) => handleInputChange('last_name', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Correo Electrónico"
        value={formData.email}
        onChangeText={(value) => handleInputChange('email', value)}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="País"
        value={formData.country}
        onChangeText={(value) => handleInputChange('country', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Ciudad"
        value={formData.city}
        onChangeText={(value) => handleInputChange('city', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Número de Teléfono"
        value={formData.phone_number}
        onChangeText={(value) => handleInputChange('phone_number', value)}
      />
      <View style={styles.datePickerContainer}>
      {!showDatePicker && (<TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.inputdate}>
          <Text style={styles.textDate}>
            {formData.birth_date ? formData.birth_date : 'Fecha de Nacimiento (DD-MM-YYYY)'}
          </Text>
        </TouchableOpacity>)}
        {showDatePicker && (
          <View>
            <DateTimePicker
              value={selectedDate || new Date()}
              mode="date"
              display="spinner"
              onChange={handleDateChange}
            />
            {Platform.OS === 'ios' && (
              <TouchableOpacity onPress={confirmDate} style={styles.confirmButton}>
                <Text style={styles.confirmButtonText}>Confirmar fecha</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
      {Platform.OS === 'web' ? (
        <select
          style={styles.select}
          value={formData.gender}
          onChange={(e) => handleInputChange('gender', e.target.value)}
        >
          <option value="" disabled>Seleccione Género</option>
          <option value="Masculino">Masculino</option>
          <option value="Femenino">Femenino</option>
          <option value="Otro">Otro</option>
        </select>
      ) : (
        <RNPickerSelect
          onValueChange={(value: any) => handleInputChange('gender', value)}
          value={formData.gender}
          items={[
            { label: 'Masculino', value: 'M' },
            { label: 'Femenino', value: 'F' },
            { label: 'Otro', value: 'Otro' },
          ]}
          placeholder={{ label: 'Seleccione Género', value: '' }}
          style={pickerSelectStyles}
        />
      )}
      <TouchableOpacity
  style={styles.button}
  onPress={() => setCategoriesModalVisible(true)}
>
  <Text style={styles.buttonText}>Ver Categorías</Text>
</TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Actualizar datos</Text>
      </TouchableOpacity>
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, modalError ? styles.modalError : styles.modalSuccess]}>
          {modalError ? (
              <Icon name="close-circle" size={50} color="red" />
            ) : (
              <Icon name="checkmark-circle" size={50} color="green" />
            )}
            <Text style={styles.modalText}>{modalMessage}</Text>
            <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal visible={isCategoriesModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Categorías</Text>
            <ScrollView>
              {allCategories.map((category) => (
                <View key={category.category_id} style={styles.checkboxContainer}>
                  <Checkbox
                    value={selectedCategories.includes(category.category_id)}
                    onValueChange={() => handleCategoryChange(category.category_id)}
                  />
                  <Text style={styles.label}>{category.name}</Text>
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity onPress={handleSaveCategories} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Guardar Categorías</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setCategoriesModalVisible(false)} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </ScrollView>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    height: 40,
    width: Platform.OS === 'web' ? '50%' : '90%',
    maxWidth: Platform.OS === 'web' ? 400 : '90%',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    fontSize: 16,
    alignSelf: 'center',
  },
  inputAndroid: {
    height: 40,
    width: Platform.OS === 'web' ? '50%' : '90%',
    maxWidth: Platform.OS === 'web' ? '30%' : '90%',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    fontSize: 16,
    alignSelf: 'center',
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
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#3179BB',
  },
  input: {
    height: 40,
    width: '90%',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
    alignSelf: 'center',
    
  },
  button: {
    backgroundColor: '#3179bb',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
    width: '60%',
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
  select: {
    height: 50,
    width: '100%',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#595959',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxHeight: '70%',
  },
  modalText: {
    fontSize: 16,
    marginVertical: 10,
    textAlign: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  label: {
    marginLeft: 8,
  },
  modalButton: {
    backgroundColor: '#2196F3',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    marginVertical: 5,
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalError: {
    // backgroundColor: '#f8d7da',
  },
  modalSuccess: {
    // backgroundColor: '#d4edda',
  },
  datePickerContainer: {
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
    width: '100%',
    alignSelf:'center'
  },
  textDate:{
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
    alignContent:'center'
  },
  inputdate: {
    display:'flex',
    justifyContent:'center',
    alignContent:'center',
    height: 40,
    width: '90%',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  confirmButton: {
    backgroundColor: '#3179bb',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 50,
    alignItems: 'center',
    marginBottom: 10,
    width: 250,
    alignSelf: 'center'
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  categoryText: {
    fontSize: 16,
    marginVertical: 5,
  },
});

export default ProfileScreen;
