import React, {useState, useEffect} from 'react';
import {PermissionsAndroid} from 'react-native';
import {
  Text,
  Button,
  Image,
  Card,
  ButtonGroup,
  Input,
} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  View,
  StyleSheet,
  Alert,
  Keyboard,
  Dimensions,
  ScrollView,
  SafeAreaView,
  TouchableOpacityBase,
} from 'react-native';
import {platformApi} from '../../../../../api';
import moment from 'moment';
import DatePicker from 'react-native-datepicker';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Imageupload from './imageupload';

const styles = StyleSheet.create({
  page: {
    marginLeft: '5%',
    margin: '5%',
    backgroundColor: '#fefefe',
    paddingBottom: '5%',
    marginBottom: '17%',
  },
  button: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
    color: 'white',
    width: '100%',
  },
  but: {
    color: 'white',
  },
  phone: {
    marginTop: '-3%',
    margin: '5%',
    width: '90%',
  },
  input: {
    margin: '5%',
    width: '90%',
    marginTop: '-3%',
  },
  buttonGroup: {
    marginLeft: '8%',
    width: '83%',
    backgroundColor: 'lightgray',
  },
  location: {
    margin: '5%',
    width: '90%',
    marginTop: '3%',
  },
  buttonCon: {
    backgroundColor: '#f75b5b',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
  imagePicker: {
    alignItems: 'center',
    marginBottom: 15,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
  },
  image: {
    width: '80%',
    height: '80%',
  },
  subHeading: {
    marginLeft: '7%',
    marginTop: '5%',
    marginBottom: '5%',
    color: 'gray',
    fontSize: 13,
  },
});

