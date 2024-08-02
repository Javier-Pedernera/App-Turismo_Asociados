import React from 'react';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const Sidebar: React.FC<DrawerContentComponentProps> = (props) => {
  const navigateToScreen = (screenName: string) => {
    props.navigation.navigate('MainTabs', { screen: screenName });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.option} onPress={() => navigateToScreen('Mapa')}>
        <MaterialCommunityIcons style={styles.icon} name="map" size={24} color="#000" />
        <Text style={styles.optionText}>Mapa</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.option} onPress={() => navigateToScreen('Favoritos')}>
        <MaterialCommunityIcons style={styles.icon} name="folder-heart-outline" size={24} color="#000" />
        <Text style={styles.optionText}>Favoritos</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.option} onPress={() => navigateToScreen('Contacto')}>
        <MaterialCommunityIcons style={styles.icon} name="card-account-phone-outline" size={24} color="#000" />
        <Text style={styles.optionText}>Contacto</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  icon: {
    width:25,
    marginRight: 15,
    marginLeft: 10,
    color:'#F1AD3E'
  },
  optionText: {
    color:'rgb(38, 38, 38)',
    fontSize: 17,
  },
});

export default Sidebar;


// Paleta: naranja: #F1AD3E
//         mostaza: #d59831
//         azul: #3179BB
//         celeste: #64C9ED