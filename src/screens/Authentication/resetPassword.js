import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import { Input, Button, Text } from "react-native-elements";
import Icon from 'react-native-vector-icons/FontAwesome';
import { platformApi, setAccessToken } from '../../api';
import { Alert } from 'react-native';

const resetPassword = (props) => {

  useEffect(() => {
    // console.log("resetpassword", props.route.params.params)
    let token = props.route.params.params
    platformApi.post("/api/user/checkForgotPassword", { token })
      .then((result) => {
        // console.log("result---------------><-----------------------", result)
        let { data } = result;
        if (data.code === 200) {
          //   console.log("response", data.response)
          let { response } = data;
          if (response.code === 200) {
            console.log("---------------------------><--------------------iddd", result.data.response.data.id)
            setid(result.data.response.data.id)
          }
        }
      });
  }, [])


  const [error, setError] = useState(false);
  const [id, setid] = useState()
  const [visible, setVisible] = useState(true);
  const [visible2, setVisible2] = useState(true);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const passwordchange = () => {
    console.log("reference", password, id)
    if (!error) {
      platformApi.post("/api/user/updatePassword", { password, id }).then((result) => {
        // console.log("result", result)
        let { data } = result;
        if (data.code === 200) {
          // console.log("response", data.response)
          let { response } = data;
          if (response.code === 200) {
            // setid(data.id)
            props.navigation.navigate('Login')
          }
        }
      });
    }
    else {
      Alert.alert('Password doesn\'t match');
    }

  }
  return (
    <View>
      <Text style={{ marginTop: '25%', textAlign: 'center' }} h3>Change Password</Text>
      <Input
        value={password}
        placeholder="Password"
        containerStyle={{ marginTop: '18%' }}
        onChange={(text) => { setPassword(text.nativeEvent.text) }}
        secureTextEntry={visible}
        inputStyle={{ marginLeft: '5%' }}
        leftIcon={
          <Icon
            name='lock'
            size={24}
            color='black'
          />
        }
        rightIcon={
          <Icon
            name={visible ? 'eye' : 'eye-slash'}
            size={20}
            onPress={() => { setVisible(!visible) }}
          />
        }
      />
      <Input
        value={confirmPassword}
        placeholder="Confirm Password"
        errorStyle={!error ? { display: 'none' } : {}}
        errorMessage="Invalid Phone/Password"
        containerStyle={{ marginTop: '1%', marginBottom: '20%' }}
        onChange={(text) => { setConfirmPassword(text.nativeEvent.text), text.nativeEvent.text === password ? setError(false) : setError(true) }}
        secureTextEntry={visible2}
        inputStyle={{ marginLeft: '5%' }}
        leftIcon={
          <Icon
            name='lock'
            size={24}
            color='black'
          />
        }
        rightIcon={
          <Icon
            name={visible2 ? 'eye' : 'eye-slash'}
            size={20}
            onPress={() => { setVisible2(!visible2) }}
          />
        }
      />
      <View style={{
        margin: '9%',
        marginTop: '0%',
        marginBottom: '0%'
      }}>
        <Button buttonStyle={{ backgroundColor: '#f75b5b' }} loadingProps={{ animating: false }} raised={false} onPress={() => passwordchange()} title="Change Password" />
      </View>
    </View>
  )
}

export default resetPassword
