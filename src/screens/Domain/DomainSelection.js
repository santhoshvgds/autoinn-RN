import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Input, Icon, Button} from 'react-native-elements';
// import * as SecureStore from 'expo-secure-store';
// import LOGO from "../../../assets/splash.png"

import {StyleSheet, Text, View, Dimensions, Alert} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
const {width, height} = Dimensions.get('window');
const DomainSelection = ({navigation}) => {
  const [Domain, setDomain] = useState('');

  const checkDomain = async () => {
    const value = await AsyncStorage.getItem('domainName');
    // console.log("value", value)
    if (value != null) {
      axios
        .get(value)
        .then((result) => {
          if (result.status == 200) {
            navigation.navigate('Login');
          } else {
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  useEffect(() => {
    checkDomain();
  }, []);

  const storingDomain = () => {
    let domain = Domain + '.autocloud.in';
    axios
      .get('http://' + domain + '/')
      .then(async (result) => {
        if (
          result.status == 200 &&
          (domain === 'test.autocloud.in' ||
            domain === 'pacer.autocloud.in' ||
            domain === 'nandiyamaha.autocloud.in')
        ) {
          await AsyncStorage.setItem('domainName', 'http://' + domain + '/');

          navigation.navigate('Login');
        } else {
          setDomain(null);
          Alert.alert('Autocloud Workspace Invalid', 'Enter valid Domain');
        }
      })
      .catch((error) => {
        console.log(error);
        setDomain(null);
        Alert.alert('Autocloud Workspace Invalid', 'Enter valid Domain');
      });
  };
  return (
    <View>
      <Text style={{textAlign: 'center', marginTop: '40%', fontSize: 25}}>
        Sign in to your workspace
      </Text>
      <Text style={{textAlign: 'center', marginTop: '5%', fontSize: 13}}>
        Enter your workspace’s Autocloud URL
      </Text>
      <Input
        autoCapitalize="none"
        value={Domain}
        onChange={(text) => setDomain(text.nativeEvent.text)}
        placeholder="your-workspace"
        inputStyle={{marginLeft: '5%'}}
        rightIcon={<Text style={{fontSize: 18}}>.autocloud.in</Text>}
        containerStyle={{
          marginTop: '10%',
          width: '80%',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
        leftIcon={<Icon name="web" size={24} color="black" />}
      />
      <View style={styles.button}>
        <Button
          buttonStyle={{backgroundColor: '#f75b5b'}}
          title="Continue"
          onPress={storingDomain}
        />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  button: {
    marginTop: '10%',
    marginLeft: 'auto',
    marginRight: 'auto',
    width: width / 1.5,
    height: height / 15,
  },
  input: {
    marginTop: 10,
    marginBottom: 10,
    width: width / 1.5,
    height: height / 15,
  },
});

export default DomainSelection;
