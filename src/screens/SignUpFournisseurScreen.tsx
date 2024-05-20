import React, { useState, useEffect } from 'react';
import { View, ScrollView, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import database from '@react-native-firebase/database';

const SignInScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  async function handleSignUp() {
    if (password !== confirmPassword) {
      Alert.alert("Les mots de passe ne correspondent pas.");
      return;
    }
    try {
      const userCredentials = await auth().createUserWithEmailAndPassword(email, password);
      const userId = userCredentials.user.uid;
      console.log('Utilisateur inscrit avec succès:', userCredentials.user);

      // Enregistrez les données de l'utilisateur dans la base de données Firebase Realtime
      await database().ref(`/users/${userId}`).set({
        email: email,
        phoneNumber: phoneNumber,
      });

      navigation.navigate('Welcome');
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      Alert.alert('Erreur d\'inscription', error.message);
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.title}>inscription fournisseur</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          onChangeText={setEmail}
          value={email}
          color="black" // Ajout de la couleur noire pour le texte
          placeholderTextColor="grey" // Ajout de la couleur grise pour le placeholder
        />
        <TextInput
          style={styles.input}
          placeholder="Mot de passe"
          secureTextEntry={true}
          onChangeText={setPassword}
          value={password}
          color="black" // Ajout de la couleur noire pour le texte
          placeholderTextColor="grey" // Ajout de la couleur grise pour le placeholder
        />
        <TextInput
          style={styles.input}
          placeholder="Confirmer le mot de passe"
          secureTextEntry={true}
          onChangeText={setConfirmPassword}
          value={confirmPassword}
          color="black" // Ajout de la couleur noire pour le texte
          placeholderTextColor="grey" // Ajout de la couleur grise pour le placeholder
        />
        <TextInput
          style={styles.input}
          placeholder="Numéro de téléphone"
          keyboardType="phone-pad"
          onChangeText={setPhoneNumber}
          value={phoneNumber}
          color="black" // Ajout de la couleur noire pour le texte
          placeholderTextColor="grey" // Ajout de la couleur grise pour le placeholder
        />
        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>S'inscrire</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: '#DFDEDA',
  },
  title: {
    fontSize: 30,
    fontFamily: 'Raleway-Bold',
    marginTop: 20,
    marginBottom: 20,
    color: '#FF4B3A',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#EFEFEE',
    marginBottom: 20,
    paddingLeft: 10,
    borderRadius: 10,
    fontFamily: 'Raleway-Medium',
  },
  button: {
    backgroundColor: '#FF4B3A',
    borderRadius: 10,
    height: 50,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'Raleway-Bold',
    fontSize: 19,
    color: 'black',
  },
});

export default SignInScreen;
