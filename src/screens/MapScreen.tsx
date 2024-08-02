import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, TouchableOpacity, Image, Dimensions } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store/store';
import MapViewDirections from 'react-native-maps-directions';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { getMemoizedBranches } from '../redux/selectors/branchSelectors';
import { Platform } from 'react-native';
import { WebView } from 'react-native-webview';
// import { Image } from 'expo-image';

const GOOGLE_MAPS_APIKEY = process.env.EXPO_PUBLIC_API_KEYGOOGLE;
const screenHeight = Dimensions.get('window').height;
const MapScreen: React.FC = () => {
    const branches = useSelector(getMemoizedBranches);
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [loading, setLoading] = useState(true);
    const [destination, setDestination] = useState<{ latitude: number; longitude: number } | null>(null);
    const [selectedBranchId, setSelectedBranchId] = useState<number | null>(null);
    const [route, setRoute] = useState<boolean>(false);

    console.log(branches);
    // console.log("api key==============", GOOGLE_MAPS_APIKEY);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.error('Permission to access location was denied');
                setLoading(false);
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
            setLoading(false);
        })();
    }, []);

    const handleMarkerPress = (branchID: number) => {
        setSelectedBranchId(null);
        setRoute(false)
    };
    const handleRoutePress = (latitude: number, longitude: number) => {
        setDestination({ latitude, longitude });
        setSelectedBranchId(null);
        setRoute(true)
    };


    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#3179BB" />
            </View>
        );
    }

    if (!location || !branches) {
        return (
            <View style={styles.loaderContainer}>
                <Text style={styles.errorText}>Unable to fetch current location or branches</Text>
            </View>
        );
    }

    if (!GOOGLE_MAPS_APIKEY) {
        return (
            <View style={styles.loaderContainer}>
                <Text style={styles.errorText}>Google Maps API key is not defined</Text>
            </View>
        );
    }

    return (
        <MapView
            style={styles.map}
            initialRegion={{
                //ubicacion de usuario
                // latitude: location?.coords.latitude ?? -33.4489,
                // longitude: location?.coords.longitude ?? -70.6693,

                //ubicacion cobquecura
                latitude: -36.133852565671226,
                longitude: -72.79750640571565,

                latitudeDelta: 0.035,
                longitudeDelta: 0.02,
            }}
        >
            {branches.map((branch: any) => (
                <Marker
                    key={branch.branch_id}
                    coordinate={{
                        latitude: branch.latitude ?? 0, // Ensure this never returns undefined
                        longitude: branch.longitude ?? 0, // Ensure this never returns undefined
                    }}
                    title={branch.name}
                    description={branch.description}
                    onPress={() => handleMarkerPress(branch.branch_id)}
                >
                    <MaterialCommunityIcons name="map-marker" size={40} color="#F1AD3E" />
                    <Callout style={route ? styles.calloutContainerHide : styles.calloutContainer} tooltip>
                        <View style={styles.calloutback}>

                        {Platform.OS === 'android' ? (
                            <View style={styles.calloutImageAndroidCont}>
                            <WebView style={styles.calloutImageAndroid} source={{ uri: branch.image_url  }} />
                      </View >
                            // <Text style={styles.calloutImageContainer}>
                            //     <Image
                            //         source={{ uri: branch.image_url }}
                            //         style={styles.calloutImageAndroid}
                            //     />
                            // </Text>
                        ) : (
                            <View style={styles.calloutImageContainer}>
                                <Image
                                    source={{ uri: branch.image_url }}
                                    style={styles.calloutImage}
                                />
                            </View>
                        )}
                        <View style={styles.callout}>
                            <Text style={styles.calloutTitle}>{branch.name}</Text>
                            <View style={styles.divider}></View>
                            <Text style={styles.calloutDescription}>{branch.description}</Text>
                            <Text style={styles.calloutDescription}>{branch.address}</Text>
                        </View>
                        <View>
                            <TouchableOpacity
                                style={styles.calloutButton}
                                onPress={() => handleRoutePress(branch.latitude ?? 0, branch.longitude ?? 0)}
                            >
                                <Text style={styles.calloutButtonText}>Cómo llegar?</Text>
                            </TouchableOpacity>
                        </View>
                        </View>
                    </Callout>

                </Marker>
            ))}
            <Marker
                coordinate={{
                    // marcador cobquecura
                    latitude: -36.133852565671226,
                    longitude: -72.79750640571565,
                    //marcador de usuario
                    //   latitude: location.coords.latitude,
                    //   longitude: location.coords.longitude,
                }}
                title="Tu ubicación"
            >
                <MaterialCommunityIcons name="map-marker-radius" size={40} color="#3179BB" />
            </Marker>
            {destination && (
                <MapViewDirections
                    origin={{
                        //ruta desde cobquecura
                        latitude: -36.133852565671226,
                        longitude: -72.79750640571565,
                        //ruta desde usuario
                        // latitude: location.coords.latitude,
                        // longitude: location.coords.longitude,
                    }}
                    destination={destination}
                    apikey={GOOGLE_MAPS_APIKEY!}
                    strokeWidth={3}
                    strokeColor="#3179BB"
                />
            )}
        </MapView>
    );
};

