import React, {useState, useEffect, useContext, useRef} from 'react';
import {Text, Button, Card, SearchBar} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  View,
  StyleSheet,
  Alert,
  Linking,
  Platform,
  FlatList,
  RefreshControl,
  Image,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import Header from '../../../components/Header';
import {
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import Swipeout from 'react-native-swipeout';
import {platformApi} from '../../../api';
import {ContextAPI} from '../../../ContextAPI';
import vehicleSubImage from '../../../../assets/1bikeSub.png';
import {color} from 'react-native-reanimated';

const styles = StyleSheet.create({
  heading: {
    marginTop: '2%',
    marginLeft: '5%',
    height: '100%',
    marginBottom: '4%',
  },
  title: {
    flexDirection: 'row',
  },
  line: {
    borderWidth: 1,
    borderColor: '#636363',
  },
  image: {
    height: 85,
    width: 85,
    top: 0,
    resizeMode: 'center',
  },
  scroll: {
    height: '70%',
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
    top: '84%',
  },
  eachImg: {
    padding: 4,
    paddingTop: 1,
    paddingBottom: 2,
    flexDirection: 'row',
    height: 100,
    backgroundColor: 'white',
  },
  eachInfo: {
    left: 10,
    top: 5,
    width: '75%',
  },
  bold: {
    fontWeight: 'bold',
  },
  message: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    backgroundColor: 'white',
  },
  vehicles: {
    fontSize: 9,
  },
  comments: {
    left: '10%',
  },
  search: {
    height: 52,
    marginTop: '-0.07%',
    marginBottom: 0,
  },
  inputSearch: {
    height: 32,
    borderRadius: 10,
    marginTop: 1,
  },
  eachText: {
    fontSize: 13,
    padding: 2,
  },
  myloader: {
    position: 'absolute',
    top: '17%',
    left: 0,
    zIndex: 10,
    backgroundColor: '#ffffff',
    opacity: 0.9,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '83%',
  },
  eachSubText: {
    color: '#6c7b8a',
  },
});

