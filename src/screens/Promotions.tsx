import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Modal } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import Icon from 'react-native-vector-icons/Ionicons';

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
  {
    id: 4,
    title: 'Descuento en Montañas',
    description: '10% de descuento en resorts de montaña',
    imageUrl: 'https://via.placeholder.com/150',
  },
  {
    id: 5,
    title: 'Descuentos en Descuentos Exclusivos',
    description: 'Promociones exclusivas para miembros',
    imageUrl: 'https://via.placeholder.com/150',
  },
  {
    id: 6,
    title: 'Ofertas en Restaurantes',
    description: 'Ofertas especiales en restaurantes seleccionados',
    imageUrl: 'https://via.placeholder.com/150',
  },
];

const AvailablePromotions: React.FC = () => {
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleOpenModal = (promotion: Promotion) => {
    setSelectedPromotion(promotion);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setSelectedPromotion(null);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Promociones Disponibles</Text>
      <FlatList
        data={mockPromotions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.promotionCard} onPress={() => handleOpenModal(item)}>
            <Image source={{ uri: item.imageUrl }} style={styles.promotionImage} />
            <View style={styles.promotionContent}>
              <Text style={styles.promotionTitle}>{item.title}</Text>
              <Text style={styles.promotionDescription} numberOfLines={2}>{item.description}</Text>
              <View style={styles.qrCodeContainer}>
                <QRCode value={`promo_${item.id}`} size={100} />
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      <Modal visible={modalVisible} animationType="slide" transparent={true} onRequestClose={handleCloseModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={handleCloseModal}>
              <Icon name="close-circle" size={30} color="#3179BB" />
            </TouchableOpacity>
            {selectedPromotion && (
              <>
                <Image source={{ uri: selectedPromotion.imageUrl }} style={styles.modalImage} />
                <Text style={styles.modalTitle}>{selectedPromotion.title}</Text>
                <Text style={styles.modalDescription}>{selectedPromotion.description}</Text>
              </>
            )}
          </View>
        </View>
      </Modal>
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
    width: '80%',
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  modalImage: {
    width: '100%',
    height: 200,
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#3179BB',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
});

export default AvailablePromotions;
