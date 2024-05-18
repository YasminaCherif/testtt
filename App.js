import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import MainContainer from './navigation/MainContainer'; // Importation de votre conteneur principal de navigation
import 'react-native-gesture-handler';
const App = () => {
  return (
    <NavigationContainer>
      <MainContainer />
    </NavigationContainer>
  );
};

export default App;