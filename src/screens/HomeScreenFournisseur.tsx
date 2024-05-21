import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator, FlatList, Image, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-virtualized-view';
import MyView from '../components/MyView';
import MyText from '../components/MyText';
import Search from '../components/Search';
import Category from '../components/Category';
import firestore from '@react-native-firebase/firestore';
import FoodCard from '../components/FoodCard';
import AddPlat from '../components/AddPlat';
import DashboardIcon from './../../assets/images/dashbord.png';
import CartIcon from './../../assets/images/panier.png';

function HomeScreenFournisseur({ navigation }) {
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [promotions, setPromotions] = useState([]);
    const [foods, setFoods] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [plats, setPlats] = useState([]);

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
            const foods = [];
            res.forEach(documentSnapshot => {
                foods.push({
                    ...documentSnapshot.data(),
                    key: documentSnapshot.id,
                });
            });
            setFoods(foods);
        });
        return () => subscriber();
    }, []);

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

    const navigateToAddPlat = () => {
            navigation.navigate('AddPlat'); // Remplacez 'AddPlat' par le nom de votre vue pour ajouter un plat
        };

    const getPlatsByCategory = async (categoryId) => {
        try {
            console.log("Fetching plats for category:", categoryId);
            const querySnapshot = await firestore()
                .collection('plats')
                .where('categoryId', '==', categoryId)
                .get();

            const plats = [];
            querySnapshot.forEach(documentSnapshot => {
                plats.push({
                    ...documentSnapshot.data(),
                    key: documentSnapshot.id,
                });
            });
            console.log("Plats fetched for category:", categoryId, plats);
            setPlats(plats);
        } catch (error) {
            console.error('Error fetching plats by category:', error);
        }
    };

    const handleCategorySelect = (key: string) => {
        console.log("Selected category:", key);
        setSelectedCategory(key);
        getPlatsByCategory(key);
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
                    <View style={styles.space}></View>
                    <TouchableOpacity onPress={navigateToCart}>
                        <Image source={CartIcon} style={styles.icon} />
                    </TouchableOpacity>
                </View>
                <View>
                    <MyText style={styles.headerText}>salam founisseur</MyText>
                </View>

                <Search />

                <View style={{ height: 50 }}>
                    <FlatList
                        horizontal
                        data={categories}
                        renderItem={({ item }) => (
                            <Category
                                title={item.title}
                                itemKey={item.key}
                                isSelected={item.key === selectedCategory}
                                onSelect={handleCategorySelect}
                            />
                        )}
                        keyExtractor={item => item.key}
                        showsHorizontalScrollIndicator={false}
                    />
                </View>
                <TouchableOpacity onPress={navigateToAddPlat}>
                                                <View style={styles.addPlatButton}>
                                                    <MyText style={styles.addPlatButtonText}>Ajouter un plat</MyText>
                                                </View>
                                            </TouchableOpacity>
                <View style={{ marginTop: -68 }}>
                    <MyText style={styles.text}> </MyText>
                    <FlatList
                        vertical
                        data={plats}
                        renderItem={({ item }) => (
                            <FoodCard
                                image={item.imageURL}
                                title={item.title}
                                price={item.price}
                                itemKey={item.key}
                            />
                        )}
                        showsHorizontalScrollIndicator={false}
                    />
                </View>
                <View style={styles.alo}>
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
                        showsHorizontalScrollIndicator={false}
                    />
                    <MyText style={styles.text}>Nos promotions</MyText>
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
                </View>
            </MyView>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    alo: {
        marginTop: -20,
    },
    scrollView: {
        flex: 1,
        backgroundColor: '#f7f6ff',
    },
    con: {
        backgroundColor: '#F2F2F2',
    },
    text: {
        marginLeft: 21,
        fontSize: 20,
        marginBottom: 3,
        marginTop: 30,
        fontFamily: 'Raleway-Bold',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        marginTop: 20,
    },
    space: {
        marginLeft: 'auto',
    },
    icon: {
        width: 40,
        height: 40,
        marginRight: 10,
    },
    addPlatButton: {
            backgroundColor: '#FF4B3A',
            paddingVertical: 15,
            paddingHorizontal: 10,
            borderRadius: 5,
            marginTop: 10,
            marginLeft: 15,
            marginRight: 15,
        },
        addPlatButtonText: {
                color: '#FFFFFF',
                fontSize: 16,
                fontWeight: 'bold',
            },
    headerText: {
        flex: 1,
        marginLeft: 21,
        fontSize: 22,
        marginTop: 20,
        marginBottom: 20,
        fontFamily: 'Raleway-Bold',
    },
});

export default HomeScreenFournisseur;