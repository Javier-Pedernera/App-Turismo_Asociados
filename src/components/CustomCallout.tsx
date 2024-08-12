import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

interface CustomCalloutProps {
  branch: any;
  handleRoutePress: () => void;
}

const CustomCallout: React.FC<CustomCalloutProps> = ({ branch, handleRoutePress}) => {
  console.log("punto turistico",branch);
  const imageUrl = branch.branch_id 
  ? branch.image_url 
  : branch.images && branch.images.length > 0 
    ? branch.images[0].image_path 
    : null; 

const displayName = branch.branch_id 
  ? branch.name 
  : branch.title;
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= rating ? 'star' : i - rating <= 0.5 ? 'star-half' : 'star-outline'}
          size={16}
          color="#FFD700"
        />
      );
    }
    return stars;
  };
  
  return (
    <View style={styles.calloutContainer}>
      <View style={styles.calloutBack}>
        {Platform.OS === 'android' ? (
          <View style={styles.calloutImageAndroidCont}>
            <Image style={styles.calloutImageAndroid} source={{ uri: imageUrl }} />
          </View>
        ) : (
          <View style={styles.calloutImageContainer}>
            <Image source={{ uri: branch.image_url }} style={styles.calloutImage} />
          </View>
        )}
        <View style={styles.callout}>
          <Text style={styles.calloutTitle}>{displayName}</Text>
          <View style={styles.divider}></View>
          <View style={styles.ratingContainer}>
          {/* <Text style={styles.calloutDescription}>{branch.description}</Text> */}
          <View style={styles.starsContainer}>
            {renderStars(3.5)}
          </View>
          </View>
        <View style={styles.addressBttn}>
          <Text style={styles.calloutadress}>{branch.address}</Text>
          <TouchableOpacity style={styles.calloutButton} onPress={handleRoutePress}>
        <MaterialCommunityIcons name="directions" size={24} color="rgb(49, 121, 187)" />
          <Text style={styles.calloutButtonText}>Cómo llegar?</Text>
        </TouchableOpacity>
        </View>
        </View>
        
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  calloutContainer: {
    position: 'absolute',
    bottom: 150, 
    left: 50, 
    zIndex: 999,
    width: 250,
    // borderRadius: 10,
    // backgroundColor: 'rgba(255, 255, 255, 0.8)',
    // padding: 10,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.3,
    // shadowRadius: 3,
    // elevation: 5,
  },
  calloutBack: {
    height: 280,
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    elevation: 15, // Aumenta la elevación para que la sombra sea más evidente
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 }, // Aumenta el desplazamiento de la sombra
    shadowOpacity: 1, // Aumenta la opacidad de la sombra
    shadowRadius: 1, // Aumenta el radio de la sombra para una dispersión más amplia
  },
  callout: {
    width: '90%',
    display:'flex',
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    // marginBottom: 5,
  },
  divider: {
    height: 1,
    width: '90%',
    backgroundColor: 'rgba(206, 206, 206, 0.5)',
    marginVertical: 5,
  },

  ratingContainer: {
    width:'100%',
    display:'flex',
    flexDirection: 'row',
    // justifyContent:'space-evenly',
  },
  calloutDescription: {
    width:'60%',
    textAlign: 'left',
    fontSize: 14,
    color: 'gray',
    marginBottom: 0,
  },
  starsContainer:{
    width:'30%',
    display:'flex',
    flexDirection: 'row',
  },
  calloutButton: {
    width:'35%',
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderRadius: 5,
    alignItems: 'center',
    
  },
  calloutButtonText: {
    fontSize: 12,
    color: '#3179BB',
    marginBottom: 0,
  },
  calloutImageContainer: {
    width: 150,
    height: 100,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 5,
    backgroundColor: 'trasparent',
  },
  calloutImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  calloutImageAndroidCont: {
    marginBottom:15,
    width: 200,
    height: 100,
    backgroundColor: 'white',
  },
  calloutImageAndroid: {
    backgroundColor: 'transparent',
    width: '100%',
    height: '100%',
  },
  addressBttn:{
    width:'100%',
    display:'flex',
    flexDirection:'row',
    alignItems:'center'
  },
  calloutadress:{
    width:'68%',
    fontSize: 14,
    color: 'gray',
    marginBottom: 0,
  }
});

export default CustomCallout;