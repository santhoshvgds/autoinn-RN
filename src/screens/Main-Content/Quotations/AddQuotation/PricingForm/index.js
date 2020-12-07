import React, {useState, useEffect} from 'react';
import {Text, Button, Image, Card, CheckBox} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  View,
  StyleSheet,
  Alert,
  Linking,
  Dimensions,
  ScrollView,
  Slider,
} from 'react-native';
import {
  Table,
  TableWrapper,
  Row,
  Rows,
  Col,
  Cols,
  Cell,
} from 'react-native-table-component';
import {TouchableOpacity} from 'react-native-gesture-handler';

const screenWidth = Math.round(Dimensions.get('window').width);
const marginButton = (23 / 100) * screenWidth;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    borderWidth: 1,
    borderColor: '#C1C0B9',
    marginTop: 10,
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
  page: {
    height: '100%',
    backgroundColor: '#efefef',
  },
  button: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
    color: 'white',
    width: '100%',
  },
  pricingForm: {
    height: '86%',
  },
  buttonCon: {
    backgroundColor: '#f75b5b',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
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
  noModels: {
    textAlign: 'center',
    top: '50%',
  },
  imageSlider: {
    flexDirection: 'row',
  },
  sliderBtn: {
    width: '40%',
    marginLeft: '7%',
    height: '100%',
    marginBottom: '4%',
  },
  icon: {
    marginTop: '23%',
  },
});
const PricingForm = (props) => {
  const dataProps = props.route.params.params;
  const selectedVehicle = dataProps.singleData.selectedModels;
  const [checkedColor, setCheckedColor] = useState(
    dataProps.singleData.checkedColor,
  );
  const [insurance, setInsurance] = useState(
    dataProps.singleData.insuranceSelected,
  );
  const [dataTable, setDataTable] = useState(dataProps.singleData.priceTable);
  const [vehicleColor, setVehicleColor] = useState(
    dataProps.singleData.vehicleColor,
  );

  useEffect(() => {
    // console.log(dataProps.singleData.vehicle)
  }, []);

  const onNext = () => {
    // console.log("object", insurance);
    insurance.map((eachVehicleInsurance, index) => {
      let array = [];
      let onRoad = 0;
      if (dataProps.singleData.vehicle[index].price.showroomPrice) {
        onRoad =
          onRoad + dataProps.singleData.vehicle[index].price.showroomPrice;
      }
      if (dataProps.singleData.vehicle[index].price.roadTax) {
        onRoad = onRoad + dataProps.singleData.vehicle[index].price.roadTax;
      }
      if (dataProps.singleData.vehicle[index].price.registrationFee) {
        onRoad =
          onRoad + dataProps.singleData.vehicle[index].price.registrationFee;
      }
      if (dataProps.singleData.vehicle[index].price.warrantyPrice) {
        onRoad =
          onRoad + dataProps.singleData.vehicle[index].price.warrantyPrice;
      }
      if (dataProps.singleData.vehicle[index].price.handlingCharges) {
        onRoad =
          onRoad + dataProps.singleData.vehicle[index].price.handlingCharges;
      }
      eachVehicleInsurance.map((element, i) => {
        if (element && i === 0) {
          array.push({
            type: 'insurance1plus5',
            amount: dataProps.singleData.vehicle[index].price.insurance1plus5,
            onRoad:
              onRoad +
              dataProps.singleData.vehicle[index].price.insurance1plus5,
          });
        }
        if (element && i === 1) {
          array.push({
            type: 'insurance5plus5',
            amount: dataProps.singleData.vehicle[index].price.insurance5plus5,
            onRoad:
              onRoad +
              dataProps.singleData.vehicle[index].price.insurance5plus5,
          });
        }
        if (element && i === 2) {
          array.push({
            type: 'insurance1plus5ZD',
            amount: dataProps.singleData.vehicle[index].price.insurance1plus5ZD,
            onRoad:
              onRoad +
              dataProps.singleData.vehicle[index].price.insurance1plus5ZD,
          });
        }
        if (element && i === 3) {
          array.push({
            type: 'insurance5plus5ZD',
            amount: dataProps.singleData.vehicle[index].price.insurance5plus5ZD,
            onRoad:
              onRoad +
              dataProps.singleData.vehicle[index].price.insurance5plus5ZD,
          });
        }
      });
      dataProps.singleData.vehicle[index].insuranceType = array;
    });
    props.navigation.navigate('Lead Data Form', {
      params: dataProps,
    });
  };

  return (
    <View style={styles.page}>
      <Text style={{textAlign: 'center', marginTop: '3%', marginBottom: '3%'}}>
        Pricing Form
      </Text>
      <View style={styles.pricingForm}>
        {!selectedVehicle.length ? (
          <Text style={styles.noModels}>Select Vehicles in Previous Page</Text>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{marginLeft: 8, marginRight: 8}}>
            {selectedVehicle.map((eachSelected, index) => {
              return (
                <View style={{marginTop: 15}}>
                  <View>
                    <Card>
                      <Text style={[styles.modelTitle, {marginBottom: '4%'}]}>
                        {eachSelected.modelCode} - {eachSelected.modelName}
                      </Text>
                      <View style={{display: 'flex', flexDirection: 'row'}}>
                        <Icon
                          name="chevron-left"
                          size={30}
                          style={styles.icon}
                          color={
                            vehicleColor[index] !== 0 ? '#f75b5b' : 'lightgray'
                          }
                          onPress={() => {
                            if (vehicleColor[index] !== 0) {
                              let color = vehicleColor;
                              color[index] = color[index] - 1;
                              setVehicleColor([...color]);
                            }
                          }}
                        />
                        <Image
                          source={{
                            uri: eachSelected.image[vehicleColor[index]].url,
                          }}
                          style={{marginBottom: 10, height: 150, width: 250}}
                          resizeMode="contain"
                        />
                        <Icon
                          name="chevron-right"
                          size={30}
                          style={styles.icon}
                          color={
                            eachSelected.image.length - 1 !==
                            vehicleColor[index]
                              ? '#f75b5b'
                              : 'lightgray'
                          }
                          onPress={() => {
                            if (
                              eachSelected.image.length - 1 !==
                              vehicleColor[index]
                            ) {
                              let color = vehicleColor;
                              color[index] = color[index] + 1;
                              setVehicleColor([...color]);
                            }
                          }}
                        />
                      </View>
                      <Text style={[styles.modelTitle, {marginBottom: '4%'}]}>
                        {eachSelected.image[vehicleColor[index]].color}
                      </Text>
                      {/* <View style={styles.imageSlider}>
                        <Button buttonStyle={{ backgroundColor: '#f75b5b' }} titleStyle={{ color: 'white' }} containerStyle={styles.sliderBtn} onPress={() => { let color = vehicleColor; color[index] = color[index] - 1; setVehicleColor([...color]) }} disabled={vehicleColor[index] === 0} title="Previous"></Button>
                        <Button buttonStyle={{ backgroundColor: '#f75b5b' }} titleStyle={{ color: 'white' }} containerStyle={styles.sliderBtn} onPress={() => { let color = vehicleColor; color[index] = color[index] + 1; setVehicleColor([...color]) }} disabled={eachSelected.image.length - 1 === vehicleColor[index]} title="Next"></Button>
                      </View> */}
                      {!dataProps.singleData.view ? (
                        <Card>
                          <Text>Insurance Type :</Text>
                          {!dataProps.singleData.view &&
                          eachSelected.price[0] &&
                          eachSelected.price[0].insurance1plus5 ? (
                            <CheckBox
                              center
                              checkedColor="#f75b5b"
                              title={`1+5 - ${eachSelected.price[0].insurance1plus5}`}
                              checked={insurance[index][0]}
                              onPress={() => {
                                let array = insurance;
                                let table = dataTable;
                                if (!insurance[index][0]) {
                                  let total = 0;
                                  table[index].map((each) => {
                                    if (
                                      each[0] !== 'On-Road Price(1 + 5)' &&
                                      each[0] !== 'On-Road Price(5 + 5)' &&
                                      each[0] !== 'On-Road Price(1 + 5)ZD' &&
                                      each[0] !== 'On-Road Price(5 + 5)ZD'
                                    )
                                      total = total + each[1];
                                  });
                                  total =
                                    total +
                                    eachSelected.price[0].insurance1plus5;
                                  table[index].push([
                                    'On-Road Price(1 + 5)',
                                    total,
                                  ]);
                                } else {
                                  table[index] = table[index].filter((each) => {
                                    return each[0] !== 'On-Road Price(1 + 5)';
                                  });
                                }
                                setDataTable([...table]);
                                insurance[index][0] = !insurance[index][0];
                                setInsurance([...array]);
                              }}
                            />
                          ) : (
                            <Text style={{marginTop: -14}}></Text>
                          )}
                          {!dataProps.singleData.view &&
                          eachSelected.price[0] &&
                          eachSelected.price[0].insurance5plus5 ? (
                            <CheckBox
                              center
                              checkedColor="#f75b5b"
                              title={`5+5 - ${eachSelected.price[0].insurance5plus5}`}
                              checked={insurance[index][1]}
                              onPress={() => {
                                let array = insurance;
                                let table = dataTable;
                                if (!insurance[index][1]) {
                                  let total = 0;
                                  table[index].map((each) => {
                                    if (
                                      each[0] !== 'On-Road Price(1 + 5)' &&
                                      each[0] !== 'On-Road Price(5 + 5)' &&
                                      each[0] !== 'On-Road Price(1 + 5)ZD' &&
                                      each[0] !== 'On-Road Price(5 + 5)ZD'
                                    )
                                      total = total + each[1];
                                  });
                                  total =
                                    total +
                                    eachSelected.price[0].insurance5plus5;
                                  table[index].push([
                                    'On-Road Price(5 + 5)',
                                    total,
                                  ]);
                                } else {
                                  table[index] = table[index].filter((each) => {
                                    return each[0] !== 'On-Road Price(5 + 5)';
                                  });
                                }
                                setDataTable([...table]);
                                insurance[index][1] = !insurance[index][1];
                                setInsurance([...array]);
                              }}
                            />
                          ) : (
                            <Text style={{marginTop: -14}}></Text>
                          )}
                          {!dataProps.singleData.view &&
                          eachSelected.price[0] &&
                          eachSelected.price[0].insurance1plus5ZD ? (
                            <CheckBox
                              center
                              checkedColor="#f75b5b"
                              title={`1+5 ZD - ${eachSelected.price[0].insurance1plus5ZD}`}
                              checked={insurance[index][2]}
                              onPress={() => {
                                let array = insurance;
                                let table = dataTable;
                                if (!insurance[index][2]) {
                                  let total = 0;
                                  table[index].map((each) => {
                                    if (
                                      each[0] !== 'On-Road Price(1 + 5)' &&
                                      each[0] !== 'On-Road Price(5 + 5)' &&
                                      each[0] !== 'On-Road Price(1 + 5)ZD' &&
                                      each[0] !== 'On-Road Price(5 + 5)ZD'
                                    )
                                      total = total + each[1];
                                  });
                                  total =
                                    total +
                                    eachSelected.price[0].insurance1plus5ZD;
                                  table[index].push([
                                    'On-Road Price(1 + 5)ZD',
                                    total,
                                  ]);
                                } else {
                                  table[index] = table[index].filter((each) => {
                                    return each[0] !== 'On-Road Price(1 + 5)ZD';
                                  });
                                }
                                setDataTable([...table]);
                                insurance[index][2] = !insurance[index][2];
                                setInsurance([...array]);
                              }}
                            />
                          ) : (
                            <Text style={{marginTop: -14}}></Text>
                          )}
                          {!dataProps.singleData.view &&
                          eachSelected.price[0] &&
                          eachSelected.price[0].insurance5plus5ZD ? (
                            <CheckBox
                              checkedColor="#f75b5b"
                              center
                              title={`5+5 ZD - ${eachSelected.price[0].insurance5plus5ZD}`}
                              checked={insurance[index][3]}
                              onPress={() => {
                                let array = insurance;
                                let table = dataTable;
                                if (!insurance[index][3]) {
                                  let total = 0;
                                  table[index].map((each) => {
                                    if (
                                      each[0] !== 'On-Road Price(1 + 5)' &&
                                      each[0] !== 'On-Road Price(5 + 5)' &&
                                      each[0] !== 'On-Road Price(1 + 5)ZD' &&
                                      each[0] !== 'On-Road Price(5 + 5)ZD'
                                    )
                                      total = total + each[1];
                                  });
                                  total =
                                    total +
                                    eachSelected.price[0].insurance5plus5ZD;
                                  table[index].push([
                                    'On-Road Price(5 + 5)ZD',
                                    total,
                                  ]);
                                } else {
                                  table[index] = table[index].filter((each) => {
                                    return each[0] !== 'On-Road Price(5 + 5)ZD';
                                  });
                                }
                                setDataTable([...table]);
                                insurance[index][3] = !insurance[index][3];
                                setInsurance([...array]);
                              }}
                            />
                          ) : (
                            <Text></Text>
                          )}
                        </Card>
                      ) : (
                        <Text></Text>
                      )}
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
                              data={dataTable[index]}
                              flexArr={[2, 1]}
                              style={styles.row}
                              textStyle={styles.text}
                            />
                          </TableWrapper>
                        </Table>
                      </View>
                    </Card>
                    {/* <Card containerStyle={{ margin: 20 }}>
                    <Text style={{ marginBottom: 20 }}>Color Selection :</Text>
                    {!dataProps.singleData.view
                      ?
                      eachSelected.image.map((eachColor, i) => {
                        // console.log(eachColor);
                        return (
                          <CheckBox
                            center
                            disable={dataProps}
                            title={eachColor.color}
                            checked={checkedColor[index][i]}
                            checkedColor='#f75b5b'
                            onPress={() => {
                              let colorSelected = checkedColor;
                              colorSelected[index].map((eachColorSelected, ind) => {
                                colorSelected[index][ind] = false
                              })
                              dataProps.singleData.vehicle[index].color = eachColor.id
                              colorSelected[index][i] = !colorSelected[index][i]
                              setCheckedColor([...colorSelected])
                            }}
                          />
                        )
                      })
                      :
                      <Text style={{ textAlign: 'center' }}>{dataProps.singleData.vehicle[index].color ? dataProps.singleData.vehicle[index].color.color : 'No Color Selected For This Model'}</Text>
                    }
                  </Card> */}
                  </View>
                </View>
              );
            })}
          </ScrollView>
        )}
      </View>
      <View
        style={{position: 'absolute', bottom: '0%', left: '0%', width: '100%'}}>
        <TouchableOpacity onPress={() => onNext()} style={styles.buttonCon}>
          <Text style={styles.button}>CONTINUE</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PricingForm;
