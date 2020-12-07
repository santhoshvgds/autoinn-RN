import React, {useEffect, useContext, useState} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  AsyncStorage,
  Linking,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {Text, ButtonGroup, Input, Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Table, TableWrapper, Row, Rows} from 'react-native-table-component';
import {platformApi} from '../../../../../api';
import moment from 'moment';
import {
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native-gesture-handler';
import DatePicker from 'react-native-datepicker';
import {Dropdown} from 'react-native-material-dropdown';
import {WebView} from 'react-native-webview';
import {Alert} from 'react-native';

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
  buttonGroup: {
    width: '100%',
    marginLeft: 0,
    color: 'white',
  },
  container: {
    // height: "72%",
    padding: 0,
    borderWidth: 1,
    borderColor: '#C1C0B9',
  },
  head: {
    height: 35,
    backgroundColor: '#f75b5b',
    color: 'white',
  },
  wrapper: {
    flexDirection: 'row',
  },
  row: {
    height: 'auto',
    paddingTop: 7,
    paddingBottom: 7,
    backgroundColor: '#E7E6E1',
  },
  text: {
    textAlign: 'center',
    flexWrap: 'wrap',
  },
  btn: {
    width: '80%',
    marginLeft: '10%',
    height: 18,
    backgroundColor: '#636363',
    borderRadius: 5,
  },
  btnText: {
    textAlign: 'center',
    color: '#fff',
  },
  containerPdf: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 25,
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

const ActivityInfo = (props) => {
  const {data, modify} = props.route.params;
  const [selectedTab, setSelectedTab] = useState(0);
  const [followDate, setFollowDate] = useState(
    data.scheduleDateAndTime
      ? moment(data.scheduleDateAndTime)
      : moment(new Date()),
  );
  const [followTime, setFollowTime] = useState(
    data.scheduleDateAndTime
      ? moment(data.scheduleDateAndTime)
      : moment(new Date()),
  );
  const [remarks, setRemarks] = useState('');
  const [messageInfo, setMessageInfo] = useState(null);
  const [dataTable, setDataTable] = useState([[]]);

  const elementButton = (value) => (
    <TouchableOpacity
      onPress={() => {
        props.navigation.navigate('Pdf', {uri: value});
      }}>
      <View style={styles.btn}>
        <Text style={styles.btnText}>View</Text>
      </View>
    </TouchableOpacity>
  );

  const component1 = () => <Text>Details</Text>;
  const component2 = () => <Text>Communication</Text>;

  const switchButtons = [{element: component1}, {element: component2}];

  useEffect(() => {
    setRemarks(data.remarks);
    if (data.sms) {
      setMessageInfo(data.sms);
    }
    if (data.quotation) {
      if (data.quotation.sms.length) {
        setMessageInfo(data.quotation.sms[0]);
      }
      setDataTable([
        [
          'With Brochure',
          data.quotation.quotationId,
          'Quoted',
          elementButton(data.quotation.pdfWithBrochure),
        ],
        [
          'Without Brochure',
          data.quotation.quotationId,
          'Quoted',
          elementButton(data.quotation.pdfWithOutBrochure),
        ],
      ]);
    }
    if (data.booking) {
      if (data.booking.sms) {
        setMessageInfo(data.booking.sms);
      }
      let arr = [];
      if (data.booking.authentication.beforeVerification)
        arr.push([
          'Before Verf.',
          data.booking.bookingId,
          elementButton(data.booking.authentication.beforeVerification),
        ]);
      if (data.booking.authentication.afterVerification)
        arr.push([
          'After Verf.',
          data.booking.bookingId,
          elementButton(data.booking.authentication.afterVerification),
        ]);
      setDataTable(arr);
    }
  }, []);

  const activityEdit = () => {
    data.scheduleDate = followDate.format('DD-MM-YYYY');
    data.scheduleTime = followTime.format('HH:mm');
    platformApi.put(`/api/activity/${data.id}`, data).then((res) => {
      let {data} = res;
      if (data.code === 200) {
        let {response} = data;
        if (response.code === 200) {
          Alert.alert('Activity modified sucessfully');
          props.navigation.navigate('Follow Up');
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
        <View style={styles.topContainer}>
          {console.log('data', data)}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: 10,
            }}>
            <Text>Act. ID : {data.activityId}</Text>
            <View>
              <Text>
                Date :{' '}
                {data.createdAt && moment(data.createdAt).format('DD-MM-YYYY')}
              </Text>
              <Text>
                Time :{' '}
                {data.createdAt && moment(data.createdAt).format('HH:mm')}
              </Text>
            </View>
          </View>
          {data.booking || data.callId || data.sms || data.quotation ? (
            <ButtonGroup
              // disabled={dataProps.singleData.view}
              onPress={(change) => {
                setSelectedTab(change), console.log('touch', change);
              }}
              selectedIndex={selectedTab}
              disabledSelectedStyle={{backgroundColor: '#636363'}}
              buttons={switchButtons}
              selectedButtonStyle={{backgroundColor: '#f75b5b'}}
              containerStyle={styles.buttonGroup}
            />
          ) : (
            <></>
          )}
          <ScrollView style={{marginBottom: '14%'}}>
            {selectedTab === 0 ? (
              <View>
                {/* <Text style={{ padding: 10, paddingTop: 5, paddingBottom: 5, fontSize: 15 }}>Quotation Generated : {data.quotation ? 'True' : 'False'}</Text> */}
                <Dropdown
                  disabled={!modify}
                  onChangeText={(value) => {
                    data.enquiryType = value;
                  }}
                  value={data.enquiryType ? data.enquiryType : undefined}
                  containerStyle={{
                    width: '92%',
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
                  labelTextStyle={{fontSize: 20}}
                />
                <Text style={{padding: 10, fontSize: 15}}>
                  Scheduled Follow Up - Date
                </Text>
                <DatePicker
                  disabled={!modify}
                  style={{width: 300, marginBottom: '2%'}}
                  date={followDate && followDate.format('DD-MM-YYYY')}
                  mode="date"
                  placeholder="Select date"
                  format="DD-MM-YYYY"
                  minDate={moment(new Date()).format('DD-MM-YYYY')}
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  customStyles={{
                    dateIcon: {
                      position: 'absolute',
                      left: '14%',
                      top: 4,
                      marginTop: 10,
                    },
                    dateInput: {
                      marginLeft: '35%',
                      marginTop: 10,
                    },
                  }}
                  onDateChange={(date) => {
                    setFollowDate(moment(date, 'DD-MM-YYYY'));
                  }}
                />
                <Text style={{padding: 10, fontSize: 15}}>
                  Scheduled Follow Up - Time
                </Text>
                <DatePicker
                  disabled={!modify}
                  style={{width: 300}}
                  date={followTime && followTime.format('HH:mm‎')}
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
                        left: '18%',
                        top: 8,
                        marginTop: 9,
                        color: 'green',
                      }}
                    />
                  }
                  customStyles={{
                    dateIcon: {
                      position: 'absolute',
                      left: '10%',
                      top: 4,
                      marginTop: 10,
                    },
                    dateInput: {
                      marginLeft: '35%',
                      marginTop: 10,
                    },
                  }}
                  onDateChange={(time) => {
                    setFollowTime(moment(time, 'HH:mm'));
                  }}
                />
                <Text style={{padding: 10, fontSize: 15}}>Remarks</Text>
                <TextInput
                  editable={modify}
                  multiline={true}
                  numberOfLines={4}
                  style={{
                    borderWidth: 1,
                    margin: '4%',
                    marginTop: '2%',
                    padding: 8,
                    borderColor: 'lightgray',
                    backgroundColor: '#efefef',
                  }}
                  onChangeText={(text) => {
                    setRemarks(text), (data.remarks = text);
                  }}
                  value={remarks}
                />
              </View>
            ) : (
              <View>
                {data.interactionType && (
                  <Text style={{padding: 10, paddingTop: 5, fontSize: 15}}>
                    Interaction Type : {data.interactionType}
                  </Text>
                )}
                {data.quotation ? (
                  <View>
                    <Text style={{padding: 10, paddingTop: 5, fontSize: 15}}>
                      Activity Type : Quotation
                    </Text>
                    <Text style={{padding: 10, paddingTop: 5, fontSize: 15}}>
                      Quotation Id : {data.quotation.quotationId}
                    </Text>
                    <Text style={{padding: 10, paddingTop: 5, fontSize: 15}}>
                      Quoted Vehicles :{' '}
                    </Text>
                    <Text
                      style={{
                        padding: 10,
                        paddingTop: 5,
                        paddingLeft: 70,
                        fontSize: 15,
                      }}>
                      {data.quotation.vehicle.map((each, index) => {
                        return (
                          <Text>
                            {index + 1}.{' '}
                            {each.vehicleDetail
                              ? `${each.vehicleDetail.modelCode} - ${
                                  each.vehicleDetail.modelName
                                }${'\n'}`
                              : `Vehicle Deleted${'\n'}`}
                          </Text>
                        );
                      })}
                    </Text>
                    <Text style={{padding: 10, paddingTop: 0, fontSize: 15}}>
                      Associated Documents :
                    </Text>
                    <View
                      style={{marginTop: 5, marginLeft: 10, marginRight: 10}}>
                      <Table>
                        <Row
                          data={['Doc. Type', 'Doc. Id', 'Status', 'Action']}
                          flexArr={[1, 1, 1, 1]}
                          style={styles.head}
                          textStyle={[styles.text, {color: 'white'}]}
                        />
                        <TableWrapper style={styles.wrapper}>
                          <ScrollView style={styles.container}>
                            <Rows
                              data={dataTable}
                              flexArr={[1, 1, 1, 1]}
                              style={styles.row}
                              textStyle={styles.text}
                            />
                          </ScrollView>
                        </TableWrapper>
                      </Table>
                    </View>
                  </View>
                ) : (
                  <View></View>
                )}
                {data.booking ? (
                  <View>
                    <Text style={{padding: 10, paddingTop: 5, fontSize: 15}}>
                      Activity Type : Booking
                    </Text>
                    <Text style={{padding: 10, paddingTop: 5, fontSize: 15}}>
                      Booking Id : {data.booking.bookingId}
                    </Text>
                    <Text style={{padding: 10, paddingTop: 5, fontSize: 15}}>
                      Customer Verification :{' '}
                      {data.booking.authentication.digital
                        ? 'Pending'
                        : 'Completed'}
                    </Text>
                    <Text style={{padding: 10, paddingTop: 5, fontSize: 15}}>
                      Supervisor Verification : {data.booking.bookingStatus}
                    </Text>
                    <Text style={{padding: 10, paddingTop: 5, fontSize: 15}}>
                      Booked Vehicle :{' '}
                    </Text>
                    <Text
                      style={{
                        padding: 10,
                        paddingTop: 5,
                        paddingLeft: 70,
                        fontSize: 15,
                      }}>
                      {data.booking.vehicle.modelCode} -{' '}
                      {data.booking.vehicle.modelName}
                    </Text>
                    <Text style={{padding: 10, paddingTop: 5, fontSize: 15}}>
                      Vehicle Color:{' '}
                    </Text>
                    <Text
                      style={{
                        padding: 10,
                        paddingTop: 5,
                        paddingLeft: 70,
                        fontSize: 15,
                      }}>
                      {data.booking.color.code} - {data.booking.color.color}
                    </Text>
                    <Text style={{padding: 10, paddingTop: 0, fontSize: 15}}>
                      Associated Documents :
                    </Text>
                    <View
                      style={{marginTop: 5, marginLeft: 10, marginRight: 10}}>
                      <Table>
                        <Row
                          data={['Doc. Type', 'Doc. Id', 'Action']}
                          flexArr={[1, 1, 1]}
                          style={styles.head}
                          textStyle={[styles.text, {color: 'white'}]}
                        />
                        <TableWrapper style={styles.wrapper}>
                          {dataTable.length ? (
                            <ScrollView style={styles.container}>
                              <Rows
                                data={dataTable}
                                flexArr={[1, 1, 1]}
                                style={styles.row}
                                textStyle={styles.text}
                              />
                            </ScrollView>
                          ) : (
                            <Rows
                              data={[['NO DATA']]}
                              flexArr={[1]}
                              style={styles.row}
                              textStyle={styles.text}
                            />
                          )}
                        </TableWrapper>
                      </Table>
                    </View>
                  </View>
                ) : (
                  <View></View>
                )}
                {messageInfo ? (
                  <View>
                    <Text style={{padding: 10, paddingTop: 10, fontSize: 15}}>
                      Phone : {messageInfo.phone}
                    </Text>
                    <Text style={{padding: 10, paddingTop: 5, fontSize: 15}}>
                      Status :{' '}
                      {messageInfo.smsStatus === 'DELIVRD'
                        ? 'Delivered'
                        : 'Not Delivered'}
                    </Text>
                    {messageInfo.smsStatus === 'DELIVRD' ? (
                      <Text style={{padding: 10, paddingTop: 5, fontSize: 15}}>
                        Delivered Date :{' '}
                        {moment(messageInfo.smsDeliveredTime).format(
                          'DD-MM-YYYY',
                        )}
                      </Text>
                    ) : (
                      <View></View>
                    )}
                    {messageInfo.smsStatus === 'DELIVRD' ? (
                      <Text style={{padding: 10, paddingTop: 5, fontSize: 15}}>
                        Delivered Time :{' '}
                        {moment(messageInfo.smsDeliveredTime).format('HH:mm')}{' '}
                        HRS
                      </Text>
                    ) : (
                      <View></View>
                    )}
                    <Text style={{padding: 10, paddingTop: 5, fontSize: 15}}>
                      Message :{' '}
                    </Text>
                    <Text
                      style={{
                        padding: 15,
                        fontSize: 14,
                        backgroundColor: 'white',
                        margin: 15,
                        marginTop: 5,
                      }}>
                      {messageInfo.smsText.trim()}
                    </Text>
                  </View>
                ) : (
                  <View></View>
                )}
              </View>
            )}
          </ScrollView>
        </View>
        {modify ? (
          <View
            style={{
              position: 'absolute',
              bottom: '0%',
              left: '0%',
              width: '100%',
            }}>
            <TouchableOpacity
              onPress={() => {
                activityEdit();
              }}
              style={styles.buttonCon}>
              <Text style={styles.button}>SAVE</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View
            style={{
              position: 'absolute',
              bottom: '0%',
              left: '0%',
              width: '100%',
            }}>
            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate('Follow Up');
              }}
              style={styles.buttonCon}>
              <Text style={styles.button}>CLOSE</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

export default ActivityInfo;
