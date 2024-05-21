// TabNavigator.js
import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import ContactScreen from '../screens/ContactScreen';
import DashboardIcon from './../../assets/images/dashbord.png';
import CartIcon from './../../assets/images/panier.png';
import FavoriteIcon from './../../assets/images/favorie.png';
import ContactIcon from './../../assets/images/contact.png';
import HomeIcon from './../../assets/images/home.png';

const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
     <Tab.Navigator
       screenOptions={{
         tabBarShowLabel: false,
         tabBarStyle: {
           backgroundColor: '#E0E0E0',
             borderTopWidth: 0, // Set your desired color here
         },
       }}
     >
       <Tab.Screen
         name="home"
         component={HomeScreen}
         options={{
           tabBarIcon: ({ color, size, focused }) => (
                       <Image
                         source={HomeIcon}
                         style={[styles.icon, { tintColor: focused ? '#FF4B3A' : color }]}
                       />
                     ),
                     headerShown: false,
                   }}
       />
       <Tab.Screen
         name="favorite"
         component={FavoritesScreen}
         options={{
          tabBarIcon: ({ color, size, focused }) => (
                                          <Image
                                            source={FavoriteIcon}
                                            style={[styles.icon, { tintColor: focused ? '#FF4B3A' : color }]}
                                          />
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
                               tabBarIcon: ({ color, size, focused }) => (
                                           <Image
                                             source={ContactIcon}
                                             style={[styles.icon, { tintColor: focused ? '#FF4B3A' : color }]}
                                           />
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
  icon: {
    width: 40,
    height: 40,
  },
});

export default TabNavigator;