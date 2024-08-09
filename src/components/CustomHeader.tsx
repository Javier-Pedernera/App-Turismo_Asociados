import React from 'react';
import { View, Text, Image, StyleSheet, Platform, StatusBar, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { UserData } from '../redux/types/types';
import { logoutUser } from '../services/authService';
import { SimpleLineIcons } from '@expo/vector-icons';
import { getMemoizedUserData } from '../redux/selectors/userSelectors';

const CustomHeader: React.FC = () => {
  const dispatch = useDispatch();
  const user = useSelector(getMemoizedUserData);
  if (!user) return null;

  const handleLogout = () => {
    dispatch(logoutUser() as any);
  };
// console.log(user.image_url?.slice(0,4));

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
      <SimpleLineIcons name="logout" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 40,
    padding: 10,
    backgroundColor: '#3179BB', 
    paddingHorizontal: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 0.5,
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft:10,
    borderColor: '#fff', // Usar color naranja de la paleta
    borderWidth: 1,
    borderRadius: 25,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 25,
   
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
