import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity, ScrollView, TextInput, FlatList, ActivityIndicator, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Promotion, ImagePromotion as PromotionImage, UserData } from '../redux/types/types';
import { AppDispatch } from '../redux/store/store';
import { fetchPromotions } from '../redux/actions/promotionsActions';
import { RootStackParamList } from '../navigation/AppNavigator';
import Checkbox from 'expo-checkbox';
import Modal from 'react-native-modal';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { fetchAllCategories, fetchUserCategories } from '../redux/actions/categoryActions';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getMemoizedPromotions } from '../redux/selectors/promotionSelectors';
import { getMemoizedAllCategories, getMemoizedUserCategories } from '../redux/selectors/categorySelectors';
import {  getMemoizedUserData } from '../redux/selectors/userSelectors';
import {  fetchUserFavorites } from '../redux/actions/userActions';
import PromotionCard from '../components/PromotionCard';
import Loader from '../components/Loader';

const { width: screenWidth } = Dimensions.get('window');

const PromotionsScreen: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const promotions = useSelector(getMemoizedPromotions);
  const categories = useSelector(getMemoizedAllCategories);
  const user_categories = useSelector(getMemoizedUserCategories);
  const user = useSelector(getMemoizedUserData) as UserData;
  const [filteredPromotions, setFilteredPromotions] = useState<Promotion[]>(promotions);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [keyword, setKeyword] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [filterByPreferences, setFilterByPreferences] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        if (user?.user_id) {
          await dispatch(fetchUserCategories(user.user_id));
          await dispatch(fetchUserFavorites());
        }
        await dispatch(fetchAllCategories());
        await dispatch(fetchPromotions());
      } finally {
        setLoading(false);
      }
    };
  
    loadData();
  }, [dispatch, user]);

  useEffect(() => {
    setFilteredPromotions(promotions);
  }, [promotions]);

  const handlePress = useCallback((promotion: Promotion) => {
    navigation.navigate('PromotionDetail', { promotion });
  }, [navigation]);

  const formatDateString = useCallback((date: Date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }, []);

  const handleStartDateChange = useCallback((event: any, date?: Date | undefined) => {
    if (Platform.OS === 'android') {
      setShowStartDatePicker(false);
    }
    if (date) {
      setStartDate(date);
    }
  }, []);

  const handleEndDateChange = useCallback((event: any, date?: Date | undefined) => {
    if (Platform.OS === 'android') {
      setShowEndDatePicker(false);
    }
    if (date) {
      setEndDate(date);
    }
  }, []);

  const confirmStartDate = useCallback(() => {
    setShowStartDatePicker(false);
  }, []);

  const confirmEndDate = useCallback(() => {
    setShowEndDatePicker(false);
  }, []);

  const toggleCategory = useCallback((categoryId: number) => {
    setSelectedCategories((prevSelectedCategories) => {
      if (prevSelectedCategories.includes(categoryId)) {
        return prevSelectedCategories.filter(id => id !== categoryId);
      } else {
        return [...prevSelectedCategories, categoryId];
      }
    });
  }, []);

  const applyFilters = useCallback(() => {
    setLoading(true);
    let filtered = promotions;
    if (filterByPreferences && user && user.categories) {
      filtered = filtered.filter(promotion =>
        promotion.categories.some(c => user_categories.map(uc => uc.id).includes(c.category_id))
      );
    }
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(promotion => {
        const categoryIds = promotion.categories.map(c => c.category_id);
        return selectedCategories.some(id => categoryIds.includes(id));
      });
    }

    if (keyword) {
      filtered = filtered.filter(promotion => promotion.title.toLowerCase().includes(keyword.toLowerCase()));
    }

    if (startDate) {
      filtered = filtered.filter(promotion =>
        new Date(promotion.start_date) >= startDate
      );
    }

    if (endDate) {
      filtered = filtered.filter(promotion =>
        new Date(promotion.expiration_date) <= endDate
      );
    }

    setFilteredPromotions(filtered);
    setLoading(false);
    setIsModalVisible(false);
  }, [filterByPreferences, user, user_categories, selectedCategories, keyword, startDate, endDate, promotions]);

  const clearFilters = useCallback(() => {
    setSelectedCategories([]);
    setKeyword('');
    setStartDate(null);
    setEndDate(null);
    setFilterByPreferences(false);
    setFilteredPromotions(promotions);
  }, [promotions]);

  return (
    <View style={styles.gradient}
    >
      <View style={styles.btns}>
        <TouchableOpacity style={styles.filterButton} onPress={() => setIsModalVisible(true)}>
          <MaterialCommunityIcons name="filter-outline" size={24} color="#fff" />
          <Text style={styles.filterButtonText}>Mostrar Filtros</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.clearFiltersButton} onPress={clearFilters}>
          <MaterialCommunityIcons name="filter-remove-outline" size={24} color="#fff" />
          <Text style={styles.clearFiltersButtonText}>Limpiar Filtros</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <Modal isVisible={isModalVisible} style={styles.modal}>
          <View style={styles.modalContent}>
            <View style={styles.misPrefe}>
              <Checkbox
                style={styles.checkbox}
                value={filterByPreferences}
                onValueChange={setFilterByPreferences}
              />
              <Text style={styles.labelMisprefer}>Filtrar por mis preferencias</Text>
            </View>
            <FlatList
              data={categories}
              keyExtractor={(item) => item.category_id.toString()}
              numColumns={2}
              renderItem={({ item }) => (
                <View style={styles.checkboxContainer}>
                  <Checkbox
                    style={styles.checkbox}
                    value={selectedCategories.includes(item.category_id)}
                    onValueChange={() => toggleCategory(item.category_id)}
                  />
                  <Text style={styles.label}>{item.name}</Text>
                </View>
              )}
            />
            <TextInput
              style={styles.input}
              placeholder="Palabra clave"
              value={keyword}
              placeholderTextColor="#888"
              onChangeText={setKeyword}
            />
            <View style={styles.containerDate}>
              {!showStartDatePicker && (
                <TouchableOpacity onPress={() => setShowStartDatePicker(true)} style={styles.inputdate}>
                  <Text style={styles.textDate}>
                    {startDate ? formatDateString(startDate) : 'Fecha de Inicio'}
                  </Text>
                </TouchableOpacity>
              )}
              {showStartDatePicker && (
                <View>
                  <DateTimePicker
                    value={startDate || new Date()}
                    mode="date"
                    display="spinner"
                    onChange={handleStartDateChange}
                  />
                  {Platform.OS === 'ios' && (
                    <TouchableOpacity onPress={confirmStartDate} style={styles.confirmButton}>
                      <Text style={styles.confirmButtonText}>Confirmar fecha de inicio</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
              {!showEndDatePicker && (
                <TouchableOpacity onPress={() => setShowEndDatePicker(true)} style={styles.inputdate}>
                  <Text style={styles.textDate}>
                    {endDate ? formatDateString(endDate) : 'Fecha de Fin'}
                  </Text>
                </TouchableOpacity>
              )}
              {showEndDatePicker && (
                <View>
                  <DateTimePicker
                    value={endDate || new Date()}
                    mode="date"
                    display="spinner"
                    onChange={handleEndDateChange}
                  />
                  {Platform.OS === 'ios' && (
                    <TouchableOpacity onPress={confirmEndDate} style={styles.confirmButton}>
                      <Text style={styles.confirmButtonText}>Confirmar fecha de fin</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
            <TouchableOpacity style={styles.filteraplyButton} onPress={applyFilters}>
              <Text style={styles.filterButtonText}>Aplicar Filtros</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={() => setIsModalVisible(false)}>
              <Text style={styles.filterButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </Modal>
        {loading ? (
          <Loader></Loader>
        ) : (
          filteredPromotions.map((promotion: Promotion, index:number) => (
            <PromotionCard
              key={promotion.promotion_id}
              promotion={promotion}
              index={index}
              handlePress={handlePress}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    padding: 20,
  },
  filters: {
    marginBottom: 20,
  },
  btns: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center', // Fondo blanco para la barra de botones
    paddingVertical: 10,
    // borderTopWidth: 1,
    // borderTopColor: '#ddd',
    borderRadius:25,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: -1 },
    // shadowOpacity: 0.1,
    // shadowRadius: 5,
    // elevation: 2,
    zIndex:1,
    // backgroundColor: 'rgba(255, 252, 247, 0.1)'
  },
  labelMisprefer:{
    color: '#f1ad3e',
    marginLeft: 8,
    fontWeight:'bold'
  },
  misPrefe:{
    
    display:'flex',
    flexDirection:'row',
    width:'70%',
    marginBottom:20,
    alignSelf:'center'
  },
  checkbox: {
    borderRadius: 8,
    borderColor: 'rgba(49, 121, 187,0.5)',
  },
  checkboxContainer: {
    height: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    width: '50%',
    paddingHorizontal: 5, 
  },
  label: {
    marginLeft: 8,
  },
  input: {
    alignSelf:'center',
    width:'70%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
    borderColor: 'rgba(49, 121, 187,0.5)',
    borderWidth: 1,
    color:"#000"
  },
  filteraplyButton: {
    width:'60%',
    alignSelf:'center',
    backgroundColor: '#3179BB',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 1,
    elevation: 3,
  },
  filterButton: {
    width:'45%',
    alignSelf:'center',
    backgroundColor: 'rgba(49, 121, 187, 1)',
    padding: 4,
    borderRadius: 8,
    alignItems: 'center',
    // marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 2,
    elevation: 5,
  },
  filterButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  
  promotionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0)',
    borderRadius: 10,
    marginBottom: 25,
  },
  promotionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  promotionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3179BB',
  },
  promotionDates: {
    marginTop: 10,
    fontSize: 14,
    color: '#888',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(49, 121, 187,0.5)',
    marginHorizontal: 15,
  },
  carouselItem: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselImage: {
    width: screenWidth,
    height: '100%',
    borderRadius: 10,
  },
  carousel: {
    alignSelf: 'center',
  },
  discountContainerText:{
    width:'80%',
    
  },
  discountContainer: {
    // height:'50%',
    display:'flex',
    flexDirection:'column',
    justifyContent:'space-evenly',
    alignContent:'center',
    alignItems:'center',
    width:'20%',
  },
  discountContText:{
    backgroundColor: '#FF6347',
    width:'85%',
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 8,
    textAlign:'center'
  },
  discountText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  closeButton: {
    width:'60%',
    alignSelf:'center',
    backgroundColor: '#f1ad3e',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 1,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 1,
    elevation: 3,
  },
  clearFiltersButton: {
    width:'45%',
    alignSelf:'center',
    backgroundColor: '#f1ad3e',
    padding: 4,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 1,
    elevation: 3,
  },
  clearFiltersButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 5,
  }, 
  containerDate: {
    padding: 20,
  },
  inputdate: {
    alignSelf:'center',
    width:'80%',
    padding: 10,
    borderRadius: 8,
    borderColor: 'rgba(49, 121, 187,0.5)',
    borderWidth: 1,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  textDate: {
    fontSize: 16,
  },
  confirmButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#64C9ED',
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  loaderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 300,
  },
  loader: {
    justifyContent: 'flex-start',
    alignContent:'flex-start',
    alignItems: 'center',
    alignSelf:'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  starCont:{
    marginTop:20,
    zIndex:10,
  },
  star:{
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 0.5,
    elevation: 1,
  }
});

export default PromotionsScreen;

 // console.log("categorias del usuario",user_categories);
//  console.log("favoritos del usuario en promotions screen",userFavorites);
  // console.log("filterByPreferences",filterByPreferences);
  // console.log("selectedCategories",selectedCategories);
  // console.log("filteredPromotions",filteredPromotions);