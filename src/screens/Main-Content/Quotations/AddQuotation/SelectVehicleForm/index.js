import React, { useState, useEffect } from 'react'
import { Text, Button, Image, Card, SearchBar } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { View, StyleSheet, Alert, Linking, ScrollView } from 'react-native';
import { platformApi } from '../../../../../api';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Dropdown } from 'react-native-material-dropdown';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';


const styles = StyleSheet.create({
  page: {
    height: '100%',
    marginBottom: "1%"
  },
  button: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
    color: 'white',
    width: '100%'
  },
  selectManufacturer: {
    // height: '80%',
    marginBottom: '18%'
  },
  noModels: {
    textAlign: 'center',
    top: '50%'
  },
  eachModelHeading: {
    fontSize: 12,
    color: 'black',
    padding: 0,
    flex: 0.95,
    flexWrap: 'wrap'
  },
  buttonCon: {
    backgroundColor: '#f75b5b',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50
  }
})
const SelectVehicleForm = (props) => {

  const [manufacturers, setManufacturers] = useState([]);
  const [model, setModel] = useState([]);
  const [selectedModels, setSelectedModels] = useState([])
  const [filteredModels, setFilteredModels] = useState([])
  const [category, setCategory] = useState('All Category')
  const dataProps = props.route.params.params;
  useEffect(() => {
    let manufacturer = []
    platformApi
      .get("/api/manufacturer")
      .then((result) => {
        const { data } = result;
        if (data.code === 200) {
          const { response } = data;
          if (response.code === 200) {
            let newArray = []
            handleManufacturerChange(response.data[0].id)
            response.data.map(each => {
              newArray.push({
                label: each.name,
                value: each.id
              })
            })
            setManufacturers(newArray)
          }
        }
      })
      .catch((error) => {
        // console.error("Error on Image Form : ", error);
      });
    // console.log("dataProps", dataProps.singleData.view)
    if (dataProps.singleData.view) {
      handleManufacturerChange(dataProps.singleData.vehicle[0].vehicleDetail.manufacturer.id)
      let selectedVehicles = [];
      // console.log("data props", dataProps.singleData.vehicle)
      dataProps.singleData.vehicle.map(each => {
        selectedVehicles.push(each.vehicleDetail)
      })
      setSelectedModels(selectedVehicles)
    }
    else {
      // console.log("value", manufacturers);
    }
  }, [])

  const onNext = () => {
    if (selectedModels.length) {
      dataProps.singleData.selectedModels = selectedModels
      let insuranceType = [];
      let priceTable = [];
      let vehicleColorSelection = []
      let checkedColor = [];
      let vehicle = []
      selectedModels.map((each, index) => {
        insuranceType.push([false, false, false, false]);
        vehicle.push({
          vehicleDetail: each,
          price: each.price[0]
        })

        let arr = [];
        if (each.price[0].showroomPrice) {
          arr.push(["Ex-showroom Price", each.price[0].showroomPrice])
        }
        if (each.price[0].roadTax) {
          arr.push(["Road Tax", each.price[0].roadTax])
        }
        if (each.price[0].warrantyPrice) {
          arr.push(["Warranty Price", each.price[0].warrantyPrice])
        }
        if (each.price[0].registrationFee) {
          arr.push(["Registration Fee", each.price[0].registrationFee])
        }
        if (each.price[0].handlingCharges) {
          arr.push(["Handling Charges", each.price[0].handlingCharges])
        }
        if (dataProps.singleData.view) {
          dataProps.singleData.vehicle[index].insuranceType.map(eachInsurance => {
            if (eachInsurance.type === 'insurance1plus5') {
              arr.push(['On-Road Price(1 + 5)', eachInsurance.onRoad])
            }
            if (eachInsurance.type === 'insurance5plus5') {
              arr.push(['On-Road Price(5 + 5)', eachInsurance.onRoad])
            }
            if (eachInsurance.type === 'insurance1plus5ZD') {
              arr.push(['On-Road Price(1 + 5)ZD', eachInsurance.onRoad])
            }
            if (eachInsurance.type === 'insurance5plus5ZD') {
              arr.push(['On-Road Price(5 + 5)ZD', eachInsurance.onRoad])
            }
          })
        }
        priceTable.push(arr)
        vehicleColorSelection.push(0);
        let eachColorVehicle = []
        each.image.map(eachColor => {
          eachColorVehicle.push(false)
        })
        checkedColor.push(eachColorVehicle)
      })
      dataProps.singleData.insuranceSelected = insuranceType;
      dataProps.singleData.priceTable = priceTable;
      dataProps.singleData.vehicleColor = vehicleColorSelection;
      dataProps.singleData.checkedColor = checkedColor;
      if (!dataProps.singleData.view) {
        dataProps.singleData.vehicle = vehicle
      }


      props.navigation.navigate('Pricing Form', {
        params: dataProps,
      })
    }
    else {
      Alert.alert('Alert', 'Select atleast one vehicle');
    }
  }

  const handleManufacturerChange = (id) => {
    platformApi
      .get(`/api/vehicleMaster/man/${id}`)
      .then((result) => {
        const { data } = result;
        if (data.code === 200) {
          const { response } = data;
          if (response.code === 200) {
            const models = response.data.filter(
              (model) => model.vehicleStatus === "AVAILABLE" && model.price[0]
            );
            setModel(models);
            setFilteredModels(models)
          }
        }
      })
      .catch(err => {
        // console.log("err", err);
      })
  }
  const handleVehicleCategory = (id) => {
    let tmpCategory = []
    if (id === "ALL")
      tmpCategory = model
    else {
      let temp = [...model]
      tmpCategory = temp.filter(model => model.category === id)
    }
    setFilteredModels(tmpCategory)
  }
  return (
    <View>
      <View style={styles.page}>
        <Text style={{ textAlign: 'center', marginTop: '5%' }}>Select Vehicle Form</Text>
        <View style={{ flexDirection: 'row' }}>
          <Dropdown
            containerStyle={{ width: '56%', marginLeft: 'auto', marginRight: 'auto', marginTop: '0%' }}
            value={dataProps.singleData.view ? dataProps.singleData.vehicle[0].vehicleDetail.manufacturer.name : manufacturers[0] && manufacturers[0].label}
            label="Select Manufacturer"
            onChangeText={(value) => handleManufacturerChange(value)}
            data={manufacturers}
          />
          <Dropdown
            containerStyle={{ width: '30%', marginLeft: 'auto', marginRight: 'auto', marginTop: '0%' }}
            value={dataProps.singleData.view ? 'All Category' : category}
            label="Category"
            onChangeText={(value) => { handleVehicleCategory(value), setCategory(value) }}
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
          />
        </View>
        <View style={styles.selectManufacturer}>
          {/* {console.log("model", model[0])} */}
          {!model.length
            ?
            <Text style={styles.noModels}>No Models Found For This Manufacturer</Text>
            :
            <FlatList
              showsVerticalScrollIndicator={false}
              style={{ borderWidth: 1, borderColor: '#efefef',marginBottom:0 }}
              data={filteredModels}
              numColumns={2}
              renderItem={({ item }) => {
                let eachModel = item
                let modelShow = eachModel.modelCode + ' - ' + eachModel.modelName
                // console.log("each------------>", eachModel.image)
                let buttonType = selectedModels.some(eachSelected => {
                  return eachSelected.id === eachModel.id
                })
                return (
                  <Card key={eachModel.id} containerStyle={{ marginTop: 5, marginLeft: 3, marginRight: 2, width: '48.5%' }} >
                    {
                      eachModel.image && eachModel.image[0]
                        ?
                        <View>
                          <TouchableOpacity onPress={() => {
                            if (buttonType) {
                              if (!dataProps.singleData.view) {
                                let array = selectedModels.filter(each => each.id !== eachModel.id);
                                setSelectedModels([...array])
                              }
                            } else {
                              if (!dataProps.singleData.view) {
                                let array = selectedModels;
                                array.push(eachModel);
                                setSelectedModels([...array])
                              }

                            }
                          }}  >

                            <Image
                              source={{ uri: eachModel.image[0] && eachModel.image[0].url }}
                              style={{ height: 100, marginBottom: 10 }}
                              resizeMode="contain"
                            />
                            {buttonType
                              ?
                              <Button
                                icon={<Icon name='check-circle' color='#f75b5b' size={24} style={{ marginRight: "4%" }} />}
                                buttonStyle={{ borderRadius: 0, margin: 0 }}
                                titleStyle={styles.eachModelHeading}
                                title={modelShow}
                                disabled={dataProps.singleData.view}
                                // onPress={() => { if (props.singleData.view) { let array = selectedModels.filter(each => each.id !== eachModel.id); setSelectedModels([...array]) } }}
                                type='outline'
                              // raised={true}
                              />
                              :
                              <Button
                                icon={<Icon name='check-circle' color='gray' size={24} style={{ marginRight: "1.5%" }} />}
                                buttonStyle={{ borderRadius: 0, margin: 0 }}
                                titleStyle={styles.eachModelHeading}
                                style={{ width: "100%" }}
                                title={modelShow}
                                disabled={dataProps.singleData.view}
                                // onPress={() => { if (props.singleData.view) { let array = selectedModels; array.push(eachModel); setSelectedModels([...array]) } }}
                                type='outline'
                              // raised={true}
                              />
                            }
                          </TouchableOpacity>
                        </View>
                        :

                        <>{console.log("eachModel")}</>
                    }

                  </Card>
                )
              }}
            >
            </FlatList>
          }
        </View>
        <View style={{ position: 'absolute', bottom: '0%', left: '0%', width: '100%' }}>
          <TouchableOpacity onPress={() => onNext()} style={styles.buttonCon}>
            <Text style={styles.button}>CONTINUE</Text>
          </TouchableOpacity>
        </View>
      </View>

    </View>
  )

}

export default SelectVehicleForm