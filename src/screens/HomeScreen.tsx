import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getUserData } from '../utils/storage';
import { RootStackParamList } from '../navigation/AppNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppDispatch, RootState } from '../redux/store/store';
import { useDispatch, useSelector } from 'react-redux';
import { UserData, Promotion } from '../redux/types/types';
import { setUser } from '../redux/reducers/userReducer';
import { fetchPromotions } from '../redux/actions/promotionsActions';
import { fetchAllCategories } from '../redux/actions/categoryActions';
import { RFPercentage } from "react-native-responsive-fontsize";
import Carousel from 'react-native-reanimated-carousel';
import { LinearGradient } from 'expo-linear-gradient';

const { width: screenWidth } = Dimensions.get('window');
const screenHeight = Dimensions.get('window').height;
type homeScreenProp = StackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<homeScreenProp>();
  const userData = useSelector((state: RootState) => state.user.userData) as UserData;
  const promotions = useSelector((state: RootState) => state.promotions.promotions.slice(0, 2)) as Promotion[];
  const isLoggedIn = userData?.email;

  useEffect(() => {
    checkUserLoggedIn();
    
  }, []);

  const checkUserLoggedIn = async () => {
    const storedUserData = await getUserData();
    // console.log("storedUserData",storedUserData);
    
    dispatch(fetchPromotions());
    if (storedUserData) {
      dispatch(setUser(storedUserData));
      navigation.navigate('Home');
    }
  };

  
  const handlePress = (promotion: Promotion) => {
    if (isLoggedIn) {
      navigation.navigate('PromotionDetail', { promotion });
    } else {
      navigation.navigate('Login');
    }
  };

  const renderItem = ({ item }: { item: Promotion }) => (
   
      <TouchableOpacity style={styles.carouselItem} onPress={() => handlePress(item)}>
      <View style={styles.promotionContent}>
        <Text style={styles.promotionTitle}>{item.title}</Text>
        <View style={styles.discountContainer}>
          <Text style={styles.discountText}>30%</Text>
        </View>
      </View>
      <Image source={{ uri: item.images[0]?.image_path }} style={styles.carouselImage} />
      </TouchableOpacity>
   
  );

  return (
    <View style={styles.container}>
      
      <View style={styles.upperSection}>
        <Image source={{ uri: 'https://res.cloudinary.com/dbwmesg3e/image/upload/v1721915163/TurismoApp/imagenes/letrero-cobquecura-1_ebnygx.jpg' }} style={styles.backgroundImage} />
        <View style={styles.textContainer}>
          <Text style={styles.title}>Bienvenido a la Cámara de Comercio de Cobquecura</Text>
          {/* <Text style={styles.description}>
            Esta aplicación está diseñada para ayudar a los usuarios a conseguir promociones y promocionar lugares turísticos en Cobquecura, Chile.
          </Text> */}
          {/* {isLoggedIn ? (
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('PromotionsScreen')}>
              <Text style={styles.buttonText}>Ir a las promociones</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.authButtons}>
              <TouchableOpacity style={styles.buttonSecondary} onPress={() => navigation.navigate('Login')}>
                <Text style={styles.buttonText}>Ingresar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonSecondary} onPress={() => navigation.navigate('Register')}>
                <Text style={styles.buttonSecondaryText}>Registrarse</Text>
              </TouchableOpacity>
            </View>
          )} */}
        </View>
      </View>

      {promotions && 
      <View style={styles.lowerSection}>
        <LinearGradient
        // Colors in the gradient
        colors={['#ffffff', '#ffffff', '#ffffff']}
        // Angle of the gradient
        start={{ x: 1, y: 1 }} // start at the top-left
        end={{ x: 1, y: 0 }}   // end at the bottom-right
        style={styles.gradient}
      >

        <Carousel
          loop
          width={screenWidth}
          height={screenWidth / 2}
          autoPlay={true}
          autoPlayInterval={5000}
          data={promotions}
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
        </LinearGradient>
      </View>
      }
      {!isLoggedIn &&
            <View style={styles.authButtons}>
              <TouchableOpacity style={styles.buttonSecondary} onPress={() => navigation.navigate('Login')}>
                <Text style={styles.buttonText}>Ingresar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonSecondary} onPress={() => navigation.navigate('Register')}>
                <Text style={styles.buttonSecondaryText}>Registrarse</Text>
              </TouchableOpacity>
            </View>
           }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height:'100%',
    display:'flex',

  },
  upperSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  textContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Opcional: para un fondo semitransparente
  },
  title: {
    fontSize: RFPercentage(2.5),
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 80,
  },
  description: {
    fontSize: RFPercentage(2),
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  authButtons: {
    position:"absolute",
    bottom:0,
    // marginBottom:-50,
    // marginTop:40,
    marginBottom: 33,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
  },
  button: {
    borderColor:'#3179BB',
    borderWidth:1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    width: '60%',
    // marginBottom: 5,
    // marginTop:15
  },
  buttonText: {
    color: '#3179BB',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonSecondary: {
    borderColor:'#3179BB',
    borderWidth:1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    width: '40%',
    // marginBottom: 5,
    // marginTop:15
  },
  buttonSecondaryText: {
    color: '#3179BB',
    fontSize: 16,
    fontWeight: 'bold',
  },
  lowerSection: {
    // shadowColor: '#fff',
    // shadowOffset: { width: 0, height: 1 },
    // shadowOpacity: 1,
    // shadowRadius: 25,
    flex: 1,
    alignContent:'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselItem: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    paddingTop:10,
  },
  carouselImage: {
    width: screenWidth,
    
    height: '100%',
    borderRadius: 10,
  },
  carousel: {
    // backgroundColor:'red',
    height:"100%",
    marginTop:20,
    alignContent:'flex-start',
    justifyContent: 'center',
    alignItems: 'flex-start',
    zIndex:1,
    width:screenWidth
  },
  promotionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  promotionTitle: {
    color: 'black',
    fontSize: RFPercentage(2.3),
    fontWeight: 'bold',
    marginBottom:10,
    width:'80%'
  },
  discountContainer: {
    backgroundColor: '#FF6347',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  discountText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  gradientBackground: {
    flex: 1,
  },
  gradientOverlay: {
    position: 'absolute',
    width: screenWidth,
    height: screenHeight,
    opacity: 0.5,
  },
  topLeft: {
    top: 0,
    left: 0,
    width: screenWidth * 0.5,
    height: screenHeight * 0.5,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    width: screenWidth * 0.5,
    height: screenHeight * 0.5,
  },
  gradient: {
    flex: 1,
  },
});

export default HomeScreen;

