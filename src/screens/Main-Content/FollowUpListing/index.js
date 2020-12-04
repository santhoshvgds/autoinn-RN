import React, { useState, useEffect, useContext, useRef } from 'react'
import { Text, SearchBar } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { View, StyleSheet, RefreshControl, Image, ActivityIndicator } from 'react-native';
import Header from "../../../components/Header"
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
// import Swipeout from 'react-native-swipeout';
import { platformApi } from '../../../api';
import { ContextAPI } from "../../../ContextAPI";
import moment from "moment"
import vehicleSubImage from "../../../../assets/1bikeSub.png"
import { color } from 'react-native-reanimated';


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
    borderColor: '#636363',
    width: '100%',
    backgroundColor: 'white'
  },
  image: {
    height: 85,
    width: 85,
    top: 0,
    resizeMode: 'center'
  },
  scroll: {
    height: "70%",
  },
  add: {
    position: 'absolute',
    left: '83.5%',
    top: '91%',
    marginBottom: '2%',
    // backgroundColor:'white'
  },
  scrollToTop: {
    position: 'absolute',
    left: '86%',
    top: '93%',
  },
  eachImg: {
    padding: 4,
    paddingTop: 1,
    paddingBottom: 2,
    flexDirection: 'row',
    height: 100,
    backgroundColor: 'white'
  },
  eachInfo: {
    left: 10,
    top: 5,
    width: '75%'
  },
  bold: {
    fontWeight: 'bold'
  },
  message: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    backgroundColor: 'white'
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
    marginBottom: 0
  },
  inputSearch: {
    height: 32,
    borderRadius: 10,
    marginTop: 1
  },
  eachText: {
    fontSize: 13,
    padding: 2
  },
  myloader: {
    position: "absolute",
    top: '17%',
    left: 0,
    zIndex: 10,
    backgroundColor: "#ffffff",
    opacity: 0.9,
    justifyContent: 'center',
    alignItems: 'center',
    width: "100%",
    height: "83%"
  },
  eachSubText: {
    color: '#6c7b8a'
  },
  eachFollowUp: {
    backgroundColor: 'white',
    padding: 10,
    paddingLeft: 20,
    paddingBottom: 15
  }
});



const FollowUpListing = (props) => {
  const { loginCredintials } = useContext(ContextAPI)
  const [search, setSearch] = useState('')
  const [dataSource, setDataSource] = useState([]);
  const [refreshing, setRefreshing] = useState(false)
  const [newData, setNewData] = useState(true);
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(50);
  const scroll = useRef(null);
  const vehicleSubImageUri = Image.resolveAssetSource(vehicleSubImage).uri

  useEffect(() => {
    setPrimaryData()
  }, [])

  // const addQuotation = () => {
  //   props.navigation.navigate('Customer Details Form', {
  //     params: { dataSource: dataSource, singleData: { view: false }, setDataSource: setDataSource }
  //   })
  // }

  const onRefresh = () => {
    setRefreshing(true)
    setPrimaryData('', 2)
    setRefreshing(false)
  }

  const setPrimaryData = (searchString, tempPage) => {
    if (tempPage !== 2)
      setLoading(true)
    let obj = {
      page: tempPage || page,
      size: limit,
      branch: loginCredintials.branch.id,
      searchString: searchString || search,
      filter: {}
    }
    platformApi
      .post("/api/customer/unique/phone", obj)
      .then((result) => {
        if (tempPage !== 2)
          setLoading(false)
        const { data } = result;
        if (data.code === 200) {
          const { response } = data;
          if (response.code === 200) {
            console.log("response", response.data)
            if (response.data.customers.length) {
              setNewData(true)
            }
            else {
              setNewData(false)
            }
            if (!search && !tempPage) {
              let data = [...dataSource, ...response.data.customers]
              setDataSource(data);
            }
            else {
              setDataSource([...response.data.customers])
            }
          } else {
            alert("Unable to fetch Follow-up");
          }
        } else {
          alert("Unable to fetch Follow-up");
        }
      })
      .catch((error) => {
        alert("Unable to fetch Follow-up")
      });
  }

  useEffect(() => {
    setPrimaryData()
  }, [page, search])
  console.log("data", dataSource)

  return (
    <View style={{ height: '100%', backgroundColor: 'lightgray' }}>
      <Header title={'FOLLOW UP'} navigation={props.navigation} />
      <SearchBar
        placeholder="Search Follow up"
        onChangeText={(text) => { setDataSource([]), setPage(1), setSearch(text), console.log("text", text) }}
        value={search}
        round
        containerStyle={styles.search}
        inputContainerStyle={styles.inputSearch}
      />
      {
        !loading ?
          <ScrollView
            ref={scroll}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => onRefresh()}
                tintColor="#f75b5b"
              />
            }
          >
            {
              dataSource && dataSource.map(eachFollowUp => {
                return (

                  <View>
                    <TouchableOpacity onPress={() => {
                      props.navigation.navigate('Follow Up', {
                        phone: eachFollowUp.phone
                      })
                    }
                    }>
                      <View style={styles.eachFollowUp}>
                        <Text>Quotation ID : {eachFollowUp.quotationId}</Text>
                        <Text>Customer Name : {eachFollowUp.name}</Text>
                        <Text>Phone Number : {eachFollowUp.phone}</Text>
                        <Text>Scheduled Date & Time : {moment(eachFollowUp.scheduleDate).format('DD-MM-YYYY')} , {moment(eachFollowUp.scheduleTime).format('HH:mm')}</Text>
                      </View>
                    </TouchableOpacity>
                    <View style={styles.line} />
                  </View>
                )
              })
            }

          </ScrollView>
          :
          <ActivityIndicator style={{ marginTop: 'auto', marginBottom: 'auto' }} size="large" color='#f75b5b' />
      }

      <Icon
        name='arrow-up'
        size={35}
        style={styles.scrollToTop}
        color='#f75b5b'
        reverse={false}
        reverseColor="green"
        raised={true}
        onPress={() => { scroll.current.scrollTo({ x: 0, y: 0, animated: true }) }}
      />

    </View>
  )
}

export default FollowUpListing