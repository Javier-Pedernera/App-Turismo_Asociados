import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store/store';
import { UserData } from '../redux/types/types';

const UserCredential: React.FC = () => {
  const user = useSelector((state: RootState) => state.user.userData) as UserData;
// console.log(user);

  return (
    Object.keys(user).length? <View style={styles.container}>
       <Text style={styles.name}>{user.first_name} {user.last_name}</Text>
      <Image 
        source={{ uri: user.image_url || 'https://via.placeholder.com/150' }} 
        style={styles.image} 
      />
      <View style={styles.qrCard}>
        <QRCode
          value={user.user_id?.toString() || ''}
          size={150}
        />
      </View>
    </View>: <View></View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    height:"100%",
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    // borderRadius: 10,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.8,
    // shadowRadius: 2,
    // elevation: 5,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    alignSelf: 'center',
  },
  qrCard: {
    backgroundColor: '#f7f7f7',
    display:'flex',
    justifyContent:'center',
    width: "70%",
    height:"40%",
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 5,
    alignItems: 'center',
  },
});

export default UserCredential;
