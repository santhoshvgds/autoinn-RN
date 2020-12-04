import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Image, RefreshControl} from 'react-native';
import {Text, ButtonGroup, Avatar} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import {platformApi} from '../../../../api';
import moment from 'moment';
import {ScrollView} from 'react-native-gesture-handler';
import {Table, TableWrapper, Row, Rows} from 'react-native-table-component';
import vehicleSubImage from '../../../../../assets/1bikeSub.png';
// import {color} from 'react-native-reanimated';
// import {each} from 'lodash';

const styles = StyleSheet.create({
  userProfile: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 7,
    paddingBottom: 7,
    backgroundColor: 'whitesmoke',
  },
  subText: {
    color: '#6c7b8a',
  },
  iconContainer: {
    // borderWidth: 3,
    padding: 2,
    width: 92,
    borderColor: '#363636',
  },
  subIcons: {
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  optionIcon: {
    marginLeft: 'auto',
    marginRight: 5,
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  iconRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 3,
  },
  buttonGroup: {
    width: '100%',
    marginLeft: 0,
    color: 'white',
  },
  eachActivity: {
    marginTop: 8,
    backgroundColor: '#efefef',
    // padding: 12,
    width: '98%',
    marginLeft: 'auto',
    marginRight: 'auto',
    borderWidth: 1,
    borderColor: '#636363',
    // paddingBottom: 3
  },
  leftRightIcon: {
    marginTop: 'auto',
    marginBottom: 'auto',
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
  vehicleContainer: {
    flexDirection: 'row',
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 4,
    paddingRight: 4,
    margin: 6,
    borderWidth: 2,
    borderColor: '#636363',
  },
  enquiryTypeContainer: {
    width: '33.33%',
    margin: 'auto',
    borderWidth: 1,
    borderColor: '#636363',
  },
  activityTop: {
    width: '100%',
    backgroundColor: '#f75b5b',
    height: 34,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#636363',
    padding: 7,
  },
  statusContainer: {
    width: '33.33%',
    margin: 'auto',
    backgroundColor: '#28d6c0',
    borderWidth: 1,
    borderColor: '#636363',
  },
});

const FollowUp = (props) => {
  const {navigation} = props;
  const [customerData, setCustomerData] = useState(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const [activityData, setActivityData] = useState([]);
  const [selectedVehicleIndex, setSelectedVehicleIndex] = useState(0);
  const [selectedCustomerIndex, setSelectedCustomerIndex] = useState(0);
  const [purchasedVehicles, setPurchasedVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState({});
  const [dataTable, setDataTable] = useState([[]]);
  const [refreshing, setRefreshing] = useState(false);
  const vehicleSubImageUri = Image.resolveAssetSource(vehicleSubImage).uri;

  const component1 = () => <Text>Activity</Text>;
  const component2 = () => <Text>Details</Text>;

  const switchButtons = [{element: component1}, {element: component2}];

  useEffect(() => {
    // console.log("propsFollowUp", props.route.params)
    platformApi
      .get(`/api/customer/phone-no/${props.route.params.phone}`)
      .then((res) => {
        let {data} = res ? res : null;
        if (data.code === 200) {
          let {response} = data;
          if (response.code === 200) {
            setCustomerData(response.data.customers);
            let customersId = response.data.customers.map((each) => {
              return each.id;
            });
            platformApi
              .post('/api/activity/customers', {
                limit: 20,
                offset: 0,
                ids: customersId,
              })
              .then((res) => {
                console.log('res', res);
                let {data} = res ? res : null;
                if (data.code === 200) {
                  let {response} = data;
                  if (response.code === 200) {
                    // console.log("responseActivity", response.data)
                    setActivityData(response.data);
                    // setActivityData([...response.data, ...response.data, ...response.data])
                  }
                }
              });
            platformApi
              .post('/api/customer/merge', {
                limit: 20,
                offset: 0,
                ids: customersId,
              })
              .then((res) => {
                console.log('res', res);
                let {data} = res ? res : null;
                if (data.code === 200) {
                  let {response} = data;
                  if (response.code === 200) {
                    console.log('quotation', response.data);
                    setPurchasedVehicles(response.data.purchasedVehicle);
                    // setActivityData(response.data)
                    let tableArray = [];
                    response.data.quotation.map((eachQuotation) => {
                      let rowArray = [eachQuotation.quotationId];
                      let rowVehicleString = '';
                      eachQuotation.vehicle.map((eachVehicle, index) => {
                        if (index === 0)
                          rowVehicleString =
                            eachVehicle.vehicleDetail.modelName;
                        else
                          rowVehicleString =
                            rowVehicleString +
                            ' , ' +
                            '\n' +
                            eachVehicle.vehicleDetail.modelName;
                      });
                      rowArray.push(rowVehicleString);
                      tableArray.push(rowArray);
                    });
                    setDataTable(tableArray);
                  }
                }
              });
          }
        }
      });
  }, []);

  useEffect(() => {
    if (purchasedVehicles.length) {
      platformApi
        .get(`/api/vehicle/${purchasedVehicles[selectedVehicleIndex].id}`)
        .then((res) => {
          let {data} = res ? res : null;
          if (data.code === 200) {
            let {response} = data;
            if (response.code === 200) {
              console.log('VehicleSelected', response.data);
              setSelectedVehicle(response.data);
            }
          }
        });
    }
  }, [selectedVehicleIndex, selectedTab]);

  useEffect(() => {
    customerData && console.log('customer', customerData[selectedVehicleIndex]);
  }, [selectedCustomerIndex]);
  // console.log("selectedVehicle", Object.keys(selectedVehicle).length)
  const onRefresh = () => {
    setRefreshing(true);
    platformApi
      .post('/api/activity/', {
        limit: 20,
        offset: 0,
        id: props.route.params.customer,
      })
      .then((res) => {
        let {data} = res ? res : null;
        setRefreshing(false);
        if (data.code === 200) {
          let {response} = data;
          if (response.code === 200) {
            setActivityData([...response.data]);
          }
        }
      });
  };

  const activityType = (data) => {
    if (data.quotation) return 'Quotation Activity';
    else if (data.booking) return 'Booking Activity';
    else if (data.sms) return 'SMS Activity';
    else return 'Walk-In Activity';
  };

  const enquiryColor = (data) => {
    if (data.enquiryType === 'Cold') return '#9DCDE1';
    else if (data.enquiryType === 'Warm') return '#F7A43E';
    else return '#ED4A50';
  };

  const dynamicData = (data) => {
    if (data.quotation) return `Quotation Id : ${data.quotation.quotationId}`;
    else if (data.booking)
      return `Vehicle : ${data.booking.vehicle.modelCode} - ${data.booking.vehicle.modelName}`;
    else if (data.sms) return `Phone Number : ${data.sms.phone}`;
    else return `Interaction Type : ${data.interactionType}`;
  };

  const statusText = (data, type) => {
    if (data.quotation) {
      if (type === 1) return 'Quoted';
      else return '#59CD84';
    } else if (data.booking) {
      if (type === 1) {
        if (data.booking.bookingStatus === 'PENDING') return 'Verf. Pending';
        else if (data.booking.bookingStatus === 'ACCEPTED')
          return 'Verf. Approved';
        else return 'Verf. Rejected';
      } else {
        if (data.booking.bookingStatus === 'PENDING') return '#F7A43E';
        else if (data.booking.bookingStatus === 'ACCEPTED') return '#59CD84';
        else return '#ED4A50';
      }
    } else if (data.sms) {
      if (type === 1)
        return data.sms.smsStatus === 'DELIVRD' ? 'Delivered' : 'Not Delivered';
      else return data.sms.smsStatus === 'DELIVRD' ? '#59CD84' : '#ED4A50';
    } else {
      if (type === 1) return 'Walk-In Activity';
      else return '#9DCDE1';
    }
  };

  return (
    <View style={{height: '100%', marginBottom: '5%'}}>
      <View style={styles.userProfile}>
        <Icon
          name="chevron-left"
          size={30}
          style={styles.leftRightIcon}
          color={selectedCustomerIndex !== 0 ? '#f75b5b' : 'lightgray'}
          onPress={() => {
            if (selectedCustomerIndex !== 0) {
              setSelectedCustomerIndex(selectedCustomerIndex - 1);
            }
          }}
        />
        <Avatar
          size={80}
          source={
            props.route.params.image && {
              uri: props.route.params.image,
            }
          }
          rounded
          overlayContainerStyle={{backgroundColor: 'grey'}}
          icon={
            props.route.params.image ? {} : {name: 'user', type: 'font-awesome'}
          }
          // onPress={takeImageCamera}
          containerStyle={{marginLeft: 10}}
        />
        <View style={{marginTop: 'auto', marginBottom: 'auto', maxWidth: 230}}>
          <Text h4>
            {customerData && customerData[selectedCustomerIndex].name}
          </Text>
          <Text>
            Customer Id :{' '}
            <Text style={styles.subText}>
              {customerData && customerData[selectedCustomerIndex].customerId}
            </Text>
          </Text>
          <Text>
            Customer Type :{' '}
            <Text style={styles.subText}>
              {customerData && customerData[selectedCustomerIndex].customerType}
            </Text>{' '}
          </Text>
          <Text>
            <Text style={styles.subText}>
              {customerData && customerData[selectedCustomerIndex].gender}
            </Text>
            <Text style={styles.subText}>
              {customerData && customerData[selectedCustomerIndex].dateOfBirth
                ? `| ${moment().diff(
                    customerData[selectedCustomerIndex].dateOfBirth,
                    'years',
                  )} Y.O`
                : ''}
            </Text>
            <Text style={styles.subText}>
              {customerData &&
              customerData[selectedCustomerIndex].address &&
              customerData[selectedCustomerIndex].address.locality
                ? `| ${customerData[selectedCustomerIndex].address.locality}`
                : ''}
            </Text>
          </Text>
        </View>
        <Icon
          name="chevron-right"
          size={30}
          style={styles.leftRightIcon}
          color={
            customerData && customerData.length - 1 !== selectedCustomerIndex
              ? '#f75b5b'
              : 'lightgray'
          }
          onPress={() => {
            if (
              customerData &&
              customerData.length - 1 !== selectedCustomerIndex
            ) {
              setSelectedCustomerIndex(selectedCustomerIndex + 1);
            }
          }}
        />
      </View>
      <View style={styles.iconRowContainer}>
        <View style={styles.iconContainer}>
          <Icon
            style={styles.subIcons}
            name="phone-square"
            size={40}
            color="#f75b5b"
          />
        </View>
        <View style={[styles.iconContainer, {top: 5}]}>
          <Icon
            onPress={() => {
              props.navigation.navigate('NewActivity', {
                customer: customerData[selectedCustomerIndex].id,
                customerData: customerData[selectedCustomerIndex],
              });
            }}
            style={styles.subIcons}
            name="file"
            size={30}
            color="#f75b5b"
          />
        </View>
        <View style={styles.iconContainer}>
          <Icon
            onPress={() => {
              props.navigation.navigate('Message', {
                customer: customerData[selectedCustomerIndex].id,
                customerData: customerData[selectedCustomerIndex],
              });
            }}
            style={styles.subIcons}
            name="envelope-square"
            size={40}
            color="#f75b5b"
          />
        </View>
        {/* <View style={styles.iconContainer}>
          <Icon style={styles.subIcons} name="pencil" size={40} color='#f75b5b' />
        </View> */}
      </View>
      <View>
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
        {selectedTab === 0 ? (
          <ScrollView
            style={{height: '68%'}}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => onRefresh()}
                tintColor="#f75b5b"
              />
            }>
            {activityData.map((each, i) => {
              return (
                <View key={i} style={styles.eachActivity}>
                  <View style={styles.activityTop}>
                    <Text
                      style={{
                        marginTop: 'auto',
                        marginBottom: 'auto',
                        color: 'white',
                      }}>
                      {activityType(each)}
                    </Text>
                    <Text
                      style={{
                        marginTop: 'auto',
                        marginBottom: 'auto',
                        color: 'white',
                      }}>
                      {moment(each.createdAt).format('DD-MM-YYYY , HH:mm')}
                    </Text>
                  </View>
                  {/* <Text>Activity Id : {each.activityId}</Text> */}
                  {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 0 }}>
                        <Text>Int. Type : {each.interactionType}</Text>
                        <Text>Enquiry Type : {each.enquiryType || 'NIL'}</Text>
                      </View> */}
                  <View style={{padding: 12}}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginTop: 5,
                      }}>
                      <Text>
                        Sch. Date & Time:{' '}
                        {each.scheduleDateAndTime
                          ? moment(each.scheduleDateAndTime).format(
                              'DD-MM-YYYY , HH:mm',
                            )
                          : 'NIL'}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginTop: 5,
                      }}>
                      <Text>{dynamicData(each)}</Text>
                    </View>
                    <View style={{marginTop: 5, width: '100%'}}>
                      <Text>
                        Remarks : {each.remarks ? each.remarks : 'NIL'}
                      </Text>
                    </View>
                  </View>
                  {/* <View style={{ alignItems: 'flex-end', flexDirection: 'row' }}>
                        <Icon style={styles.optionIcon} name="play" size={16} color='#f75b5b' />
                        <Menu >
                          <MenuTrigger children={<Icon style={{ marginLeft: 20, marginTop: 'auto', marginBottom: 'auto', marginRight: 5 }} name="ellipsis-v" size={20} color='#f75b5b' />} />
                          <MenuOptions optionsContainerStyle={{ width: '30%', backgroundColor: '#f75b5b' }}>
                            <MenuOption customStyles={{ optionText: { textAlign: 'center', color: 'white' } }} style={{ padding: 9 }} onSelect={() => { navigation.navigate('ActivityInfo', { data: each, modify: false }) }} text='View' />
                            <View style={{ borderTopWidth: 1, borderTopColor: 'black' }}></View>
                            <MenuOption customStyles={{ optionText: { textAlign: 'center', color: 'white' } }} style={{ padding: 9 }} onSelect={() => { navigation.navigate('ActivityInfo', { data: each, modify: true }) }} text='Modify' />
                          </MenuOptions>
                        </Menu>
                      </View> */}
                  <View
                    style={{flexDirection: 'row', height: 32, width: '100%'}}>
                    <View
                      style={[
                        styles.statusContainer,
                        {backgroundColor: statusText(each, 2)},
                      ]}>
                      <Text
                        style={{
                          textAlign: 'center',
                          marginTop: 'auto',
                          marginBottom: 'auto',
                          color: 'white',
                        }}>
                        {statusText(each, 1)}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.enquiryTypeContainer,
                        {backgroundColor: enquiryColor(each)},
                      ]}>
                      <Text
                        style={{
                          textAlign: 'center',
                          marginTop: 'auto',
                          marginBottom: 'auto',
                          color: 'white',
                        }}>
                        {each.enquiryType || 'Hot'}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: '33.33%',
                        backgroundColor: 'gray',
                        borderWidth: 1,
                        borderColor: '#636363',
                      }}>
                      <Text
                        onPress={() => {
                          navigation.navigate('ActivityInfo', {
                            data: each,
                            modify: true,
                          });
                        }}
                        style={{
                          textAlign: 'center',
                          marginTop: 'auto',
                          marginBottom: 'auto',
                          color: 'white',
                        }}>
                        Modify
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        ) : (
          <View>
            {Object.keys(selectedVehicle).length ? (
              <View style={styles.vehicleContainer}>
                <Icon
                  name="chevron-left"
                  size={30}
                  style={styles.leftRightIcon}
                  color={selectedVehicleIndex !== 0 ? '#f75b5b' : 'lightgray'}
                  onPress={() => {
                    if (selectedVehicleIndex !== 0) {
                      setSelectedVehicleIndex(selectedVehicleIndex - 1);
                    }
                  }}
                />
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    width: '88%',
                  }}>
                  <View style={{padding: 4}}>
                    <Image
                      source={{
                        uri:
                          (selectedVehicle.color &&
                            selectedVehicle.color.url) ||
                          vehicleSubImageUri,
                      }}
                      style={{marginBottom: 5, height: 67, width: 70}}
                      resizeMode="contain"
                    />
                    <Text style={{textAlign: 'center'}}>
                      {selectedVehicle && selectedVehicle.color
                        ? selectedVehicle.color.code
                        : ''}
                    </Text>
                  </View>
                  <View
                    style={{
                      width: '74%',
                      marginTop: 'auto',
                      marginBottom: 'auto',
                    }}>
                    <Text>
                      {selectedVehicle && selectedVehicle.vehicle
                        ? selectedVehicle.vehicle.manufacturer &&
                          selectedVehicle.vehicle.manufacturer.name
                        : 'Vehicle Deleted'}
                    </Text>
                    <Text>{selectedVehicle && selectedVehicle.registerNo}</Text>
                    <Text>
                      {selectedVehicle &&
                        selectedVehicle.vehicle &&
                        selectedVehicle.vehicle.modelCode}{' '}
                      -{' '}
                      {selectedVehicle &&
                        selectedVehicle.vehicle &&
                        selectedVehicle.vehicle.modelName}
                    </Text>
                    <Text>
                      Date of sale :{' '}
                      {selectedVehicle && selectedVehicle.dateOfSale
                        ? moment(selectedVehicle.dateOfSale).format(
                            'DD/MM/YYYY',
                          )
                        : 'No date given'}
                    </Text>
                    <Text style={{textAlign: 'right'}}>
                      {selectedVehicleIndex + 1}/{purchasedVehicles.length}
                    </Text>
                  </View>
                </View>
                <Icon
                  name="chevron-right"
                  size={30}
                  style={styles.leftRightIcon}
                  color={
                    purchasedVehicles.length - 1 !== selectedVehicleIndex
                      ? '#f75b5b'
                      : 'lightgray'
                  }
                  onPress={() => {
                    if (purchasedVehicles.length - 1 !== selectedVehicleIndex) {
                      setSelectedVehicleIndex(selectedVehicleIndex + 1);
                    }
                  }}
                />
              </View>
            ) : (
              <View>
                <Text style={{textAlign: 'center', padding: 10}}>
                  There is no associated vehicles for this customer.
                </Text>
              </View>
            )}

            <View style={{marginTop: 10}}>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={{marginLeft: 8}}>Quotations :</Text>
                <Text style={{color: '#f75b5b', marginRight: 7}}>
                  Link Quotation
                </Text>
              </View>
              <View style={{marginTop: 5, position: 'relative', height: '51%'}}>
                <Table>
                  <Row
                    data={['Qto No', 'Quoted Vehicle']}
                    flexArr={[1, 2]}
                    style={styles.head}
                    textStyle={[styles.text, {color: 'white'}]}
                  />
                  <TableWrapper style={styles.wrapper}>
                    {dataTable.length ? (
                      <ScrollView style={styles.container}>
                        <Rows
                          data={dataTable}
                          flexArr={[1, 2]}
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
          </View>
        )}
      </View>
    </View>
  );
};

export default FollowUp;
