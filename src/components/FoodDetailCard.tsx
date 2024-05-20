import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Importation des images
import favorieImage from './../../assets/images/favorie.png';
import favoriteSelectedImage from './../../assets/images/favorite-selected.png';

function FoodDetailCard({ image, title, price, description }) {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavoriteToggle = async () => {
    try {
      // Récupérer la liste des favoris depuis le stockage local
      const favorites = await AsyncStorage.getItem('favorites');
      let favoritesArray = [];
      if (favorites) {
        favoritesArray = JSON.parse(favorites);
      }

      // Vérifier si l'élément est déjà dans les favoris
      const index = favoritesArray.indexOf(title);
      if (index !== -1) {
        // Supprimer l'élément s'il est déjà dans les favoris
        favoritesArray.splice(index, 1);
        setIsFavorite(false);
      } else {
        // Ajouter l'élément aux favoris
        favoritesArray.push(title);
        setIsFavorite(true);
      }

      // Mettre à jour la liste des favoris dans le stockage local
      await AsyncStorage.setItem('favorites', JSON.stringify(favoritesArray));
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  return (
    <View style={styles.card}>
      <Image source={{ uri: image }} style={styles.image} />
      <View style={styles.header}>
        <TouchableOpacity style={styles.favoriteButton} onPress={handleFavoriteToggle}>
          <Image
            source={isFavorite ? favoriteSelectedImage : favorieImage}
            style={styles.favoriteIcon}
          />
        </TouchableOpacity>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.price}>{price} MAD</Text>
        </View>
      </View>
      <View style={styles.descriptionContainer}>
        <Text style={styles.description}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    width: '95%',
    marginVertical: 10,
    position: 'relative', // Permet de positionner l'icône de favori absolument par rapport à cette vue
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  textContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 4,
    fontFamily: 'Raleway-Bold',
  },
  price: {
    fontSize: 24,
    color: 'black',
    marginBottom: 10,
    fontFamily: 'Raleway-Bold',
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 16,
    marginBottom: 16,
  },
  descriptionContainer: {
    width: '100%',
  },
  description: {
    fontSize: 15,
    color: 'gray',
    fontFamily: 'Raleway-Bold',

  },
  favoriteButton: {
    position: 'absolute', // Position absolue par rapport au parent
    top: 10, // Décalage de 10 unités vers le haut
    right: 10, // Décalage de 10 unités vers la droite
  },
  favoriteIcon: {
    width: 30,
    height: 30,
  },
});

export default FoodDetailCard;
