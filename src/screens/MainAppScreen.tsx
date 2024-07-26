import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { FontAwesome } from '@expo/vector-icons';
import UserCredential from './UserCredential';
import FavoritePromotions from './FavoritePromotions';
import PageUnderConstruction from './PageUnderConstruction';
import PromotionsScreen from './PromotionsScreen';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const Tab = createBottomTabNavigator();

const MainAppScreen: React.FC = () => {

  const getIconName = (routeName: string): any => {
    switch (routeName) {
      case 'Inicio':
        return 'home';
      case 'Perfil':
        return 'user';
      case 'Descuentos':
        return 'ticket';
      case 'Más':
        return 'menu-open';
      case 'Credencial':
        return 'address-card';
      default:
        return 'circle';
    }
  };

  return (
      <Tab.Navigator 
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            const iconName = getIconName(route.name);
            if(iconName == 'menu-open'){
              return <MaterialCommunityIcons name="menu-open" size={size} color={color} />
            }else{
              return <FontAwesome name={iconName} size={size} color={color} />;
            }
            
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
        <Tab.Screen name="Inicio" component={HomeScreen} options={{ headerShown: false }} />
        <Tab.Screen name="Perfil" component={ProfileScreen} options={{ headerShown: false }}/>
        <Tab.Screen name="Descuentos" component={PromotionsScreen} options={{ headerShown: false }} />
        <Tab.Screen name="Credencial" component={UserCredential} options={{ headerShown: false }}/>
        <Tab.Screen name="Más" component={PageUnderConstruction} options={{ headerShown: false }}/>
      </Tab.Navigator>
  );
};

export default MainAppScreen;