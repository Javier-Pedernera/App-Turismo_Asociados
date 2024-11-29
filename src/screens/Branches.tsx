import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, FlatList, Modal } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getMemoizedBranches } from '../redux/selectors/branchSelectors';
import { BranchForm } from '../components/BranchForm';
import SemicirclesOverlay from '../components/SemicirclesOverlay';
import { Dimensions } from 'react-native';
import { fetchPartnerById } from '../redux/actions/userActions';
import { getMemoizedUserData } from '../redux/selectors/userSelectors';
import { UserData } from '../redux/types/types';
import { fetchBranches } from '../redux/actions/branchActions';
import { AppDispatch } from '../redux/store/store';

const API_URL = process.env.EXPO_PUBLIC_API_URL;
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const Branches: React.FC = () => {
  const branches = useSelector(getMemoizedBranches);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const user = useSelector(getMemoizedUserData) as UserData;
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchPartnerById(user.user_id));
    dispatch(fetchBranches(user.user_id));
  }, []);

  const handleView = (branch: any) => {
    setSelectedBranch(branch);
    setIsModalVisible(true);
  };

  const handleCreate = () => {
    setSelectedBranch(null);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedBranch(null);
  };
console.log("sucursales",branches);
// console.log("imprimo imagende la sucursal miniatura",`${API_URL}${branches[0].image_url}`);

  return (
    <View style={styles.container}>
      <SemicirclesOverlay/>
      <Text style={styles.nameTitle}>Sucursal activa</Text>
      {!branches?.length?
        <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
          <Text style={styles.createButtonText}>Crear Sucursal</Text>
        </TouchableOpacity>:
         <FlatList
        data={branches}
        keyExtractor={(item) => item.branch_id.toString()}
        renderItem={({ item }) => (
          <View style={styles.branchContainer}>
            {item.image_url ? <Image source={{ uri: `${API_URL}${item.image_url}` }} style={styles.image} /> :
              <Image
                source={require('../../assets/noimage.png')}
                style={styles.image}
                alt={item.name}
              />}
            <Text style={styles.name}>{item.name}</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.viewButton}
                onPress={() => handleView(item)}
              >
                <Text style={styles.buttonText}>Ver</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      }
      <Modal visible={isModalVisible} animationType="slide">
        <BranchForm branch={selectedBranch} onClose={closeModal} />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display:'flex',
    height: screenHeight ,
    padding: 15,
    backgroundColor: '#fff',
  },
  nameTitle:{
    height: screenHeight *0.25,
    fontSize: 16,
    color:'#fff',
    fontWeight:'600',
    textAlign:'center',
  },
  branchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingTop: 10,
    paddingBottom: 8,
    paddingLeft:5,
    paddingRight:5
  },
  image: {
    width: 90,
    height: 50,
    marginRight: 16,
  },
  name: {
    fontSize: 16,
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  viewButton: {
    backgroundColor: '#007a8c',
    padding: 8,
    borderRadius: 8,
    width:80,
    textAlign:'center',
    height:48,
    alignItems:'center',
    justifyContent:'center'

  },
  buttonText: {

    textAlign:'center',
    color: '#fff',
  },
  createButton: {
    backgroundColor: '#007a8c',
    padding: 10,
    width:'80%',
    borderRadius: 8,
    alignSelf:'center',
    marginTop: 16,
    height:48,
    alignItems:'center',
    justifyContent:'center'
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Branches;
