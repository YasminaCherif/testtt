import React from 'react';
import {StyleSheet, View, TextInput} from 'react-native';

function Search() {
  return (
    // Vue contenant le champ de texte pour la recherche
    <View style={styles.container}>
      {/* Champ de texte pour la recherche */}
      <TextInput style={{width: '100%'}} placeholder="Search for a food item" />
    </View>
  );
}

// Styles pour le composant Search
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white', // Fond blanc
    height: 49, // Hauteur de la vue
    width: '88%', // Largeur de la vue
    alignSelf: 'center', // Alignement au centre
    borderRadius: 15, // Bord arrondi
    justifyContent: 'center', // Centrage vertical
    alignItems: 'center', // Centrage horizontal
    paddingLeft: 13.5, // Marge à gauche
    marginBottom: 17, // Marge en bas
  },
});

export default Search; // Export du composant Search
