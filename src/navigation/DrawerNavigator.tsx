// // src/navigation/DrawerNavigator.tsx

// import React from 'react';
// import { createDrawerNavigator } from '@react-navigation/drawer';
// import { NavigationContainer } from '@react-navigation/native';
// import MainAppScreen from '../screens/MainAppScreen';
// import FavoritePromotions from '../screens/FavoritePromotions';
// import ProfileScreen from '../screens/ProfileScreen';
// import PageUnderConstruction from '../screens/PageUnderConstruction';

// const Drawer = createDrawerNavigator();

// const DrawerNavigator = () => {
//   return (
//     <NavigationContainer>
//       <Drawer.Navigator initialRouteName="MainAppScreen">
//         <Drawer.Screen name="Inicio" component={MainAppScreen} />
//         <Drawer.Screen name="Promociones Favoritas" component={FavoritePromotions} />
//         <Drawer.Screen name="Perfil" component={ProfileScreen} />
//         <Drawer.Screen name="Más Opciones" component={PageUnderConstruction} />
//       </Drawer.Navigator>
//     </NavigationContainer>
//   );
// };

// export default DrawerNavigator;
