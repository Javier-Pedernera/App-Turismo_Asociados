import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { AppDispatch, RootState } from '../redux/store/store';
import { fetchPromotions } from '../redux/actions/promotionsActions';
import { Promotion, UserData } from '../redux/types/types';
import { RootStackParamList } from '../navigation/AppNavigator';
import { getMemoizedPromotions } from '../redux/selectors/promotionSelectors';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useEffect, useState } from 'react';
import { getMemoizedFavorites } from '../redux/selectors/userSelectors';
import { fetchUserFavorites, removeFavoriteAction } from '../redux/actions/userActions';
import Checkbox from 'expo-checkbox';

const { width: screenWidth } = Dimensions.get('window');
const screenHeight = Dimensions.get('window').height;

const FavoritesScreen: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const promotions = useSelector(getMemoizedPromotions);
  const userFavorites = useSelector(getMemoizedFavorites);
  const [loading, setLoading] = useState(false);
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);
  
  
  useEffect(() => {
    setLoading(true);
    dispatch(fetchPromotions());
    dispatch(fetchUserFavorites()).finally(() => setLoading(false));
  }, [dispatch]);

  const handlePress = (promotion: Promotion) => {
    navigation.navigate('PromotionDetail', { promotion });
  };

  const handleRemoveFavorite = (promotionId: number) => {
    Alert.alert(
      "Eliminar favorito",
      "¿Estás seguro de que deseas eliminar esta promoción de tus favoritos?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Eliminar",
          onPress: () => dispatch(removeFavoriteAction(promotionId)),
          style: "destructive"
        }
      ],
      { cancelable: true }
    );
  };

  const filteredFavorites = promotions.filter(promotion => userFavorites.includes(promotion.promotion_id));
  console.log("favoritos del usuario",filteredFavorites);
  const isPromotionAvailable = (promotion: Promotion) => {
    const today = new Date();
    return promotion.available_quantity! > 0 && new Date(promotion.expiration_date) >= today;
  };

  const displayedFavorites = showOnlyAvailable
    ? filteredFavorites.filter(isPromotionAvailable)
    : filteredFavorites;

  return (
    filteredFavorites.length? 
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.filterContainer}>
        <Checkbox
          value={showOnlyAvailable}
          onValueChange={setShowOnlyAvailable}
          style={styles.checkbox}
        />
        <Text style={styles.checkboxLabel}>Mostrar solo disponibles</Text>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        displayedFavorites.map((promotion) => (
          <TouchableOpacity
            key={promotion.promotion_id}
            style={styles.promotionCard}
            onPress={() => handlePress(promotion)}
          >
            <View style={styles.promotionContent}>
              <Image
                source={isPromotionAvailable(promotion) ? { uri: promotion.images[0].image_path } : require('../../assets/no_disponible.jpg')}
                style={styles.promotionImage}
              />
              <View style={styles.promotionContentText}>
                <Text style={styles.promotionTitle}>{promotion.title}</Text>
                <Text style={styles.promotionDates}>Desde: {promotion.start_date}</Text>
                <Text style={styles.promotionDates}>Hasta: {promotion.expiration_date}</Text>
                <Text style={styles.discountText}>{promotion.discount_percentage}%</Text>
              </View>
              <TouchableOpacity style={styles.deleteBtn} onPress={() => handleRemoveFavorite(promotion.promotion_id)}>
                <MaterialIcons name="delete" size={24} color="red" />
              </TouchableOpacity>
            </View>
            <View style={styles.divider} />
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
    
    : <View style={styles.favtextcont}>
      <Text style={styles.favtext}>Agrega tus promociones favoritas.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    alignSelf: 'center',
  },
  checkbox: {
    marginRight: 8,
    borderRadius: 5,
  },
  checkboxLabel: {
    fontSize: 16,
  },
  promotionCard: {
    width: '95%',
    flexDirection: 'column',
    marginBottom: 16,
    alignItems: 'center',
    justifyContent:'center',
    alignContent:'center',
    alignSelf:'center'
  },
  promotionImage: {
    borderRadius: 5,
    width: "30%",
    height: 100,
    marginRight: 16,
  },
  promotionContent: {
    display: 'flex',
    flexDirection: 'row',
    // width: '90%',
  },
  promotionContentText: {
    width: "70%",
    flexDirection: 'column',
    flexWrap: 'wrap',

  },
  promotionTitle: {
    width:"100%",
    fontSize: 14,
    fontWeight: 'bold',
    flexWrap: 'wrap',
    textAlign: 'left',
  },
  promotionDates: {
    fontSize: 14,
    color: 'gray',
  },
  discountText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'green',
  },
  deleteBtn: {
    position: 'absolute',
    bottom: 5,
    right: 15,
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: 'rgba(206, 206, 206,0.5)',
    marginTop: 10,
    padding: 0.8,
  },
  favtext:{
    
    fontSize: 14,
    fontWeight: 'bold',
    color:'#14160d',
    flexWrap: 'wrap',
    textAlignVertical:'center',
    textAlign: 'center'
  },
  favtextcont:{
    display:'flex',
    justifyContent:'center',
    width:"100%",
    height: screenHeight *0.4,
  }
});

export default FavoritesScreen;
