import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Quotations from '../../screens/Main-Content/Quotations';
import CustomerDetailsForm from '../../screens/Main-Content/Quotations/AddQuotation/CustomerDetailsForm';
import LeadDataForm from '../../screens/Main-Content/Quotations/AddQuotation/LeadDataForm';
import PricingForm from '../../screens/Main-Content/Quotations/AddQuotation/PricingForm';
import SelectVehicleForm from '../../screens/Main-Content/Quotations/AddQuotation/SelectVehicleForm';
import FollowUp from "../../screens/Main-Content/Quotations/FollowUp"
import { Icon } from 'react-native-elements';
import Messages from '../../screens/Main-Content/Quotations/FollowUp/Messages';
import CreateSMS from '../../screens/Main-Content/Quotations/FollowUp/Messages/CreateSMS';
import ActivityInfo from '../../screens/Main-Content/Quotations/FollowUp/ActivityView';
import PdfView from '../../screens/Main-Content/Quotations/FollowUp/ActivityView/PdfView';
import NewActivity from '../../screens/Main-Content/Quotations/FollowUp/NewActivity';
import ViewQuotation from '../../screens/Main-Content/Quotations/ViewQuotation';
const Quotation = createStackNavigator();

const QuotationRoute = () => {
  return (
    <Quotation.Navigator initialRouteName="Quotations">
      <Quotation.Screen
        options={{
          headerShown: false,
          headerStyle: {
            backgroundColor: 'black',
            height: 60
          },
        }}
        name="Quotations"
        component={Quotations}
      />
      <Quotation.Screen
        options={{
          title: "QUOTATION CREATION",
          headerStyle: {
            backgroundColor: '#f75b5b',
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
        name="Customer Details Form"
        component={CustomerDetailsForm}
      />
      <Quotation.Screen
        options={{
          title: "QUOTATION CREATION",
          headerStyle: {
            backgroundColor: '#f75b5b',

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
        name="Lead Data Form"
        component={LeadDataForm}
      />
      <Quotation.Screen
        options={{
          title: "QUOTATION CREATION",
          headerStyle: {
            backgroundColor: '#f75b5b',

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
        name="Pricing Form"
        component={PricingForm}
      />
      <Quotation.Screen
        options={{
          title: "QUOTATION CREATION",
          headerStyle: {
            backgroundColor: '#f75b5b',

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
        name="Select Vehicle Form"
        component={SelectVehicleForm}
      />
      <Quotation.Screen
        options={{
          title: "FOLLOW UP",
          headerStyle: {
            backgroundColor: '#f75b5b',

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
        name="Follow Up"
        component={FollowUp}
      />
      <Quotation.Screen
        options={{
          title: "MESSAGE FOLLOW UP",
          headerStyle: {
            backgroundColor: '#f75b5b',

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
        name="Message"
        component={Messages}
      />
      <Quotation.Screen
        options={{
          title: "CREATE NEW SMS",
          headerStyle: {
            backgroundColor: '#f75b5b',

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
        name="CreateSMS"
        component={CreateSMS}
      />
      <Quotation.Screen
        options={{
          title: "ACTIVITY INFO",
          headerStyle: {
            backgroundColor: '#f75b5b',

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
        name="ActivityInfo"
        component={ActivityInfo}
      />
      <Quotation.Screen
        options={{
          title: "PDF",
          headerStyle: {
            backgroundColor: '#f75b5b',

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
        name="Pdf"
        component={PdfView}
      />
      <Quotation.Screen
        options={{
          title: "WALK-IN ACTIVITY",
          headerStyle: {
            backgroundColor: '#f75b5b',

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
        name="NewActivity"
        component={NewActivity}
      />
      <Quotation.Screen
        options={{
          title: "VIEW QUOTATION",
          headerStyle: {
            backgroundColor: '#f75b5b',

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
        name="View Quotation"
        component={ViewQuotation}
      />
    </Quotation.Navigator>
  )
}

export default QuotationRoute