import React, { useState, useEffect } from 'react'
import { Text, Button, Image, Card, ButtonGroup, Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { View, StyleSheet, Alert, Keyboard, Dimensions } from 'react-native';
import { platformApi } from '../../../../../api';


const styles = StyleSheet.create({
  page: {
    height: '95%',
    marginLeft: '5%',
    margin: '5%',
    backgroundColor: '#fefefe',
  },
  button: {
    margin: 50,
  },
  phone: {
    marginTop: '5%',
    margin: '5%',
    width: '90%',
  },
  input: {
    margin: '5%',
    width: '90%',
    marginTop: '2%'
  },
  buttonGroup: {
    marginLeft: '8%',
    width: '83%',
    backgroundColor: 'lightgray'
  },
  location: {
    margin: '5%',
    width: '90%',
    marginTop: '6%'
  },
  buttonCon: {
    alignItems: 'center',
    position: "relative",
    top: '4%'
  }
})


const VehicleDetailForm1 = (props) => {

  const onNext = () =>{
    props.navigation.navigate('VehicleDetailForm2')
  }

  return (
    <View style={styles.page}>
      <Text style={{ textAlign: 'center', marginTop: '5%' }}>Vehicles Details Form - I</Text>
      <View style={{ height: '70%' }}>

      <View style={styles.buttonCon}>
        <Button onPress={() => onNext()} type="clear" style={styles.button} title="Click Here To Proceed"></Button>
      </View>
      </View>
    </View>
  )
}

export default VehicleDetailForm1;