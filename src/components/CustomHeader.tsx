import React from 'react';
import { View, Text, Image, StyleSheet, Platform, StatusBar, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store/store';
import { UserData } from '../redux/types/types';
import { logoutUser } from '../services/authService';
import { SimpleLineIcons } from '@expo/vector-icons';

const CustomHeader: React.FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.userData) as UserData;
  if (!Object.keys(user).length) return null;

  const handleLogout = () => {
    dispatch(logoutUser() as any);
  };

  return (
    <View style={styles.headerContainer}>
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
      <View style={styles.nameContainer}>
        <Text style={styles.userName}>{user.first_name}</Text>
        {/* <Text style={styles.appName}>TuApp</Text> */}
      </View>
      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
      <SimpleLineIcons name="logout" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 50,
    padding: 10,
    backgroundColor: '#3179BB', 
    paddingHorizontal: 20,
    elevation: 5,
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft:10
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderColor: '#fff', // Usar color naranja de la paleta
    borderWidth: 2,
  },
  nameContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  appName: {
    color: '#fff', // Usar color naranja de la paleta
    fontSize: 14,
    fontWeight: 'bold',
  },
  logoutButton: {
    // backgroundColor: '#64C9ED', // Usar color celeste de la paleta
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    // borderRadius: 25,
    // borderColor: '#fff',
    // borderWidth: 0.5,
    // marginRight:10
  },
});

export default CustomHeader;
