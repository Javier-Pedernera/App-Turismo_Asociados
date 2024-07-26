import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store/store';
import { UserData } from '../redux/types/types';
import * as Animatable from 'react-native-animatable';
import Svg, { Circle } from 'react-native-svg';

const { width } = Dimensions.get('window');

const UserCredential: React.FC = () => {
  const user = useSelector((state: RootState) => state.user.userData) as UserData;

  if (Object.keys(user).length === 0) {
    return <View style={styles.emptyContainer}><Text style={styles.emptyText}>No user data available</Text></View>;
  }

  return (
    <View style={styles.background}>
      {/* <Svg
        height="100%"
        width="100%"
        style={StyleSheet.absoluteFill}
      >
        <Circle cx="20%" cy="20%" r="180" fill="#F1AD3E" opacity={0.7} />
        <Circle cx="80%" cy="30%" r="190" fill="#3179BB" opacity={0.7} />
        <Circle cx="30%" cy="80%" r="150" fill="#64C9ED" opacity={0.7} />
        <Circle cx="80%" cy="90%" r="110" fill="#F1AD3E" opacity={0.6} />
        <Circle cx="90%" cy="70%" r="120" fill="#3179BB" opacity={0.5} />
      </Svg> */}
      <View style={styles.container}>
        <Image 
          source={{ uri: user.image_url || 'https://via.placeholder.com/150' }} 
          style={styles.image} 
        />
        <Text style={styles.name}>{user.first_name} {user.last_name}</Text>
        <Animatable.View animation="bounceIn" duration={1500} style={styles.qrCard}>
          <QRCode
            value={user.user_id?.toString() || ''}
            size={width * 0.6}
          />
        </Animatable.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  svg: {
    position: 'absolute',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    width: '100%',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
    textAlign: 'center',
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    borderColor: '#fff',
    borderWidth: 2,
  },
  qrCard: {
    backgroundColor: '#f7f7f7',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 5,
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  emptyText: {
    fontSize: 18,
    color: '#888',
  },
});

export default UserCredential;
