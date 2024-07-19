import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

interface Promotion {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
}

const mockPromotions: Promotion[] = [
  {
    id: 1,
    title: 'Descuento en Viajes de Aventura',
    description: 'Obtén un 20% de descuento en tu próxima aventura',
    imageUrl: 'https://via.placeholder.com/150',
  },
  {
    id: 2,
    title: '2x1 en Turismo Cultural',
    description: 'Disfruta de un 2x1 en tours culturales',
    imageUrl: 'https://via.placeholder.com/150',
  },
  {
    id: 3,
    title: 'Ofertas en Playas',
    description: 'Descuentos exclusivos en hoteles de playa',
    imageUrl: 'https://via.placeholder.com/150',
  },
];

const FavoritePromotions: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Promociones Favoritas</Text>
      <FlatList
        data={mockPromotions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.promotionCard}>
            <Image source={{ uri: item.imageUrl }} style={styles.promotionImage} />
            <View style={styles.promotionContent}>
              <Text style={styles.promotionTitle}>{item.title}</Text>
              <Text style={styles.promotionDescription}>{item.description}</Text>
              <View style={styles.qrCodeContainer}>
                <QRCode value={`promo_${item.id}`} size={100} />
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3179BB',
    marginBottom: 20,
  },
  promotionCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  promotionImage: {
    width: '100%',
    height: 150,
  },
  promotionContent: {
    padding: 15,
  },
  promotionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3179BB',
    marginBottom: 5,
  },
  promotionDescription: {
    fontSize: 14,
    color: '#555',
  },
  qrCodeContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
});

export default FavoritePromotions;
