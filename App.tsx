import  { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { Provider } from 'react-redux';
import store from './src/redux/store/store';
import 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

// Evita que la pantalla de carga se oculte hasta que las fuentes estén cargadas
SplashScreen.preventAutoHideAsync();

const App: React.FC = () => {
  // Carga de fuentes
  const [fontsLoaded] = useFonts({
    'Inter-Regular-400': require('./assets/fonts/Inter-Regular-400.otf'),
  });

  useEffect(() => {
    // Oculta la pantalla de carga cuando las fuentes están listas
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // Muestra una pantalla en blanco mientras las fuentes se están cargando
  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Provider store={store}>
        <AppNavigator />
      </Provider>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;