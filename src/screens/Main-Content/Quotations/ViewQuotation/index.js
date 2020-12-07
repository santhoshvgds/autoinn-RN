import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Image,
  Alert,
  Linking,
  ActivityIndicator,
} from 'react-native';
import {Text, Card, Button} from 'react-native-elements';
import {platformApi} from '../../../../api';
import moment from 'moment';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import {Table, TableWrapper, Row, Rows} from 'react-native-table-component';
import Imageupload from '../AddQuotation/CustomerDetailsForm/imageupload';

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#fefefe',
    marginBottom: '14%',
  },
  subHeading: {
    marginLeft: '8%',
    marginTop: '5%',
    marginBottom: '5%',
    fontSize: 15,
  },
  container: {
    flex: 1,
    padding: 0,
    borderWidth: 1,
    borderColor: '#C1C0B9',
    marginTop: 10,
    marginLeft: 20,
    marginRight: 15,
  },
  head: {
    height: 35,
    backgroundColor: '#f75b5b',
    color: 'white',
  },
  wrapper: {
    flexDirection: 'row',
  },
  title: {
    flex: 1,
    backgroundColor: '#636363',
  },
  row: {
    height: 28,
    backgroundColor: '#E7E6E1',
  },
  text: {
    textAlign: 'center',
  },
  modelTitle: {
    textAlign: 'center',
    backgroundColor: '#636363',
    padding: '3%',
    color: 'white',
    borderColor: '#363636',
    borderWidth: 2,
    fontSize: 13,
  },
  icon: {
    marginTop: '23%',
  },
  button: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
    color: 'white',
    width: '100%',
  },
  buttonCon: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    marginTop: '0%',
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

