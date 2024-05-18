import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator, ScrollView } from 'react-native';
import MyView from '../components/MyView';
import MyText from '../components/MyText';
import Search from '../components/Search';
import Category from '../components/Category';
import firestore from '@react-native-firebase/firestore';
import FoodCard from '../components/FoodCard';
import { FlatList } from 'react-native';

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

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <ScrollView style={styles.scrollView}>
      <MyView style={styles.con}>
        <MyText style={{ marginTop: 30, marginBottom: 7, marginLeft: 21, fontSize: 19 }}>Welcome</MyText>
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
});

export default HomeScreen;
