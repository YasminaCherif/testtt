import React, { useEffect, useState } from 'react';
import { Button, View, StyleSheet, Text, TextInput } from 'react-native';
import { CardField, useStripe } from '@stripe/stripe-react-native';
import functions from '@react-native-firebase/functions';
import firestore from '@react-native-firebase/firestore';
import { useNavigation, useRoute } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

const PaymentScreen = () => {
  const { confirmPayment } = useStripe();
  const [cardDetails, setCardDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [paymentMethod, setPaymentMethod] = useState(''); // Default payment method is empty
  const [address, setAddress] = useState(''); // State to store the address
  const navigation = useNavigation();
  const route = useRoute();
  const { amount, items, userId } = route.params;

  useEffect(() => {
    createPaymentIntent();
  }, []);

  const createPaymentIntent = async () => {
    try {
      const createPaymentIntent = functions().httpsCallable('createPaymentIntent');
      const paymentIntentData = await createPaymentIntent({
        amount: amount * 100,
        currency: 'usd',
        items,
        userId,
      });

      const clientSecret = paymentIntentData?.data?.paymentIntent;
      if (clientSecret) {
        setClientSecret(clientSecret);
      } else {
        throw new Error('Client secret is missing in the response');
      }
    } catch (error) {
      console.error('Error creating payment intent:', error);
    }
  };

  const handlePayment = async () => {
    try {
      setLoading(true);

      if (paymentMethod === 'card') {
        if (!cardDetails?.complete) {
          console.log('Please enter complete card details.');
          return;
        }

        console.log('Client Secret:', clientSecret);
        if (!clientSecret) {
          throw new Error('Client secret is empty');
        }

        const { error, paymentIntent } = await confirmPayment(clientSecret, {
          paymentMethodType: 'Card',
        });

        if (error) {
          console.log('Payment failed:', error.message);
        } else {
          console.log('Payment successful:', paymentIntent);
        }
      } else if (paymentMethod === 'delivery') {
        await handlePaymentOnDelivery(); // Call function for payment on delivery
      }

      const orderId = await createOrder(items, userId, amount, address); // Pass the address to createOrder
      if (!orderId) {
        throw new Error('Erreur lors de la création de la commande');
      }

      await firestore().collection('commandes').doc(orderId).update({
        statusFournisseur: 'Nouvelle', // Only updating fournisseur status
        address, // Save the address in the order document
      });

      navigation.navigate('PaymentSuccessScreen');
    } catch (error) {
      console.error('Error during payment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentOnDelivery = async () => {
    try {
      setLoading(true);

      // Handle payment on delivery logic
      // For example, you can update the order status or any other relevant action
    } catch (error) {
      console.error('Error during payment on delivery:', error);
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (items, userId, totalPrice, address) => {
    try {
      const orderDetails = {
        userId,
        items: items.map(item => ({
          ...item,
          fournisseurId: item.fournisseurId || 'unknown',
          imageURL: item.imageURL || 'unknown', // Include imageURL here
          averageRating: item.averageRating || 0, // Include averageRating here
        })),
        totalPrice,
        createdAt: firestore.FieldValue.serverTimestamp(),
        address,
      };

      const orderRef = await firestore().collection('commandes').add(orderDetails);
      return orderRef.id;
    } catch (error) {
      console.error('Error creating order:', error);
      return null;
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Adresse de livraison"
        onChangeText={setAddress}
        value={address}
      />
      <Button title="Payer à la livraison" onPress={() => setPaymentMethod('delivery')} disabled={loading} />
      <Button title="Payer par carte" onPress={() => setPaymentMethod('card')} disabled={loading} />
      {paymentMethod && (
        <>
          <CardField
            postalCodeEnabled={false}
            placeholder={{
              number: '4242 4242 4242 4242',
            }}
            cardStyle={{
              backgroundColor: 'black',
              textColor: 'white',
            }}
            style={styles.cardField}
            onCardChange={setCardDetails}
          />
          <Button title="Valider" onPress={handlePayment} disabled={loading} />
        </>
      )}
      {loading && <Text>Loading...</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  cardField: {
    height: 50,
    marginVertical: 30,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});

export default PaymentScreen;