const ViewQuotation = (props) => {
  const dataProps = props.route.params.params;
  const [selectedModels, setSelectedModels] = useState([]);
  const [dataTable, setDataTable] = useState([]);
  const [vehicleColor, setVehicleColor] = useState(
    dataProps.singleData.vehicleColor,
  );
  const [selectedVehicleIndex, setSelectedVehicleIndex] = useState(0);
  const [pageLoad, setPageLoad] = useState(false);

  useEffect(() => {
    let selectedVehicles = [];
    // console.log("data props", dataProps.singleData.vehicle)
    dataProps.singleData.vehicle.map((each) => {
      selectedVehicles.push(each.vehicleDetail);
    });
    setSelectedModels(selectedVehicles);
    dataProps.singleData.selectedModels = selectedVehicles;
    let insuranceType = [];
    let priceTable = [];
    let vehicleColorSelection = [];
    let checkedColor = [];
    let vehicle = [];
    selectedVehicles.map((each, index) => {
      insuranceType.push([false, false, false, false]);
      vehicle.push({
        vehicleDetail: each,
        price: each.price[0],
      });

      let arr = [];
      if (each.price[0].showroomPrice) {
        arr.push(['Ex-showroom Price', each.price[0].showroomPrice]);
      }
      if (each.price[0].roadTax) {
        arr.push(['Road Tax', each.price[0].roadTax]);
      }
      if (each.price[0].warrantyPrice) {
        arr.push(['Warranty Price', each.price[0].warrantyPrice]);
      }
      if (each.price[0].registrationFee) {
        arr.push(['Registration Fee', each.price[0].registrationFee]);
      }
      if (each.price[0].handlingCharges) {
        arr.push(['Handling Charges', each.price[0].handlingCharges]);
      }
      if (dataProps.singleData.view) {
        dataProps.singleData.vehicle[index].insuranceType.map(
          (eachInsurance) => {
            if (eachInsurance.type === 'insurance1plus5') {
              arr.push(['On-Road Price(1 + 5)', eachInsurance.onRoad]);
            }
            if (eachInsurance.type === 'insurance5plus5') {
              arr.push(['On-Road Price(5 + 5)', eachInsurance.onRoad]);
            }
            if (eachInsurance.type === 'insurance1plus5ZD') {
              arr.push(['On-Road Price(1 + 5)ZD', eachInsurance.onRoad]);
            }
            if (eachInsurance.type === 'insurance5plus5ZD') {
              arr.push(['On-Road Price(5 + 5)ZD', eachInsurance.onRoad]);
            }
          },
        );
      }
      priceTable.push(arr);
      vehicleColorSelection.push(0);
      let eachColorVehicle = [];
      each.image.map((eachColor) => {
        eachColorVehicle.push(false);
      });
      checkedColor.push(eachColorVehicle);
      return null;
    });
    dataProps.singleData.insuranceSelected = insuranceType;
    dataProps.singleData.priceTable = priceTable;
    setDataTable(priceTable);
    setVehicleColor(vehicleColorSelection);
    dataProps.singleData.checkedColor = checkedColor;
    if (!dataProps.singleData.view) {
      dataProps.singleData.vehicle = vehicle;
    }
  }, []);

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
          {text: 'Cancel', style: 'cancel'},
        ],
      );
    } else {
      Alert.alert('Actions', `Quotation not Generated`, [
        {text: 'Cancel', style: 'cancel'},
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
      const {data} = result ? result : null;
      if (data && data.code === 200) {
        alert('Message sent Successfully');
        // dataProps.setDataSource([quotationData, ...dataProps.dataSource])
        props.navigation.navigate('Quotations');
      } else {
        alert('Message Not Sent');
        // dataProps.setDataSource([quotationData, ...dataProps.dataSource])
        props.navigation.navigate('Quotations');
      }
    });
  };

  const generatePdf = (singleData, type) => {
    setPageLoad(true);
    const id = singleData.id;
    // console.log("singleData", singleData)
    platformApi.post('api/quotation/pdfGenerate', {id}).then((result) => {
      let {data} = result ? result : null;
      if (data && data.code === 200) {
        let {response} = data;
        // console.log("response", response)
        if (response.code === 200) {
          setPageLoad(false);
          console.log('responsePDF', response);
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
                style: 'cancel',
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
                    // dataProps.setDataSource([singleData, ...dataProps.dataSource])
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

  const onCancel = (singleData) => {
    dataProps.setDataSource([singleData, ...dataProps.dataSource]);
    props.navigation.navigate('Quotations');
  };

  console.log('data', selectedModels);
  return (
    <View>
      {pageLoad === true && (
        <View style={styles.myloader}>
          <ActivityIndicator
            style={{
              marginTop: 'auto',
              marginBottom: 'auto',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
            size="large"
            color="#f75b5b"
          />
        </View>
      )}
      <ScrollView style={{height: '100%'}} showsVerticalScrollIndicator={false}>
        <View style={styles.page}>
          {/* <Text style={{ textAlign: 'center', marginTop: '5%' }}>Customer Details Form</Text> */}
          {dataProps.singleData.view ? (
            <Text
              style={{
                textAlign: 'center',
                marginTop: 20,
                marginBottom: 10,
                color: 'gray',
              }}>
              {' '}
              QUOTATION ID : {dataProps.singleData.quotationId}
            </Text>
          ) : (
            <Text></Text>
          )}
          <Imageupload
            ImageURL={dataProps.singleData.image}
            view={dataProps.singleData.view}
          />
          <Text style={[styles.subHeading, {marginTop: '8%'}]}>
            Customer Name :{' '}
            <Text style={{color: 'gray'}}>
              {dataProps.singleData.customer.name}
            </Text>{' '}
          </Text>
          <Text style={[styles.subHeading, {marginTop: '0%'}]}>
            Gender :{' '}
            <Text style={{color: 'gray'}}>
              {dataProps.singleData.customer &&
                dataProps.singleData.customer.gender}
            </Text>
          </Text>
          <Text style={[styles.subHeading, {marginTop: '0%'}]}>
            Phone :{' '}
            <Text style={{color: 'gray'}}>
              {dataProps.singleData.customer &&
                dataProps.singleData.customer.contacts[0].phone}{' '}
            </Text>
          </Text>
          <Text style={[styles.subHeading, {marginTop: '0%'}]}>
            Locality :{' '}
            <Text style={{color: 'gray'}}>
              {dataProps.singleData.customer &&
                dataProps.singleData.customer.address &&
                dataProps.singleData.customer.address.locality}
            </Text>{' '}
          </Text>
          <Text style={[styles.subHeading, {marginTop: '0%'}]}>
            Test Drive Taken :{' '}
            <Text style={{color: 'gray'}}>
              {dataProps.singleData.testDriveTaken ? 'Taken' : 'Not Taken'}{' '}
            </Text>
          </Text>
          <Text style={[styles.subHeading, {marginTop: '0%'}]}>
            Expected Date of Sale :{' '}
            <Text style={{color: 'gray'}}>
              {dataProps.singleData.expectedDateOfPurchase
                ? moment(dataProps.singleData.expectedDateOfPurchase).format(
                    'DD-MM-YYYY',
                  )
                : 'Not Given'}{' '}
            </Text>
          </Text>

          <Text style={[styles.subHeading, {marginTop: '0%'}]}>
            Quoted Vehicles :{' '}
            <Text style={{color: 'gray'}}>{dataTable.length}</Text>
          </Text>
          {selectedModels[0] && (
            <View style={{margin: 15, marginTop: 0}}>
              <Card>
                <Text style={[styles.modelTitle, {marginBottom: '4%'}]}>
                  {selectedModels[selectedVehicleIndex].modelCode} -{' '}
                  {selectedModels[selectedVehicleIndex].modelName}
                </Text>
                <View style={{display: 'flex', flexDirection: 'row'}}>
                  {/* <Icon
                        name="chevron-left"
                        size={30}
                        style={styles.icon}
                        color={vehicleColor[index] !== 0 ? "#f75b5b" : 'lightgray'}
                        onPress={() => { if (vehicleColor[index] !== 0) { let color = vehicleColor; color[index] = color[index] - 1; setVehicleColor([...color]) } }}
                      /> */}
                  <Image
                    source={{
                      uri:
                        selectedModels[selectedVehicleIndex].image &&
                        selectedModels[selectedVehicleIndex].image[
                          vehicleColor[0]
                        ] &&
                        selectedModels[selectedVehicleIndex].image[
                          vehicleColor[0]
                        ].url,
                    }}
                    style={{marginBottom: 10, height: 150, width: 305}}
                    resizeMode="contain"
                  />
                  {/* <Icon
                        name="chevron-right"
                        size={30}
                        style={styles.icon}
                        color={eachSelected.image.length - 1 !== vehicleColor[index] ? "#f75b5b" : 'lightgray'}
                        onPress={() => { if (eachSelected.image.length - 1 !== vehicleColor[index]) { let color = vehicleColor; color[index] = color[index] + 1; setVehicleColor([...color]) } }}
                      /> */}
                </View>
                <Text style={[styles.modelTitle, {marginBottom: '4%'}]}>
                  {selectedModels[selectedVehicleIndex] &&
                    selectedModels[selectedVehicleIndex].image[
                      vehicleColor[0]
                    ] &&
                    selectedModels[selectedVehicleIndex].image[vehicleColor[0]]
                      .color}
                </Text>
                <View style={styles.container}>
                  <Table borderStyle={{borderColor: 'transparent'}}>
                    <Row
                      data={['Type', 'Price']}
                      flexArr={[2, 1]}
                      style={styles.head}
                      textStyle={styles.text}
                    />
                    <TableWrapper style={styles.wrapper}>
                      {/* <Col data={tableTitle} style={styles.title} heightArr={[28, 28]} textStyle={styles.text} /> */}
                      <Rows
                        data={dataTable[selectedVehicleIndex]}
                        flexArr={[2, 1]}
                        style={styles.row}
                        textStyle={styles.text}
                      />
                    </TableWrapper>
                  </Table>
                </View>
                {selectedModels.length > 1 ? (
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                      marginTop: 15,
                    }}>
                    <Button
                      onPress={() => {
                        if (selectedVehicleIndex !== 0)
                          setSelectedVehicleIndex(selectedVehicleIndex - 1);
                      }}
                      buttonStyle={
                        selectedVehicleIndex !== 0
                          ? {backgroundColor: '#f75b5b', width: 120}
                          : {backgroundColor: 'gray', width: 120}
                      }
                      title="Previous"
                    />
                    <Button
                      onPress={() => {
                        if (selectedVehicleIndex !== selectedModels.length - 1)
                          setSelectedVehicleIndex(selectedVehicleIndex + 1);
                      }}
                      buttonStyle={
                        selectedVehicleIndex !== selectedModels.length - 1
                          ? {backgroundColor: '#f75b5b', width: 120}
                          : {backgroundColor: 'gray', width: 120}
                      }
                      style={{width: 120}}
                      title="Next"
                    />
                  </View>
                ) : (
                  <></>
                )}
              </Card>
            </View>
          )}
          <Text style={[styles.subHeading, {marginTop: '0%'}]}>
            Branch :{' '}
            <Text style={{color: 'gray'}}>
              {dataProps.singleData.branch.name}{' '}
            </Text>
          </Text>
          <Text style={[styles.subHeading, {marginTop: '0%'}]}>
            Enquiry Type :{' '}
            <Text style={{color: 'gray'}}>
              {dataProps.singleData.enquiryType}{' '}
            </Text>
          </Text>
          <Text style={[styles.subHeading, {marginTop: '0%'}]}>
            Lead Source :{' '}
            <Text style={{color: 'gray'}}>
              {dataProps.singleData.leadSource}{' '}
            </Text>
          </Text>
          {dataProps.singleData.view ? (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                marginTop: '0%',
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
                      phone: dataProps.singleData.customer.contacts[0].phone,
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
          <Text style={[styles.subHeading, {marginTop: '7%'}]}>
            Next Schedule Date :{' '}
            <Text style={{color: 'gray'}}>
              {dataProps.singleData.scheduleDate
                ? moment(dataProps.singleData.scheduleDate).format('DD-MM-YYYY')
                : 'Not Given'}{' '}
            </Text>
          </Text>
          <Text style={[styles.subHeading, {marginTop: '0%'}]}>
            Next Schedule Time :{' '}
            <Text style={{color: 'gray'}}>
              {dataProps.singleData.scheduleTime
                ? moment(dataProps.singleData.scheduleTime).format('HH:mm')
                : 'Not Given'}{' '}
            </Text>
          </Text>
          {dataProps.singleData.remarks && (
            <View>
              <Text style={[styles.subHeading, {marginTop: '0%'}]}>
                Remarks :
              </Text>
              <Text
                style={[
                  styles.subHeading,
                  {marginLeft: '15%', color: 'gray', marginTop: '0%'},
                ]}>
                {dataProps.singleData.remarks}{' '}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
      <View
        style={{position: 'absolute', bottom: '0%', left: '0%', width: '100%'}}>
        <TouchableOpacity
          onPress={() => props.navigation.navigate('Quotations')}
          style={[styles.buttonCon, {backgroundColor: '#f75b5b'}]}>
          <Text style={styles.button}>CANCEL</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ViewQuotation;
