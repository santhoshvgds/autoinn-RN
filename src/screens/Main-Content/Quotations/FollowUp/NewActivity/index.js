import React, {useEffect, useContext, useState} from 'react';
import {
  StyleSheet,
  View,
  Image,
  Linking,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {Text, ButtonGroup, Input, Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import {platformApi} from '../../../../../api';
import moment from 'moment';
import {
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import {Table, TableWrapper, Row, Rows} from 'react-native-table-component';
import {Dropdown} from 'react-native-material-dropdown';
import DatePicker from 'react-native-datepicker';
import {Alert} from 'react-native';

const styles = StyleSheet.create({
  messageCharCount: {
    textAlign: 'right',
    paddingRight: '6%',
  },
  messageInput: {
    borderWidth: 1,
    margin: '6%',
    marginTop: '4%',
    marginBottom: 3,
    borderColor: 'lightgray',
    backgroundColor: '#efefef',
    padding: 4,
  },
  buttonCon: {
    backgroundColor: '#f75b5b',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
  buttonCon2: {
    backgroundColor: 'gray',
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
  textHeading: {
    marginLeft: '7%',
    marginTop: '5%',
    marginBottom: '0%',
    color: 'gray',
    fontSize: 11.5,
  },
});

const NewActivity = (props) => {
  const [enquiryType, setEnquiryType] = useState('');
  const [charCount, setCharCount] = useState(0);
  const [remarks, setRemarks] = useState('');
  const [interactionType, setInteractionType] = useState('');
  const [followDate, setFollowDate] = useState(
    moment(new Date()).format('DD-MM-YYYY'),
  );
  const [followTime, setFollowTime] = useState(
    moment(new Date()).format('HH:mm'),
  );

  const createActivity = () => {
    let activityData = {
      customerId: props.route.params.customerData.id,
      remarks: remarks ? remarks : '',
      followUpDate: followDate,
      followUpTime: followTime,
      interactionType,
      enquiryType,
    };
    console.log('smsData', activityData);
    platformApi.post('/api/activity/create', activityData).then((res) => {
      let {data} = res;
      console.log('data', data);
      if (data.code === 200) {
        let {response} = data;
        if (response.code === 200) {
          Alert.alert('Activity created successully');
          props.navigation.navigate('Follow Up');
        } else {
          Alert.alert('SMS Not Sent');
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
        <ScrollView style={{position: 'relative', marginBottom: '7%'}}>
          {/* <View style={{ marginBottom: "17%" }}> */}
          {/* <Dropdown
              containerStyle={{ width: '35%', marginLeft: 'auto', marginRight: 'auto', marginTop: '0%' }}
              // value={dataProps.singleData.view ? dataProps.singleData.vehicle[0].vehicleDetail.manufacturer.name : manufacturers[0] && manufacturers[0].label}
              label="Template"
              // onChangeText={(value) => handleManufacturerChange(value)}
              data={[{
                label: 'All Category',
                value: 'ALL'
              }, {
                value: 'SCOOTER',
                label: 'Scooter',
              }, {
                value: 'MOTORCYCLE',
                label: 'Motorcycles',
              }]}
            /> */}
          <Dropdown
            containerStyle={{
              width: '87%',
              marginLeft: 'auto',
              marginRight: 'auto',
              marginTop: '0%',
            }}
            value={interactionType}
            label="Interaction Type"
            onChangeText={(value) => {
              setInteractionType(value);
            }}
            data={[{label: 'WALK-IN', value: 'WALK IN'}]}
          />
          <Dropdown
            onChangeText={(value) => {
              setEnquiryType(value);
            }}
            value={enquiryType}
            containerStyle={{
              width: '87%',
              marginLeft: 'auto',
              marginRight: 'auto',
              marginTop: '0%',
            }}
            data={[
              {label: 'Hot', value: 'Hot'},
              {label: 'Warm', value: 'Warm'},
              {label: 'Cold', value: 'Cold'},
            ]}
            label="Select Enquiry Type"
          />

          <Text
            style={{
              marginLeft: '5.5%',
              marginTop: '5%',
              marginBottom: '5%',
              color: 'gray',
              fontSize: 11.5,
            }}>
            Follow Up - Date
          </Text>
          <DatePicker
            style={{width: 320, marginBottom: '2%'}}
            date={followDate}
            mode="date"
            placeholder="Select date"
            format="DD-MM-YYYY"
            minDate={moment(new Date()).format('DD-MM-YYYY')}
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            customStyles={{
              dateIcon: {
                position: 'absolute',
                left: '7%',
                top: 4,
                marginTop: 10,
              },
              dateInput: {
                marginLeft: '22%',
                marginTop: 10,
              },
            }}
            onDateChange={(date) => {
              setFollowDate(date), console.log('date', date);
            }}
          />
          <Text
            style={{
              marginLeft: '5.5%',
              marginTop: '5%',
              marginBottom: '5%',
              color: 'gray',
              fontSize: 11.5,
            }}>
            Follow Up - Time
          </Text>
          <DatePicker
            style={{width: 320}}
            date={followTime}
            mode="time"
            placeholder="Select Time"
            format="HH:mm"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            iconComponent={
              <Icon
                name="clock-o"
                color="gray"
                size={29}
                style={{
                  position: 'absolute',
                  left: '10.8%',
                  top: 9,
                  marginTop: 4,
                  color: 'green',
                }}
              />
            }
            customStyles={{
              dateIcon: {
                position: 'absolute',
                left: '7%',
                top: 4,
                marginTop: 10,
              },
              dateInput: {
                marginLeft: '22%',
                marginTop: 10,
                marginBottom: 10,
              },
            }}
            onDateChange={(time) => {
              setFollowTime(time), console.log('time', time);
            }}
          />
          <Text style={styles.textHeading}>Remarks</Text>
          <TextInput
            multiline={true}
            numberOfLines={6}
            placeholder="Type your message here..."
            style={styles.messageInput}
            onChangeText={(text) => {
              if (charCount < 450) {
                setCharCount(text.length), setRemarks(text);
              }
            }}
            value={remarks}
          />
          <Text style={styles.messageCharCount}>{charCount}/450</Text>
          {/* </View> */}
        </ScrollView>
      </View>
      <View
        style={{position: 'absolute', bottom: '0%', left: '0%', width: '100%'}}>
        <TouchableOpacity
          onPress={() => {
            interactionType && enquiryType && remarks && createActivity();
          }}
          style={
            interactionType && enquiryType && remarks
              ? styles.buttonCon
              : styles.buttonCon2
          }>
          <Text style={styles.button}>Create Activity</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default NewActivity;
