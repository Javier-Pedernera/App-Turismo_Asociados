import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Modal, FlatList, Dimensions, Alert } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { Branch, ImagePromotion, Promotion } from '../redux/types/types';
import { RootStackParamList } from '../navigation/AppNavigator';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import QRCode from 'react-native-qrcode-svg';
import Carousel from 'react-native-reanimated-carousel';
import { ActivityIndicator } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import { getMemoizedBranches } from '../redux/selectors/branchSelectors';
import { useSelector } from 'react-redux';

type PromotionDetailScreenRouteProp = RouteProp<RootStackParamList, 'PromotionDetail'>;

const { width: screenWidth } = Dimensions.get('window');
const screenHeight = Dimensions.get('window').height;

const PromotionDetailScreen: React.FC = () => {
  const route = useRoute<PromotionDetailScreenRouteProp>();
  const branches = useSelector(getMemoizedBranches);
  const { promotion } = route.params;
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [branch, setBranch] = useState<Branch | null>(null);
  const [currentPosition, setCurrentPosition] = useState<{ latitude: number, longitude: number } | null>(null);
console.log("localizacion de usuario", currentPosition);

  useEffect(() => {
    if (branches.length) {
      const branchProm = branches.find(branch => branch.branch_id == promotion.branch_id) || null;
      setBranch(branchProm);
    }
  }, [promotion, branches]);

  useEffect(() => {
    const requestLocationPermission = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to show your current location.');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setCurrentPosition({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    };

    requestLocationPermission();
  }, []);

  const openModal = (imagePath: string) => {
    setSelectedImage(imagePath);
    setModalVisible(true);
  };

  const handleImageLoadStart = () => setLoading(true);
  const handleImageLoadEnd = () => setLoading(false);

  const closeModal = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };

  const renderItem2 = ({ item }: { item: ImagePromotion }) => (
    <TouchableOpacity onPress={() => openModal(item.image_path)}>
      {loading && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#F1AD3E" />
        </View>
      )}
      <Image source={{ uri: item.image_path }} style={styles.thumbnail} onLoadStart={handleImageLoadStart} onLoadEnd={handleImageLoadEnd} />
    </TouchableOpacity>
  );

  const renderItem = ({ item }: { item: ImagePromotion }) => (
    <View style={styles.carouselItem}>
      <Image source={{ uri: item.image_path }} style={styles.carouselImage} onLoadStart={handleImageLoadStart} onLoadEnd={handleImageLoadEnd} />
    </View>
  );

  const handleGetDirections = () => {
    Alert.alert('Direcciones', 'Función para mostrar las direcciones.');
  };

  const defaultImage = 'https://res.cloudinary.com/dbwmesg3e/image/upload/v1721157537/TurismoApp/no-product-image-400x400_1_ypw1vg_sw8ltj.png';
  const promoImage = promotion.images.length > 0 ? promotion.images[0].image_path : defaultImage;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Volver</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{promotion.title}</Text>
        {loading && (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color="#F1AD3E" />
          </View>
        )}
        <Image
          source={{ uri: promoImage }}
          style={styles.mainImage}
          onLoadStart={handleImageLoadStart}
          onLoadEnd={handleImageLoadEnd}
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
        <View style={styles.qrCode}>
          <QRCode
            value={promotion.qr_code}
            size={screenWidth * 0.5}
            color="black"
            backgroundColor="white"
          />
          <Text style={styles.dates}>Validez:</Text>
          <View style={styles.dates2}>
            <Text style={styles.dates}>Desde: {promotion.start_date}</Text>
            <Text style={styles.dates}>Hasta: {promotion.expiration_date}</Text>
          </View>
        </View>
        {branch && branch.latitude !== null && branch.longitude !== null && (
          <>
            <Text style={styles.descriptiontitle}>Ubicación:</Text>
            <Text style={styles.descriptiontitle}>{branch.address}</Text>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: branch.latitude,
                longitude: branch.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              <Marker
                coordinate={{ latitude: branch.latitude, longitude: branch.longitude }}
                title={branch.name}
                description={branch.address}
              >
                <Callout style={styles.calloutContainer} onPress={handleGetDirections}>
                  <View style={styles.callout}>
                    <View style={styles.calloutImageContainer}>
                      <Image source={{ uri: promoImage }} style={styles.calloutImage}  resizeMode="cover"/>
                    </View>
                    
                    <Text style={styles.calloutTitle}>{branch.name}</Text>
                    <TouchableOpacity style={styles.calloutButton} onPress={handleGetDirections}>
                      <Text style={styles.calloutButtonText}>¿Cómo llegar?</Text>
                    </TouchableOpacity>
                  </View>
                </Callout>
              </Marker>
              {currentPosition && (
                <Marker
                  coordinate={currentPosition}
                  title="Mi ubicación"
                  pinColor="blue"
                />
              )}
            </MapView>
          </>
        )}
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
                height={screenWidth * 0.75}
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
    backgroundColor: '#3179BB',
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
    display: 'flex',
    marginTop: 20,
    width: '90%',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: 20,
  },
  title: {
    fontSize: 23,
    fontWeight: 'bold',
    color: '#3179BB',
    marginBottom: 20,
    textAlign: 'center',
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
    fontWeight: 'bold',
  },
  dates2: {
    marginTop: -5,
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-evenly',
    fontSize: 14,
    color: '#888',
    marginBottom: 10,
  },
  dates: {
    paddingTop: 15,
    fontSize: 14,
    color: '#888',
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
    height: '100%',
  },
  modalContainer2: {
    height: '50%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    alignContent: 'center',
  },
  carousel: {
    width: screenWidth,
    height: screenWidth * 0.75,
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
    color: '#f1ad3e',
  },
  thumbnailsContainer: {
    width: '100%',
    marginTop: 10,
    marginBottom: 20,
  },
  thumbnail: {
    width: 100,
    height: 90,
    marginRight: 10,
    borderRadius: 5,
  },
  loader: {
    position: 'absolute',
    top: '30%',
    left: '50%',
  },
  map: {
    width: '100%',
    height: 300,
    marginTop: 20,
    marginBottom: 20,
  },
  calloutContainer: {
    height: screenHeight * 0.18,
  },
  callout: {
    height:'100%',
    flexDirection: 'column',
    alignItems: 'center',
    alignContent:'center',
    justifyContent: 'space-between',
  },
  calloutImageContainer:{
    width: '100%',
    height: '50%',
    display:'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calloutImage: {
    width: 70,
    height: 70,
    borderRadius: 5,
    marginBottom: 5,
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  calloutButton: {
    backgroundColor: '#3179BB',
    padding: 5,
    borderRadius: 5,
  },
  calloutButtonText: {
    color: '#fff',
    fontSize: 14,
  },
});

export default PromotionDetailScreen;