const CustomerDetailsForm = (props) => {
  const [phone, setPhone] = useState('');
  const [customer, setCustomer] = useState({});
  const [gender, setGender] = useState(null);
  const [location, setLocation] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [followDate, setFollowDate] = useState(moment(new Date()));
  const [hasPermission, setHasPermission] = useState(null);
  const [selectedImage, setSelectedImage] = useState();
  const [testDrive, setTestDrive] = useState(null);

  const [pickedImage, setPickedImage] = useState();

  const component1 = () => <Text>Male</Text>;
  const component2 = () => <Text>Female</Text>;

  const dataProps = props.route.params.params;

  useEffect(() => {
    (async () => {
      const grand = await await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Cool Photo App Camera Permission',
          message:
            'Cool Photo App needs access to your camera ' +
            'so you can take awesome pictures.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      setHasPermission(granted === PermissionsAndroid.RESULTS.GRANTED);
    })();
    if (dataProps.singleData.view) {
      if (dataProps.singleData.testDriveTaken) {
        setTestDrive(0);
      } else {
        setTestDrive(1);
      }
      // console.log("expected",dat)
      setFollowDate(
        dataProps.singleData.expectedDateOfPurchase
          ? moment(dataProps.singleData.expectedDateOfPurchase)
          : undefined,
      );
      setCustomerName(
        (dataProps.singleData.customer && dataProps.singleData.customer.name) ||
          dataProps.singleData.proCustomer.name,
      );
      setLocation(
        dataProps.singleData.customer &&
          dataProps.singleData.customer.address &&
          dataProps.singleData.customer.address.locality,
      );
      setPhone(
        (dataProps.singleData.customer &&
          dataProps.singleData.customer.contacts[0].phone) ||
          dataProps.singleData.proCustomer.phone ||
          dataProps.singleData.proCustomer.refferedBy.contacts[0].phone,
      );
      let gender =
        dataProps.singleData.customer && dataProps.singleData.customer.gender;
      if (gender === 'Male') {
        setGender(0);
      } else {
        setGender(1);
      }
    }
  }, []);
  const imageTakenHandler = (imagePath) => {
    setSelectedImage(imagePath);
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const onNext = () => {
    let executive = '';
    if (testDrive === 0) {
      dataProps.singleData.testDriveTaken = true;
    } else {
      dataProps.singleData.testDriveTaken = false;
    }
    // console.log("follow", followDate)
    if (followDate)
      dataProps.singleData.expectedDateOfPurchase = followDate.format(
        'DD-MM-YYYY',
      );
    // console.log("moment", moment(followDate).format('DD-MM-YYYY'))
    dataProps.singleData.quotationPhone = phone;
    platformApi.get('/api/user/currentUser').then((result) => {
      let {data} = result ? result : null;
      if (data && data.code === 200) {
        let {response} = data;
        if (response.code === 200) {
          dataProps.singleData.executive = response.data.id;
        }
      }
    });
    if (phone && location && customerName && !dataProps.singleData.view) {
      if (
        customer.contacts &&
        customer.contacts[0].phone === phone &&
        customerName === customer.name
      ) {
        dataProps.singleData.customer = customer.id;
        // console.log(customer.id);
      } else {
        dataProps.singleData.name = customerName;
        dataProps.singleData.locality = location;
        if (gender === 0) {
          dataProps.singleData.gender = 'Male';
        } else {
          dataProps.singleData.gender = 'Female';
        }
        if (customer.contacts && customer.contacts[0].phone === phone) {
          dataProps.singleData.customer = customer.id;
          dataProps.singleData.phone = null;
        } else {
          dataProps.singleData.phone = phone;
          dataProps.singleData.customer = null;
        }
      }
      dataProps.imagePath = selectedImage;
      props.navigation.navigate('Select Vehicle Form', {
        params: dataProps,
      });
    } else if (dataProps.singleData.view) {
      props.navigation.navigate('Select Vehicle Form', {
        params: dataProps,
      });
    } else {
      alert('Enter all Field Values');
    }
  };
  const searchCustomer = (text) => {
    Keyboard.dismiss();
    console.log('phone', phone);
    let data = text || phone;
    platformApi.get('api/customer/phone/' + data).then((result) => {
      let {data} = result ? result : null;
      if (data && data.code === 200) {
        let {response} = data;
        if (response.code === 200) {
          if (response.data[0]) {
            setCustomer(response.data[0]);
            setLocation(response.data[0].address.locality);
            if (response.data[0].gender === 'Male') {
              setGender(0);
            } else {
              setGender(1);
            }
            setCustomerName(response.data[0].name);
          } else {
            alert('Customer Not Found');
            setCustomerName('');
            setGender(null);
            setLocation('');
          }
        }
      }
    });
  };

  const verifyPermissions = async () => {
    PermissionsAndroid.check('camera').then((response) => {
      if (response === false) {
        //Open scanner
        Alert.alert(
          'Insufficient permissions!',
          'You need to grant camera permissions to use this app.',
          [{text: 'Okay'}],
        );
        return false;
      }
      return true;
    });
  };

  const testcomponent1 = () => <Text>Yes</Text>;
  const testcomponent2 = () => <Text>No</Text>;

  const testDrivebuttons = [
    {element: testcomponent1},
    {element: testcomponent2},
  ];
  // console.log("object", pickedImage);
  const buttons = [{element: component1}, {element: component2}];
  return (
    <View>
      <ScrollView style={{height: '100%'}} showsVerticalScrollIndicator={false}>
        <View style={styles.page}>
          {/* <Text style={{ textAlign: 'center', marginTop: '5%' }}>Customer Details Form</Text> */}
          {dataProps.singleData.view ? (
            <Text
              style={{
                marginLeft: '6%',
                marginTop: 20,
                marginBottom: 10,
                color: 'gray',
                fontWeight: 'bold',
              }}>
              {' '}
              Quotation Id : {dataProps.singleData.quotationId}
            </Text>
          ) : (
            <Text></Text>
          )}

          <Imageupload
            onImageTaken={imageTakenHandler}
            ImageURL={dataProps.singleData.image}
            view={dataProps.singleData.view}
          />
          {/* <ScrollView > */}
          <Text style={[styles.subHeading, {marginTop: '15%'}]}>
            Phone Number
          </Text>
          <Input
            keyboardType="numeric"
            // label="Phone Number"
            placeholder="Phone Number"
            value={phone}
            disabled={dataProps.singleData.view}
            onChange={(text) => {
              setPhone(text.nativeEvent.text);
              if (text.nativeEvent.text.length === 10)
                searchCustomer(text.nativeEvent.text);
            }}
            leftIcon={{type: 'font-awesome', name: 'phone'}}
            containerStyle={styles.phone}
            inputStyle={{marginLeft: '7%'}}
            rightIcon={
              !dataProps.singleData.view
                ? {
                    onPress: () => {
                      searchCustomer();
                    },
                    type: 'font-awesome',
                    name: 'search',
                  }
                : {}
            }
          />
          <Text style={[styles.subHeading, {marginTop: '0%'}]}>
            Customer Name
          </Text>
          <Input
            // label="Customer Name"
            placeholder="Customer Name"
            value={customerName}
            disabled={dataProps.singleData.view}
            onChange={(text) => {
              setCustomerName(text.nativeEvent.text);
            }}
            leftIcon={{type: 'font-awesome', name: 'user'}}
            containerStyle={styles.input}
            inputStyle={{marginLeft: '7%'}}
          />
          <Text style={[styles.subHeading, {marginTop: '0%'}]}>Gender </Text>
          <ButtonGroup
            onPress={(change) => {
              setGender(change);
            }}
            selectedIndex={gender}
            buttons={buttons}
            disabledSelectedStyle={{backgroundColor: '#636363'}}
            selectedButtonStyle={{backgroundColor: '#f75b5b'}}
            disabled={dataProps.singleData.view}
            textStyle={{color: 'white'}}
            containerStyle={styles.buttonGroup}
          />
          <Text style={[styles.subHeading, {marginTop: '6%'}]}>Location</Text>
          <Input
            value={location}
            onChange={(text) => {
              setLocation(text.nativeEvent.text);
            }}
            // label="Location"
            placeholder="Locality"
            disabled={dataProps.singleData.view}
            leftIcon={{type: 'font-awesome', name: 'map-marker'}}
            containerStyle={[styles.location, {marginTop: '-3%'}]}
            inputStyle={{marginLeft: '7%'}}
          />
          <Text style={[styles.subHeading, {marginTop: '0%'}]}>
            Test Drive Taken
          </Text>
          <ButtonGroup
            disabled={dataProps.singleData.view}
            onPress={(change) => {
              setTestDrive(change);
            }}
            selectedIndex={testDrive}
            disabledSelectedStyle={{backgroundColor: '#636363'}}
            buttons={testDrivebuttons}
            selectedButtonStyle={{backgroundColor: '#f75b5b'}}
            containerStyle={styles.buttonGroup}
          />
          <Text style={[styles.subHeading, {marginTop: '5%'}]}>
            Expected Date of Sale{' '}
          </Text>
          <DatePicker
            disabled={dataProps.singleData.view}
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
              setFollowDate(moment(date, 'DD-MM-YYYY'));
            }}
          />
        </View>
      </ScrollView>
      <View
        style={{
          position: 'absolute',
          bottom: '0%',
          left: '0%',
          width: '100%',
          marginTop: 0,
        }}>
        <TouchableOpacity onPress={() => onNext()} style={styles.buttonCon}>
          <Text style={styles.button}>CONTINUE</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CustomerDetailsForm;
