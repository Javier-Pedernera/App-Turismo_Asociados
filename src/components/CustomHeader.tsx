import React from 'react';
import { View, Text, Image, StyleSheet, Platform, StatusBar, TouchableOpacity, Dimensions } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { UserData } from '../redux/types/types';
import { logoutUser } from '../services/authService';
import { SimpleLineIcons } from '@expo/vector-icons';
import { getMemoizedUserData } from '../redux/selectors/userSelectors';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';

const { width: screenWidth } = Dimensions.get('window');

const CustomHeader: React.FC = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const user = useSelector(getMemoizedUserData);
  if (!user) return null;

  const handleLogout = () => {
    dispatch(logoutUser() as any);
  };
 
  return (
    <View style={styles.headerContainer}>
        <Text style={styles.userName}>Hola, {user.first_name}</Text>
        <TouchableOpacity style={styles.imageCont}>
      <View style={styles.avatarContainer}>
        {user?.image_url ? (
          <Image source={{ uri: user.image_url }} style={styles.avatar} />
        ) : (
          <Image
            source={{ uri: "https://res.cloudinary.com/dbwmesg3e/image/upload/v1721231402/TurismoApp/perfil_tfymsu.png" }}
            style={styles.avatar}
          />
        )}
      </View>
      </TouchableOpacity>
      {/* <View style={styles.nameContainer}> */}
        {/* <Text style={styles.appName}>TuApp</Text> */}
      {/* </View> */}
      {/* <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <SimpleLineIcons name="logout" size={20} color="#fff" />
      </TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    minWidth:screenWidth*0.9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'space-around',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 40,
    padding: 5,
    backgroundColor: '#007a8c',
    paddingHorizontal: 20,
    height:85,
    // elevation: 5,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.2,
    // shadowRadius: 0.5,
  },
  imageCont:{
    width:screenWidth * 0.3,
  },
  avatarContainer: {
    position:'relative',  
    flexDirection: 'row',
    right:0,
    width:45,
    height:45,
    marginLeft:'60%',
    // alignItems: 'center',
    // marginLeft: 10,
    borderColor: '#fff', // Usar color naranja de la paleta
    borderWidth: 1,
    borderRadius: 25,
  },
  avatar: {
    width: '100%',
    // height: 40,
    borderRadius: 25,

  },
  nameContainer: {
    width:screenWidth * 0.7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  appName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  logoutButton: {
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CustomHeader;
