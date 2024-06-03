import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Modal from 'react-native-modal';

const Commandes = () => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');
  const [currentOrder, setCurrentOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const user = auth().currentUser;
        if (!user) {
          throw new Error('User not authenticated');
        }

        const userOrders = await firestore()
          .collection('commandes')
          .where('userId', '==', user.uid)
          .get();

        const ordersData = userOrders.docs.map(doc => {
          const data = doc.data();
          let statusClient = data.statusClient;

          // Update statusClient based on statusFournisseur
          if (data.statusFournisseur === 'Nouvelle') {
            statusClient = 'Commande en cours de traitement';
          } else if (data.statusFournisseur === 'encours') {
            statusClient = 'En cours de préparation';
          } else if (data.statusFournisseur === 'refusee') {
            statusClient = 'Commande refusée';
          } else if (data.statusFournisseur === 'livree') {
            statusClient = 'Commande Livrée';
          }

          // Add itemKey if it does not exist
          const items = data.items.map(item => ({
            ...item,
            itemKey: item.itemKey || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // Generate a unique id if itemKey does not exist
          }));

          return { id: doc.id, ...data, items, statusClient };
        });

        setOrders(ordersData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleRateOrder = (order) => {
    setCurrentOrder(order);
    setModalVisible(true);
  };

  const submitRating = async () => {
    if (!rating || !comment) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }

    try {
      const user = auth().currentUser;

      if (!user) {
        throw new Error('User not authenticated');
      }

      const item = currentOrder.items[0];
      console.log('item:', item); // Log pour vérifier l'élément complet

      const platId = item?.itemKey;
      const fournisseurId = item?.fournisseurId;

      console.log('platId:', platId);  // Log pour vérifier platId
      console.log('fournisseurId:', fournisseurId);  // Log pour vérifier fournisseurId

      if (!platId || !fournisseurId) {
        throw new Error('Invalid platId or fournisseurId');
      }

      // Ajouter une entrée dans la collection 'ratings'
      await firestore().collection('ratings').add({
        userId: user.uid,
        platId: platId,
        fournisseurId: fournisseurId,
        rating: parseInt(rating),
        comment,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

      // Marquer la commande comme notée
      await firestore().collection('commandes').doc(currentOrder.id).update({
        rated: true,
      });

      setModalVisible(false);
      setRating('');
      setComment('');
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF4B3A" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <View style={styles.container}>
        {orders.length === 0 ? (
          <Text style={styles.emptyText}>Aucune commande trouvée.</Text>
        ) : (
          <View>
            {orders.map(order => (
              <View key={order.id} style={styles.orderContainer}>
                <Text style={styles.orderStatus}>Statut: {order.statusClient}</Text>
                <Text style={styles.orderText}>Plats commandés :</Text>
                <View style={styles.itemsContainer}>
                  {order.items.map((item, index) => (
                    <View key={index} style={styles.itemContainer}>
                      <Text style={styles.itemTitle}>{item.title}</Text>
                      <Text style={styles.itemText}>Quantité: {item.quantity}</Text>
                      <Text style={styles.itemText}>Prix: {item.price} dh</Text>
                    </View>
                  ))}
                </View>
                {order.statusClient === 'Commande Livrée' && !order.rated && (
                  <TouchableOpacity
                    style={styles.rateButton}
                    onPress={() => handleRateOrder(order)}
                  >
                    <Text style={styles.rateButtonText}>Noter le Fournisseur</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        )}
      </View>

      <Modal isVisible={isModalVisible}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Noter le Fournisseur</Text>
          <TextInput
            style={styles.input}
            placeholder="Note (1-5)"
            keyboardType="numeric"
            value={rating}
            onChangeText={setRating}
          />
          <TextInput
            style={styles.input}
            placeholder="Commentaire"
            value={comment}
            onChangeText={setComment}
          />
          <TouchableOpacity style={styles.button} onPress={submitRating}>
            <Text style={styles.buttonText}>Soumettre</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollViewContent: {
    paddingVertical: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    color: 'gray',
  },
  orderContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  orderStatus: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF4B3A',
    marginBottom: 10,
  },
  orderText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  itemsContainer: {
    marginLeft: 10,
  },
  itemContainer: {
    marginBottom: 10,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  itemText: {
    fontSize: 14,
    color: 'gray',
  },
  rateButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#FF4B3A',
    borderRadius: 5,
    alignItems: 'center',
  },
  rateButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#FF4B3A',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
  },
});

export default Commandes;
