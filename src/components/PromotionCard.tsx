import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity } from 'react-native';
import { Promotion, ImagePromotion as PromotionImage } from '../redux/types/types';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../redux/store/store';
import { getMemoizedFavorites } from '../redux/selectors/userSelectors';
import * as Animatable from 'react-native-animatable';
import type { View as AnimatableView } from 'react-native-animatable';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { getMemoizedStates } from '../redux/selectors/globalSelectors';
import { formatDateToDDMMYYYY } from '../utils/formatDate';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const { width: screenWidth } = Dimensions.get('window');

interface PromotionCardProps {
  promotion: Promotion;
  index: number;
  handlePress: (promotion: Promotion) => void;
  handleEdit: (promotion: Promotion) => void;
  handleDelete: (promotionId: number) => void;
}

const PromotionCard: React.FC<PromotionCardProps> = ({ promotion, index, handlePress, handleEdit, handleDelete }) => {
  const dispatch: AppDispatch = useDispatch();
  const [loadingImg, setLoadingImg] = useState(false);
  const heartRefs = useRef<Animatable.View[]>([]);


  const handleImageLoadStart = () => setLoadingImg(true);
  const handleImageLoadEnd = () => setLoadingImg(false);



  const animateHeart = (index: number) => {
    if (heartRefs.current[index]?.rubberBand) {
      heartRefs.current[index].rubberBand(1000);
    }
  };

  return (
    <TouchableOpacity
      key={promotion.promotion_id}
      style={styles.promotionCard}
      onPress={() => handlePress(promotion)}
    >
      <View style={styles.carouselItem}>
        <Image
          source={
            promotion.images.length > 0
              ? { uri: promotion.images[0].image_path }
              : require('../../assets/images/images.png')
          }
          style={styles.carouselImage}
          onLoadStart={handleImageLoadStart}
          onLoadEnd={handleImageLoadEnd}
        />
        <View style={styles.previewOverlay}>
          <Ionicons name="eye" size={24} color="rgba(244, 244, 244,0.7)" />
          <Text style={styles.previewText}>Vista Previa</Text>
        </View>
      </View>
      <View style={styles.promotionContent}>
        <View style={styles.discountContainerText}>
          <Text style={styles.promotionTitle}>{promotion.title}</Text>
          <Text style={styles.promotionDates}>
            Desde: {formatDateToDDMMYYYY(promotion.start_date)}
          </Text>
          <Text style={styles.promotionDates}>
            Hasta: {formatDateToDDMMYYYY(promotion.expiration_date) }
          </Text>
          <Text style={styles.promotionDates}>
            Disponibles: {promotion.available_quantity}
          </Text>
        </View>
        <View style={styles.discountContainer}>
          <View style={styles.discountContText}>
            <Text style={styles.discountText}>{promotion.discount_percentage}%</Text>
          </View>
          <View style={styles.starCont}>
            <Animatable.View ref={(ref: AnimatableView | null) => {
              heartRefs.current[index] = ref as Animatable.View;
            }}>
              <View style={styles.actionsContainer}>
                <TouchableOpacity onPress={() => handleEdit(promotion)}>
                  <MaterialCommunityIcons name="square-edit-outline" size={28} color="rgb(0, 122, 140)" style={styles.actionIcon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(promotion.promotion_id)}>
                  <Ionicons name="trash-outline" size={25} color="#e04545" />
                </TouchableOpacity>
              </View>
            </Animatable.View>
          </View>
        </View>
      </View>
      <View style={styles.divider} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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
    fontSize: screenWidth * 0.045,
    fontWeight: 'bold',
    color: 'rgb(0, 122, 140)',
  },
  promotionDates: {
    marginTop: 3,
    fontSize: screenWidth * 0.035,
    color: '#888',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgb(172, 208, 213)',
    marginHorizontal: 15,
  },
  carouselItem: {
    height: 150,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselImage: {
    width: '90%',
    height: '100%',
    borderRadius: 10,
  },
  carousel: {
    alignSelf: 'center',
  },
  discountContainerText: {
    width: '80%',
  },
  discountContainer: {
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '20%',
    height: 'auto'
  },
  discountContText: {
    backgroundColor: '#007a8c',
    width: '80%',
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 8,
    textAlign: 'center',
  },
  discountText: {

    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  starCont: {
    marginTop: 20,
    zIndex: 10,
  },
  actionsContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignContent: 'flex-start',
    alignItems: 'flex-start'
  },
  actionIcon: {
    marginBottom: 10,
    marginLeft: 0,
  },
  previewOverlay: {
    position: 'absolute',
    bottom: 0,
    left: '5%',
    right: 0,
    height: 150,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
    alignSelf: 'center',
    borderRadius: 10
  },
  previewText: {
    fontWeight: 'bold',
    color: " rgba(244, 244, 244,0.7)"
  },
});

export default React.memo(PromotionCard);
