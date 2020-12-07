import React, {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Authentication from '../screens/Authentication';
import HomeScreen from './HomeScreen';
import {ContextAPI} from '../ContextAPI';
import DomainSelection from '../screens/Domain/DomainSelection';
import forgetPassword from '../screens/Authentication/forgotPassword';
import resetPassword from '../screens/Authentication/resetPassword';
import splashScreen from '../screens/Domain/splashScreen';

const Stack = createStackNavigator();
const AppRouter = () => {
  const [loginCredintials, setLoginCredintials] = useState({});
  return (
    <ContextAPI.Provider value={{loginCredintials, setLoginCredintials}}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="splashScreen">
          <Stack.Screen
            options={{
              headerStyle: {
                backgroundColor: '#f75b5b',
              },
              headerBackTitle: null,
              headerLeft: null,
              headerTitleStyle: {
                fontWeight: 'bold',
                color: 'white',
              },
              title: 'AUTOCLOUD',
            }}
            name="Domain"
            component={DomainSelection}
          />
          <Stack.Screen
            options={{
              // headerLeft: null,
              headerBackTitle: null,
              headerStyle: {
                backgroundColor: '#f75b5b',
              },
              headerBackTitleStyle: {
                fontSize: 15,
                color: 'white',
              },
              headerTitleStyle: {
                fontWeight: 'bold',
                color: 'white',
              },
              title: 'AUTOCLOUD',
            }}
            name="Forgetpassword"
            component={forgetPassword}
          />
          <Stack.Screen
            options={{
              // headerLeft: null,
              headerBackTitle: null,
              headerStyle: {
                backgroundColor: '#f75b5b',
              },
              headerBackTitleStyle: {
                fontSize: 15,
                color: 'white',
              },
              headerTitleStyle: {
                fontWeight: 'bold',
                color: 'white',
              },
              title: 'AUTOCLOUD',
            }}
            name="ResetPassword"
            component={resetPassword}
          />
          <Stack.Screen
            options={{
              // headerLeft: null,
              headerBackTitle: null,
              headerStyle: {
                backgroundColor: '#f75b5b',
              },
              headerBackTitleStyle: {
                fontSize: 15,
                color: 'white',
              },
              headerTitleStyle: {
                fontWeight: 'bold',
                color: 'white',
              },
              title: 'AUTOCLOUD',
            }}
            name="Login"
            component={Authentication}
          />
          <Stack.Screen
            options={{
              headerShown: false,
              headerStyle: {
                backgroundColor: 'black',
              },
            }}
            name="HomeScreen"
            component={HomeScreen}
          />
          <Stack.Screen
            options={{
              //  title: null,
              headerShown: false,
            }}
            name="splashScreen"
            component={splashScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ContextAPI.Provider>
  );
};

export default AppRouter;
