import React, { useState, useEffect } from 'react'
import { Text, Button, Image, Card, SearchBar } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { View, StyleSheet, Alert, Linking, Platform, RefreshControl } from 'react-native';
import Header from "../../../components/Header"
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { platformApi } from '../../../api';

const styles = StyleSheet.create({
  heading: {
    marginTop: '2%',
    marginLeft: '5%',
    height: '100%',
    marginBottom: '4%'
  },
  title: {
    flexDirection: 'row',
  },
  line: {
    borderWidth: 1,
    borderColor: '#efefef'
  },
  image: {
    height: 90,
    width: 90,
    top: 10,
    resizeMode: 'center'
  },
  scroll: {
    height: "70%",
  },
  add: {
    left: '85%',
    top: '1%',
    marginBottom: '2%'
  },
  eachImg: {
    flexDirection: 'row',
    height: 125
  },
  eachInfo: {
    left: 10,
    top: 7,
    width: '57%'
  },
  bold: {
    fontWeight: 'bold'
  },
  message: {
    top: "73%",
    left: "-5%",
    flexDirection: 'row'
  },
  vehicles: {
    fontSize: 9
  },
  comments: {
    left: '10%'
  },
  search: {
    height: 52,
    marginTop: '-0.07%',
    marginBottom: 8
  },
  inputSearch: {
    height: 32,
    borderRadius: 10,
    marginTop: 1
  },

});


const BookingRegister = (props) => {


  const [search, setSearch] = useState('')
  const [dataSource, setDataSource] = useState([]);
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    setPrimaryData()
  }, [])

  const setPrimaryData = () => {
    // platformApi
    //   .get("/api/quotation")
    //   .then((result) => {
    //     const { data } = result;
    //     if (data.code === 200) {
    //       const { response } = data;
    //       if (response.code === 200) {
    //         setDataSource(response.data);
    //         // console.log("Quotations---->", response.data);
    //       } else {
    //         alert("Unable to fetch Quotation");
    //       }
    //     } else {
    //       alert("Unable to fetch Quotation");
    //     }
    //   })
    //   .catch((error) => {
    //     alert("Unable to fetch Quotation")
    //   });
  }

  const addJobOrder = () => {
    props.navigation.navigate('VehicleDetailForm1')
    // let quotationId = ''
    // platformApi
    //   .post("/api/idGenerate/quotation")
    //   .then((result) => {
    //     let { data } = result;
    //     if (data.code === 200) {
    //       let { response } = data;
    //       if (response.code === 200) {
    //         quotationId = response.data
    //         // setDataProps({ quotationId })
    //         props.navigation.navigate('Customer Details Form', {
    //           params: { dataSource: dataSource, singleData: { quotationId, view: false }, setDataSource: setDataSource }
    //         })
    //       }
    //     }
    //   })

  }

  const onRefresh = () => {
    setRefreshing(true)
    setPrimaryData();
    setRefreshing(false)
  }

  const searchData = (searchString) => {
    if (searchString) {
      // platformApi
      //   .post("/api/quotation/search", {
      //     name: searchString,
      //     size: 10,
      //     from: 0,
      //   })
      //   .then((result) => {
      //     const { data } = result;
      //     if (data.code === 200) {
      //       const { response } = data;
      //       if (response.code === 200) {
      //         if (response.data.quotation) {
      //           setDataSource(response.data.quotation);
      //         }
      //       }
      //     }
      //   })
    }
    else {
      setPrimaryData()
    }
  }

  return (
    <View style={{ height: '100%', backgroundColor: 'lightgray' }}>
      <Header title={'BOOKING REGISTER'} navigation={props.navigation} />
      <SearchBar
        placeholder="Search Booking Register"
        onChangeText={(o) => { setSearch(o), searchData(o) }}
        value={search}
        round
        textContentType="telephoneNumber"
        keyboardType="numeric"
        containerStyle={styles.search}
        inputContainerStyle={styles.inputSearch}
      />
      <ScrollView style={styles.scroll}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />}
      >


      </ScrollView>
      <Icon
        name='plus-circle'
        size={40}
        color='black'
        style={styles.add}
        reverse={false}
        reverseColor="green"
        raised={true}
        onPress={_ =>
          addJobOrder()
        }
      />

    </View>

  )
}

export default BookingRegister