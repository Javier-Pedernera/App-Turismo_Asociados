// import React, { useState } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, Image, FlatList, Modal, Alert } from 'react-native';
// import { useSelector } from 'react-redux';
// import { getMemoizedBranches } from '../redux/selectors/branchSelectors';
// import { BranchForm } from '../components/BranchForm';

// const BranchDetails: React.FC = () => {
//   const branches = useSelector(getMemoizedBranches);
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [selectedBranch, setSelectedBranch] = useState(null);

//   const handleEdit = (branch: any) => {
//     setSelectedBranch(branch);
//     setIsModalVisible(true);
//   };

//   const handleDelete = (branchId: number) => {
//     Alert.alert(
//       'Confirmar eliminación',
//       '¿Estás seguro de que deseas eliminar esta sucursal?',
//       [
//         { text: 'Cancelar', style: 'cancel' },
//         {
//           text: 'Eliminar',
//           style: 'destructive',
//           onPress: () => {
//             // Lógica para eliminar la sucursal
//             console.log(`Sucursal con ID ${branchId} eliminada`);
//           },
//         },
//       ],
//     );
//   };

//   const handleCreate = () => {
//     setSelectedBranch(null);
//     setIsModalVisible(true);
//   };

//   const closeModal = () => {
//     setIsModalVisible(false);
//     setSelectedBranch(null);
//   };

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={branches}
//         keyExtractor={(item) => item.branch_id.toString()}
//         renderItem={({ item }) => (
//           <View style={styles.branchContainer}>
//             <Image source={{ uri: item.image_url }} style={styles.image} />
//             <Text style={styles.name}>{item.name}</Text>
//             <View style={styles.buttonContainer}>
//               <TouchableOpacity
//                 style={styles.editButton}
//                 onPress={() => handleEdit(item)}
//               >
//                 <Text style={styles.buttonText}>Editar</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={styles.deleteButton}
//                 onPress={() => handleDelete(item.branch_id)}
//               >
//                 <Text style={styles.buttonText}>Eliminar</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         )}
//       />
//       {!branches.length && <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
//         <Text style={styles.createButtonText}>Crear Sucursal</Text>
//       </TouchableOpacity>}

//       <Modal visible={isModalVisible} animationType="slide">
//         <BranchForm branch={selectedBranch} onClose={closeModal} />
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     backgroundColor: '#fff',
//   },
//   branchContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//     paddingBottom: 8,
//   },
//   image: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     marginRight: 16,
//   },
//   name: {
//     fontSize: 16,
//     flex: 1,
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//   },
//   editButton: {
//     backgroundColor: '#3179BB',
//     padding: 8,
//     borderRadius: 8,
//     marginRight: 8,
//   },
//   deleteButton: {
//     backgroundColor: '#BB3131',
//     padding: 8,
//     borderRadius: 8,
//   },
//   buttonText: {
//     color: '#fff',
//   },
//   createButton: {
//     backgroundColor: '#3179BB',
//     padding: 16,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginTop: 16,
//   },
//   createButtonText: {
//     color: '#fff',
//     fontSize: 16,
//   },
// });

// export default BranchDetails;
