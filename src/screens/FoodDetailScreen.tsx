import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator, Text, TouchableOpacity, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import FoodDetailCard from '../components/FoodDetailCard';
import AsyncStorage from '@react-native-async-storage/async-storage';

function FoodDetailScreen({ route }) {
  const { itemKey } = route.params;
  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFoodDetail = async () => {
      try {
        const documentSnapshot = await firestore().collection('plats').doc(itemKey).get();
        if (documentSnapshot.exists) {
          setFood(documentSnapshot.data());
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching food details:', error);
        setLoading(false);
      }
    };
    fetchFoodDetail();
  }, [itemKey]);

  const handleAddToCart = () => {
    // Logique pour ajouter l'article au panier
    Alert.alert("Succès", `${food.title} a été ajouté au panier.`);
  };

  const handleAddToFavorites = async () => {
    try {
      const favoritesString = await AsyncStorage.getItem('favorites');
      const favorites = favoritesString ? JSON.parse(favoritesString) : [];

      if (!favorites.find(favorite => favorite.itemKey === itemKey)) {
        favorites.push({ itemKey, title: food.title, price: food.price }); // Assurez-vous de stocker le prix
        await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
        setIsFavorite(true);
        Alert.alert('Succès', `${food.title} a été ajouté aux favoris.`);
      } else {
        Alert.alert('Info', `${food.title} est déjà dans vos favoris.`);
      }
      console.log('Favorites:', favorites);
    } catch (error) {
      console.error('Error adding to favorites:', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de l\'ajout aux favoris.');
    }
  };


  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!food) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Plat non trouvé</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FoodDetailCard
        image={food.imageURL}
        title={food.title}
        price={food.price}
        description={food.description}
      />
      <TouchableOpacity style={styles.button} onPress={handleAddToCart}>
        <Text style={styles.buttonText}>Ajouter au panier</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleAddToFavorites}>
        <Text style={styles.buttonText}>Ajouter aux favoris</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#C7C8CC',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#FF4B3A',
    borderRadius: 15,
    height: 50,
    width: '94%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default FoodDetailScreen;
