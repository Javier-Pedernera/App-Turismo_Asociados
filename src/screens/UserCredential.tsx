import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useSelector } from 'react-redux';
import { UserData } from '../redux/types/types';
import * as Animatable from 'react-native-animatable';
import { getMemoizedUserData } from '../redux/selectors/userSelectors';

const { width } = Dimensions.get('window');

const UserCredential: React.FC = () => {
  const user = useSelector(getMemoizedUserData) as UserData;

  if (!user) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No user data available</Text>
      </View>
    );
  }

  const userId = user?.user_id?.toString() || '';

  return (
    <View style={styles.background}>
      <View style={styles.container}>
        <View style={styles.imagecont}>
          <Image
            source={{ uri: user.image_url || 'https://via.placeholder.com/150' }}
            style={styles.image}
          />
        </View>

        <Text style={styles.name}>
          {user.first_name} {user.last_name}
        </Text>
        <Animatable.View animation="bounceIn" duration={1500} style={styles.qrCard}>
          {userId ? (
            <QRCode value={userId} size={width * 0.6} />
          ) : (
            <Text style={styles.emptyText}>No QR Code available</Text>
          )}
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
    marginBottom: 40,
    color: '#1c242b',
    textAlign: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 1,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    
  },
  imagecont:{
    borderColor: '#3179BB',
    borderWidth: 1,
    borderRadius: 60,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 5,
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
