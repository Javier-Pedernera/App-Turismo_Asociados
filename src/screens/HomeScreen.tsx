import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, ActivityIndicator, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getUserData } from '../utils/storage';
import { RootStackParamList } from '../navigation/AppNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppDispatch } from '../redux/store/store';
import { useDispatch, useSelector } from 'react-redux';
import { getMemoizedAccessToken } from '../redux/selectors/userSelectors';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { useFonts } from 'expo-font';
import { setUser } from '../redux/reducers/userReducer';
import { rgbaColor } from 'react-native-reanimated/lib/typescript/reanimated2/Colors';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

type homeScreenProp = StackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<homeScreenProp>();
  const accessToken = useSelector(getMemoizedAccessToken);
  const isLoggedIn = !!accessToken;
  const [loading, setLoading] = useState(true);
  const opacity = useRef(new Animated.Value(0)).current;
  const [fontsLoaded] = useFonts({
    'Buckwheat-TC-Sans-Rg': require('../../assets/fonts/Buckwheat-TC-Sans-Rg.otf'),
  });

  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  const checkUserLoggedIn = async () => {
    const storedUserData = await getUserData();
    if (storedUserData) {
      dispatch(setUser(storedUserData));
    }
  };

  const handleImageLoadStart = () => setLoading(true);

  const handleImageLoadEnd = () => {
    setLoading(false);
    Animated.timing(opacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://res.cloudinary.com/dbwmesg3e/image/upload/v1724860673/TurismoApp/Puntos%20turisticos/AdobeStock_501242485_Preview_xfgtpa.jpg' }}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <View style={styles.textContainer}>
        {/* <Text style={styles.title}>Bienvenido a la Cámara de Comercio de Cobquecura</Text> */}
        <Text style={styles.subtitleBlock}>
          <Text style={[styles.subtitle, { color: 'rgb(0, 122, 140)' }]}>CAMARA DE COMERCIO </Text>
          <Text style={[styles.subtitle2, { color: '#F1AD3E' }]}>TURISMO Y DESARROLLO </Text>
          <Text style={[styles.subtitle3, { color: '#64C9ED' }]}>COBQUECURA</Text>
        </Text>
        {!isLoggedIn && (
          <View style={styles.authButtons}>
            <TouchableOpacity style={styles.buttonSecondary} onPress={() => navigation.navigate('Login')}>
              <Text style={styles.buttonText}>Ingresar</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: screenWidth,
    height: screenHeight,
  },
  logoContainer: {
    position: 'absolute',
    top: screenHeight * 0.3,
    // left: 20,
    width: '100%',
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 150,
  },
  textContainer: {
    position: 'absolute',
    bottom: screenHeight * 0,
    backgroundColor: 'rgba(76, 76, 76,0.5)',
    paddingBottom: screenHeight * 0.1,
    display: 'flex',
    justifyContent: 'flex-start'
    // paddingStart: screenWidth*0.2,
  },
  title: {
    fontSize: RFPercentage(2.5),
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitleBlock: {
    marginTop: '3%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingLeft: screenWidth * 0.2,
    width: screenWidth * 1,
    paddingVertical: screenWidth * 0.02,

  },
  subtitle: {
    display: 'flex',
    fontSize: RFPercentage(2),
    width: '100%',
    textAlign: 'center',
    fontFamily: 'Buckwheat-TC-Sans-Rg',
    marginBottom: 40,
  },
  subtitle2: {
    display: 'flex',
    fontSize: RFPercentage(2.3),
    width: '100%',
    textAlign: 'center',
    fontFamily: 'Buckwheat-TC-Sans-Rg',
    marginBottom: 40,
  },
  subtitle3: {
    fontSize: RFPercentage(4.4),
    width: '100%',
    textAlign: 'center',
    fontFamily: 'Buckwheat-TC-Sans-Rg',
    marginBottom: 40,
  },
  authButtons: {
    // position: 'absolute',
    // bottom: 50,
    width: '100%',
    alignItems: 'center',
  },
  buttonSecondary: {
    borderColor: 'rgb(0, 122, 140)',
    backgroundColor: 'rgb(0, 122, 140)',
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    width: '70%',
    marginTop: 30,
    marginBottom: -30
    // bottom:-10
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
