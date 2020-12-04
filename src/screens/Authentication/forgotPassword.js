import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Input, Icon, Button, Text} from 'react-native-elements';
import {platformApi} from '../../api';
import {Linking} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

const forgetPassword = () => {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [visibility, setVisibilty] = useState(false);

  const sendmailAction = () => {
    if (AsyncStorage.getItem('token')) {
      // let obj;
      let mobileLink = Linking.makeUrl('/ResetPassword');
      platformApi
        .post('/api/user/sendForgotPassword', {phone, mobileLink})
        .then((result) => {
          // console.log("result", result)
          setVisibilty(true);
          let {data} = result ? result : null;
          if (data.code === 200) {
            // let {response} = data;
            // if (response.code === 200) {
            // }
          }
        });
    }
  };

  return (
    <View>
      <Text style={{marginTop: '35%', textAlign: 'center'}} h3>
        Forgot Password
      </Text>
      <Input
        value={phone}
        textContentType="telephoneNumber"
        keyboardType="numeric"
        containerStyle={{marginTop: '20%', marginBottom: '10%'}}
        onChange={(text) => setPhone(text.nativeEvent.text)}
        placeholder="Phone Number"
        inputStyle={{marginLeft: '5%'}}
        leftIcon={<Icon name="phone" size={24} color="black" />}
      />
      <View style={styles.button}>
        <Button
          buttonStyle={{backgroundColor: '#f75b5b'}}
          loadingProps={{animating: loading}}
          raised={false}
          onPress={() => sendmailAction()}
          title={!visibility ? 'Send SMS' : 'Resend Sms'}
        />
      </View>
    </View>
  );
};
export default forgetPassword;
const styles = StyleSheet.create({
  button: {
    margin: '9%',
    marginTop: '0%',
    marginBottom: '0%',
  },
});
