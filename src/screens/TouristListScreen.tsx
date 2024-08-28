import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { getMemoizedTouristPoints } from '../redux/selectors/touristPointSelectors';
import { fetchTouristPoints } from '../redux/actions/touristPointActions';
import { AppDispatch } from '../redux/store/store';
import Loader from '../components/Loader';
import { TouristPoint } from '../redux/types/types';
import { Ionicons } from '@expo/vector-icons';

const TouristListScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch<AppDispatch>();
  const touristPoints = useSelector(getMemoizedTouristPoints) as TouristPoint[];
  const [loading, setLoading] = useState(true);
  console.log("puntos turistico en la lista",touristPoints);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchTouristPoints());
      } catch (error) {
        console.error('Error fetching tourist points:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);

  const handlePress = (touristPoint: any) => {
    navigation.navigate('TouristDetailScreen', { touristPoint });
  };

  const renderStarRating = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= rating ? 'star' : i - rating <= 0.5 ? 'star-half' : 'star-outline'}
          size={12}
          color="#FFD700"
        />
      );
    }
    return stars;
  };
  const renderItem = ({ item }: { item: TouristPoint }) => (
    <TouchableOpacity style={styles.itemContainer} onPress={() => handlePress(item)}>
      {item.images && Array.isArray(item.images) && item.images.length > 0 && (
        <Image source={{ uri: item.images[0].image_path }} style={styles.image} />
      )}
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text>{renderStarRating(item.average_rating || 0)}</Text>
      </View>
    </TouchableOpacity>
  );
  if (loading) {
    return <Loader />;
  }

  return (
    <View style={styles.container}>
      {
        touristPoints &&
        <FlatList
          data={touristPoints}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding:10
  },
  itemContainer: {
    flexDirection: 'row',
    width: '100%',
    alignSelf:'center',
    padding: 10,
    backgroundColor: '#fff',
    marginBottom: 5,
    borderRadius: 5,
    elevation: 1,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 5,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom:10
  },
});

export default TouristListScreen;
