import React from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

function DashboardScreen() {
  const navigation = useNavigation();

  const handleSupplierMode = () => {
    // Ajoutez ici la logique pour activer le mode fournisseur
    // Par exemple, naviguer vers SignUpScreen
    navigation.navigate('SignInFournisseur'); // Assurez-vous que le nom de la route est correct
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ color: 'black' }}> Welcome to the Dashboard!</Text>
      <Button title="Mode Fournisseur" onPress={handleSupplierMode} />
    </View>
  );
}

export default DashboardScreen;
