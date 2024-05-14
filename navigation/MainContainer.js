import React from 'react';
import { View, ImageBackground, Image, ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import LoginScreen from './screens/LoginScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import SignInScreen from './screens/SignInScreen';
import myImage from './asset/images/img.png';
import myImage2 from './asset/images/Logo2.png';

const Stack = createStackNavigator();

const MainContainer = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={MainScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="SignIn" component={SignInScreen} />
    </Stack.Navigator>
  );
};


const MainScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <ImageBackground
          source={myImage}
          style={styles.backgroundImage}
        >
          <Image
            source={myImage2}
            style={styles.logo}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button1}
              onPress={() => navigation.navigate('Welcome')}
            >
              <Text style={styles.buttonText}>Continuer en tant qu'invité</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button2}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.buttonText}>Se connecter</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  logo: {
    marginLeft: -5,
    marginTop: -60,
    width: 300,
    height: 300,
    resizeMode: 'contain',
  },
  buttonContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 260,
  },
  button1: {
    backgroundColor: '#FF4B3A',
    borderRadius: 35,
    paddingVertical: 20,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  button2: {
    backgroundColor: '#FF4B3A',
    borderRadius: 35,
    paddingVertical: 20,
    paddingHorizontal: 75,
    marginBottom: 10,
  },
  buttonText: {
    fontFamily: 'Raleway',
    fontSize: 19,
  },
});

export default MainContainer;
