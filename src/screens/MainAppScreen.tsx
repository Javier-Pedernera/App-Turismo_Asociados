import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentComponentProps, useDrawerStatus } from '@react-navigation/drawer';
import { StyleSheet, TouchableOpacity } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { FontAwesome } from '@expo/vector-icons';
import UserCredential from './UserCredential';
import PromotionsScreen from './PromotionsScreen';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Sidebar from '../components/Sidebar';
import PlaceholderScreen from './PlaceholderScreen';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../redux/store/store';
import { fetchBranches } from '../redux/actions/branchActions';
import MapScreen from './MapScreen';
import FavoritesScreen from './FavoritesScreen';
import ContactComponent from './ContactoScreen';
import TouristListScreen from './TouristListScreen';
import TouristDetailScreen from './TouristDetailScreen';

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const MainTabs = () => {
  const navigation = useNavigation();
  const drawerStatus = useDrawerStatus();
  const [focusedTab, setFocusedTab] = useState<string | null>(null);

  const getIconName = (routeName: string): any => {
    switch (routeName) {
      case 'Inicio':
        return 'home';
      case 'Mapa':
        return 'map-o';
      case 'Descuentos':
        return 'ticket';
      case 'Credencial':
        return 'address-card';
      case 'Más':
        return 'more-horiz';
      default:
        return 'circle';
    }
  };

  useEffect(() => {
    if (drawerStatus === 'open') {
      setFocusedTab('Más');
    } else {
      setFocusedTab(null);
    }
  }, [drawerStatus]);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          const iconName = getIconName(route.name);
          if (route.name === 'Más') {
            const isFocused = focusedTab === 'Más';
            return (
              <TouchableOpacity
                onPress={() => {
                  navigation.dispatch(DrawerActions.toggleDrawer());
                }}
              >
                <MaterialIcons name={isFocused ? 'read-more' : iconName} size={size} color={isFocused ? '#3179BB' : '#aaa'} />
              </TouchableOpacity>
            );
          }
          const isFocused = focusedTab === route.name;
          return <FontAwesome name={iconName} size={size} color={isFocused ? '#3179BB' : color} />;
        },
        tabBarActiveTintColor: '#3179BB',
        tabBarInactiveTintColor: '#aaa',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 0,
          elevation: 5,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.8,
          shadowRadius: 2,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: 'bold',
        },
        tabBarIconStyle: {
          marginTop: 1,
        },
        tabBarItemStyle: {
          padding: 5,
        },
      })}
    >
      <Tab.Screen
        name="Inicio"
        component={HomeScreen}
        options={{ headerShown: false }}
        listeners={{
          tabPress: () => setFocusedTab('Inicio'),
        }}
      />
       <Tab.Screen
        name="Mapa"
        component={MapScreen}
        options={{ headerShown: false }}
        listeners={{
          tabPress: () => setFocusedTab('Mapa'),
        }}
      />
      <Tab.Screen
        name="Descuentos"
        component={PromotionsScreen}
        options={{ headerShown: false }}
        listeners={{
          tabPress: () => setFocusedTab('Descuentos'),
        }}
      />
      <Tab.Screen
        name="Credencial"
        component={UserCredential}
        options={{ headerShown: false }}
        listeners={{
          tabPress: () => setFocusedTab('Credencial'),
        }}
      />
      <Tab.Screen
        name="Más"
        component={PlaceholderScreen}
        options={{ headerShown: false }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.dispatch(DrawerActions.toggleDrawer());
          },
        })}
      />
     <Tab.Screen
        name="Perfil"
        component={ProfileScreen}
        options={{ tabBarButton: () => null, headerShown: false  }}
      />
      <Tab.Screen
        name="Favoritos"
        component={FavoritesScreen}
        options={{ tabBarButton: () => null, headerShown: false }}
      />
      <Tab.Screen
        name="Contacto"
        component={ContactComponent}
        options={{ tabBarButton: () => null, headerShown: false }}
      />
      <Tab.Screen
        name="PuntosTuristicos"
        component={TouristListScreen}
        options={{ tabBarButton: () => null, headerShown: false  }}
      />
      {/* <Tab.Screen
        name="DetallePuntoTuristico"
        component={TouristDetailScreen}
        options={{ tabBarButton: () => null, headerShown: false  }}
      /> */}
      
    </Tab.Navigator>
    
  );
};

const MainAppScreen: React.FC = () => {
  

  return (
    <Drawer.Navigator
      drawerContent={(props: DrawerContentComponentProps) => <Sidebar {...props} />}
      screenOptions={{
        drawerPosition: 'right',
        drawerStyle: {
          width: 250,
        },
      }}
    >
      <Drawer.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
    </Drawer.Navigator>
  );
};

export default MainAppScreen;

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#7F5DF0',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
});
