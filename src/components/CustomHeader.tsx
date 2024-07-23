import { View, Text, Image, StyleSheet, Platform, StatusBar, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store/store';
import { UserData } from '../redux/types/types';
import { logoutUser } from '../services/authService';
import { AntDesign } from '@expo/vector-icons';

const CustomHeader: React.FC = () => {

  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.userData) as UserData;
  if (!Object.keys(user).length ) return null;
  // console.log("usuario en navbar",user);
  const handleLogout = () => {
    dispatch(logoutUser() as any);
  };
  return (
    <View style={styles.headerContainer}>
      {user?.image_url? <Image source={{ uri: user.image_url }} style={styles.avatar} />:
      <Image source={{uri:"https://res.cloudinary.com/dbwmesg3e/image/upload/v1721231402/TurismoApp/perfil_tfymsu.png"}} style={styles.avatar} />
      }
      <View style={styles.nameContainer}>
        <StatusBar barStyle="dark-content" />
      </View>
      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
      <AntDesign name="poweroff" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems:'flex-end',
    justifyContent:'space-between',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 50,
    padding: 10,
    backgroundColor: 'rgba(49, 121, 187, 0.1)',
    paddingLeft:30,
    paddingRight:20
  },
  nameContainer: {
    width:'50%',
    display:'flex',
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between'
  },
  logo:{
    width: 40,
    height: 40,
    marginLeft: 20
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginRight: 10,
    borderColor: 'rgb(160, 159, 159)',
    borderWidth: 1,
    
  },
  userName: {
    color:'rgba(145, 149, 150, 0.9)',
    fontSize: 13,
    fontWeight: 'bold',
  },
  appName: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 10
  },
  logoutButton: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 50,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default CustomHeader;