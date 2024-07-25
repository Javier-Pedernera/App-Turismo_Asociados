import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Modal, FlatList, Dimensions } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { ImagePromotion, Promotion } from '../redux/types/types';
import { RootStackParamList } from '../navigation/AppNavigator';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import QRCode from 'react-native-qrcode-svg';
import Carousel from 'react-native-reanimated-carousel';

type PromotionDetailScreenRouteProp = RouteProp<RootStackParamList, 'PromotionDetail'>;

const { width: screenWidth } = Dimensions.get('window');

const PromotionDetailScreen: React.FC = () => {
  const route = useRoute<PromotionDetailScreenRouteProp>();
  const { promotion } = route.params;
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Función para manejar la apertura del modal
  const openModal = (imagePath: string) => {
    setSelectedImage(imagePath);
    setModalVisible(true);
  };

  // Función para manejar el cierre del modal
  const closeModal = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };

  const renderItem2 = ({ item }: { item: ImagePromotion }) => (
    <TouchableOpacity onPress={() => openModal(item.image_path)}>
      <Image source={{ uri: item.image_path }} style={styles.thumbnail} />
    </TouchableOpacity>
  );

  // Función para renderizar cada item del carrusel
  const renderItem = ({ item }: { item: ImagePromotion }) => (
    <View style={styles.carouselItem}>
      <Image source={{ uri: item.image_path }} style={styles.carouselImage} />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalles</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Mostrar la imagen principal */}
        <Text style={styles.title}>{promotion.title}</Text>
        <Image
          source={{ uri: promotion.images.length > 0 ? promotion.images[0].image_path : 'https://res.cloudinary.com/dbwmesg3e/image/upload/v1721157537/TurismoApp/no-product-image-400x400_1_ypw1vg_sw8ltj.png' }}
          style={styles.mainImage}
        />
{promotion.images.length > 1 && (
          <FlatList
            data={promotion.images}
            keyExtractor={(item) => item.image_id.toString()}
            renderItem={renderItem2}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.thumbnailsContainer}
          />
        )}
        <Text style={styles.descriptiontitle}>Descripción:</Text>
        <Text style={styles.description}>{promotion.description}</Text>
        {/* Mostrar código QR */}
        <View style={styles.qrCode}>
          <QRCode
            value={promotion.qr_code}
            size={150}
            color="black"
            backgroundColor="white"
          />
        <View style={styles.dates2}>
            <Text style={styles.dates}>Validez:</Text>
        <Text style={styles.dates}>
          Desde: {promotion.start_date}
        </Text>
        <Text style={styles.dates}>
            Hasta: {promotion.expiration_date}
        </Text>
        </View>
        
        </View>


        {/* Modal de imagen */}
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={closeModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContainer2}>

            <Carousel
              loop
              width={screenWidth}
              height={screenWidth * 0.75} // Ajusta la altura del carrusel
              autoPlay={true}
              data={promotion.images}
              scrollAnimationDuration={3000}
              mode="parallax"
              modeConfig={{
                parallaxScrollingScale: 0.8,
                parallaxScrollingOffset: 50,
              }}
              renderItem={renderItem}
              style={styles.carousel}
              panGestureHandlerProps={{
                activeOffsetX: [-10, 10],
              }}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={closeModal}
            >
              <MaterialCommunityIcons name="close" size={24} color="#f1ad3e" />
            </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Thumbnails de imágenes */}
        
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingTop: 50,
    backgroundColor: '#d59831',
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  content: {
    padding: 20,
  },
  mainImage: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    resizeMode: 'cover',
    marginBottom: 20,
  },
  qrCode: {
    display:'flex',
    width:'90%',
    justifyContent:'space-between',
    flexDirection:'row',
    alignSelf: 'center',
    marginVertical: 20,
  },
  title: {
    fontSize: 23,
    fontWeight: 'bold',
    color: '#3179BB',
    marginBottom: 20,
    textAlign:'center'
  },
  description: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  descriptiontitle: {
    fontSize: 18,
    color: '#555',
    marginBottom: 10,
    fontWeight:'bold'
  },
  dates2: {
    display:'flex',
    flexDirection:'column',
    width:'50%',
    fontSize: 14,
    color: '#888',
    marginBottom: 10,
  },
  dates: {
    fontSize: 14,
    color: '#888',
    marginBottom: 10,
  },
  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  categoryIcon: {
    marginRight: 10,
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    height:'100%',
  },
  modalContainer2:{
    height:'50%',
    display:'flex',
    flexDirection:'column',
    justifyContent:'space-evenly',
    alignItems:'center',
    alignContent:'center'
  },
  carousel: {
    width: screenWidth,
    height: screenWidth * 0.75, // Ajusta la altura del carrusel
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
  closeButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 50,
    padding: 15,
    color:'#f1ad3e',
  },
  thumbnailsContainer: {
    width: '100%',
    marginTop: 10,
    marginBottom:20,
  },
  thumbnail: {
    width: 100,
    height: 90,
    marginRight: 10,
    borderRadius: 5,
  },
});

export default PromotionDetailScreen;
