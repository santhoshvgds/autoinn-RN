import React, { useContext} from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Dashboard from '../../screens/Dashboard';
import CustomDrawerContent from './customDrawer';
import QuotationRoute from '../QuotationRoute';
import BookingRegisterRoute from '../BookingRegisterRoute';
import {ContextAPI} from '../../ContextAPI';
import FollowUp from '../../screens/Main-Content/FollowUpListing';

const Drawer = createDrawerNavigator();

export default function index() {
  let {loginCredintials} = useContext(ContextAPI);

  // console.log("hello", loginCredintials);
  let dp = loginCredintials.profilePicture;
  let name = loginCredintials.employeeName;
  return (
    <Drawer.Navigator
      drawerContentOptions={{
        itemStyle: {marginVertical: 6},
      }}
      drawerContent={(props) => (
        <CustomDrawerContent
          labelStyle={{color: 'white'}}
          activeTintColor="black"
          activeBackgroundColor="rgba(100, 100, 100, .5)"
          {...props}
          dp={dp}
          name={name}
        />
      )}
      initialRouteName="Dashboard"
      drawerStyle={{
        backgroundColor: '#18242B',
        width: 200,
        height: '100%',
      }}>
      <Drawer.Screen name="Dashboard" component={Dashboard} />
      <Drawer.Screen name="Quotations" component={QuotationRoute} />
      <Drawer.Screen name="Follow up" component={FollowUp} />
      <Drawer.Screen name="Booking Register" component={BookingRegisterRoute} />
      {/* <Drawer.Screen name="CRM" component={Dashboard} /> */}
    </Drawer.Navigator>
  );
}
