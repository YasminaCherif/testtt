import React from 'react';
import {StyleSheet, View, Image, Button, } from 'react-native';
// import {Rating} from 'react-native-elements';
import MyText from './MyText';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';

function FoodCard({image, title, price, onPress, itemKey, }) {

  const navigation = useNavigation()




  return (
    <View style={styles.con}>
      <View style={styles.imageCon}>
        <Image style={{height: '90%', width: '80%'}} source={{uri: image}} />
      </View>
      <View style={{flex: 1, paddingLeft: '12%'}}>
        <MyText numberOfLines={1} style={styles.title}>
          {title}
        </MyText>
        {/*
        <Rating
          ratingBackgroundColor="red"
          tintColor="red"
          ratingCount={5}
          imageSize={24}
          style={{alignSelf: 'flex-start', paddingTop: 4}}
        />
        */}

        <MyText style={styles.price}>{price} dh</MyText>
        <View style={{flexDirection:"row"}}>

        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  con: {
    height: 190,
    width: 180,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'red',
    marginHorizontal: 22,
  },
  imageCon: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 15,
    fontFamily: 'Audiowide-Regular',
    color: 'white',
  },
  price: {
    color: 'white',
    fontSize: 30,
    marginVertical: 1.5,
  },
  bagCon: {
    backgroundColor: 'white',
    height: 31,
    width: 31,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 12,
    right: 12,
    borderRadius: 16.5,
  },
});
export default FoodCard;