const styles = StyleSheet.create({
    map: {
        flex: 1,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontSize: 18,
        color: 'red',
    },
    calloutContainer: {
        // alignSelf:'center',
        marginTop: 95,
        // backgroundColor: 'rgba(255, 255, 255, 0.7)',
        height:300,
        width: 250,
        padding: 10,
        display:'flex',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems:'center',
        borderRadius: 10,
         backgroundColor:"transparent",
        
    },
    calloutContainerHide: {
        display: 'none'
    },
    calloutback:{
        height:300,
        width: 250,
        display:'flex',
        borderRadius: 10,
         backgroundColor:"rgba(255, 255, 255,0.8)",
         justifyContent: 'center',
         alignContent: 'center',
         alignItems:'center',
         padding: 10,
    },
    callout: {
        // width:'100%',
        // display: 'flex',
        // justifyContent: 'center',
        // alignContent: 'center',
        // padding: 0,
        height:'30%',
        width: 250,
        alignItems: 'center',
        borderRadius: 10,
       
    },
    calloutTitle: {
        textAlign: 'center',
        // backgroundColor: '#3179BB',
        // alignSelf: 'flex-start',
        // width: 200,
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    calloutButton: {
        backgroundColor: '#3179BB',
        paddingVertical: 5,
        paddingHorizontal: 10,
        width:'80%',
        borderRadius: 5,
        marginTop:25,
        marginBottom: 5,
    },
    calloutButtonText: {
        color: '#fff',
    },
    calloutImageContainer: {
        display:'flex',
        flexDirection:'column',
        alignSelf:'center',
        alignItems: 'center',
        justifyContent:'center',
        alignContent:'center',
        top:0,
        width: 150,
        height: 100,
        borderRadius: 10,
        overflow: 'hidden',
        // marginBottom: 15,
        backgroundColor: 'white',  
    },
    calloutImage: {
        width: 200,
        height: 100,
        resizeMode: 'cover',
    },
    calloutImageAndroidCont:{
        width: 150,
        height: 100,
        backgroundColor: 'white',  
    },
    calloutImageAndroid:{
        // alignSelf:'center',
        width:'100%',
        minHeight: 100,
        backgroundColor: 'white',  
    },
    calloutDescription: {
        textAlign: 'center',
        fontSize: 14,
        color: 'gray',
        marginBottom: 0,
    },
    divider: {
        height: 1,
        width: 200,
        // padding:20,
        marginTop: 5,
        marginBottom: 5,
        backgroundColor: 'rgb(206, 206, 206)',
        marginHorizontal: 15,
    },
});

export default MapScreen;
