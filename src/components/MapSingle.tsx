import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform, Dimensions, ActivityIndicator } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import CustomCallout from '../components/CustomCallout';
import { Branch } from '../redux/types/types';
import { Ionicons } from '@expo/vector-icons';



const GOOGLE_MAPS_APIKEY = process.env.EXPO_PUBLIC_API_KEYGOOGLE;
const { width: screenWidth } = Dimensions.get('window');
const screenHeight = Dimensions.get('window').height;

interface MapComponentProps {
  branch: any | null;
  currentPosition: { latitude: number, longitude: number } | null;
  destination: { latitude: number, longitude: number } | null;
  routeSelected: boolean;
  selectedBranch: any;
  handleMapPress: () => void;
  handleGetDirections: () => void;
  setSelectedBranch: (branch: any) => void;
  routeLoading: boolean;
  setRouteLoading: (loading: boolean) => void;
  ratings: any
}

const MapSingle: React.FC<MapComponentProps> = ({
  ratings,
  branch,
  currentPosition,
  destination,
  routeSelected,
  selectedBranch,
  handleMapPress,
  handleGetDirections,
  setSelectedBranch,
  routeLoading,
  setRouteLoading,
}) => {

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
    <View style={styles.mapContainer}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: branch?.latitude || 0,
          longitude: branch?.longitude || 0,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        onPress={handleMapPress}
      >
        {branch && (
          <Marker
            coordinate={{ latitude: branch.latitude, longitude: branch.longitude }}
            onPress={() => setSelectedBranch(branch)}
          >
            <MaterialCommunityIcons name="map-marker" size={40} color="#F1AD3E" />
            {Platform.OS === 'ios' && (
              <Callout style={routeSelected ? styles.calloutContainerHide : styles.calloutContainerIos} tooltip>
                <View style={styles.callout}>
                  <View style={styles.calloutImageContainer}>
                    <Image source={{ uri: branch.image_url }} style={styles.calloutImage} />
                  </View>
                  <Text style={styles.calloutTitle}>{branch.name}</Text>
                  <View style={styles.divider}></View>
                  <View style={styles.ratingContainer}>
                    {renderStars(ratings.average_rating)}
                  </View>
                  <Text style={styles.calloutDescription}>{branch.description}</Text>
                  <Text style={styles.calloutDescription}>{branch.address}</Text>
                  <TouchableOpacity style={styles.calloutButton} onPress={handleGetDirections}>
                    <Text style={styles.calloutButtonText}>Cómo llegar?</Text>
                  </TouchableOpacity>
                </View>
              </Callout>
            )}
          </Marker>
        )}
        {currentPosition && (
          <Marker coordinate={currentPosition} title="Mi ubicación" pinColor="blue">
            <MaterialCommunityIcons name="map-marker-radius" size={40} color="#3179BB" />
          </Marker>
        )}
        {destination && currentPosition && (
          <MapViewDirections
            origin={{
              latitude: currentPosition.latitude,
              longitude: currentPosition.longitude,
            }}
            destination={destination}
            apikey={GOOGLE_MAPS_APIKEY!}
            strokeWidth={3}
            strokeColor="#3179BB"
            timePrecision="none"
            precision="high"
            onStart={() => setRouteLoading(true)}
            onReady={() => setRouteLoading(false)}
          />
        )}
      </MapView>
        {routeLoading && (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color="#64C9ED" />
          </View>
        )}
      {selectedBranch && !routeSelected && Platform.OS === 'android' && (
        <View style={styles.calloutContainer}>
          <CustomCallout branch={selectedBranch} handleRoutePress={handleGetDirections} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mapContainer: {
    padding: 1,
  },
  map: {
    width: '100%',
    height:screenHeight *0.5,
    // height: 400,
    marginTop: 20,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 5,
  },
  calloutContainerHide: {
    display: 'none',
  },
  calloutContainerIos: {
    width: 200,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  callout: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  calloutImageContainer: {
    width: 120,
    height: 90,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calloutImage: {
    width: 130,
    height: 80,
    borderRadius: 5,
    marginBottom: 5,
  },
  calloutTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  calloutButton: {
    backgroundColor: '#3179BB',
    marginTop: 10,
    padding: 5,
    borderRadius: 5,
  },
  calloutButtonText: {
    color: '#fff',
    fontSize: 12,
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: 'gray',
    opacity: 0.5,
    marginVertical: 5,
  },
  calloutDescription: {
    textAlign: 'center',
    fontSize: 12,
    color: 'gray',
    marginBottom: 0,
  },
  calloutContainer: {
    width: 200,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  loader: {
    position: 'absolute',
    top: '50%',
    left: '45%',
  },
});

export default MapSingle;