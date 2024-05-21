// Dashboard.js

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import back from './../../assets/images/back.png';

const DashboardScreen = ({ onClose }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        <Image source={back} style={styles.icon} />
      </TouchableOpacity>
      {/* Add your dashboard content here */}
      <Text>This is your dashboard content</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  icon:{
    height:30,
    width:30,
    marginLeft: 30 ,
    marginTop: -20,
  }
});

export default DashboardScreen;