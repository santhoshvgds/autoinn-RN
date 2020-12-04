import React, {useState, useContext, useEffect} from 'react';
import {Button, Input, Text} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
// import * as SecureStore from 'expo-secure-store';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {platformApi, setAccessToken} from '../../api';
import {ContextAPI} from '../../ContextAPI';
import {ScrollView} from 'react-native-gesture-handler';
import {Linking} from 'react-native';

const styles = StyleSheet.create({
  button: {
    margin: '9%',
    marginTop: '20%',
  },
});

const LoginPage = ({navigation}) => {
  function urlRedirect(url) {
    if (!url) return;
    let {path, queryParams} = Linking.parse(url);
    // console.log(`Linked to app with path: ${path} and data: ${JSON.stringify(queryParams)}`);
    // console.log("------------------>token", queryParams.token)
    // const setAccessToken = async () => await AsyncStorage.setItem("token", queryParams.token);
    if (path === 'Forgetpassword') {
      navigation.navigate(path, {
        params: queryParams.token,
      });
    }
  }
  (() => {
    Linking.addEventListener('url', (event) => {
      urlRedirect(event.url);
    });
    Linking.getInitialURL().then((initial) => {
      urlRedirect(initial);
    });
  })();

  const {setLoginCredintials} = useContext(ContextAPI);
  const [visible, setVisible] = useState(true);
  const [eye, setEye] = useState(true);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  // const []

  useEffect(() => {
    if (AsyncStorage.getItem('token')) {
      let obj;
      platformApi.get('/api/user/currentUser').then((result) => {
        let {data} = result ? result : null;
        if (data.code === 200) {
          let {response} = data;
          if (response.code === 200) {
            if (response.data.profile)
              obj = {
                ...response.data.profile.department,
                ...response.data.profile,
                employeeId: response.data.id,
              };
            obj.profilePicture = response.data.profilePicture;
            setLoginCredintials(obj);
            navigation.navigate('HomeScreen', {
              params: response.data.user,
            });
            setError(false);
            setPassword('');
            setPhone('');
          }
        }
      });
    }
  }, []);

  const loginAction = () => {
    setLoading(true);
    platformApi.post('/api/user/login', {phone, password}).then((res) => {
      let {data} = res ? res : null;
      if (data.code === 200) {
        let {response} = data;
        if (response.code === 200) {
          // console.log('response', response)
          setAccessToken(response.data.token);
          let obj = response.data.user.department;
          platformApi.get('/api/user/currentUser').then((result) => {
            setLoading(false);
            let {data} = result ? result : null;
            if (data.code === 200) {
              let {response} = data;
              if (response.code === 200) {
                if (response.data.profile)
                  obj = {
                    ...obj,
                    ...response.data.profile,
                    employeeId: response.data.id,
                  };
                obj.profilePicture = response.data.profilePicture;
                setLoginCredintials(obj);
                navigation.navigate('HomeScreen', {
                  params: response.data.user,
                });
                setError(false);
                setPassword('');
                setPhone('');
              }
            }
          });
        } else {
          setPassword('');
          setPhone('');
          setError(true);
        }
      }
    });
  };

  return (
    <KeyboardAvoidingView
      enabled
      keyboardVerticalOffset={100}
      behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
      <ScrollView style={{height: '90%'}}>
        <Text
          style={{marginLeft: '35%', marginBottom: '20%', marginTop: '20%'}}
          h1>
          Login
        </Text>
        {loading ? (
          <ActivityIndicator size="large" color="#f75b5b" />
        ) : (
          <View>
            <Input
              value={phone}
              textContentType="telephoneNumber"
              keyboardType="numeric"
              onChange={(text) => setPhone(text.nativeEvent.text)}
              placeholder="Phone Number"
              inputStyle={{marginLeft: '5%'}}
              leftIcon={<Icon name="phone" size={24} color="black" />}
            />

            <Input
              autoCapitalize="none"
              value={password}
              placeholder="Password"
              errorStyle={!error ? {display: 'none'} : {}}
              errorMessage="Invalid Phone/Password"
              onChange={(text) => {
                setPassword(text.nativeEvent.text);
              }}
              secureTextEntry={visible}
              inputStyle={{marginLeft: '5%'}}
              leftIcon={<Icon name="lock" size={24} color="black" />}
              rightIcon={
                <Icon
                  name={eye ? 'eye' : 'eye-slash'}
                  size={20}
                  onPress={() => {
                    setVisible(!visible), setEye(!eye);
                  }}
                />
              }
            />
            <View style={styles.button}>
              <Button
                buttonStyle={{backgroundColor: '#f75b5b'}}
                loadingProps={{animating: loading}}
                raised={false}
                onPress={() => loginAction()}
                title="Sign-In"
              />
              <View style={{marginTop: '5%'}}>
                <Button
                  onPress={() => {
                    navigation.navigate('Forgetpassword');
                  }}
                  titleStyle={{color: '#f75b5b'}}
                  type="clear"
                  title="Forgot Password"
                />
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginPage;
