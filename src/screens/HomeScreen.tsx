import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator, ScrollView, Image, TouchableOpacity, FlatList } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import MyView from '../components/MyView';
import MyText from '../components/MyText';
import Search from '../components/Search';
import Category from '../components/Category';
import firestore from '@react-native-firebase/firestore';
import FoodCard from '../components/FoodCard';
import DashboardIcon from './../../assets/images/dashbord.png';
import CartIcon from './../../assets/images/panier.png';
import FavoriteIcon from './../../assets/images/favorie.png';
import ContactIcon from './../../assets/images/contact.png';
import HomeIcon from './../../assets/images/home.png';
import FavoritesScreen from './FavoritesScreen';
import ContactScreen from './ContactScreen';
import CartScreen from './CartScreen';

const Tab = createBottomTabNavigator();

function HomeScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [foods, setFoods] = useState([]);
  const [promotions, setPromotions] = useState([]);

  useEffect(() => {
    const subscriber = firestore()
      .collection('categories')
      .onSnapshot(querySnapshot => {
        const categories = [];
        querySnapshot.forEach(documentSnapshot => {
          categories.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });
        setCategories(categories);
        setLoading(false);
      });
    return () => subscriber();
  }, []);

  useEffect(() => {
    const subscriber = firestore().collection("foods").onSnapshot((res) => {
      const foods = []
      res.forEach(documentSnapshot => {
        foods.push({
          ...documentSnapshot.data(),
          key: documentSnapshot.id,
        });
      });
      setFoods(foods);
    })
    return () => subscriber()
  },[])

  useEffect(() => {
    const subscriber = firestore()
      .collection('promotions')
      .onSnapshot(querySnapshot => {
        const promotions = [];
        querySnapshot.forEach(documentSnapshot => {
          promotions.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });
        setPromotions(promotions);
        setLoading(false);
      });
    return () => subscriber();
  }, []);

  const navigateToDashboard = () => {
    navigation.navigate('Dashboard');
  };

  const navigateToCart = () => {
    navigation.navigate('cart'); // Make sure the route name is 'Cart'
  };

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <ScrollView style={styles.scrollView}>
      <MyView style={styles.con}>
        <View style={styles.header}>
          <TouchableOpacity onPress={navigateToDashboard}>
            <Image source={DashboardIcon} style={styles.icon} />
          </TouchableOpacity>
          <MyText style={styles.headerText}>Découvrez Nos Délice</MyText>
          <TouchableOpacity onPress={navigateToCart}>
            <Image source={CartIcon} style={styles.icon} />
          </TouchableOpacity>
        </View>
        <Search />
        <MyText style={styles.text}>Catégories</MyText>
        <View style={{ height: 150 }}>
          <FlatList
            horizontal
            data={categories}
            renderItem={({ item }) => (
              <Category title={item.title} itemKey={item.key} image={{ uri: item.imageURL }} />
            )}
          />
        </View>
        <MyText style={styles.text}>Les plus populaires </MyText>
        <FlatList
          horizontal
          data={foods}
          renderItem={({ item }) => (
            <FoodCard
              image={item.imageURL}
              title={item.title}
              price={item.price}
              rate={item.rate}
              itemKey={item.key}
            />
          )}
        />
        <MyText style={styles.text}>Nos promotions </MyText>
        <FlatList
          horizontal
          data={promotions}
          renderItem={({ item }) => (
            <FoodCard
              image={item.imageURL}
              title={item.title}
              price={item.price}
              rate={item.rate}
              itemKey={item.key}
            />
          )}
        />
      </MyView>
    </ScrollView>
  );
}


function TabNavigator() {
  return (
    <Tab.Navigator tabBarOptions={{ showLabel: false }}>
      <Tab.Screen
        name="home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Image source={HomeIcon} style={[styles.icon, { tintColor: color }]} />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="favorite"
        component={FavoritesScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Image source={FavoriteIcon} style={[styles.icon, { tintColor: color }]} />
          ),
          headerShown: false,
        }}
        listeners={({ navigation }) => ({
          tabPress: (event) => {
            event.preventDefault();
            navigation.navigate('favorite');
          },
        })}
      />
      <Tab.Screen
        name="contact"
        component={ContactScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Image source={ContactIcon} style={[styles.icon, { tintColor: color }]} />
          ),
          headerShown: false,
        }}
        listeners={({ navigation }) => ({
          tabPress: (event) => {
            event.preventDefault();
            navigation.navigate('contact');
          },
        })}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#f7f6ff',
  },
  con: {
    backgroundColor: '#f7f6ff',
  },
  text: {
    marginLeft: 21,
    fontSize: 19,
    marginBottom: 13,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginTop: 20,
  },
  icon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  headerText: {
    flex: 1,
    marginLeft: 21,
    fontSize: 20,
    marginTop: 7,
    marginBottom: 7,
  },
});

export default TabNavigator;
