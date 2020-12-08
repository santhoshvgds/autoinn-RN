import React, {useState, useEffect, useContext} from 'react';
import DatePicker from 'react-native-datepicker';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Text, Button, ButtonGroup, Image} from 'react-native-elements';
import {
  View,
  StyleSheet,
  Dimensions,
  TextInput,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Picker,
  Linking,
} from 'react-native';
import moment from 'moment';
import {platformApi} from '../../../../../api';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {ContextAPI} from '../../../../../ContextAPI';
import {Dropdown} from 'react-native-material-dropdown';
const screenHeight = Math.round(Dimensions.get('window').height);

const styles = StyleSheet.create({
  page: {
    height: '100%',
    backgroundColor: '#fefefe',
  },
  button: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
    color: 'white',
    width: '100%',
  },
  leadDataForm: {
    height: '86%',
  },
  buttonCon: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    marginTop: '0%',
  },
  buttonGroup: {
    marginLeft: '8%',
    width: '83%',
    backgroundColor: 'lightgray',
  },
  buttonViewCon: {
    flexDirection: 'row',
  },
  myloader: {
    position: 'absolute',
    top: '0%',
    left: 0,
    zIndex: 10,
    backgroundColor: '#ffffff',
    opacity: 0.9,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
});

const LeadDataForm = (props) => {
  const [testDrive, setTestDrive] = useState(null);
  const [followDate, setFollowDate] = useState(moment(new Date()));
  const [followTime, setFollowTime] = useState(moment(new Date()));
  const [pageLoad, setPageLoad] = useState(false);
  const [remarks, setRemarks] = useState('');
  const [branch, setBranch] = useState([]);
  const [status, setStatus] = useState(false);
  const {loginCredintials} = useContext(ContextAPI);
  const dataProps = props.route.params.params;

  useEffect(() => {
    // console.log('hello', loginCredintials.branch);
    if (dataProps.singleData.view) {
      setFollowDate(
        dataProps.singleData.scheduleDate
          ? moment(dataProps.singleData.scheduleDate)
          : undefined,
      );
      setFollowTime(
        dataProps.singleData.scheduleTime
          ? moment(dataProps.singleData.scheduleTime)
          : undefined,
      );
      setRemarks(dataProps.singleData.remarks);
      if (dataProps.singleData.testDriveTaken) {
        setTestDrive(0);
      } else {
        setTestDrive(1);
      }
    } else {
      let array = [];
      loginCredintials.branch.map((element) => {
        let obj = {
          label: element.name,
          value: element.id,
        };
        array.push(obj);
      });
      dataProps.singleData.branch = array[0].value;
      // console.log(array);
      if (array) setBranch(array);
    }
  }, []);

  const onCancel = (singleData) => {
    dataProps.setDataSource([singleData, ...dataProps.dataSource]);
    props.navigation.navigate('Quotations');
  };

  const triggerSMS = (quotationData) => {
    // console.log(quotationData);
    const cname =
      (quotationData.customer && quotationData.customer.name) ||
      quotationData.proCustomer.name;
    const qtno = quotationData.quotationId;
    const vname = [];
    quotationData.vehicle &&
      quotationData.vehicle.map((each) => {
        vname.push(each.vehicleDetail.modelName);
      });
    const slex =
      quotationData.executive &&
      quotationData.executive.profile.employeeName +
        ' - ' +
        quotationData.executive.phone;
    const link = quotationData.pdfWithBrochure;
    const linkWithoutBrochure = quotationData.pdfWithOutBrochure;
    const phone =
      quotationData.quotationPhone ||
      (quotationData.customer && quotationData.customer.contacts[0].phone) ||
      (quotationData.proCustomer && quotationData.proCustomer.phone);
    const dlr = quotationData.branch && quotationData.branch.name;
    // console.log("heloooo", quotationData.branch.name);

    let obj = {
      cname,
      qtno,
      vname,
      slex,
      linkWithoutBrochure,
      link,
      phone,
      dlr,
    };
    // console.log("objjjjjjjjjjjj", obj);
    platformApi.post('api/sendSms/quotation', obj).then((result) => {
      const {data} = result;
      if (data.code === 200) {
        alert('Message sent Successfully');
        dataProps.setDataSource([quotationData, ...dataProps.dataSource]);
        props.navigation.navigate('Quotations');
      } else {
        alert('Message Not Sent');
        dataProps.setDataSource([quotationData, ...dataProps.dataSource]);
        props.navigation.navigate('Quotations');
      }
    });
  };

  const generatePdf = (singleData, type) => {
    setPageLoad(true);
    const id = singleData.id;
    // console.log("singleData", singleData)
    platformApi.post('api/quotation/pdfGenerate', {id}).then((result) => {
      let {data} = result;
      if (data.code === 200) {
        let {response} = data;
        // console.log("response", response)
        if (response.code === 200) {
          setPageLoad(false);
          // console.log('responsePDF', response);
          let Location =
            response.pdfWithBrochure.data &&
            response.pdfWithBrochure.data.Location;
          if (Location.substring(0, 4) !== 'http')
            Location = 'https://' + Location;
          singleData.pdfWithBrochure = Location;

          let Location2 =
            response.pdfWithoutBrochure.data &&
            response.pdfWithoutBrochure.data.Location;
          if (Location2.substring(0, 4) !== 'http')
            Location2 = 'https://' + Location2;
          singleData.pdfWithOutBrochure = Location2;
          // console.log("singleeeedata", Location, Location2, singleData)

          Alert.alert(
            'Actions',
            `Choose an Action for ${singleData.quotationId}`,
            [
              {
                text: 'Cancel',
                style: 'Cancel',
                onPress: () => {
                  onCancel(singleData);
                },
              },
              {
                text: 'Send Via SMS',
                onPress: () => {
                  triggerSMS(singleData);
                },
              },
              {
                text: 'Print PDF',
                onPress: () => {
                  Linking.openURL(Location);
                  if (type === 1) {
                    dataProps.setDataSource([
                      singleData,
                      ...dataProps.dataSource,
                    ]);
                    props.navigation.navigate('Quotations');
                  }
                },
              },
            ],
            {cancelable: true},
          );
        } else {
          setPageLoad(false);
          alert('Pdf Not Generated');
        }
      } else {
        setPageLoad(false);
        alert('Pdf Not Generated');
      }
      // console.log("pdf------------->", result, id);
    });
  };

  const pdfButton = () => {
    if (
      dataProps.singleData.pdfWithBrochure &&
      dataProps.singleData.pdfWithOutBrochure
    ) {
      Alert.alert(
        'Actions',
        `Choose an Action for ${dataProps.singleData.quotationId}`,
        [
          {
            text: 'PDF With Brochure',
            onPress: () => {
              Linking.openURL(dataProps.singleData.pdfWithBrochure);
            },
          },
          {
            text: 'PDF Without Brochure',
            onPress: () => {
              Linking.openURL(dataProps.singleData.pdfWithOutBrochure);
            },
          },
          {text: 'Cancel', style: 'Cancel'},
        ],
      );
    } else {
      Alert.alert('Actions', `Quotation not Generated`, [
        {text: 'Cancel', style: 'Cancel'},
        {
          text: 'Generate PDF',
          onPress: () => {
            // console.log("dataProps", dataProps.singleData)
            generatePdf(dataProps.singleData, 2);
          },
        },
      ]);
    }
  };

  const onSubmit = () => {
    // console.log("time", followTime.format('h:mm:ss a'))
    if (
      dataProps.singleData.leadSource &&
      dataProps.singleData.branch &&
      dataProps.singleData.enquiryType &&
      dataProps.singleData.remarks
    ) {
      setStatus(true);
      if (followDate)
        dataProps.singleData.scheduleDate = followDate.format('DD-MM-YYYY');
      if (followTime)
        dataProps.singleData.scheduleTime = followTime.format('h:mm:ss a');
      // console.log("object", followDate.format('DD-MM-YYYY'))
      let submit = dataProps.singleData;
      submit.image = undefined;
      submit.insuranceSelected = undefined;
      submit.priceTable = undefined;
      submit.selectedModels = undefined;
      submit.checkedColor = undefined;
      submit.vehicleColor = undefined;
      // console.log("submit", submit.quotationId)
      platformApi.post('/api/idGenerate/quotation').then((result) => {
        let {data} = result;
        if (data.code === 200) {
          let {response} = data;
          if (response.code === 200) {
            submit.quotationId = response.data.QuotationId;
            if (!submit.customer) {
              submit.customerId = response.data.customerId;
            }
            let filename =
              props.route.params.params.imagePath &&
              props.route.params.params.imagePath.split('/').pop();
            let match = /\.(\w+)$/.exec(filename);
            let type = match ? `image/${match[1]}` : `image`;
            const formData = new FormData();
            props.route.params.params.imagePath &&
              formData.append('photo', {
                uri: props.route.params.params.imagePath,
                name: filename,
                type,
              });
            formData.append('finalData', JSON.stringify(submit));

            platformApi
              .post('/api/quotation', formData, {
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'multipart/form-data',
                },
              })
              .then((result) => {
                const {data} = result;
                if (data.code === 200) {
                  const {response} = data;
                  if (response.code === 200) {
                    // console.log("resultt", response.data)
                    generatePdf(response.data, 1);
                  } else {
                    // console.log("oncancel", result)
                  }
                }
              });
          }
        }
      });
    } else {
      // console.log("object", dataProps.singleData.leadSource, dataProps.singleData.branch, dataProps.singleData.enquiryType)
      Alert.alert('Enter all field Values');
    }
  };
  const confirmDelete = () => {
    platformApi
      .delete(`/api/quotation/${dataProps.singleData.id}`)
      .then((result) => {
        const {data} = result;
        if (data.code === 200) {
          const {response} = data;
          if (response.code === 200) {
            alert('Deleted Successfully');
            let Data = [];
            Data = dataProps.dataSource.filter(
              (data) => data.id !== dataProps.singleData.id,
            );
            dataProps.setDataSource([...Data]);
            props.navigation.navigate('Quotations');
          } else {
            alert('Quotation not deleted');
          }
        } else {
          alert('Quotation not deleted');
        }
      });
  };

  return (
    <KeyboardAvoidingView
      enabled
      keyboardVerticalOffset={100}
      behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
      {pageLoad === true && (
        <View style={styles.myloader}>
          <Text>Generating PDF...</Text>
        </View>
      )}
      <View style={styles.page}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={{textAlign: 'center', marginTop: '5%'}}>
            Lead Data Form
          </Text>
          <View style={styles.leadDataForm}>
            {/* <Text style={{ marginLeft: '5%', marginTop: '5%', marginBottom: '-4%' }}>Branch</Text> */}
            <Dropdown
              label="Select Branch"
              disabled={dataProps.singleData.view}
              value={
                dataProps.singleData.view
                  ? dataProps.singleData.branch.name
                  : dataProps.singleData.branch ||
                    (branch[0] && branch[0].label)
              }
              containerStyle={{
                width: '90%',
                marginLeft: 'auto',
                marginRight: 'auto',
                marginTop: '0%',
              }}
              onChangeText={(value) => {
                dataProps.singleData.branch = value;
              }}
              data={branch}
            />
            {/* <Text style={{ marginLeft: '5%', marginTop: '0%', marginBottom: '-4%' }}>Enquiry Type</Text> */}
            <Dropdown
              disabled={dataProps.singleData.view}
              onChangeText={(value) => {
                dataProps.singleData.enquiryType = value;
              }}
              value={dataProps.singleData.enquiryType}
              containerStyle={{
                width: '90%',
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
            {/* <Text style={{ marginLeft: '5%', marginTop: '0%' }}>Lead Source</Text> */}
            <Dropdown
              disabled={dataProps.singleData.view}
              label="Select Lead Source"
              onChangeText={(value) => {
                dataProps.singleData.leadSource = value;
              }}
              value={dataProps.singleData.leadSource}
              containerStyle={{
                width: '90%',
                marginLeft: 'auto',
                marginRight: 'auto',
                marginTop: '0%',
              }}
              data={[
                {value: 'WALK IN', label: 'Walk In'},
                {value: 'CALL ENQUIRY', label: 'Call Enquiry'},
                {value: 'REFERRAL', label: 'Referral'},
                {value: 'SOCIAL MEDIA', label: 'Social Media'},
                {value: 'SMS', label: 'SMS'},
                {value: 'NEWSPAPER', label: 'Newspaper'},
                {value: 'TELEVISION AD', label: 'Television Ad'},
                {value: 'LEAFLET', label: 'Leaflet'},
              ]}
            />
            {dataProps.singleData.view ? (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  marginTop: 15,
                }}>
                <Button
                  onPress={() => {
                    pdfButton();
                  }}
                  buttonStyle={{backgroundColor: '#f75b5b', width: 120}}
                  title="PDF"
                />
                <Button
                  onPress={() => {
                    props.navigation.navigate(
                      'Follow Up',
                      dataProps.singleData && {
                        quotation: dataProps.singleData.id,
                        customer: dataProps.singleData.customer.id,
                        image: dataProps.singleData.image,
                      },
                    );
                  }}
                  buttonStyle={{backgroundColor: '#f75b5b', width: 120}}
                  style={{width: 120}}
                  title="Follow-up"
                />
              </View>
            ) : (
              <></>
            )}
            {/* <ButtonGroup
              disabled={dataProps.singleData.view}
              onPress={(change) => { setTestDrive(change) }}
              selectedIndex={testDrive}
              disabledSelectedStyle={{ backgroundColor: '#636363' }}
              buttons={buttons}
              selectedButtonStyle={{ backgroundColor: '#f75b5b' }}
              containerStyle={styles.buttonGroup} /> */}
            <Text
              style={{
                marginLeft: '5.5%',
                marginTop: '5%',
                marginBottom: '5%',
                color: 'gray',
                fontSize: 11.5,
              }}>
              Scheduled Follow Up - Date
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
            <Text
              style={{
                marginLeft: '5.5%',
                marginTop: '5%',
                marginBottom: '5%',
                color: 'gray',
                fontSize: 11.5,
              }}>
              Scheduled Follow Up - Time
            </Text>
            <DatePicker
              disabled={dataProps.singleData.view}
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
                    left: '10.8%',
                    top: 9,
                    marginTop: 9,
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
                },
              }}
              onDateChange={(time) => {
                setFollowTime(moment(time, 'HH:mm'));
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
              Remarks
            </Text>
            <TextInput
              editable={!dataProps.singleData.view}
              multiline={true}
              numberOfLines={4}
              style={{
                borderWidth: 1,
                margin: '8%',
                marginTop: '2%',
                borderColor: 'lightgray',
                backgroundColor: '#efefef',
              }}
              onChangeText={(text) => {
                setRemarks(text), (dataProps.singleData.remarks = text);
              }}
              value={remarks}
            />
          </View>
        </ScrollView>
      </View>
      <View
        style={{position: 'absolute', bottom: '0%', left: '0%', width: '100%'}}>
        {dataProps.singleData.view ? (
          <TouchableOpacity
            onPress={() => props.navigation.navigate('Quotations')}
            style={[styles.buttonCon, {backgroundColor: '#f75b5b'}]}>
            <Text style={styles.button}>CANCEL</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => {
              if (!status) onSubmit();
            }}
            style={[
              styles.buttonCon,
              {backgroundColor: status ? 'lightgray' : '#f75b5b'},
            ]}>
            <Text style={styles.button}>SUBMIT</Text>
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

export default LeadDataForm;