const Quotations = (props) => {
  const {loginCredintials} = useContext(ContextAPI);
  const [search, setSearch] = useState('');
  const [dataSource, setDataSource] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [newData, setNewData] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [pageLoad, setPageLoad] = useState(false);
  const [page, setPage] = useState(1);
  const [rowIndex, setRowIndex] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [limit, setLimit] = useState(50);
  const scroll = useRef(null);
  const vehicleSubImageUri = Image.resolveAssetSource(vehicleSubImage).uri;

  useEffect(() => {
    setPrimaryData();
  }, []);

  const addQuotation = () => {
    props.navigation.navigate('Customer Details Form', {
      params: {
        dataSource: dataSource,
        singleData: {view: false},
        setDataSource: setDataSource,
      },
    });
  };

  const onRefresh = () => {
    setRefreshing(true);
    setPrimaryData('', 2);
    setRefreshing(false);
  };

  const setPrimaryData = (searchString, tempPage) => {
    if (tempPage !== 2) setLoading(true);
    let obj = {
      reverse: true,
      page: tempPage || page,
      size: limit,
      branch: loginCredintials.branch.id,
      searchString: searchString || search,
      filter: {},
    };
    platformApi
      .post('/api/quotation/get', obj)
      .then((result) => {
        if (tempPage !== 2) setLoading(false);
        const {data} = result ? result : null;
        if (data.code === 200) {
          const {response} = data;
          if (response.code === 200) {
            if (response.data.Quotation.length) {
              setNewData(true);
            } else {
              setNewData(false);
            }
            if (!search && !tempPage) {
              let data = [...dataSource, ...response.data.Quotation];
              setDataSource(data);
            } else {
              setDataSource([...response.data.Quotation]);
            }
          } else {
            alert('Unable to fetch Quotation');
          }
        } else {
          alert('Unable to fetch Quotation');
        }
      })
      .catch((error) => {
        alert('Unable to fetch Quotation');
      });
  };

  useEffect(() => {
    setPrimaryData();
  }, [page, search]);

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
      if (data.code === 200) {
        alert('Message sent Successfully');
      } else {
        alert('Message Not Sent');
      }
    });
  };

  const generatePdf = (singleData) => {
    setPageLoad(true);
    const id = singleData.id;
    platformApi.post('api/quotation/pdfGenerate', {id}).then((result) => {
      let {data} = result ? result : null;
      if (data.code === 200) {
        let {response} = data;
        if (response.code === 200) {
          setPrimaryData();
          setPageLoad(false);
          // console.log("response", response.data)
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
              {text: 'Cancel', style: 'Cancel'},
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

  let swipeBtns = [
    {
      text: 'Print',
      backgroundColor: 'gray',
      underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
      onPress: () => {
        let id =
          'Please Choose an Action for ' + selectedData &&
          selectedData.quotationId;
        if (selectedData.pdfWithBrochure) {
          Alert.alert(
            'Actions',
            id,
            [
              {text: 'Cancel', style: 'Cancel'},
              {
                text: 'Send Via SMS',
                onPress: () => {
                  triggerSMS(selectedData);
                },
              },
              {
                text: 'Print PDF',
                onPress: () => {
                  if (selectedData.pdfWithBrochure) {
                    Linking.openURL(selectedData.pdfWithBrochure);
                  }
                },
              },
            ],
            {cancelable: true},
          );
        } else {
          Alert.alert('Actions', id, [
            {text: 'Cancel', style: 'Cancel'},
            {
              text: 'Generate PDF',
              onPress: () => {
                generatePdf(selectedData);
              },
            },
          ]);
        }
      },
    },
    {
      text: 'Call',
      backgroundColor: 'lightgreen',
      underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
      onPress: () => {
        let id =
          'Please Choose an Action for ' + selectedData &&
          selectedData.quotationId;
        Alert.alert('Actions', id, [
          {text: 'Cancel', style: 'Cancel'},
          {
            text: 'Call',
            onPress: () => {
              let phoneNumber =
                selectedData.customer &&
                selectedData.customer.contacts[0].phone;
              // console.log("phone", phoneNumber);
              if (phoneNumber) {
                if (Platform.OS === 'android') {
                  phoneNumber = `tel:${phoneNumber}`;
                } else {
                  phoneNumber = `telprompt:${phoneNumber}`;
                }
                Linking.openURL(phoneNumber);
              } else {
                alert('Phone Number not Provided');
              }
            },
          },
        ]);
      },
    },
    {
      text: 'Delete',
      backgroundColor: 'red',
      underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
      onPress: () => {
        let id = 'Please Choose an Action for ' + selectedData.quotationId;
        Alert.alert(
          'Are you sure ?',
          id,
          [
            {text: 'Cancel', style: 'Cancel'},
            {
              text: 'Delete',
              onPress: () => {
                confirmDelete();
              },
            },
          ],
          {cancelable: true},
        );
      },
    },
  ];

  const confirmDelete = () => {
    platformApi.delete(`/api/quotation/${selectedData.id}`).then((result) => {
      const {data} = result ? result : null;
      if (data.code === 200) {
        const {response} = data;
        if (response.code === 200) {
          alert('Deleted Successfully');
          let Data = [];
          Data = dataSource.filter((data) => data.id !== selectedData.id);
          setDataSource([...Data]);
        } else {
          alert('Quotation not deleted');
        }
      } else {
        alert('Quotation not deleted');
      }
    });
  };

  const onSwipeOpen = (rowIndex, item) => {
    setRowIndex(rowIndex);
    setSelectedData(item);
  };
  const onSwipeClose = (index) => {
    if (index === rowIndex) {
      setRowIndex(null);
      setSelectedData(null);
    }
  };

  return (
    <View style={{height: '100%', backgroundColor: 'lightgray'}}>
      <Header title={'QUOTATIONS'} navigation={props.navigation} />
      {pageLoad === true && (
        <View style={styles.myloader}>
          <Text>Generating PDF...</Text>
        </View>
      )}
      <SearchBar
        placeholder="Search Quotations"
        onChangeText={(text) => {
          setDataSource([]),
            setPage(1),
            setSearch(text),
            console.log('text', text);
        }}
        value={search}
        round
        containerStyle={styles.search}
        inputContainerStyle={styles.inputSearch}
      />
      {!loading ? (
        <ScrollView
          ref={scroll}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => onRefresh()}
              tintColor="#f75b5b"
            />
          }>
          {dataSource.map((u, i) => {
            return (
              <View key={i}>
                <View style={styles.message}>
                  <Text style={{fontSize: 11}}>{u.quotationId}</Text>
                  <Text style={{fontSize: 11}}>
                    {u.customer.address && u.customer.address.locality
                      ? u.customer.address.locality
                      : ''}
                  </Text>
                </View>
                <TouchableWithoutFeedback
                  key={i}
                  style={styles.eachImg}
                  onPress={() => {
                    props.navigation.navigate('View Quotation', {
                      params: {
                        dataSource: dataSource,
                        singleData: {...u, view: true},
                        setDataSource: setDataSource,
                        generatePdf: generatePdf,
                      },
                    });
                  }}>
                  <View>
                    <Image
                      style={styles.image}
                      resizeMode="contain"
                      source={{
                        uri:
                          (u.vehicle[0] &&
                            u.vehicle[0].vehicleDetail &&
                            u.vehicle[0].vehicleDetail.image[0] &&
                            u.vehicle[0].vehicleDetail.image[0].url) ||
                          vehicleSubImageUri,
                      }}
                    />
                  </View>
                  <View style={styles.eachInfo}>
                    <Text style={styles.eachText}>
                      <Text style={styles.bold}>Model Name: </Text>
                      <Text style={styles.eachSubText}>
                        {u.vehicle && u.vehicle[0] && u.vehicle[0].vehicleDetail
                          ? u.vehicle[0].vehicleDetail.modelName
                          : 'Model Deleted'}
                      </Text>
                    </Text>
                    <Text style={styles.eachText}>
                      <Text style={styles.bold}>Customer Name: </Text>
                      <Text style={styles.eachSubText}>
                        {u.customer && u.customer.name}
                      </Text>
                    </Text>
                    <Text style={styles.eachText}>
                      <Text style={styles.bold}>Follow Up: </Text>
                      <Text style={styles.eachSubText}>
                        {u.scheduleDate
                          ? `${new Date(
                              u.scheduleDate,
                            ).toLocaleDateString()},${new Date(
                              u.scheduleTime,
                            ).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}`
                          : 'No Scheduled-Date Given'}
                      </Text>
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
                <View style={styles.line} />
              </View>
            );
          })}
        </ScrollView>
      ) : (
        <ActivityIndicator
          style={{marginTop: 'auto', marginBottom: 'auto'}}
          size="large"
          color="#f75b5b"
        />
      )}

      <Icon
        name="arrow-up"
        size={35}
        style={styles.scrollToTop}
        color="#f75b5b"
        reverse={false}
        reverseColor="green"
        raised={true}
        onPress={() => {
          scroll.current.scrollTo({x: 0, y: 0, animated: true});
        }}
      />
      <Icon
        name="plus-circle"
        size={58}
        color="#f75b5b"
        style={styles.add}
        reverse={false}
        reverseColor="green"
        raised={true}
        onPress={(_) => addQuotation()}
      />
    </View>
  );
};

export default Quotations;
