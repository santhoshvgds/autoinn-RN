import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import JobOrder from '../../screens/Main-Content/BookingRegister';
import { Icon } from 'react-native-elements';
import VehicleDetailForm1 from '../../screens/Main-Content/BookingRegister/AddBookingRegister/VehicleDetailForm1';
import VehicleDetailForm2 from '../../screens/Main-Content/BookingRegister/AddBookingRegister/VehicleDetailForm2';
import ObservationForm from '../../screens/Main-Content/BookingRegister/AddBookingRegister/ObservationForm';
import JobDetailsForm from '../../screens/Main-Content/BookingRegister/AddBookingRegister/JobDetailsForm';
const BookingRegister = createStackNavigator();

const BookingRegisterRoute = () => {
  return (
    <BookingRegister.Navigator initialRouteName="JobOrder">
      <BookingRegister.Screen
        options={{
          headerShown: false,
          headerStyle: {
            backgroundColor: 'black',
            height: 60
          },
        }}
        name="JobOrder"
        component={JobOrder}
      />
      <BookingRegister.Screen
        options={{
          title: "Vehicle Details Form - I",
          headerStyle: {
            backgroundColor: '#636363',
          },
          headerTitleStyle: {
            color: 'white',
            fontSize: 15,

          },
          headerBackTitle: null,
          headerBackTitleStyle: {
            fontSize: 15,
            color: 'white'
          },

        }}
        name="VehicleDetailForm1"
        component={VehicleDetailForm1}
      />
      <BookingRegister.Screen
        options={{
          title: "Vehicle Details Form - II",
          headerStyle: {
            backgroundColor: '#636363',

          },
          headerBackTitle: null,
          headerTitleStyle: {
            color: 'white',
            fontSize: 15
          },
          headerBackTitleStyle: {
            fontSize: 15,
            color: 'white'
          }
        }}
        name="VehicleDetailForm2"
        component={VehicleDetailForm2}
      />
      <BookingRegister.Screen
        options={{
          title: "Observation Form",
          headerStyle: {
            backgroundColor: '#636363',

          },
          headerBackTitle: null,
          headerTitleStyle: {
            color: 'white',
            fontSize: 15
          },
          headerBackTitleStyle: {
            fontSize: 15,
            color: 'white'
          }
        }}
        name="ObservationForm"
        component={ObservationForm}
      />
      <BookingRegister.Screen
        options={{
          title: "Job Details Form",
          headerStyle: {
            backgroundColor: '#636363',

          },
          headerBackTitle: null,
          headerTitleStyle: {
            color: 'white',
            fontSize: 15
          },
          headerBackTitleStyle: {
            fontSize: 15,
            color: 'white'
          }
        }}
        name="JobDetailsForm"
        component={JobDetailsForm}
      />
    </BookingRegister.Navigator>
  )
}

export default BookingRegisterRoute