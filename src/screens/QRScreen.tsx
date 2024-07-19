// import React, { useEffect, useRef, useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Platform, ActivityIndicator } from 'react-native';
// import QRCode from 'react-native-qrcode-svg';
// import { useDispatch, useSelector } from 'react-redux';
// import { RootState } from '../redux/store/store';
// import { saveQRCode, fetchUserQRCode } from '../services/qrService'; // Supone que tienes un servicio para manejar QR en el backend
// import * as FileSystem from 'expo-file-system';
// import * as Sharing from 'expo-sharing';
// import { UserData } from '../redux/types/types';

// const QRScreen: React.FC = () => {
//   const dispatch = useDispatch();
//   const user = useSelector((state: RootState) => state.user.userData) as UserData;
//   const [qrData, setQrData] = useState('');
//   const [qrImage, setQrImage] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);
//   const qrCodeRef = useRef<QRCode>(null);

//   useEffect(() => {
//     if (user.qr_code_url) {
//       setQrImage(user.qr_code_url);
//     }
//     setLoading(false);
//   }, [user.qr_code_url]);

//   const handleGenerateQR = () => {
//     if (!qrData) {
//       Alert.alert('Error', 'Por favor, ingrese datos para generar el QR');
//       return;
//     }
//     qrCodeRef.current?.toDataURL((dataURL) => {
//       setQrImage(`data:image/png;base64,${dataURL}`);
//     });
//   };

//   const handleSaveQR = async () => {
//     if (!qrImage) {
//       Alert.alert('Error', 'No se ha generado un código QR para guardar');
//       return;
//     }

//     try {
//       const response = await saveQRCode(qrImage); // Supone que tienes un servicio para guardar el QR en el backend
//       if (response.status === 200) {
//         Alert.alert('Success', 'Código QR guardado exitosamente');
//       } else {
//         Alert.alert('Error', 'No se pudo guardar el código QR');
//       }
//     } catch (error) {
//       Alert.alert('Error', 'Ocurrió un error al guardar el código QR');
//     }
//   };

//   if (loading) {
//     return <ActivityIndicator size="large" color="#3179BB" />;
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Código QR</Text>
//       {qrImage ? (
//         <View>
//           <Image source={{ uri: qrImage }} style={styles.qrImage} />
//           <TouchableOpacity style={styles.button} onPress={() => Sharing.shareAsync(qrImage)}>
//             <Text style={styles.buttonText}>Compartir QR</Text>
//           </TouchableOpacity>
//         </View>
//       ) : (
//         <>
//           <TextInput
//             style={styles.input}
//             placeholder="Ingrese los datos para el QR"
//             placeholderTextColor="#aaa"
//             value={qrData}
//             onChangeText={setQrData}
//           />
//           <TouchableOpacity style={styles.button} onPress={handleGenerateQR}>
//             <Text style={styles.buttonText}>Generar QR</Text>
//           </TouchableOpacity>
//         </>
//       )}
//       <QRCode
//         value={qrData}
//         size={200}
//         getRef={(c) => (qrCodeRef.current = c)}
//       />
//       {!user.qr_code_url && (
//         <TouchableOpacity style={styles.button} onPress={handleSaveQR}>
//           <Text style={styles.buttonText}>Guardar QR</Text>
//         </TouchableOpacity>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//     backgroundColor: '#f7f7f7',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     color: '#3179BB',
//   },
//   input: {
//     height: 40,
//     width: '80%',
//     borderColor: '#ddd',
//     borderWidth: 1,
//     borderRadius: 8,
//     marginBottom: 15,
//     paddingHorizontal: 15,
//     backgroundColor: '#fff',
//     fontSize: 16,
//   },
//   qrImage: {
//     width: 200,
//     height: 200,
//     marginBottom: 20,
//   },
//   button: {
//     backgroundColor: '#F1AD3E',
//     paddingVertical: 15,
//     paddingHorizontal: 30,
//     borderRadius: 8,
//     marginTop: 10,
//     alignItems: 'center',
//     width: '60%',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.8,
//     shadowRadius: 2,
//     elevation: 5,
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });

// export default QRScreen;
