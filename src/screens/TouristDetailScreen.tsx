import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, FlatList, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView, Dimensions, KeyboardAvoidingView, Platform } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store/store';
import {  addNewRating, fetchRatings, updateExistingRating } from '../redux/actions/touristPointActions';
import { Rating, TouristPoint, UserData } from '../redux/types/types';
import { getMemoizedUserData } from '../redux/selectors/userSelectors';
import Loader from '../components/Loader';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { getMemoizedRatings } from '../redux/selectors/touristPointSelectors';
import { Ionicons } from '@expo/vector-icons';


type TouristDetailScreenRouteProp = RouteProp<RootStackParamList, 'TouristDetailScreen'>;
type TouristDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'TouristDetailScreen'>;
const { width: screenWidth } = Dimensions.get('window');
interface TouristDetailScreenProps {
  route: TouristDetailScreenRouteProp;
  navigation: TouristDetailScreenNavigationProp;
}

const TouristDetailScreen: React.FC<TouristDetailScreenProps> = ({ route, navigation }) => {
  const { touristPoint } = route.params;
  const dispatch: AppDispatch = useDispatch();
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [editingRatingId, setEditingRatingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = useSelector(getMemoizedUserData) as UserData;
  const ratings = useSelector(getMemoizedRatings);

  console.log("en el formulario",newComment,newRating);
  
  console.log("todos las valoraciones",ratings);
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("hace el dispach?");
        console.log("pt id?",touristPoint.id);
        dispatch(fetchRatings(touristPoint.id));
      } catch (error) {
        setError('Failed to fetch ratings');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [touristPoint.id, dispatch]);

  const handleAddRating = () => {
    console.log("agrega valoracion???");
    
    const rating = {
      rating: newRating,
      comment: newComment,
      tourist_id: user.user_id,
      
    };
console.log(rating);

    dispatch(addNewRating(rating, touristPoint.id));
    setNewRating(0);
    setNewComment('');
  };

  const handleUpdateRating = () => {
    if (editingRatingId !== null) {
      const updatedRating = {
        id: editingRatingId,
        rating: newRating,
        comment: newComment,
        tourist_id: user.user_id,
        tourist_point_id: touristPoint.id,
      };

      dispatch(updateExistingRating(updatedRating));
      setEditingRatingId(null);
      setNewRating(0);
      setNewComment('');
    }
  };

  const renderStarRating = (rating: number) => {
    const stars = Array.from({ length: 5 }, (_, index) => (
      <Icon
        key={index}
        name={index < rating ? 'star' : 'star-o'}
        size={20}
        color="#FFD700"
      />
    ));
    return <View style={styles.starsContainer}>{stars}</View>;
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text>{error}</Text>;
  }
  const renderItem = ({ item }: { item: Rating }) => (
    <View style={styles.ratingContainer}>
      {renderStarRating(item.rating)}
      <Text style={styles.comment}>{item.comment}</Text>
      {item.tourist_id === user.user_id && (
        <TouchableOpacity onPress={() => {
          setEditingRatingId(item.id);
          setNewRating(item.rating);
          setNewComment(item.comment);
        }}>
          <Text style={styles.editButton}>Edit</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={styles.container}>
        <View style={styles.container}>
          {touristPoint.images && touristPoint.images.length > 0 && (
            touristPoint.images.map(image => (
              <Image key={image.id} source={{ uri: image.image_path }} style={styles.image} />
            ))
          )}
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <MaterialIcons name="arrow-back-ios-new" size={24} color="#3179BB" />
          </TouchableOpacity>
          <View style={styles.container2}>
            <Text style={styles.title}>{touristPoint.title}</Text>
            <Text style={styles.description}>{touristPoint.description}</Text>
            <Text style={styles.averageRating}>Valoracion:</Text>
            {renderStarRating(touristPoint.average_rating ?? 0)}
          </View>
        </View>

        {ratings.filter(rating => rating.tourist_point_id === touristPoint.id).map((rating) => (
          <View key={rating.id} style={styles.ratingContainer}>
            {renderStarRating(rating.rating)}
            <Text style={styles.comment}>{rating.comment}</Text>
            {rating.tourist_id === user.user_id && (
              <TouchableOpacity onPress={() => {
                setEditingRatingId(rating.id);
                setNewRating(rating.rating);
                setNewComment(rating.comment);
              }}>
                <Text style={styles.editButton}>Edit</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}

        <View style={styles.newRatingContainer}>
          <Text style={styles.averageRating}>Tu valoración:</Text>
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setNewRating(star)}>
                <Ionicons name={star <= newRating ? 'star' : 'star-outline'} size={24} color="#FFD700" />
              </TouchableOpacity>
            ))}
          </View>
          <TextInput
            placeholder="Comparte tu experiencia"
            value={newComment}
            onChangeText={setNewComment}
            style={styles.input}
            multiline
          />
          <TouchableOpacity onPress={editingRatingId === null ? handleAddRating : handleUpdateRating} style={styles.button}>
            <Text style={styles.buttonText}>{editingRatingId === null ? 'Enviar valoración' : 'Actualizar valoración'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
    flat:{
        // overflow: 'hidden',  
        width: screenWidth,
        
    },
    container: {
        // padding: 16,
        overflow: 'hidden', 
        width: "100%",
        backgroundColor: '#fff',
      },
      container2:{
        width: "100%",
        padding: 16,
      },
      newRatingContainer: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#f8f8f8',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
      },
  backButton: {
    position: 'absolute',
    width: 45,
    top: 50,
    height: 35,
    left: 10,
    backgroundColor: 'rgb(255, 255, 255)',
    padding: 5,
    borderRadius: 5,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
    elevation: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    marginBottom: 8,
  },
  location: {
    fontSize: 14,
    color: '#555',
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  averageRating: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 16,
  },
  ratingContainer: {
    marginBottom: 16,
    padding: 16,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  comment: {
    fontSize: 16,
    marginVertical: 8,
  },
  editButton: {
    color: '#3179BB',
    marginTop: 8,
    fontWeight: 'bold',
  },
  input: {
    borderColor: '#ddd',
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#3179BB',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TouristDetailScreen;
