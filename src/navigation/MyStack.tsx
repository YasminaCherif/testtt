// MyStack.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MainScreen from '../screens/MainScreen';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import DashboardScreen from '../screens/DashboardScreen';
import CartScreen from '../screens/CartScreen';
import TabNavigator from './TabNavigator';
import { createDrawerNavigator } from '@react-navigation/drawer';
import SignUpForm from '../screens/SignUpForm';
import HomeScreenFournisseur from '../screens/HomeScreenFournisseur';
import AddPlat from './../components/AddPlat';
import FoodDetailScreen from '../screens/FoodDetailScreen';


const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

export default function MyStack() {
  return (
    <Stack.Navigator initialRouteName="Main" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={MainScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignIn" component={SignUpScreen} />
      <Stack.Screen name="Welcome" component={TabNavigator} />
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="cart" component={CartScreen} />
      <Stack.Screen name="SignUpForm" component={SignUpForm} />
      <Stack.Screen name="HomeScreenFournisseur" component={HomeScreenFournisseur} />
      <Stack.Screen name="AddPlat" component={AddPlat} />
      <Stack.Screen name="FoodDetail" component={FoodDetailScreen} />

    </Stack.Navigator>
  );
}