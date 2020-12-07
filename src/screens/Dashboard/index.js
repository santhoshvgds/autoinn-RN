import React, {useState, useEffect} from 'react';
import {Button, Image, Avatar, Text, Card} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  BackHandler,
} from 'react-native';
import {platformApi} from '../../api';
import Header from '../../components/Header';
import {useFocusEffect} from '@react-navigation/native';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginTop: '1%',
  },
  title: {
    overflow: 'scroll',
  },
  icon: {
    marginLeft: '29%',
    marginBottom: '7%',
    color: '#03DAC5',
  },
  iconCycle: {
    marginLeft: '20%',
    marginBottom: '7%',
    color: '#03DAC5',
  },
});

const Dashboard = ({navigation}) => {
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, []),
  );

  const onClickNavigate = () => {
    navigation.navigate('Quotations');
  };

  return (
    <View>
      <Header title={'DASHBOARD'} navigation={navigation} />
      <SafeAreaView style={{height: '100%'}}>
        <ScrollView>
          <View style={[styles.container, {marginTop: '8%'}]}>
            <TouchableOpacity onPress={onClickNavigate}>
              <Card
                title="Quotations"
                containerStyle={{width: '72%', marginLeft: '11%'}}>
                <Icon name="file-text" size={60} style={styles.icon} />
              </Card>
            </TouchableOpacity>
            {/* <TouchableOpacity onPress={() => {
              navigation.navigate('JobOrder')
            }
            }>
              <Card
                title='Booking Register'
                containerStyle={{ width: '85%', marginLeft: '-1.5%' }}
              >
                <Icon
                  name="motorcycle"
                  size={60}
                  style={styles.iconCycle}
                />
              </Card>
            </TouchableOpacity> */}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};
export default Dashboard;
