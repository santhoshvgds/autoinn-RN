import React from 'react';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/FontAwesome';
import {View} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {Text, Image} from 'react-native-elements';
// import * as SecureStore from 'expo-secure-store';

const customDrawer = (props) => {
  return (
    <DrawerContentScrollView {...props}>
      <View style={{marginLeft: '5%', marginRight: '5%'}}>
        <Image
          source={{uri: props.dp}}
          style={{width: '100%', height: 200, marginBottom: 10}}
          resizeMode="center"
        />
      </View>
      <Text style={{margin: '8%', color: '#636363', fontSize: 18}}>
        Welcome {props.name}
      </Text>
      <DrawerItemList {...props} />

      <View>
        <DrawerItem
          label="Signout"
          labelStyle={{color: 'white'}}
          icon={() => <Icon name="sign-out" size={20} color="#636363" />}
          onPress={async () => {
            AsyncStorage.removeItem('domainName');
            AsyncStorage.removeItem('token');
            props.navigation.navigate('Domain');
          }}
          style={{top: 0}}
        />
      </View>
    </DrawerContentScrollView>
  );
};

export default customDrawer;
