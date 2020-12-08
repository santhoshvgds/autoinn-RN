import React, {useEffect, useContext} from 'react';
import {StyleSheet, Image} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import {platformApi} from '../../api';
import {ContextAPI} from '../../ContextAPI';

const splashScreen = ({navigation}) => {
  const {setLoginCredintials} = useContext(ContextAPI);

  const checkDomain = async () => {
    const value = await AsyncStorage.getItem('domainName');
    // console.log('value', value);
    if (value !== null) {
      axios
        .get(value)
        .then((result) => {
          if (result.status == 200) {
            // navigation.navigate('Login')
          } else {
            navigation.navigate('Domain');
          }
        })
        .catch((error) => {
          console.log(error);
          navigation.navigate('Domain');
        });
    } else {
      navigation.navigate('Domain');
    }
  };
  const checkLogin = async () => {
    console.log('token ' + AsyncStorage.getItem('token'));
    if (AsyncStorage.getItem('token')) {
      let obj;
      platformApi
        .get('/api/user/currentUser')
        .then((result) => {
          console.log('result', result);
          let {data} = result ? result : null;
          console.log(data);
          if (data && data.code === 200) {
            console.log('response', data.response);
            let {response} = data;
            if (response.code === 200) {
              if (response.data.profile)
                obj = {
                  ...response.data.profile.department,
                  ...response.data.profile,
                  employeeId: response.data.id,
                };
              obj.profilePicture = response.data.profilePicture;
              console.log(obj);
              setLoginCredintials(obj);
              navigation.navigate('HomeScreen', {
                params: response.data.user,
              });
            } else {
              navigation.navigate('Login');
            }
          } else {
            navigation.navigate('Login');
          }
        })
        .catch((err) => {
          console.log(err);
          navigation.navigate('Login');
        });
    }
  };

  useEffect(() => {
    // console.log('object');
    checkDomain();
    setTimeout(() => {
      // console.log("platform", platformApi);
      checkLogin();
    }, 1000);
  }, []);

  return (
    <>
      <Image
        style={styles.image}
        source={require('../../../assets/splash.png')}
      />
    </>
  );
};

export default splashScreen;
const styles = StyleSheet.create({
  image: {
    flex: 1,
    resizeMode: 'contain',
    width: null,
    height: null,
  },
});
