import React, {useEffect, useContext, useState} from 'react';
import {
  StyleSheet,
  View,
  Image,
  Linking,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
} from 'react-native';
import {Text, ButtonGroup, Input, Button} from 'react-native-elements';
import {platformApi} from '../../../../../api';
import moment from 'moment';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';

const styles = StyleSheet.create({
  topContainer: {
    height: '100%',
  },
  bottomContainer: {
    // height:'35%',
    backgroundColor: 'white',
    position: 'absolute',
    bottom: '0%',
    left: '0%',
    width: '100%',
    // borderWidth:1
  },
  eachMessage: {
    backgroundColor: 'white',
    borderWidth: 2,
    // borderStyle:'solid',
    borderColor: 'lightgray',
    margin: 8,
    marginBottom: 0,
    marginRight: 10,
  },
  deliveredDate: {
    textAlign: 'right',
    padding: 5,
  },
  eachSmsText: {
    padding: 5,
  },
  messageCharCount: {
    textAlign: 'right',
    paddingRight: '6%',
  },
  messageInput: {
    margin: '6%',
    marginTop: '2%',
    marginBottom: 3,
    borderWidth: 1,
    // borderColor: 'lightgray',
    // borderStyle:'solid',
    backgroundColor: '#efefef',
    padding: 7,
  },
  buttonCon: {
    backgroundColor: '#f75b5b',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
  button: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
    color: 'white',
    width: '100%',
  },
});

const Messages = (props) => {
  const [messageData, setMessageData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    let phoneArray = [];
    console.log('customer', props.route.params.customerData);
    platformApi
      .get(`/api/customer/smsHistory/${props.route.params.customer}`)
      .then((res) => {
        let {data} = res ? res : null;
        if (data.code === 200) {
          let {response} = data;
          if (response.code === 200) {
            setMessageData(response.data);
            // console.log("messageData", response.data)
          }
        }
      });
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    platformApi
      .get(`/api/customer/smsHistory/${props.route.params.customer}`)
      .then((res) => {
        let {data} = res ? res : null;
        if (data.code === 200) {
          let {response} = data;
          if (response.code === 200) {
            setRefreshing(false);
            setMessageData([...response.data]);
            console.log('messageData', response.data);
          }
        }
      });
  };

  return (
    <KeyboardAvoidingView
      enabled
      keyboardVerticalOffset={100}
      behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
      <View style={{height: '100%'}}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => onRefresh()}
              tintColor="#f75b5b"
            />
          }
          style={{marginBottom: '14%'}}>
          <View style={styles.topContainer}>
            {messageData.length ? (
              messageData.map((eachMessage) => {
                return (
                  <View key={eachMessage.id} style={styles.eachMessage}>
                    <Text style={styles.deliveredDate}>
                      {eachMessage.smsDeliveredTime
                        ? moment(eachMessage.smsDeliveredTime).format(
                            'DD-MM-YYYY, HH:mm',
                          )
                        : 'Not Delivered'}
                    </Text>
                    <Text style={styles.eachSmsText}>
                      {eachMessage.smsText}
                    </Text>
                  </View>
                );
              })
            ) : (
              <Text style={{textAlign: 'center', marginTop: '70%'}}>
                No Message Sent
              </Text>
            )}
          </View>
        </ScrollView>
        <View
          style={{
            position: 'absolute',
            bottom: '0%',
            left: '0%',
            width: '100%',
          }}>
          <TouchableOpacity
            onPress={() => {
              props.navigation.navigate('CreateSMS', {
                customer: props.route.params.customer,
                customerData: props.route.params.customerData,
              });
            }}
            style={styles.buttonCon}>
            <Text style={styles.button}>CREATE NEW SMS</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Messages;
