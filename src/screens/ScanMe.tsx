import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Animated, Image, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useDispatch, useSelector } from 'react-redux';
import { UserData } from '../redux/types/types';
import { getMemoizedUserData } from '../redux/selectors/userSelectors';
import { fetchPartnerById } from '../redux/actions/userActions';
import { AppDispatch } from '../redux/store/store';
import { fetchPromotions } from '../redux/actions/promotionsActions';
import { getMemoizedPromotions } from '../redux/selectors/promotionSelectors';
import { loadData } from '../redux/actions/dataLoader';
import { fetchBranches } from '../redux/actions/branchActions';
import { getMemoizedBranches } from '../redux/selectors/branchSelectors';
import Feather from '@expo/vector-icons/Feather';
import SemicirclesOverlay from '../components/SemicirclesOverlay';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface ScanData {
  type: string;
  data: string;
}

const QRScanButton = () => {

  const user = useSelector(getMemoizedUserData) as UserData;
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [cameraVisible, setCameraVisible] = useState(false);
  const [facing, setFacing] = useState<CameraType>('back');
  const lineAnimation = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const [permission, requestPermission] = useCameraPermissions();
  const dispatch: AppDispatch = useDispatch();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  //   console.log("promociones scan", promotions);
  // const token = await AsyncStorage.getItem('token');
  //   console.log("token en el sacanner", token);

  useEffect(() => {
    dispatch(loadData());
    if (user) {
      dispatch(fetchPartnerById(user.user_id));
      dispatch(fetchPromotions(user.user_id));
      dispatch(fetchBranches(user.user_id));
    }

    if (permission?.granted === false && !permission) {
      requestPermission();
    }
    setHasPermission(permission?.granted ?? null);
  }, [permission]);
  useEffect(() => {
    // Limpiar el timeout si el componente se desmonta
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  useEffect(() => {
    startLineAnimation();
  }, [cameraVisible]);

  const startLineAnimation = () => {
    Animated.sequence([
      Animated.timing(lineAnimation, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.timing(lineAnimation, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      }),
      Animated.timing(lineAnimation, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const translateY = lineAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [18, 185], // Ajusta este valor para controlar el recorrido de la línea
  });

  const handleQRScan = () => {
    setCameraVisible(true);
    timeoutRef.current = setTimeout(() => {
      setCameraVisible(false);
    }, 10000);
  };

  const handleBarCodeScanned = ({ type, data }: ScanData) => {
    console.log('Scanned QR Code:', data);
    setCameraVisible(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    Alert.alert('Código escaneado', `\nUsuario: ${data}`);
  };
  const handleCloseCamera = () => {
    setCameraVisible(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };
  const ScannerFrame = () => (
    <View style={styles.frameContainer}>
      <View style={styles.frameCornerTopLeft} />
      <View style={styles.frameCornerTopRight} />
      <View style={styles.frameCornerBottomLeft} />
      <View style={styles.frameCornerBottomRight} />
    </View>
  );
  
  if (cameraVisible && hasPermission) {
    return (
      <View style={StyleSheet.absoluteFillObject}>
        <CameraView
          style={StyleSheet.absoluteFillObject}
          facing={facing}
          barcodeScannerSettings={{
            barcodeTypes: ['qr'],
          }}
          onBarcodeScanned={handleBarCodeScanned}
        />
        <ScannerFrame />
        <TouchableOpacity style={styles.closeButton} onPress={handleCloseCamera}>
        <Feather name="camera-off" size={24} color="rgb(0, 122, 140)" />
          {/* <Text style={styles.closeButtonText}>Cerrar</Text> */}
        </TouchableOpacity>
      </View>
    );
  }
  

  return (
    <View style={styles.container}>
      <View style={styles.containercircle}>
        <SemicirclesOverlay/>
      </View>
      <View style={styles.iconContainer}>
        <Image source={require('../../assets/images/QR-Scan.png')} style={styles.icon} />
        {/* <Icon name="qrcode-scan" size={200} color="rgb(0, 122, 140)" /> */}
        <Animated.View
          style={[
            styles.scanLine,
            {
              transform: [{ translateY }],
              opacity: opacity,
            },
          ]}
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleQRScan}>
        <Text style={styles.buttonText}>Escanear QR</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height:screenHeight,
    display:'flex',
    flexDirection:'column',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent:'center'
  },
  containercircle:{
    position:'absolute',
    top:-20,
    height:screenHeight *0.2,
    width:screenWidth
  },
  iconContainer: {
    marginBottom: 20,
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },
  icon: {
    width: 200,
    height: 200, // Tamaño del PNG
  },
  scanLine: {
    position: 'absolute',
    width: 166,
    height: 1,
    backgroundColor: '#acd0d5',
    top: 0,
  },
  button: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgb(0, 122, 140)',
    elevation: 3,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  buttonPressed: {
    backgroundColor: '#275d8e', 
    transform: [{ scale: 0.98 }],
  },
  frameContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  // Esquina superior izquierda
  frameCornerTopLeft: {
    position: 'absolute',
    top: 170,
    left: 70,
    width: 35,
    height: 35,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderColor: '#acd0d5',
    borderStyle: 'solid',
    borderTopLeftRadius: 10,
  },
  // Esquina superior derecha
  frameCornerTopRight: {
    position: 'absolute',
    top: 170,
    right: 70,
    width: 35,
    height: 35,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderColor: '#acd0d5',
    borderStyle: 'solid',
    borderTopRightRadius: 10,
  },
  // Esquina inferior izquierda
  frameCornerBottomLeft: {
    position: 'absolute',
    bottom: 150,
    left: 70,
    width: 35,
    height: 35,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderColor: '#acd0d5',
    borderStyle: 'solid',
    borderBottomLeftRadius: 10,
  },
  // Esquina inferior derecha
  frameCornerBottomRight: {
    position: 'absolute',
    bottom: 150,
    right: 70,
    width: 35,
    height: 35,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderColor: '#acd0d5',
    borderStyle: 'solid',
    borderBottomRightRadius: 10,
  },
  closeButton: {
    position: 'absolute',
    bottom: 50,
    right: screenWidth*0.5,
    padding: 0,
    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 0,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default QRScanButton;
